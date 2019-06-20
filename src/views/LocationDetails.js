import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import PrimaryLocation from './home-components/PrimaryLocation'

class LocationDetails extends Component {

    render() {
        return (
            <View>
                <Text>Same as primary location</Text>
                <Text>Expandable data for next 7 days</Text>
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles

});

export default LocationDetails;
