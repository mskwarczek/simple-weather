import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { P, H1, H2, H3, Icon } from '../common/components';

class LocationDetails extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('locationName'),
        };
    };

    componentDidMount() {
        this.props.navigation.setParams({
            locationName: this.props.navigation.state.params.weather.city,
        });
    };

    render() {
        const { currently, hourly, daily, alerts } = this.props.navigation.state.params.weather;
        const { assignIcon } = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <View style={styles.box}>
                        <Icon icon={assignIcon(currently.icon)} size={72} />
                    </View>
                    <View style={styles.boxL}>
                        <H1>{Math.floor(currently.temperature)}&deg;C, {currently.summary}</H1>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.box}>
                        <Icon icon={assignIcon(hourly.icon)} size={48} />
                    </View>
                    <View style={styles.boxL}>
                        <H2>{hourly.summary}</H2>
                    </View>
                </View>
                <View style={styles.details}>
                    <P>Apparent: {Math.floor(currently.apparentTemperature)}&deg;C</P>
                    <P>Humidity: {Math.floor(currently.humidity)}%</P>
                    <P>Pressure: {Math.floor(currently.pressure)}hPa</P>
                    <P>Wind: {Math.floor(currently.windSpeed)}km/h {currently.windBearing /*TODO: function to calculate bearing and display arrow*/}</P>
                    <P>UV Index: {Math.floor(currently.uvIndex)}</P>
                    <P>Visibility: {currently.visibility}km</P>
                </View>
                <View style={styles.box}>
                    <P>TODO: alerts</P>
                </View>
                <View style={styles.box}>
                    <P>TODO: hourly chart</P>
                </View>
                <View style={styles.box}>
                    <P>TODO: daily chart</P>
                </View>
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 3,
        backgroundColor: '#4CAF50',
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxL: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 2,
    },
    details: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});

export default LocationDetails;
