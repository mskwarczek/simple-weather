import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import SearchInput from '../../common/SearchInput';

//TODO: Fix bug with event propagation when clicking on suggested locations from the list (possible solution by using PanResponder)

class SearchBar extends Component {

    showResults = (type, value, index) => {
        this.props.getSearchBarLocationData(value);
    };

    render() {
        return (
            <View style={styles.container}>
                <SearchInput
                    searchFunction={this.props.getCoordsFromCity}
                    updateState={this.showResults}
                    type={null}
                    index={null}
                />
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
