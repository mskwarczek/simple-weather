import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Button, TouchableHighlight, ScrollView } from 'react-native';
import uuid from 'uuid/v4';

import { P } from './components';
import GOOGLE_PLACES_KEY from '../../server/google_places_key.json';

/* TODO:
https://developers.google.com/places/web-service/policies
    Your Terms of Use and Privacy Policy must be publicly available.
    You must explicitly state in your application's Terms of Use that by using your application, users are bound by Google’s Terms of Service.
    You must notify users in your Privacy Policy that you are using the Google Maps API(s) and incorporate by reference the Google Privacy Policy.
*/

//TODO: Fix bug: suggestions list doesn't close when user clicks outside of it.

class SearchInput extends Component {
    state = {
        input: null,
        suggestionsTable: [],
        showSuggestions: false,
        sessionToken: null,
        placeId: null,
        error: '',
    };

    generateSessionToken = () => {
        this.setState({
            sessionToken: uuid(),
            suggestionsTable: [],
            error: '',
        });
        this.props.updateState(true, 'suggestions', this.props.index);
    };

    handleTextChange = async (input) => {
        const { sessionToken } = this.state;
        this.setState({
            input: input,
        });
        if (!input || !input.length) {
            return this.exitInput(null);
        };
        let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_PLACES_KEY}&language=pl&types=(cities)&sessiontoken=${sessionToken}&input=${input}`;
        try {
            let result = await fetch(url);
            result = await result.json();
            if (result.status === 'OK') {
                this.setState({
                    showSuggestions: true,
                    suggestionsTable: result.predictions,
                    placeId: result.predictions[0].place_id,
                    error: '',
                });
            } else if (result.status !== 'INVALID_REQUEST') {
                this.setState({
                    error: result.status,
                });
            };
        } catch (error) {
            this.setState({
                error,
            });
        };
    };

    getPlaceId = (placeId, input) => {
        this.setState({
            input,
            placeId,
        });
    };

    exitInput = (inputValue) => {
        const { suggestionsTable } = this.state;
        if (inputValue && inputValue.length && suggestionsTable && suggestionsTable.length) {
            this.setState({
                showSuggestions: false,
                input: suggestionsTable[0].description,
                placeId: suggestionsTable[0].place_id,
                error: '',
            });
        } else {
            this.setState({
                showSuggestions: false,
                error: '',
            });
        };
        this.props.updateState(false, 'suggestions', null);
    };

    fallbackForNoResults = async() => {
        if (!this.state.input) {
            return;
        };
        const result = await this.props.searchFunction(this.state.input);
        if (result.err || !result.data) {
            this.setState({ error: result.err });
        } else {
            this.props.updateState({
                latitude: result.data[0].latitude,
                longitude: result.data[0].longitude,
            }, this.props.type, this.props.index);
        };
        this.exitInput(this.state.input);
    };

    handleSubmit = async () => {
        const { placeId, sessionToken } = this.state;
        if (!placeId) {
            return this.fallbackForNoResults();
        };
        let url = `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_PLACES_KEY}&language=pl&sessiontoken=${sessionToken}&fields=geometry&placeid=${placeId}`;
        try {
            let data = await fetch(url);
            data = await data.json();
            if (data.status === 'OK') {
                this.props.updateState({
                    latitude: data.result.geometry.location.lat,
                    longitude: data.result.geometry.location.lng,
                }, this.props.type, this.props.index);
                this.exitInput(this.state.input);
            } else {
                this.setState({
                    error: result.status,
                });
            };
        } catch (error) {
            this.setState({
                error,
            });
        };
    };

    render() {
        const { error, input, showSuggestions, suggestionsTable } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <TextInput
                        style={styles.input}
                        multiline={false}
                        onChangeText={(input) => this.handleTextChange(input)}
                        onFocus={() => this.generateSessionToken()}
                        onEndEditing={() => this.exitInput(input)}
                        value={input}
                        defaultValue={this.props.defaultValue}
                    />
                    <Button 
                        title={this.props.submitText}
                        onPress={() => this.handleSubmit()}
                        color='#448AFF'
                    />
                </View>
                { showSuggestions && suggestionsTable.length && <ScrollView style={styles.suggestionsTable}>
                    { suggestionsTable.map(location => {
                        return (
                            <TouchableHighlight
                                style={styles.suggestionsTable__element}
                                key={location.id}
                                onPress={() => this.getPlaceId(location.place_id, location.description)}>
                                <P>{location.description}</P>
                            </TouchableHighlight>
                        );
                    }) }
                </ScrollView>}
                { error && error.length
                    ? <P>{error}</P>
                    : null
                }
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 10,
        backgroundColor: '#C8E6C9',
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    input: {
        width: '70%',
        borderBottomColor: '#448AFF',
        borderBottomWidth: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },
    suggestionsTable: {
        width: '100%',
    },
    suggestionsTable__element: {
        backgroundColor: '#FFF',
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});

export default SearchInput;
