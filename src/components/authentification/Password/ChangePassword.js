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

import {NoobaContext} from '../../../provider/provider';
import {changeUserPassword, resendPasswordEmail} from '../../../provider/PasswordRequest';
import MainComponent from '../../landingComponents/MainComponent';
import colors from '../../../constant/colors';
import HeaderComponent from '../../landingComponents/HeaderComponent';
import {h, totalSize, w} from '../../../tools/Dimensions';
import texts from '../../../constant/texts';

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
      marginTop: h(3.5),
      alignSelf: 'center',
      color: 'white',
      backgroundColor,
      width: w(50),
    };
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(3),
    marginTop: h(2),
    textTransform: 'uppercase',
  },
  fieldStyle: {
    marginTop: h(2),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    height: h(6),
  },
});

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.route.params.email,
      code: '',
      newMdp: '',
      confirmMdp: '',
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

  resetPassWord = (email) => {
    this.setState({spinner: true});
    resendPasswordEmail(email)
      .then((response) => {
        const {
          data: {message},
        } = response;
        if (message === 'Email sent') {
          this.setState({
            spinner: false,
            showAlert: true,
            title: texts.activation_code_resent_title,
            alertMessage: texts.activation_code_resent_text,
          });
        } else {
          this.setState({
            spinner: false,
            showAlert: true,
            title: texts.invalid_login_server_error_title,
            alertMessage: texts.invalid_login_server_error_text,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          spinner: false,
          showAlert: true,
          title: texts.invalid_login_server_error_title,
          alertMessage: texts.invalid_login_server_error_text,
        });
      });
  };

  changePass = (email, code, newMdp, confirmMdp, pro) => {
    const {navigation} = this.props;

    this.setState({spinner: true});
    changeUserPassword(email, code, newMdp).then((response) => {
      const {
        data: {message},
      } = response;
      if (newMdp !== confirmMdp) {
        this.setState({
          spinner: false,
          showAlert: true,
          title: texts.invalid_change_password_mismatch_title,
          alertMessage: texts.invalid_change_password_mismatch_text,
        });
      } else if (message === 'Wrong code') {
        this.setState({
          spinner: false,
          showAlert: true,
          title: texts.invalid_change_password_code_title,
          alertMessage: texts.invalid_change_password_code_text,
        });
      } else {
        this.setState({
          spinner: false,
        });
        navigation.navigate('PasswordChanged', {pro});
      }
    });
  };

  UpdatePassword = (confirmMdp, code, newMdp) => {
    return (
      <>
        <TextInput
          mode="outlined"
          label="Code"
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
          value={code}
          onChangeText={(text) => this.setState({code: text})}
        />
        <TextInput
          mode="outlined"
          secureTextEntry
          label="Nouveau mot de passe"
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
          value={newMdp}
          onChangeText={(text) => this.setState({newMdp: text})}
        />
        <TextInput
          mode="outlined"
          secureTextEntry
          label="Confirmation mot de passe"
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
          value={confirmMdp}
          onChangeText={(text) => this.setState({confirmMdp: text})}
        />
      </>
    );
  };

  render() {
    const {navigation, route} = this.props;
    const {email, spinner, showAlert, title, alertMessage, code, newMdp, confirmMdp} = this.state;
    const {params} = route || {pro: false};
    const {pro} = params;
    let color = colors.brown;
    if (pro) color = colors.proBlue;

    return (
      <>
        <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
        <MainComponent bgColor={color} input>
          <HeaderComponent
            navigation={navigation}
            fontsize={60}
            height={22}
            showSubTitle
            showBackButton
            bgColor={color}
          />
          <View>
            <Text style={styles.mainText}>Mot de passe</Text>
            <IconFoundation style={{alignSelf: 'center'}} name="key" size={100} color="white" />
            <Text
              style={{
                marginTop: h(2),
                textAlign: 'center',
                color: 'white',
                fontSize: totalSize(1.5),
                marginHorizontal: w(5),
              }}>
              Allez consulter vos mails et insérez le code de vérification recu par email
            </Text>
            {this.UpdatePassword(confirmMdp, code, newMdp)}
            <Button
              color="white"
              mode="text"
              style={styles.ButtonInscrit(color)}
              labelStyle={{fontSize: totalSize(1.8)}}
              onPress={() => this.changePass(email, code, newMdp, confirmMdp, pro)}>
              Valider
            </Button>
            <Button
              color="white"
              mode="text"
              style={{
                ...styles.ButtonInscrit(color),
                marginBottom: h(2),
              }}
              labelStyle={{fontSize: totalSize(1.8)}}
              onPress={() => this.resetPassWord(email)}>
              Renvoyer l'email
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
            confirmButtonColor={color}
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

ChangePassword.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      pro: PropTypes.bool.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

ChangePassword.contextType = NoobaContext;
