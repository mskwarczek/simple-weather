import React, { Component } from 'react';
import { Text } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';

export class P extends Component {
    render() {
        return (
            <Text style={{
                fontSize: 14,
                color: '#444',
                textAlign: 'center',
                margin: 3,
            }}>
                {this.props.children}
            </Text>
        );
    };
};

export class H1 extends Component {
    render() {
        return (
            <P>
                <Text style={{
                    fontSize: 20,
                    color: '#212121',
                    fontWeight: 'bold',
                }}>
                    {this.props.children}
                </Text>
            </P>
        );
    };
};

export class H2 extends Component {
    render() {
        return (
            <H1>
                <Text style={{
                    fontSize: 16,
                }}>
                    {this.props.children}
                </Text>
            </H1>
        );
    };
};

export class H3 extends Component {
    render() {
        return (
            <P>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                }}>
                    {this.props.children}
                </Text>
            </P>
        );
    };
};

export class Icon extends Component {
    render() {
        const { category, name, color } = this.props.icon;
        const { size, style } = this.props;
        if (category === 'Feather') {
            return (
                <Feather name={name}
                    size={size}
                    color={color}
                    style={style} />
            );
        } else if (category === 'Ionicons')
            return (
                <Ionicons name={name}
                    size={size}
                    color={color}
                    style={style} />
            );
        else if (category === 'MaterialCommunityIcons') {
            return (
                <MaterialCommunityIcons name={name}
                    size={size}
                    color={color}
                    style={style} />
            );
        } else {
            return <P>Icon</P>
        };
    };
};
