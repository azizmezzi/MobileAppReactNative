import React, {PureComponent} from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../../constant/colors';
import {totalSize, h, w} from '../../../tools/Dimensions';
import {NoobaContext} from '../../../provider/provider';

const styles = StyleSheet.create({
  button_fb_container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: h(2.5),
  },
  button_fb: {
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gris,
    width: w(41),
    height: h(7),
    marginRight: w(3),
  },
});

export default class FacebookButton extends PureComponent {
  render() {
    const {clickAction} = this.props;
    return (
      <View style={styles.button_fb_container}>
        <TouchableOpacity activeOpacity={0.8} style={styles.button_fb} onPress={clickAction}>
          <View
            style={{
              flexDirection: 'row',
              width: w(38),
              height: h(6),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: 5,
                width: w(10),
                marginLeft: w(2),
              }}>
              <Image
                resizeMode="contain"
                style={{alignSelf: 'center', width: w(6), height: h(6)}}
                // eslint-disable-next-line global-require
                source={require('../../../assets/facebook.png')}
              />
            </View>
            <View
              style={{
                width: w(28),
              }}>
              <Text style={{color: colors.proBlue, fontSize: totalSize(1.5), textAlign: 'center'}}>
                Connexion avec Facebook
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

FacebookButton.propTypes = {
  clickAction: PropTypes.func.isRequired,
};

FacebookButton.contextType = NoobaContext;
