import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Footer extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>Footer component</Text>
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#4CAF50',
    },
});

export default Footer;