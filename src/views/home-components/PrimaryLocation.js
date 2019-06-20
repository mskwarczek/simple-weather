import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';

import { P, H1, H3 } from '../../common/components';

class PrimaryLocation extends Component {

    render() {
        const { city, currently, hourly } = this.props.weather;
        console.log(this.props.weather);
        return (
            <TouchableHighlight style={styles.container} onPress={this.props.showDetails}>
                <View>
                    <H1>{city}</H1>
                    <View style={styles.row}>
                        <View>
                            <P>{currently.icon}</P>
                        </View>
                        <View>
                            <H1>{currently.temperature}&deg;C, {currently.summary}</H1>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <P>Feels like: {currently.apparentTemperature}&deg;C</P>
                        <P>Wind: {currently.windBearing} {currently.windSpeed}</P>
                        <P>Pressure: {currently.pressure}</P>
                        <P>Humidity: {currently.humidity}</P>
                    </View>
                    <View style={styles.row}>
                        <View>
                            <P>{hourly.icon}</P>
                        </View>
                        <View>
                            <H3>{hourly.summary}</H3>
                        </View>
                    </View>
                    <View>
                        <P>hourly chart {/*TODO */}</P>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    container: {
        flex: 3,
        backgroundColor: '#4CAF50',
        width: '100%',
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    row: {
        flexDirection: 'row',
    },
});

export default PrimaryLocation;
