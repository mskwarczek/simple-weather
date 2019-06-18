import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import SearchBar from './home-components/SearchBar';
import PrimaryLocation from './home-components/PrimaryLocation';
import SecondaryLocation from './home-components/SecondaryLocation';
import Footer from './home-components/Footer';

class Home extends Component {
    static navigationOptions = {
        title: 'Home',
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
