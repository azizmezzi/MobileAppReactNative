/* eslint-disable no-underscore-dangle */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import {BlurView} from '@react-native-community/blur';

import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import colors from '../../constant/colors';
import GlobalRender from '../main/GlobalRender';

const styles = StyleSheet.create({
  descriptionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(1.3),
    marginTop: h(8),
    marginHorizontal: w(12),
  },

  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  mainStyle: (pro) => {
    return {
      height: h(8),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: pro ? colors.proBlue : colors.brown,
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

export default class FelicitationCompteFree extends Component {
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

  suivantJeton = (pro) => {
    const {navigation} = this.props;

    return (
      <TouchableOpacity
        style={styles.mainStyle(pro)}
        onPress={() => {
          navigation.navigate('Jeton');
        }}>
        <Text style={styles.suivantText}>Suivant</Text>
        <Icon name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    );
  };

  Content = () => {
    const {pro} = this.context;
    const {showAlert} = this.state;

    return (
      <>
        {showAlert && <BlurView style={styles.absolute} blurType="light" blurAmount={10} />}

        <View style={{height: h(75)}}>
          <ScrollView>
            <View style={styles.centerView}>
              <Text
                style={{
                  ...styles.descriptionText,
                  fontSize: totalSize(1.7),

                  textTransform: 'uppercase',
                }}>
                votre abonnement premium a été stoppé
              </Text>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',

                  marginTop: h(2),
                  marginHorizontal: w(12),
                  fontSize: totalSize(1.7),

                  textTransform: 'uppercase',
                }}>
                vous avez désormais un compte free
              </Text>
            </View>
            <Image
              resizeMode="contain"
              style={{alignSelf: 'center', width: w(15), height: h(15), marginTop: h(10)}}
              // eslint-disable-next-line global-require
              source={require('../../assets/blue_diamond.png')}
            />
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: totalSize(2),
                fontWeight: 'bold',
                marginLeft: w(4),
              }}>
              Abonnement FREE
            </Text>

            <View
              style={{
                marginTop: h(18),
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              {this.suivantJeton(pro)}
            </View>
          </ScrollView>
        </View>
      </>
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
        Content={() => this.Content()}
        hideAlert={() => this.hideAlert()}
      />
    );
  }
}

FelicitationCompteFree.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

FelicitationCompteFree.contextType = NoobaContext;
