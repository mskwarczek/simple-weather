import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import SearchBar from './home-components/SearchBar';
import PrimaryLocation from './home-components/PrimaryLocation';
import SecondaryLocation from './home-components/SecondaryLocation';
import Footer from './home-components/Footer';

class Home extends Component {
    state = {
        isLoading: true,
        geolocation: true, // bool -- if set to true, userPrimaryLocation is gathered via geolocation
        userPrimaryLocation: {}, // { id, city, lat, lon } -- simplified data of location set by user as primary location
        userSecondaryLocations: [], // [ { id, city, lat, lon } ] -- simplified data of locations set by user as secondary locations
        savedLocations: [], // [ { ...recievedData, id, city } ] -- all data saved during session with added IDs and city names
        error: '',
    };
    /*  
        When app starts or AppState.currentState changes to active:
                if app starts (not just activates): componentDidMount sets event listeners for AppState changes.
                if AppState check: if there are any old (>30 minutes) objects inside savedLocations and deletes them.
            userPrimaryLocation is being set from previously saved user preferences (AsyncStorage) OR from GSP signal (depending on user settings) (EXCEPT for ids).
                In second case componentDidMount will call expo geolocation and reverse geocoding to get necessary data and then set userPrimaryLocation.
            componentDidMount OR eventListener fetches data from server using userPrimaryLocation and userSecondaryLocations.
            individual IDs are added to all fetched data sets (with use of uuid) and data sets are stored in savedLocations array.
            IDs are also added to userPrimaryLocation and userSecondaryLocations.
            From now on every data used on page is obtained by checking userPrimaryLocation (userSecondaryLocations) against IDs inside savedLocations.
            before any function sends request for new forecast data (i.e. when user uses 'search' for another location or gps coordinates change), separate function will check if:
                1. there is the same city or coordinates varying less than 5km from new request. 2 that city/coords are no more than 30 minutes old.
                If both statements are true - function will return data of that city / coords (if there are more such objects, it will choose youngest one and delete others).
    */

    static navigationOptions = {
        title: 'Home',
    };

    // Ask for geolocation permissions. It is necessary for reverse geocoding to work even if state.geolocation is set to false.
    askForPermissions = async() => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            return { err: 'Permission to access location was denied.' }
        } else {
            return { err: null }
        }
    };

    // Return city name from given latitude and longitude.
    getCityFromCoords = async (lat, lon) => {
        let permissions = this.askForPermissions();
        if (permissions.err) {
            return { err: permissions.err, data: `${lat}, ${lon}` };
        };
        let city = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
        if (!city[0].city) {
            return { err: 'Unable to obtain city name.', data: `${lat}, ${lon}` }
        };
        return { err: null, data: city[0].city };
    };

    // Generate unique id for state.savedLocations.
    generateId = () => {
        let firstPart = (Math.random() * 46656) | 0;
        let secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    };

    // Get forecast data from the server and save it to state.savedLocations
    getForecastData = async(location) => {
        const { id, city, lat, lon } = location;
        let newLocation = await fetch(`http://10.0.0.5:5000/api/forecast?lat=${lat}&lon=${lon}&lang=pl`)
            .then(res => res.json())
            .then(res => {
                newLocation = { ...res, city, id };
                return { err: null, data: newLocation };
            })
            .catch(err => {
                return { err: `Unable to fetch data from server. ${err}`, data: null };
            });
        return newLocation;
    };

    componentDidMount = async () => {
        // GET DATA FOR PRIMARY LOCATION
        //TODO: Setup event listeners for AppState change
        if (!this.state.geolocation) {
            //TODO: get data from AsyncStorage and rungenerateId(), getForecastData({ ...userPrimaryLocation, id });
            //TODO: If there is no such data, ask user to provide it or turn geolocation on
        } else {
            //TODO: get current GPS coordinates, here are example ones for Warsaw
            const id = this.generateId();
            const city = await this.getCityFromCoords(52.230983, 21.006630);
            if (city.err) {
                this.setState({ error: city.err });
            };
            const newLocation = await this.getForecastData({ id, city: city.data, lat: 52.230983, lon: 21.006630 });
            if (newLocation.err || !newLocation.data) {
                this.setState({ error: newLocation.err });
            } else {
                this.setState({
                    isLoading: false,
                    userPrimaryLocation: { id, city: city.data, lat: 52.230983, lon: 21.006630 },
                    savedLocations: [...this.state.savedLocations, newLocation.data],
                });
            };
        };
        //TODO: get secondary locations data
    };

    render() {
        const { isLoading, error, savedLocations, userPrimaryLocation } = this.state;
        if (isLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading data...{/*TODO: ActivityIndicator*/}</Text>
                </View>
            );
        };
        if (error) {
            return(
                <View style={styles.container}>
                    <Text>{error}</Text>
                </View>
            );
        };
        return (
            <View style={styles.container}>
                <SearchBar />
                <PrimaryLocation 
                    showDetails={() => this.props.navigation.navigate('LocationDetails')}
                    weather={savedLocations.filter(location => location.id === userPrimaryLocation.id)[0]}
                />
                <View style={{ flex: 3, flexDirection: 'row' }}>
                    <SecondaryLocation />
                    <SecondaryLocation />
                </View>
                <Footer />
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Home;
