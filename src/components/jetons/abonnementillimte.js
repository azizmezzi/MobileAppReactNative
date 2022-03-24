/* eslint-disable no-underscore-dangle */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Image} from 'react-native';
import PropTypes from 'prop-types';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';

import colors from '../../constant/colors';

import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import GlobalRender from '../main/GlobalRender';

const styles = StyleSheet.create({
  mainBrownText: (pro) => {
    return {
      color: pro ? colors.proBlue : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(1.8),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  ButtonInscrit2: (backgroundColor) => {
    return {
      marginTop: h(3),
      alignSelf: 'center',
      color: 'white',
      backgroundColor,
      width: w(70),
    };
  },
});

export default class Abonnementillimte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      title: '',
      message: '',
      spinner: false,
    };
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  Content = () => {
    const {pro} = this.context;

    const {navigation} = this.props;

    return (
      <View style={{height: h(75)}}>
        <ScrollView>
          <Text style={{...styles.mainBrownText(pro), marginLeft: w(5), marginTop: h(4)}}>
            Abonnement actuel
          </Text>

          <View style={styles.centerView}>
            <Image
              resizeMode="contain"
              style={{alignSelf: 'center', width: w(15), height: h(15)}}
              // eslint-disable-next-line global-require
              source={require('../../assets/diamond.png')}
            />
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: totalSize(2),
                fontWeight: 'bold',
                marginHorizontal: w(12),
              }}>
              Abonnement PREMIUM
            </Text>
          </View>
          <Text style={{...styles.mainBrownText(pro), marginLeft: w(5), marginTop: h(4)}}>
            vous avez actuellement
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: h(3),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="coins" size={35} color="gold" />
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: totalSize(2),
                fontWeight: 'bold',
                marginLeft: w(4),
              }}>
              illimité
            </Text>
          </View>

          <Text style={{...styles.mainBrownText(pro), marginLeft: w(5), marginTop: h(4)}}>
            Modifier votre abonnement
          </Text>
          <Button
            color="white"
            mode="text"
            style={styles.ButtonInscrit2(pro ? colors.proBlue : colors.brown)}
            labelStyle={{fontSize: totalSize(1.4)}}
            onPress={() => {
              navigation.navigate('ConfirmeIllimte');
            }}>
            Annuler mon abonnement
          </Button>
        </ScrollView>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {showAlert, title, message, spinner} = this.state;
    return (
      <GlobalRender
        navigation={navigation}
        showAlert={showAlert}
        title={title}
        message={message}
        spinner={spinner}
        Content={this.Content}
        hideAlert={this.hideAlert}
      />
    );
  }
}

Abonnementillimte.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Abonnementillimte.contextType = NoobaContext;
