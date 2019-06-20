import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';

import { P, H1, H2, H3 } from '../../common/components';

class SecondaryLocation extends Component {

    render() {
        return (
            <TouchableHighlight style={styles.container} onPress={this.props.showDetails}>
                <View>
                    <H1>city</H1>
                    <H2>currentSummary</H2>
                    <View style={styles.row}>
                        <View>
                            <P>icon</P>
                        </View>
                        <View>
                            <H2>temperature</H2>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View>
                            <P>icon</P>
                        </View>
                        <View>
                            <H3>hourly summary</H3>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };
};

const styles = StyleSheet.create({ //TODO: add styles
    container: {
        flex: 1,
        backgroundColor: '#C8E6C9',
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderRightColor: '#BDBDBD',
        borderRightWidth: StyleSheet.hairlineWidth,
    },
    row: {
        flexDirection: 'row',
    },
});

export default SecondaryLocation;
