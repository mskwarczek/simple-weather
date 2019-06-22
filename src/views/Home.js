import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, AsyncStorage } from 'react-native';
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
        secondaryLocationsDisplayed: 2,
        userPrimaryLocation: {}, // { id, city, lat, lon } -- current GPS location or same as userFallbackPrimaryLocation
        userFallbackPrimaryLocation: {}, // { id, city, lat, lon } -- simplified data of location set by user as primary location
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

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Home',
                headerRight: <Button
                    onPress={() => navigation.navigate('Settings', { getCoords: navigation.getParam('getCoords') })}
                    title='Settings'
                    color='#448AFF'
                />
        };
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

    // Return current device position (latitude and longitude).
    getCurrentPosition = async() => {
        let permissions = this.askForPermissions();
        if (permissions.err) {
            return { err: permissions.err, data: null };
        };
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.low, maximumAge: 1000 * 60 * 5 });
        if (!position.coords.latitude || !position.coords.longitude) {
            return { err: 'Unable to obtain current position', data: null };
        };
        return { err: null, data: position }
    };

    // Return city coordinates from given address.
    getCoordsFromCity = async(city) => {
        console.log('coords from city', city);
        let permissions = this.askForPermissions();
        if (permissions.err) {
            return { err: permissions.err, data: null };
        };
        let coords = await Location.geocodeAsync(city);
        if (!coords || coords.length === 0) {
            return { err: 'Unable to obtain city geographical coordinates.', data: null };
        };
        return { err: null, data: coords };
    };

    // Return city name from given latitude and longitude.
    getCityFromCoords = async(lat, lon) => {
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

    // Get forecast data from the server and save it to state.savedLocations.
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

    // Assign icon from avalievable icon sets depending on weather forecast data.
    assignIcon = (icon) => {
        const warm = '#FF9800';
        const wet = '#448AFF';
        const cold = '#FFF';
        const dark = '#000';
        switch(icon) {
            case 'clear-day': return { name: 'weather-sunny', category: 'MaterialCommunityIcons', color: warm };
            case 'clear-night': return { name: 'weather-night', category: 'MaterialCommunityIcons', color: warm };
            case 'rain': return { name: 'weather-rainy', category: 'MaterialCommunityIcons', color: wet };
            case 'snow': return { name: 'weather-snowy', category: 'MaterialCommunityIcons', color: cold };
            case 'sleet': return { name: 'weather-snowy-rainy', category: 'MaterialCommunityIcons', color: wet };
            case 'wind': return { name: 'wind', category: 'Feather', color: wet };
            case 'fog': return { name: 'weather-fog', category: 'MaterialCommunityIcons', color: wet };
            case 'cloudy': return { name: 'weather-cloudy', category: 'MaterialCommunityIcons', color: wet };
            case 'partly-cloudy-day': return { name: 'weather-partlycloudy', category: 'MaterialCommunityIcons', color: wet };
            case 'partly-cloudy-night': return { name: 'md-cloudy-night', category: 'Ionicons', color: dark };
            default: return { name: 'weather-partlycloudy', category: 'MaterialCommunityIcons', color: wet };;
        };
    };

    componentDidMount = async () => {
        // Provide navigation with variables and functions that need to be passed to Settings component.
        this.props.navigation.setParams({
            getCoords: this.getCoordsFromCity,
        });
        // Get primary location data.
        //TODO: Setup event listeners for AppState change
        let primaryLocationData;
        let secondaryLocationsData = new Array(this.state.secondaryLocationsDisplayed);
        if (!this.state.geolocation) {
            //TODO: get data from AsyncStorage and run generateId(), getForecastData({ ...userPrimaryLocation, id });
            //TODO: If there is no such data, ask user to provide it or turn geolocation on
        } else {
            const currentPosition = await this.getCurrentPosition();
            if (currentPosition.err) {
                this.setState({ error: currentPosition.err });
                currentPosition.data.coords = { latitude: 52.230983, longitude: 21.006630 } //TODO: data from saved fallback location from AsyncStorage should go here
            };
            const { latitude, longitude } = currentPosition.data.coords;
            const id = this.generateId();
            const city = await this.getCityFromCoords(latitude, longitude);
            if (city.err) {
                this.setState({ error: city.err });
            };
            primaryLocationData = await this.getForecastData({ id, city: city.data, lat: latitude, lon: longitude });
            if (primaryLocationData.err || !primaryLocationData.data) {
                return this.setState({ error: primaryLocationData.err });
            } else {
                this.setState({
                    userPrimaryLocation: { id, city: city.data, lat: latitude, lon: longitude },
                });
            };
        };
        // Get secondary locations data.
        //TODO: get data from AsyncStorage
        for (let i = 0; i < this.state.secondaryLocationsDisplayed; i++) {
            const id = this.generateId();
            const newLocation = await this.getForecastData({ id, city: 'Kraków', lat: 50.061766, lon: 19.937409 });
            if (newLocation.err || !newLocation.data) {
                return this.setState({ error: newLocation.err });
            } else {
                secondaryLocationsData[i] = { ...newLocation.data, id, city: 'Kraków', lat: 50.061766, lon: 19.937409 };
            };
        };
        this.setState({
            isLoading: false,
            userSecondaryLocations: secondaryLocationsData,
            savedLocations: [...this.state.savedLocations, ...secondaryLocationsData, primaryLocationData.data],
        });
    };

    render() {
        const { isLoading, error, savedLocations, userPrimaryLocation, userSecondaryLocations } = this.state;
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
                    assignIcon={this.assignIcon}
                />
                <View style={styles.secondaryLocationsContainer}>
                    {
                        userSecondaryLocations.map(location => {
                            return <SecondaryLocation
                                key={location.id}
                                showDetails={() => this.props.navigation.navigate('LocationDetails')}
                                weather={savedLocations.filter(loc => loc.id === location.id)[0]}
                                assignIcon={this.assignIcon}
                            />
                        })
                    }
                </View>
                <Footer />
            </View>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    container: {
        flex: 1,
    },
    secondaryLocationsContainer: {
        flex: 3,
        flexDirection: 'row',
    },
});

export default Home;
