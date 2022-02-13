import React from 'react'
import { ViewPropTypes, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'

const getColorScheme = colorScheme => {
    switch (colorScheme) {
        case 'white':
            return {
                colorSchemeOuter: styles.whiteButton,
                colorSchemeInner: styles.blackText,
            }
        default:
            return {
                colorSchemeOuter: styles.greenButton,
            }
    }
}

const Button = ({
    title,
    onPress,
    style,
    textStyle,
    disabled,
    accessibilityLabel,
    testID,
    block,
    colorScheme,
}) => {
    const { colorSchemeOuter, colorSchemeInner } = getColorScheme(colorScheme)
    return (
        <View style={[block && styles.block]}>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                style={[styles.buttonStyle, colorSchemeOuter, style]}
                accessibilityLabel={accessibilityLabel}
                testID={testID}
            >
                <Text style={[styles.textStyle, textStyle, colorSchemeInner]}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        borderRadius: 5,
        borderWidth: 2,
    },
    textStyle: {
        alignSelf: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
    },
    whiteButton: {
        backgroundColor: '#fff',
        borderColor: 'black',
    },
    greenButton: {
        borderColor: '#68A51D',
        backgroundColor: '#68A51D',
    },
    blackText: {
        color: '#000',
    },
    block: {
        flex: 1,
    },
})

Button.defaultProps = {
    disabled: false,
}

Button.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    style: ViewPropTypes.style,
    textStyle: PropTypes.object,
    colorScheme: PropTypes.string,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
}

export default Button
