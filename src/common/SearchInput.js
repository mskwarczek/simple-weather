import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Button, TouchableHighlight, Keyboard, Image } from 'react-native';
import uuid from 'uuid/v4';

import { P } from './components';
import GOOGLE_PLACES_KEY from '../../server/google_places_key.json';

class SearchInput extends Component {
    state = {
        input: null,
        suggestionsTable: [],
        sessionToken: null,
        error: '',
    };

    generateSessionToken = () => {
        this.setState({
            input: null,
            sessionToken: uuid(),
            error: '',
        });
        this.props.updateState(true, 'suggestions', this.props.index);
    };

    handleTextChange = async (newInput) => {
        const { sessionToken, input } = this.state;
        if (!input && newInput) {
            this.props.updateState(true, 'suggestions', this.props.index);
        };
        if (!newInput) {
            return this.exitInput();
        } else {
            this.setState({
                input: newInput,
            });
        };
        let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_PLACES_KEY}&language=pl&types=(cities)&sessiontoken=${sessionToken}&input=${newInput}`;
        try {
            let result = await fetch(url);
            result = await result.json();
            if (result.status === 'OK') {
                this.setState({
                    suggestionsTable: result.predictions,
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

    exitInput = (error, name) => {
        const errorMessage = error ? error : '';
        const newInput = name ? name : null;
        this.setState({
            input: newInput,
            suggestionsTable: [],
            error: errorMessage,
        });
        this.props.updateState(false, 'suggestions', null);
        Keyboard.dismiss();
    };

    fallbackForNoResults = async() => {
        const result = await this.props.searchFunction(this.state.input);
        if (result.err || !result.data) {
            return this.exitInput(result.err);
        } else {
            this.props.updateState({
                latitude: result.data[0].latitude,
                longitude: result.data[0].longitude,
            }, this.props.type, this.props.index);
        };
        this.exitInput(null, this.state.input);
    };

    handleSubmit = async (id, name) => {
        const { suggestionsTable, input, sessionToken } = this.state;
        let placeId, placeName;
        if (id && name) {
            placeId = id;
            placeName = name;
        } else if (suggestionsTable.length && input) {
            placeId = suggestionsTable[0].place_id;
            placeName = suggestionsTable[0].description;
        } else if (input) {
            return this.fallbackForNoResults();
        } else {
            return this.exitInput();
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
                return this.exitInput(null, placeName);
            } else {
                this.exitInput(error);
            };
        } catch (error) {
            this.exitInput(error);
        };
    };

    render() {
        const { error, input, suggestionsTable } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <TextInput
                        style={styles.input}
                        multiline={false}
                        onChangeText={(input) => this.handleTextChange(input)}
                        onFocus={() => this.generateSessionToken()}
                        onSubmitEditing={()=> this.handleSubmit()}
                        value={input}
                        placeholder={this.props.placeholder}
                        placeholderTextColor='#BDBDBD'
                    />
                    <Button 
                        title={this.props.submitText}
                        onPress={() => this.handleSubmit()}
                        color='#448AFF'
                    />
                </View>
                { (suggestionsTable.length > 0) && <View style={styles.suggestionsTable}>
                    { suggestionsTable.map(location => {
                        return (
                            <TouchableHighlight
                                style={styles.suggestionsTable__element}
                                key={location.id}
                                onPress={() => this.handleSubmit(location.place_id, location.description)}>
                                <P>{location.description}</P>
                            </TouchableHighlight>
                        );
                    }) }
                    <Image
                        style={styles.googleLogo}
                        source={require('../../assets/powered_by_google.png')}
                    />
                </View> }
                { error && error.length
                    ? <P>{error}</P>
                    : null }
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
    googleLogo: {
        resizeMode: 'contain',
        marginTop: 5,
        height: 15,
        alignSelf: 'flex-end'
    },
});

export default SearchInput;
