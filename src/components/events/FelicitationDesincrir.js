/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

import colors from '../../constant/colors';
import {h, w, totalSize} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import GlobalRender from '../main/GlobalRender';
import GlobalFunction from '../../GlobleFun/GlobalFunction';

const styles = StyleSheet.create({
  descriptionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    marginTop: h(2),
    marginHorizontal: w(12),
  },
  centerView: {
    alignItems: 'center',
  },
  suivantText: {
    fontSize: totalSize(2),
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  mainBrownText: (pro) => {
    return {
      color: pro ? colors.proBlue : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(2.1),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
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
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default class FelicitationDesincrir extends Component {
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

  suivantMarketplace = (pro) => {
    const {navigation} = this.props;

    return (
      <TouchableOpacity
        style={styles.mainStyle(pro)}
        onPress={() => {
          navigation.navigate('Marketplace');
        }}>
        <Text style={styles.suivantText}>Suivant</Text>
        <Icon name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    );
  };

  Content = () => {
    const {route} = this.props;
    const {pro} = this.context;
    const {jeton, nomEvent} = route.params;

    return (
      <View style={{height: h(75)}}>
        <ScrollView>
          <View style={{...styles.centerView, marginTop: h(3)}}>
            <Icon size={w(20)} name="check-circle" color="white" />
          </View>

          <View style={styles.centerView}>
            <Text
              style={{
                ...styles.descriptionText,
                fontSize: totalSize(2.2),
                fontWeight: 'bold',
              }}>
              Vous êtes désinscrit(e) de l'évènement :
            </Text>
          </View>
          <View style={{...styles.centerView}}>
            <View style={{flexDirection: 'row', marginTop: h(6)}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: totalSize(2.5),
                  textTransform: 'uppercase',
                }}>
                {nomEvent}
              </Text>
            </View>
          </View>
          {/* <View>
            <Text style={{...styles.mainBrownText(pro), marginLeft: w(5), marginTop: h(4)}}>
              Vous avez actuellement :
            </Text>
          </View>
          <View style={{...styles.centerView}}>
            <View style={{flexDirection: 'row', marginTop: h(6)}}>
              <Icon2 name="coins" size={30} color="gold" />
              <Text
                style={{
                  color: 'white',
                  fontSize: totalSize(2.5),
                  textTransform: 'uppercase',
                }}>
                {` ${balanceUser} Jeton(s)`}
              </Text>
            </View>
              </View> */}
          <View
            style={{
              marginTop: h(30),
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            {this.suivantMarketplace(pro)}
          </View>
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
        Content={() => this.Content()}
        hideAlert={() => this.hideAlert()}
      />
    );
  }
}

FelicitationDesincrir.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

FelicitationDesincrir.contextType = NoobaContext;
