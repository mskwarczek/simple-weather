import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Button } from 'react-native';

import { P } from './components';

// This solution is far from optimal and should be replaced with Google dynamic search. But will do for now.
//TODO: Google places dynamic search
class SearchInput extends Component {
    state = {
        text: this.props.value,
        error: '',
    };

    handleSearch = async() => {
        const result = await this.props.searchFunction(this.state.text);
        if (result.err || !result.data) {
            this.setState({ error: result.err });
        } else {
            this.props.updateState(this.props.type, result.data[0], this.props.index);
        };
    };

    render() {
        const { error } = this.state;
        return (
            <View style={styles.box}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                />
                <Button
                    title='Set'
                    color='#448AFF'
                    onPress={() => this.handleSearch()}
                />
                {
                    error
                        ? <P>{ error }</P>
                        : null
                }
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    input: {
        width: '80%',
        borderBottomColor: '#448AFF',
        borderBottomWidth: 3,
        marginBottom: 5,
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
});

export default SearchInput;
