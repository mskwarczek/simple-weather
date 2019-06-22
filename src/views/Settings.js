import React, { Component } from 'react';
import { StyleSheet, View, Button, Picker } from 'react-native';

import SearchInput from '../common/SearchInput';
import { P, H1, H2 } from '../common/components';

class Settings extends Component {
    state = {
        geocoding: true,
        primaryLocation: '',
        secondaryLocation1: '',
        secondaryLocation2: '',
    };

    static navigationOptions = {
        title: 'Settings',
    };
    // This must be tied to AsyncStorage, code below is just a temporary solution.
    updateState = (type, value) => {
        switch(type) {
            case 'geocoding': this.setState({ geocoding: value }); break;
            case 'primaryLocation': this.setState({ primaryLocation: value }); break;
            case 'secondaryLocation1': this.setState({ secondaryLocation1: value }); break;
            case 'secondaryLocation2': this.setState({ secondaryLocation2: value }); break;
            default: return;
        };
    };

    render() {
        console.log(this.state);
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
                        type='primaryLocation'
                    />
                </View>
                <View style={styles.box}>
                    <P>Enable geolocalization for primary location:</P>
                    <Picker
                        selectedValue={this.state.geocoding}
                        style={{height: 50, width: 100}}
                        onValueChange={(value) => this.updateState('geocoding', value)}>
                        <Picker.Item label='ON' value={true} />
                        <Picker.Item label='OFF' value={false} />
                    </Picker>
                </View>
                <View style={styles.box}>
                    <P>Choose secondary location 1:</P>
                    <SearchInput 
                        searchFunction={this.props.navigation.getParam('getCoords')}
                        updateState={this.updateState}
                        type='secondaryLocation1'
                    />
                </View>
                <View style={styles.box}>
                    <P>Choose secondary location 2:</P>
                    <SearchInput 
                        searchFunction={this.props.navigation.getParam('getCoords')}
                        updateState={this.updateState}
                        type='secondaryLocation2'
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
                        onPress={() => this.props.navigation.pop()}
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
