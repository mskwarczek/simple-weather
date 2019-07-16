import React, { Component } from 'react';
import { StyleSheet, View, Slider } from 'react-native';

import { P, H1, H2, H3, Icon } from '../common/components';

//TODO: Alerts (probably single line under current weather or modal for high severity)

class LocationDetails extends Component {
    state = {
        hourlySliderValue: 0,
    };

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('locationName'),
        };
    };

    calculateHourFromTimestamp = (unixTime) => {
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(unixTime * 1000);
        const hour = date.getHours();
        const day = date.getDay();
        return `${weekDays[day]}, ${hour}:00`;
    };

    handleSliderValueChange = (value) => {
        this.setState({
            hourlySliderValue: value,
        });
    };

    componentDidMount() {
        this.props.navigation.setParams({
            locationName: this.props.navigation.state.params.weather.city,
        });
    };

    render() {
        const { currently, hourly, daily, alerts } = this.props.navigation.state.params.weather;
        const { assignIcon } = this.props.navigation.state.params;
        const { hourlySliderValue } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.row}>
                        <View style={styles.box}>
                            <Icon icon={assignIcon(currently.icon)} size={72} />
                        </View>
                        <View style={styles.boxL}>
                            <H1>{Math.floor(currently.temperature)}&deg;C, {currently.summary}</H1>
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
                </View>
                { hourly.data.length && <View style={styles.box}>
                    <View style={styles.box}>
                        <H2>Next 48h hours - {this.calculateHourFromTimestamp(this.props.navigation.state.params.weather.hourly.data[hourlySliderValue].time)}</H2>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.box}>
                            <Icon icon={assignIcon(hourly.data[hourlySliderValue].icon)} size={48} />
                        </View>
                        <View style={styles.boxL}>
                            <H3>{Math.floor(hourly.data[hourlySliderValue].temperature)}&deg;C, {hourly.data[hourlySliderValue].summary}</H3>
                        </View>
                    </View>
                    <View style={styles.details}>
                        <P>Apparent: {Math.floor(hourly.data[hourlySliderValue].apparentTemperature)}&deg;C</P>
                        <P>Humidity: {Math.floor(hourly.data[hourlySliderValue].humidity)}%</P>
                        <P>Pressure: {Math.floor(hourly.data[hourlySliderValue].pressure)}hPa</P>
                        <P>Wind: {Math.floor(hourly.data[hourlySliderValue].windSpeed)}km/h {hourly.data[hourlySliderValue].windBearing /*TODO: function to calculate bearing and display arrow*/}</P>
                        <P>UV Index: {Math.floor(hourly.data[hourlySliderValue].uvIndex)}</P>
                        <P>Visibility: {hourly.data[hourlySliderValue].visibility}km</P>
                    </View>
                    <View style={styles.box}>
                        <Slider
                            style={styles.hourlySlider}
                            minimumValue={0}
                            maximumValue={hourly.data.length - 1}
                            step={1}
                            value={0}
                            minimumTrackTintColor='#448AFF'
                            maximumTrackTintColor='#BDBDBD'
                            thumbTintColor='#448AFF'
                            onValueChange={(value) => this.handleSliderValueChange(value)}
                        />
                    </View>
                </View> }
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
        backgroundColor: '#C8E6C9',
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
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
    hourlySlider: {
        width: '80%',
        height: 60,
    },
});

export default LocationDetails;
