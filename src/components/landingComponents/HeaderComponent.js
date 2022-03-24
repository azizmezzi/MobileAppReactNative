/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Badge} from 'react-native-paper';
import IconFa5 from 'react-native-vector-icons/FontAwesome5';

import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {NoobaContext} from '../../provider/provider';

import colors from '../../constant/colors';
import {h, totalSize, w} from '../../tools/Dimensions';
import RightArrow from '../../constant/config.json';
import GlobalFunction from '../../GlobleFun/GlobalFunction';

const IconArrow = createIconSetFromFontello(RightArrow);

const styles = StyleSheet.create({
  mainStyle: (height, bgColor) => {
    return {
      height: height !== undefined ? h(height) : h(55),
      width: w(100),
      backgroundColor: bgColor !== undefined ? bgColor : colors.brown,
      borderBottomRightRadius: 50,
      borderBottomLeftRadius: 50,
    };
  },
  backButtonContainer: {
    marginTop: h(1),
    transform: [{rotate: '180deg'}],
    zIndex: 50,
    marginLeft: w(3),
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  closeButton: {
    fontSize: 35,
    width: w(10),
    color: 'white',
  },
  headerTextContainer: (type) => {
    return {
      position: 'absolute',
      bottom: type !== undefined ? h(2) : h(4),
    };
  },
  titleContainer: (position) => {
    return {
      justifyContent: position !== undefined ? position : 'center',
      alignItems: position !== undefined ? position : 'center',
      width: w(100),
    };
  },
  titleText: (fontSize) => {
    return {
      fontSize: totalSize(fontSize / 9),
      color: 'white',
      textAlign: 'center',
    };
  },
});

export default class HeaderComponent extends Component {
  render() {
    const {
      showBackButton,
      fontsize,
      navigation,
      type,
      showSubTitle,
      notif,
      children,
      height,
      bgColor,
      msg,
      goBackAction,
    } = this.props;
    const {
      context: {notifications, balance, user},
    } = this;

    let newLength = 0;
    let balanceUser = balance;

    if (user !== undefined && user !== null) if (user.illimite) balanceUser = '∞';

    if (notifications !== undefined)
      newLength = notifications.filter((e) => e.ancien === false).length;

    const isPro = user !== null ? user.isPro : false;

    return (
      <View style={styles.mainStyle(height, bgColor)}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => {
              if (msg !== undefined) navigation.navigate('Messages');
              else if (goBackAction !== undefined) {
                goBackAction();
              } else navigation.goBack();
            }}>
            <IconArrow
              name="right-arrow"
              style={{marginTop: h(1), marginLeft: w(2)}}
              size={w(6)}
              color={colors.white}
            />
          </TouchableOpacity>
        )}
        <View style={styles.headerTextContainer(type)}>
          <View style={{...styles.titleContainer('center'), flexDirection: 'row'}}>
            <View style={{width: w(25)}} />
            <View
              style={{
                width: GlobalFunction.Choose(fontsize > 50, w(90), w(50)),
              }}>
              <Text
                style={{
                  ...styles.titleText(GlobalFunction.Choose(fontsize !== undefined, fontsize, 40)),
                }}>
                NOOBA
              </Text>
            </View>
            <View style={{width: w(25), flexDirection: 'row'}}>
              {GlobalFunction.Choose(
                notif !== undefined,
                <>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Notifications');
                    }}>
                    <Icon
                      name="bell"
                      size={w(6)}
                      color={Colors.white}
                      style={{
                        marginLeft: isPro ? w(2) : w(12),
                        justifyContent: 'flex-end',
                        alignContent: 'flex-end',
                        alignSelf: 'flex-end',
                      }}
                    />
                    <Badge
                      size={22}
                      style={{
                        marginTop: -h(1),
                        marginRight: -w(1),
                      }}>
                      {newLength}
                    </Badge>
                  </TouchableOpacity>
                  {isPro && (
                    <TouchableOpacity
                      onPress={() => {
                        if (user !== undefined) {
                          navigation.navigate('Jetons');
                        }
                      }}>
                      <IconFa5
                        name="coins"
                        size={w(6)}
                        color="gold"
                        style={{
                          marginLeft: w(6),
                          justifyContent: 'flex-end',
                          alignContent: 'flex-end',
                          alignSelf: 'flex-end',
                        }}
                      />
                      <Badge
                        size={22}
                        style={{
                          marginTop: -h(1),
                          marginRight: -w(1),
                        }}>
                        {balanceUser}
                      </Badge>
                    </TouchableOpacity>
                  )}
                </>,
                null,
              )}
            </View>
          </View>
          {GlobalFunction.Choose(
            type === undefined,
            <View
              style={{
                ...styles.titleContainer('flex-end'),
                marginStart: w(-15),
                opacity: showSubTitle === true ? 1 : 0,
              }}>
              <Text style={styles.titleText(fontsize !== undefined ? 18 : 15)}>
                Better together
              </Text>
            </View>,
            null,
          )}
        </View>
        {children}
      </View>
    );
  }
}

HeaderComponent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

HeaderComponent.contextType = NoobaContext;
