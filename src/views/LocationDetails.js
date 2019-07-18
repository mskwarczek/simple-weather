import React, { Component } from 'react';
import { StyleSheet, View, Button } from 'react-native';

import { H1, H2, H3, Icon } from '../common/components';
import WeatherDetails from './locationDetails-components/WeatherDetails';
import WeatherSlider from './locationDetails-components/WeatherSlider';
import AlertModal from './locationDetails-components/AlertModal';

class LocationDetails extends Component {
    state = {
        isModalVisible: false,
        hourlySliderValue: 0,
        dailySliderValue: 0,
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
        return { 
            day: weekDays[day],
            hour: `${hour}:00`,
        };
    };

    handleSliderValueChange = (value, type) => {
        if (type === 'hourly') {
            this.setState({
                hourlySliderValue: value,
            });
        } else if (type === 'daily') {
            this.setState({
                dailySliderValue: value,
            });
        };
    };

    showModal = (value) => {
        value = value ? true : false;
        this.setState({
            isModalVisible: value,
        });
    };

    componentDidMount() {
        let { city } = this.props.navigation.state.params.weather;
        this.props.navigation.setParams({
            locationName: city,
        });
    };

    render() {
        const { currently, hourly, daily, alerts } = this.props.navigation.state.params.weather;
        const { assignIcon } = this.props.navigation.state.params;
        const { isModalVisible, hourlySliderValue, dailySliderValue } = this.state;
        const hourlySliderDate = this.calculateHourFromTimestamp(hourly.data[hourlySliderValue].time);
        const dailySliderDate = this.calculateHourFromTimestamp(daily.data[dailySliderValue].time);
        return (
            <View style={styles.container}>
                {
                    isModalVisible
                        ? <AlertModal 
                            alerts={alerts}
                            showModal={this.showModal} />
                        : null
                }
                <View style={styles.box}>
                    <View style={styles.row}>
                        <View style={styles.box}>
                            <Icon icon={assignIcon(currently.icon)} size={alerts ? 48 : 72} />
                            { alerts && <Button 
                                title='Alerts'
                                onPress={() => this.showModal(true)}
                            /> }
                        </View>
                        <View style={styles.boxL}>
                            <H1>{Math.floor(currently.temperature)}&deg;C, {currently.summary}</H1>
                            <H2>{hourly.summary}</H2>
                        </View>
                    </View>
                    <WeatherDetails 
                        weather={currently}
                        type='currently'
                    />
                </View>
                { hourly.data.length && <View style={styles.box}>
                    <View style={styles.box}>
                        <H2>Next 48 hours - {hourlySliderDate.day}, {hourlySliderDate.hour}</H2>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.box}>
                            <Icon icon={assignIcon(hourly.data[hourlySliderValue].icon)} size={48} />
                        </View>
                        <View style={styles.boxL}>
                            <H3>{Math.floor(hourly.data[hourlySliderValue].temperature)}&deg;C, {hourly.data[hourlySliderValue].summary}</H3>
                        </View>
                    </View>
                    <WeatherDetails 
                        weather={hourly.data[hourlySliderValue]}
                        type='hourly'
                    />
                    <WeatherSlider 
                        type='hourly'
                        maximumValue={hourly.data.length - 1}
                        handleSliderValueChange={this.handleSliderValueChange}
                    />
                </View> }
                { daily.data.length && <View style={styles.box}>
                    <View style={styles.box}>
                        <H2>Next 7 days - {dailySliderDate.day}</H2>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.box}>
                            <Icon icon={assignIcon(daily.data[dailySliderValue].icon)} size={48} />
                        </View>
                        <View style={styles.boxL}>
                            <H3>{Math.floor(daily.data[dailySliderValue].temperatureLow)}&deg;C - {Math.floor(daily.data[dailySliderValue].temperatureHigh)}&deg;C, {daily.data[dailySliderValue].summary}</H3>
                        </View>
                    </View>
                    <WeatherDetails 
                        weather={daily.data[dailySliderValue]}
                        type='daily'
                    />
                    <WeatherSlider 
                        type='daily'
                        maximumValue={daily.data.length - 1}
                        handleSliderValueChange={this.handleSliderValueChange}
                    />
                </View> }
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
});

export default LocationDetails;
