import React, { Component } from 'react';
import { Button } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './src/views/Home';
import LocationDetails from './src/views/LocationDetails';
import Settings from './src/views/Settings';

const AppNavigator = createStackNavigator({ //TODO: maybe move to separate file
    Home: {
        screen: Home,
    },
    LocationDetails: {
        screen: LocationDetails,
    },
    Settings: {
        screen: Settings,
    }}, {
    initialRouteName: 'Home',
    defaultNavigationOptions: { //TODO: add styles
        headerStyle: {
            backgroundColor: '#888',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerRight: ( //TODO: add a button that will render fullscreen modal with options like: geolocation ON/OFF, home screen setup, about this app i odnośnikami do konkretnych widoków
            <Button
                onPress={() => alert('This is a button!')}
                title='Info'
                color="#000"
            />
        ),
    },
});

const AppContainer = createAppContainer(AppNavigator);

class App extends Component {
    render() {
        return <AppContainer />
    };
};

export default App;
