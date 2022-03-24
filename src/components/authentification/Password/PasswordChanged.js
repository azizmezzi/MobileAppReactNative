/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import {Button} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';
import {BlurView} from '@react-native-community/blur';

import colors from '../../../constant/colors';
import {NoobaContext} from '../../../provider/provider';
import MainComponent from '../../landingComponents/MainComponent';
import {h, totalSize, w} from '../../../tools/Dimensions';
import HeaderComponent from '../../landingComponents/HeaderComponent';

const styles = StyleSheet.create({
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(3),
    marginTop: h(2),
    textTransform: 'uppercase',
  },
  ButtonInscrit: (backgroundColor) => {
    return {
      marginTop: h(7),
      alignSelf: 'center',
      color: 'white',
      backgroundColor,
      width: w(50),
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

export default class PasswordChanged extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      title: '',
      alertMessage: '',
      spinner: false,
    };
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      alertMessage: '',
    });
  };

  render() {
    const {navigation, route} = this.props;
    const {spinner, showAlert, title, alertMessage} = this.state;

    const {params} = route || {pro: false};
    const {pro} = params;
    let bgColor = colors.brown;
    if (pro) bgColor = colors.proBlue;

    return (
      <>
        <MainComponent bgColor={bgColor} input>
          <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />

          <HeaderComponent
            fontsize={60}
            height={22}
            showSubTitle
            showBackButton
            navigation={navigation}
            bgColor={bgColor}
          />

          <View>
            <Text style={styles.mainText}>Mot de passe modifié</Text>
            <IconFontisto
              style={{alignSelf: 'center', marginTop: h(5)}}
              name="checkbox-active"
              size={100}
              color="white"
            />
            <Text
              style={{
                marginTop: h(5),
                textAlign: 'center',
                color: 'white',
                fontSize: totalSize(1.5),
                marginHorizontal: w(5),
              }}>
              Mot de passe modifié avec succès
            </Text>
            <Button
              color="white"
              mode="text"
              style={styles.ButtonInscrit(bgColor)}
              labelStyle={{fontSize: totalSize(1.8)}}
              onPress={() => {
                navigation.navigate('Login', {pro});
              }}>
              Login
            </Button>
          </View>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title={title}
            message={alertMessage}
            closeOnTouchOutside
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton
            confirmText="OK"
            // confirmText="Yes, delete it"
            confirmButtonColor={bgColor}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
            onDismiss={() => {
              this.hideAlert();
            }}
          />
        </MainComponent>
        {showAlert && (
          <BlurView
            style={styles.absolute}
            // viewRef={this.state.viewRef}
            blurType="light"
            blurAmount={10}
          />
        )}
      </>
    );
  }
}

PasswordChanged.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      pro: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

PasswordChanged.contextType = NoobaContext;
