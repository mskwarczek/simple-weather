import React, { Component } from 'react';
import { StyleSheet, View, Button, Picker, AsyncStorage } from 'react-native';

import SearchInput from '../common/SearchInput';
import { P, H1, H2 } from '../common/components';

class Settings extends Component {
    state = {
        geolocation: false,
        userFallbackPrimaryLocation: '',
        userSecondaryLocations: [],
    };

    static navigationOptions = {
        title: 'Settings',
    };

    componentDidMount = async () => {
        const retrieveUserSettings = this.props.navigation.getParam('retrieveUserSettings');
        const dataFromAsyncStorage = await retrieveUserSettings();
        if (!dataFromAsyncStorage.err && dataFromAsyncStorage.data) {
            this.setState({
                ...dataFromAsyncStorage.data,
            });
        };
    };

    updateState = (type, value, index) => {
        switch(type) {
            case 'geolocation': this.setState({ geolocation: value }); break;
            case 'userFallbackPrimaryLocation': this.setState({ userFallbackPrimaryLocation: value }); break;
            case 'userSecondaryLocations': this.setState({ userSecondaryLocations: Object.assign(this.state.userSecondaryLocations, { [index]: value }) }); break;
            default: return;
        };
    };

    resetState = async () => {
        await AsyncStorage.removeItem('SETTINGS');
        this.setState({
            geolocation: false,
            userFallbackPrimaryLocation: '',
            userSecondaryLocations: [],
        });
    };

    render() {
        console.log(this.state);
        storeUserSettings = this.props.navigation.getParam('storeUserSettings');
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <H1>Simple Weather</H1>
                    <H2>Settings</H2>
                </View>
                <View style={styles.box}>
                    <P>Choose primary location:</P>
                    <SearchInput 
                        searchFunction={this.props.navigation.getParam('getCoords')}
                        updateState={this.updateState}
                        type='userFallbackPrimaryLocation'
                        index={null}
                    />
                </View>
                <View style={styles.box}>
                    <P>Enable geolocation for primary location:</P>
                    <Picker
                        selectedValue={this.state.geolocation}
                        style={{height: 50, width: 100}}
                        onValueChange={(value) => this.updateState('geolocation', value)}>
                        <Picker.Item label='ON' value={true} />
                        <Picker.Item label='OFF' value={false} />
                    </Picker>
                </View>
                <View style={styles.box}>
                    <P>Choose secondary location 1:</P>
                    <SearchInput 
                        searchFunction={this.props.navigation.getParam('getCoords')}
                        updateState={this.updateState}
                        type='userSecondaryLocations'
                        index={0}
                    />
                </View>
                <View style={styles.box}>
                    <P>Choose secondary location 2:</P>
                    <SearchInput 
                        searchFunction={this.props.navigation.getParam('getCoords')}
                        updateState={this.updateState}
                        type='userSecondaryLocations'
                        index={1}
                    />
                </View>
                <View style={styles.row}>
                    <Button
                        title='Back'
                        color='#448AFF'
                        onPress={() => this.props.navigation.pop()}
                    />
                    <Button
                        title='Save'
                        color='#448AFF'
                        onPress={() => storeUserSettings(this.state)}
                    />
                    <Button
                        title='Reset'
                        color='#448AFF'
                        onPress={() => this.resetState()}
                    />
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
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
});

export default Settings;
