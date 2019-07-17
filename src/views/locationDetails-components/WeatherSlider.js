import React from 'react';
import { StyleSheet, View, Slider } from 'react-native';

const LocationDetails = (props) => {
    return (
        <View style={styles.box}>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={props.maximumValue}
                step={1}
                value={0}
                minimumTrackTintColor='#448AFF'
                maximumTrackTintColor='#BDBDBD'
                thumbTintColor='#448AFF'
                onValueChange={(value) => props.handleSliderValueChange(value, props.type)}
            />
        </View>
    );
};

const styles = StyleSheet.create({ //TODO: add styles
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    slider: {
        width: '80%',
        height: 60,
    },
});

export default LocationDetails;
