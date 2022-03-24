/* eslint-disable prettier/prettier */
/* eslint-disable react/prefer-stateless-function */
import React, {useState, useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import PropTypes from 'prop-types';

import colors from '../../constant/colors';

import {h, w, totalSize} from '../../tools/Dimensions';
import MainComponent from '../landingComponents/MainComponent';
import HeaderComponent from '../landingComponents/HeaderComponent';
import {NoobaContext} from '../../provider/provider';

const styles = StyleSheet.create({
  ButtonIdentifier: {
    marginTop: h(4),
    alignSelf: 'center',
    color: 'white',
    backgroundColor: colors.gris,
    width: w(50),
  },
  ButtonInscrit: (pro) => {
    return {
      marginTop: h(2),
      marginBottom: h(5),
      alignSelf: 'center',
      color: 'white',
      backgroundColor: pro ? colors.proBlue : colors.brown,
      width: w(50),
    };
  },
  button_fb_icon: {
    alignSelf: 'center',
    // justifyContent: 'center',
    fontSize: w(10),
    color: '#1b019b',
  },
  button_fb_iconInsta: {
    alignSelf: 'center',

    fontSize: w(9.5),
    color: colors.brown,
  },
  button_fb_iconTwitter: {
    alignSelf: 'center',
    // justifyContent: 'center',
    fontSize: w(9),
    color: '#6495ED',
  },
  button_fb: {
    alignSelf: 'center',

    borderWidth: 2,
    borderColor: colors.gris,

    width: w(38),
    height: h(6),
    marginRight: w(3),
  },
  button_fb_container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: h(2.5),
    // paddingLeft: w(3),
    // paddingTop: h(0.5),
  },
});

const MainPage = (props) => {
  const {navigation} = props;
  const [pro, setPro] = useState(false);
  const context = useContext(NoobaContext);

  return (
    <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
      <HeaderComponent
        fontsize={90}
        showSubTitle
        showBackButton={false}
        bgColor={pro ? colors.proBlue : colors.brown}
        navigation={navigation}
      />

      <View>
        <Button
          color="white"
          mode="text"
          style={styles.ButtonIdentifier}
          labelStyle={{fontSize: totalSize(2.5)}}
          onPress={() => navigation.navigate('Login', {pro})}>
          s&apos;identifier
        </Button>
        <Button
          color="white"
          mode="text"
          style={styles.ButtonInscrit(pro)}
          labelStyle={{fontSize: totalSize(2.5)}}
          onPress={() => navigation.navigate('Register', {pro})}>
          s&apos;inscrire
        </Button>

        <TouchableOpacity
          onPress={() => {
            setPro(!pro);
            context.setPro();
          }}
          style={{marginTop: h(2), alignSelf: 'center'}}>
          <Text style={{color: '#6495ED', fontSize: totalSize(1.3)}}>
            {pro ? `VOUS ETES PARTICULIER ? CLIQUEZ ICI` : `VOUS ETES PROFESSIONNEL ? CLIQUEZ ICI`}
          </Text>
        </TouchableOpacity>
      </View>
    </MainComponent>
  );
};

MainPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default MainPage;
