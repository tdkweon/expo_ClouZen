import PropTypes from 'prop-types'
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from "../colors";

const CardView = props => { 
    const { children, elevation, opacity, cornerRadius } = props;
    
    let backgroundColor = null;
    let shadowColor = null;

    if(props.isDark){
        backgroundColor = colors.dark.cardBackground;
        shadowColor = colors.dark.shadow;
    } else {
        backgroundColor = colors.light.cardBackground;
        shadowColor = colors.light.shadow;
    }

    const cardStyle = Platform.select({
        ios: () => StyleSheet.create({
            container: {
                shadowRadius: elevation,
                shadowOpacity: opacity,
                shadowOffset: {width: 0, height: elevation },
                borderRadius: cornerRadius,
                shadowColor: shadowColor,
                backgroundColor: backgroundColor,
                // width: Dimension.get('window').width - 40,
            }
        }),
        android: () => StyleSheet.create({
            container: {
                elevation: elevation,
                borderRadius: cornerRadius,
                shadowColor: shadowColor,
                backgroundColor: backgroundColor,                
                // width: Dimension.get('window').width - 40,
            }
        }),
        default: () => StyleSheet.create({
            container: {
                shadowRadius: elevation,
                shadowOpacity: opacity,
                shadowOffset: {width: 0, height: elevation },
                borderRadius: cornerRadius,
                shadowColor: shadowColor,
                backgroundColor: backgroundColor,
                alignItems: 'center',
                // width: Dimension.get('window').width - 40,
            }
        }),
    })();

    return(
        <TouchableOpacity style={[cardStyle.container, props.style]} onPress={props.onPress}>
            <View>
                {children}
            </View>
        </TouchableOpacity>
    );
};

CardView.prototype = {
    elevation: PropTypes.number,
    cornerRadius: PropTypes.number,
    opacity: PropTypes.number
}

CardView.defaultProps = {
    elevation: 10,
    cornerRadius: 20,
    opacity: 0.5
}

export default CardView;