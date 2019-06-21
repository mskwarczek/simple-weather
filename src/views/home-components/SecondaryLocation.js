import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';

import { P, H1, H2, Icon } from '../../common/components';

class SecondaryLocation extends Component {

    render() {
        const { city, currently, hourly } = this.props.weather;
        return (
            <TouchableHighlight style={styles.wrapper} onPress={this.props.showDetails}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <H1>{city}</H1>
                        <H2>{currently.summary}</H2>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.box}>
                            <Icon icon={this.props.assignIcon(currently.icon)} size={48} />
                        </View>
                        <View style={styles.boxL}>
                            <H2>{Math.floor(currently.temperature)}&deg;C</H2>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.box}>
                            <Icon icon={this.props.assignIcon(hourly.icon)} size={36} />
                        </View>
                        <View style={styles.boxL}>
                            <P>{hourly.summary}</P>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#C8E6C9',
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderRightColor: '#BDBDBD',
        borderRightWidth: StyleSheet.hairlineWidth,
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
    },
});

export default SecondaryLocation;
