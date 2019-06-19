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
        geolocation: true, // bool -- if set to true, userPrimaryLocation is gathered via geolocation, and location set by user is a fallback
        userPrimaryLocation: {}, // { id, city, lat, lon } -- data of location set by user as primary location
        userSecondaryLocations: [], // [ { id, city, lat, lon } ] -- data of locations set by user as secondary locations
        savedLocations: [], // [ { ...recievedData, id, city } ] -- all data saved during session with added IDs and city names
        error: '',
    };
    /*  
        When app starts or AppState.currentState changes to active:
                if app starts (not just activates): componentDidMount sets event listeners for AppState changes.
                if AppState check if there are any old (>30 minutes) objects inside savedLocations and deletes them.
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
            this.setState({
                error: 'Permission to access location was denied.',
            });
        };
    };

    // Return city name from given latitude and longitude.
    getCityFromCoords = async (lat, lon) => {
        this.askForPermissions();
        let city = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
        if (!city[0].city) {
            this.setState({
                error: 'Unable to obtain city name.',
            });
            return 'Unknown';
        };
        return city[0].city;
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
        fetch(`http://10.0.0.5:5000/api/forecast?lat=${lat}&lon=${lon}&lang=pl`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    savedLocations: [...this.state.savedLocations, { ...res, city, id }],
                });
            })
            .catch(err => {
                this.setState({ error: `Unable to fetch data from server. ${err}` });
                return;
            });
        
        /*
        fetch('http://10.0.0.5:5000/api/forecast?lat=52.230983&lon=21.006630&lang=pl') // Fixed for development and tests
            .then(res => res.json())
            .then(res => {
                this.getCityFromCoords(res.latitude, res.longitude);
                this.setState({
                    savedLocations: [...this.state.savedLocations, { ...res, id }],
                    userPrimaryLocation: { ...this.state.userPrimaryLocation, id },
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({ error: err });
            });*/
    };

    componentDidMount = async () => {
        // GET DATA FOR PRIMARY LOCATION
        if (!this.state.geolocation) {
            //get data from AsyncStorage and run getForecastData({ userPrimaryLocation });
            //If there is no such data, ask user to provide it or turn geolocation on
        } else {
            //get current GPS coordinates, here are example ones for Warsaw
            const city = await this.getCityFromCoords(52.230983, 21.006630);
            const id = this.generateId();
            this.getForecastData({ id, city, lat: 52.230983, lon: 21.006630 });
            this.setState({ userPrimaryLocation: { id, city, lat: 52.230983, lon: 21.006630 } });
        };
    };

    render() {
        const { error } = this.state;
        console.log(this.state);
        if (error) {
            return(
                <View style={styles.container}>
                    <Text>{error}</Text>
                </View>
            );
        };
        return (
            <View style={styles.container}>
                <SearchBar style={{ flex: 1 }} />
                <PrimaryLocation 
                    style={{ flex: 3, backgroundColor: 'red', width: '100%' }}
                    showDetails={() => this.props.navigation.navigate('LocationDetails')}
                />
                <View style={{ flex: 3, flexDirection: 'row' }}>
                    <SecondaryLocation style={{ flex: 1, backgroundColor: '#aaa' }} />
                    <SecondaryLocation style={{ flex: 1, backgroundColor: '#555' }} />
                </View>
                <Footer style={{ flex: 1 }} />
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
