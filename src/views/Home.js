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
        geolocation: false, // bool -- if set to true, userPrimaryLocation is gathered via geolocation
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
                    onPress={() => navigation.navigate('Settings', {
                        getCoords: navigation.getParam('getCoords'),
                        userSettings: navigation.getParam('userSettings'),
                        storeUserSettings: navigation.getParam('storeUserSettings')
                    })}
                    title='Settings'
                    color='#448AFF'
                />
        };
    };

    // Provide navigation with variables and functions that need to be passed to Settings component.
    setNavigationParams = () => {
        this.props.navigation.setParams({
            getCoords: this.getCoordsFromCity,
            storeUserSettings: this.storeDataInAsyncStorage,
            userSettings: { 
                geolocation: this.state.geolocation,
                userFallbackPrimaryLocation: this.state.userFallbackPrimaryLocation,
                userSecondaryLocations: this.state.userSecondaryLocations,
            },
        });
    };

    // Combine location coordinates with ID and city name.
    addIdAndCityToLocation = async (location) => {
        const id = this.generateId();
        const city = await this.getCityFromCoords(location.latitude, location.longitude);
        if (city.err) {
            return this.setState({ error: city.err });
        };
        return { ...location, id, city: city.data };
    };

    // Store user settings in AsyncStorage and trigger component reload.
    storeDataInAsyncStorage = async (settings) => {
        if (settings.userFallbackPrimaryLocation) {
            settings.userFallbackPrimaryLocation  = await this.addIdAndCityToLocation(settings.userFallbackPrimaryLocation);
        };
        if (settings.userSecondaryLocations.length) {
            for (let i = 0; i < settings.userSecondaryLocations.length; i++) {
                settings.userSecondaryLocations[i] = await this.addIdAndCityToLocation(settings.userSecondaryLocations[i]);
            };
        };
        try {
            await AsyncStorage.setItem('SETTINGS', JSON.stringify(settings));
        } catch (err) {
            return err;
        };
        this.setState({
            geolocation: settings.geolocation,
            userFallbackPrimaryLocation: settings.userFallbackPrimaryLocation,
            userSecondaryLocations: settings.userSecondaryLocations,
        });
        await this.componentReload();
    };

    // Retrieve user settings from AsyncStorage. 
    retrieveSettingsFromAsyncStorage = async () => {
        try {
            let appStateFromAsyncStorage = await AsyncStorage.getItem('SETTINGS');
            appStateFromAsyncStorage = JSON.parse(appStateFromAsyncStorage);
            if (appStateFromAsyncStorage.userFallbackPrimaryLocation && appStateFromAsyncStorage.userSecondaryLocations) {
                this.setState({
                    geolocation: appStateFromAsyncStorage.geolocation,
                    userFallbackPrimaryLocation: appStateFromAsyncStorage.userFallbackPrimaryLocation,
                    userSecondaryLocations: appStateFromAsyncStorage.userSecondaryLocations,
                });
            } else {
                //TODO: Relocate user to settings view (e.g. will trigger on first use)
                this.setState({
                    error: 'No initial state',
                });
            };
        } catch (error) {
            return this.setState({
                error,
            });
        };
    };

    // Get primary location weather data (3 variants: geolocation off, geolocation on and geolocation on but not working properly).
    getprimaryLocationWeatherData = async () => {
        let primaryLocationWeatherData;
        let lat, lon, id, city;
        if (!this.state.geolocation) {
            lat = this.state.userFallbackPrimaryLocation.latitude;
            lon = this.state.userFallbackPrimaryLocation.longitude;
            id = this.state.userFallbackPrimaryLocation.id;
            city = this.state.userFallbackPrimaryLocation.city;
        } else {
            const currentPosition = await this.getCurrentPosition();
            if (currentPosition.err) {
                this.setState({ error: currentPosition.err });
                currentPosition.data.coords = {
                    latitude: this.state.userFallbackPrimaryLocation.latitude,
                    longitude: this.state.userFallbackPrimaryLocation.longitude,
                };
            };
            lat = currentPosition.data.coords.latitude;
            lon = currentPosition.data.coords.longitude;
            combinedData =  this.addIdAndCityToLocation(currentPosition.data.coords);
            id = combinedData.id;
            city = combinedData.city;
        };
        primaryLocationWeatherData = await this.getForecastData({ id, city, lat, lon });
        if (primaryLocationWeatherData.err || !primaryLocationWeatherData.data) {
            return this.setState({ error: primaryLocationWeatherData.err });
        } else {
            this.setState({
                userPrimaryLocation: { id, city, lat, lon },
            });
        };
        return primaryLocationWeatherData.data;
    };

    // Get secondary locations weather data.
    getSecondaryLocationsWeatherData = async () => {
        let secondaryLocationsWeatherData = [];
        if (!this.state.userSecondaryLocations.length) {
            for (let i = 0; i < this.state.userSecondaryLocations.length; i++) {
                const { id, city, latitude, longitude } = this.state.userSecondaryLocations[i];
                secondaryLocationsWeatherData[i] = await this.getForecastData({ id, city, lat: latitude, lon: longitude });
                if (secondaryLocationsWeatherData[i].err || !secondaryLocationsWeatherData[i].data) {
                    return this.setState({ error: secondaryLocationsWeatherData[i].err });
                } else {
                    secondaryLocationsWeatherData[i] = secondaryLocationsWeatherData[i].data;
                }
            };
        };
        return secondaryLocationsWeatherData;
    };

    // Ask for geolocation permissions. It is necessary for geocoding and reverse geocoding to work even if state.geolocation is set to false.
    askForPermissions = async() => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            return { err: 'Permission to access location was denied.' }
        } else {
            return { err: null };
        };
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
        return { err: null, data: position };
    };

    // Return city coordinates from given address.
    getCoordsFromCity = async(city) => {
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
                if (res.status !== 200) {
                    throw new Error(res.error);
                }
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
            default: return { name: 'weather-partlycloudy', category: 'MaterialCommunityIcons', color: wet };
        };
    };

    // Retrieve and fetche all data necessary for proper weather forecast display (it is the core of this whole app).
    componentReload = async () => {
        const { isLoading, userFallbackPrimaryLocation, userSecondaryLocations } = this.state;
        if (isLoading) {
            this.setState({
                isLoading: true,
            });
        };
        if (!userFallbackPrimaryLocation || !userSecondaryLocations || !userSecondaryLocations.length) {
            await this.retrieveSettingsFromAsyncStorage();
        };
        let primaryLocationWeatherData = await this.getprimaryLocationWeatherData();
        let secondaryLocationsWeatherData = await this.getSecondaryLocationsWeatherData();
        this.setNavigationParams();
        this.setState({
            isLoading: false,
            savedLocations: [...this.state.savedLocations, ...secondaryLocationsWeatherData, primaryLocationWeatherData],
        });
    };

    componentDidMount = async () => {
        await this.componentReload();
        //TODO: Setup event listeners for AppState change
    };

    render() {
        console.log('home render');
        const { isLoading, error, savedLocations, userPrimaryLocation, userSecondaryLocations } = this.state;
        if (isLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading data...{/*TODO: ActivityIndicator*/}</Text>
                </View>
            );
        };
        if (error) {
            return (
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
                        userSecondaryLocations && userSecondaryLocations.map(location => {
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
