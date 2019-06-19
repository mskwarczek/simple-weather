import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import SearchBar from './home-components/SearchBar';
import PrimaryLocation from './home-components/PrimaryLocation';
import SecondaryLocation from './home-components/SecondaryLocation';
import Footer from './home-components/Footer';

class Home extends Component {
    state = {
        primaryLocationData: {},
        error: '',
    };

    static navigationOptions = {
        title: 'Home',
    };

    componentDidMount() {
        this.getForecastData();
    };

    getForecastData = () => {
        fetch('http://10.0.0.5:5000/api/forecast?lat=52.230983&lon=21.006630&lang=pl') // Fixed for development and tests
            .then(res => res.json())
            .then(res => {
                console.log(res); // dev
                this.setState({ primaryLocationData: res });
            })
            .catch(err => {
                console.log(err);
                this.setState({ error: err });
            });
    };

    render() {
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
