import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class SearchBar extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>Search Bar component</Text>
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#C8E6C9',
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});

export default SearchBar;
