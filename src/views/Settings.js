import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class Settings extends Component {
    static navigationOptions = {
        title: 'Settings',
    };

    render() {
        return (
            <View>
                <Text>Simple Weather</Text>
                <Text>Settings screen</Text>
                <Button
                    title='Go to Home'
                    onPress={() => this.props.navigation.navigate('Home')}
                />
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles

});

export default Settings;
