/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import IconFoundation from 'react-native-vector-icons/Foundation';
import {TextInput, Button} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';
import {BlurView} from '@react-native-community/blur';

import colors from '../../../constant/colors';
import {requestPasswordChange} from '../../../provider/PasswordRequest';
import {h, totalSize, w} from '../../../tools/Dimensions';
import MainComponent from '../../landingComponents/MainComponent';
import HeaderComponent from '../../landingComponents/HeaderComponent';
import {NoobaContext} from '../../../provider/provider';

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
  fieldStyle: {
    marginTop: h(2),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    height: h(6),
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(3),
    marginTop: h(2),
    textTransform: 'uppercase',
  },
});

export default class ForgottenEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.route.params.email,
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
    const {email, spinner, showAlert, title, alertMessage} = this.state;

    const {params} = route || {pro: false};
    const {pro} = params;

    return (
      <>
        <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown} input>
          <HeaderComponent
            fontsize={60}
            height={22}
            showSubTitle
            showBackButton
            navigation={navigation}
            bgColor={pro ? colors.proBlue : colors.brown}
          />

          <View>
            <Text style={styles.mainText}>Mot de passe</Text>
            <IconFoundation style={{alignSelf: 'center'}} name="key" size={100} color="white" />
            <TextInput
              mode="outlined"
              label="EMAIL"
              theme={{
                colors: {
                  placeholder: 'white',
                  text: 'white',
                  primary: 'white',
                  underlineColor: 'transparent',
                  background: '#4f5356',
                },
              }}
              style={styles.fieldStyle}
              value={email}
              onChangeText={(text) => this.setState({email: text})}
            />
            <Text
              style={{
                marginTop: h(5),
                textAlign: 'center',
                color: 'white',
                fontSize: totalSize(1.5),
                marginHorizontal: w(5),
              }}>
              En cliquant sur le bouton ci-dessous, vous recevrez un mail de réinitialisation du mot
              de passe sur votre adresse email.
            </Text>
            <Button
              color="white"
              mode="text"
              style={styles.ButtonInscrit(pro ? colors.proBlue : colors.brown)}
              labelStyle={{fontSize: totalSize(1.8)}}
              onPress={() => {
                this.setState({spinner: true});
                requestPasswordChange(email)
                  .then((response) => {
                    const {
                      data: {message},
                    } = response;
                    this.setState({spinner: false});
                    if (message === 'User not found') {
                      this.setState({
                        showAlert: true,
                        title: 'Erreur',
                        alertMessage: `Email n'existe pas`,
                      });
                    } else {
                      navigation.navigate('ChangePassword', {pro, email});
                    }
                  })
                  .catch((err) => {
                    this.setState({
                      spinner: false,
                      showAlert: true,
                      title: 'Erreur',
                      alertMessage: `Erreur connexion`,
                    });
                  });
              }}>
              Envoyer mail
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
            confirmButtonColor={pro ? colors.proBlue : colors.brown}
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

ForgottenEmail.propTypes = {
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

ForgottenEmail.contextType = NoobaContext;
