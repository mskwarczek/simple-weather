import React from 'react';
import { StyleSheet, View, Button, Modal, TouchableHighlight, ScrollView, Linking } from 'react-native';

import { P, H1, H2 } from '../../common/components';

const AlertModal = (props) => {

    const { visible, alerts } = props;

    const displaySeverity = (severity) => {
        switch(severity) {
            case 'advisory': return 'Low';
            case 'watch': return 'Medium';
            case 'warning': return 'High'
        };
    };

    return (
        <Modal style={styles.modal}
            visible={visible}
            animationType={'slide'}
            onRequestClose={() => props.showModal(false)}>
            <View style={styles.box}>
                <H1>Alerts</H1>
                <ScrollView>
                { alerts.length && alerts.map((alert, index) => {
                        return (
                            <View key={index}>
                                <H2>{alert.title}</H2>
                                <P>Severity: {displaySeverity(alert.severity)}</P>
                                <P>{alert.description}</P>
                                <TouchableHighlight
                                    onPress={() => Linking.openURL(alert.uri).catch((err) => console.error('An error occurred', err))}>
                                    <P>See details</P>
                                </TouchableHighlight>
                            </View>
                        );
                    })
                }
                <Button
                    title='Close'
                    color='#448AFF'
                    onPress={() => props.showModal(false)}
                />
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({ //TODO: add styles
    modal: {
        flex: 1,
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 3,
        backgroundColor: '#C8E6C9',
    },
});

export default AlertModal;
