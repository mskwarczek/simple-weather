import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';

import { P, H1, H3, Icon } from '../../common/components';

class PrimaryLocation extends Component {

    render() {
        const { city, currently, hourly } = this.props.weather;
        return (
            <TouchableHighlight style={styles.wrapper} onPress={this.props.showDetails}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <H1>{city}</H1>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.box}>
                            <Icon icon={this.props.assignIcon(currently.icon)} size={64} />
                        </View>
                        <View style={styles.boxL}>
                            <H1>{Math.floor(currently.temperature)}&deg;C, {currently.summary}</H1>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.box}>
                            <Icon icon={this.props.assignIcon(hourly.icon)} size={48} />
                        </View>
                        <View style={styles.boxL}>
                            <P>Next hours</P>
                            <H3>{hourly.summary}</H3>
                        </View>
                    </View>
                    <View style={styles.box}>
                        <P>hourly chart {/*TODO */}</P>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    wrapper: {
        flex: 3,
        width: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 3,
        backgroundColor: '#4CAF50',
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        padding: 2,
    },
});


export default PrimaryLocation;
