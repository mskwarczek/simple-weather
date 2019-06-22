import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './src/views/Home';
import LocationDetails from './src/views/LocationDetails';
import Settings from './src/views/Settings';

const AppNavigator = createStackNavigator({
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
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#4CAF50',
        },
        headerTintColor: '#212121',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    },
});

const AppContainer = createAppContainer(AppNavigator);

class App extends Component {
    render() {
        return <AppContainer />
    };
};

export default App;
