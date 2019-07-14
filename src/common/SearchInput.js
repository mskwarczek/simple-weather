import React, { Component } from 'react';
import { StyleSheet, TextInput, View, TouchableHighlight } from 'react-native';
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
//TODO: Check and fix possible problems with leaving text input via back button or mid-writing (Possibly adding a button to confirm user's choise would fix most of such problems)

class SearchInput extends Component {
    state = {
        input: null,
        predictionsTable: [],
        sessionToken: null,
        placeId: null,
        error: '',
    };

    generateSessionToken = () => {
        this.setState({
            sessionToken: uuid(),
            predictionsTable: [],
            error: '',
        });
    };

    handleTextChange = async (input) => {
        const { sessionToken } = this.state;
        this.setState({
            input,
        });
        let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_PLACES_KEY}&language=pl&types=(cities)&sessiontoken=${sessionToken}&input=${input}`;
        try {
            let result = await fetch(url);
            result = await result.json();
            if (result.status === 'OK') {
                this.setState({
                    predictionsTable: result.predictions,
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

    fallbackForNoResults = async() => {
        if (!this.state.input) {
            return;
        };
        const result = await this.props.searchFunction(this.state.input);
        if (result.err || !result.data) {
            this.setState({ error: result.err });
        } else {
            this.props.updateState(this.props.type, {
                latitude: result.data[0].latitude,
                longitude: result.data[0].longitude,
            }, this.props.index);
        };
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
                this.props.updateState(this.props.type, {
                    latitude: data.result.geometry.location.lat,
                    longitude: data.result.geometry.location.lng,
                }, this.props.index);
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
        this.generateSessionToken();
    };

    render() {
        const { error, input, predictionsTable } = this.state;
        return (
            <View style={styles.box}>
                <TextInput
                    style={styles.input}
                    multiline={false}
                    onChangeText={(input) => this.handleTextChange(input)}
                    onFocus={() => this.generateSessionToken()}
                    onEndEditing={() => this.handleSubmit()}
                    value={input}
                    defaultValue={this.props.defaultValue}
                />
                <View style={styles.predictionsTable}>
                {
                    predictionsTable.map(location => {
                        return (
                            <TouchableHighlight
                                style={styles.predictionsTable__element}
                                key={location.id}
                                onPress={() => this.getPlaceId(location.place_id, location.description)}>
                                    <P>{location.description}</P>
                            </TouchableHighlight>
                        )
                    })
                }
                </View>
                {
                    error
                        ? <P>{ error }</P>
                        : null
                }
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    input: {
        width: '80%',
        borderBottomColor: '#448AFF',
        borderBottomWidth: 3,
        marginBottom: 5,
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        overflow: 'visible',
    },
    predictionsTable: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
    },
    predictionsTable__element: {
        backgroundColor: '#FFF',
        zIndex: 10,
    },
});

export default SearchInput;
