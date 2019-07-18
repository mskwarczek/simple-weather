import React, { Component } from 'react';
import { StyleSheet, View, Button, Picker, TouchableHighlight, Linking } from 'react-native';

import SearchInput from '../common/SearchInput';
import { P, H1 } from '../common/components';

class Settings extends Component {
    state = {
        areSuggestionsVisible: false,
        activeSuggestions: null,
        geolocation: false,
        userFallbackPrimaryLocation: '',
        userSecondaryLocations: [],
    };

    static navigationOptions = {
        title: 'Settings',
    };

    updateState = (value, type, index) => {
        switch (type) {
            case 'geolocation': this.setState({ geolocation: value }); break;
            case 'userFallbackPrimaryLocation': this.setState({ userFallbackPrimaryLocation: value }); break;
            case 'userSecondaryLocations': this.setState({ userSecondaryLocations: Object.assign(this.state.userSecondaryLocations, { [index]: value }) }); break;
            case 'suggestions': this.setState({ areSuggestionsVisible: value, activeSuggestions: index })
            default: return;
        };
    };

    resetState = async () => {
        const storeUserSettings = this.props.navigation.getParam('storeUserSettings');
        storeUserSettings({
            geolocation: false,
            userFallbackPrimaryLocation: '',
            userSecondaryLocations: [],
        });
        this.setState({
            areSuggestionsVisible: false,
            activeSuggestions: null,
            geolocation: false,
            userFallbackPrimaryLocation: '',
            userSecondaryLocations: [],
        });
    };

    componentDidMount() {
        let userSettings = this.props.navigation.getParam('userSettings');
        this.setState({
            ...userSettings,
            areSuggestionsVisible: false,
            activeSuggestions: null,
        });
    };

    render() {
        const storeUserSettings = this.props.navigation.getParam('storeUserSettings');
        const { areSuggestionsVisible, activeSuggestions } = this.state;
        return (
            <View style={styles.container}>
                { !areSuggestionsVisible && <View style={styles.box}>
                    <H1>Simple Weather</H1>
                </View> }
                { (!areSuggestionsVisible || (areSuggestionsVisible && activeSuggestions === 'primary')) && <View style={styles.box}>
                    <P>Choose primary location:</P>
                    <SearchInput
                        searchFunction={this.props.navigation.getParam('getCoords')}
                        updateState={this.updateState}
                        type='userFallbackPrimaryLocation'
                        index={'primary'}
                        submitText='Set'
                        placeholder={
                            this.state.userFallbackPrimaryLocation
                                ? this.state.userFallbackPrimaryLocation.city
                                : '' }
                    />
                </View> }
                { !areSuggestionsVisible && <View style={styles.geolocation}>
                    <P>Enable geolocation for primary location:</P>
                    <Picker
                        selectedValue={this.state.geolocation}
                        style={{ height: 50, width: 100 }}
                        onValueChange={(value) => this.updateState('geolocation', value)}>
                        <Picker.Item label='ON' value={true} />
                        <Picker.Item label='OFF' value={false} />
                    </Picker>
                </View> }
                { (!areSuggestionsVisible || (areSuggestionsVisible && activeSuggestions === 0)) && <View style={styles.box}>
                    <P>Choose secondary location 1:</P>
                    <SearchInput
                        searchFunction={this.props.navigation.getParam('getCoords')}
                        updateState={this.updateState}
                        type='userSecondaryLocations'
                        index={0}
                        submitText='Set'
                        placeholder={this.state.userSecondaryLocations[0]
                            ? this.state.userSecondaryLocations[0].city
                            : '' }
                    />
                </View> }
                { (!areSuggestionsVisible || (areSuggestionsVisible && activeSuggestions === 1)) && <View style={styles.box}>
                    <P>Choose secondary location 2:</P>
                    <SearchInput
                        searchFunction={this.props.navigation.getParam('getCoords')}
                        updateState={this.updateState}
                        type='userSecondaryLocations'
                        index={1}
                        submitText='Set'
                        placeholder={this.state.userSecondaryLocations[1]
                            ? this.state.userSecondaryLocations[1].city
                            : '' }
                    />
                </View> }
                <View style={styles.buttons}>
                    <Button
                        title='Back'
                        color='#448AFF'
                        onPress={() => this.props.navigation.pop()}
                    />
                    <Button
                        title='Save'
                        color='#448AFF'
                        onPress={() => storeUserSettings({
                            geolocation: this.state.geolocation,
                            userFallbackPrimaryLocation: this.state.userFallbackPrimaryLocation,
                            userSecondaryLocations: this.state.userSecondaryLocations,
                        })}
                    />
                    <Button
                        title='Reset'
                        color='#448AFF'
                        onPress={() => this.resetState()}
                    />
                </View>
                <View style={{height: 50}}>
                    <TouchableHighlight
                        onPress={() => Linking.openURL('https://darksky.net/poweredby/').catch((err) => console.error('An error occurred', err))}>
                        <P>Powered by Dark Sky</P>
                    </TouchableHighlight>
                </View>
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#C8E6C9',
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        maxHeight: 100,
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    geolocation: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});

export default Settings;
