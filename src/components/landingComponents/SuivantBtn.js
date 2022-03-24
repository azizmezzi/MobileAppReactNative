import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../constant/colors';
import {h, totalSize, w} from '../../tools/Dimensions';

const styles = StyleSheet.create({
  mainStyle: (span, pro) => {
    return {
      height: h(8),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: pro !== undefined ? colors.proBlue : colors.brown,
      width: w(45),
      marginBottom: h(12),
    };
  },
  suivantText: {
    fontSize: totalSize(2),
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

// eslint-disable-next-line react/prefer-stateless-function
export default class SuivantBtn extends Component {
  render() {
    const {text, span, onPress, bgColor} = this.props;
    return (
      <TouchableOpacity style={styles.mainStyle(span, bgColor)} onPress={onPress}>
        <Text style={styles.suivantText}>{text !== undefined ? text : 'Suivant'} </Text>
        <Icon name="arrow-right" size={totalSize(2)} color="white" />
      </TouchableOpacity>
    );
  }
}
