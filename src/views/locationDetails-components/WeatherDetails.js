import React from 'react';
import { StyleSheet, View } from 'react-native';

import { P, Icon } from '../../common/components';

const LocationDetails = (props) => {

    const { type, weather } = props;
    return (
        <View style={styles.details}>
            {type !== 'daily' && <P>Apparent: {Math.floor(weather.apparentTemperature)}&deg;C</P>}
            <P>Humidity: {Math.floor(weather.humidity)}%</P>
            <P>Pressure: {Math.floor(weather.pressure)}hPa</P>
            <P>Wind: {Math.floor(weather.windSpeed)}km/h</P>
            <Icon 
                icon={{
                    category: 'Feather',
                    name: 'arrow-up',
                    color: '#000',
                }}
                size={16}
                style={{ transform: [{ rotate: `${weather.windBearing}deg` }]}}
            />
            {type !== 'daily' && <P>UV Index: {Math.floor(weather.uvIndex)}</P>}
            {type !== 'daily' && <P>Visibility: {weather.visibility}km</P>}
        </View>
    );
};

const styles = StyleSheet.create({ //TODO: add styles
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
