import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

class SecondaryLocation extends Component {

    render() {
        return (
            <TouchableHighlight style={this.props.style} onPress={this.props.showDetails}>
                <View>
                    <Text>city</Text>
                    <Text>currentSummary</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text>icon</Text>
                        </View>
                        <View>
                            <Text>temperature</Text>
                        </View>
                    </View>
                    <View>
                        <Text>minutely summary OR hourly summary</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles

});

export default SecondaryLocation;
