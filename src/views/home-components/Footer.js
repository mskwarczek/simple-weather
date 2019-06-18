import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Footer extends Component {

    render() {
        return (
            <View style={this.props.style}>
                <Text>Footer component</Text>
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles

});

export default Footer;