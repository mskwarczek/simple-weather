import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

class PrimaryLocation extends Component {

    render() {
        return (
            <TouchableHighlight style={this.props.style} onPress={this.props.showDetails}>
                <View>
                    <Text>city</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text>icon</Text>
                        </View>
                        <View>
                            <Text>temperature, currentSummary</Text>
                        </View>
                    </View>
                    <Text>minutely summary OR hourly summary</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>apparentTemperature</Text>
                        <Text>low</Text>
                        <Text>high</Text>
                        <Text>windSpeed</Text>
                        <Text>pressure</Text>
                        <Text>humidity</Text>
                    </View>
                    <View>
                        <Text>hourly chart</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles

});

export default PrimaryLocation;
