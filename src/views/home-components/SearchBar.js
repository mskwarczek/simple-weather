import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class SearchBar extends Component {

    render() {
        return (
            <View style={this.props.style}>
                <Text>Search Bar component</Text>
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles

});

export default SearchBar;
