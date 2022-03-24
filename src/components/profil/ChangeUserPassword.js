/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import IconFoundation from 'react-native-vector-icons/Foundation';
import {TextInput, Button} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';

import colors from '../../constant/colors';
import {updateProfileData} from '../../provider/authentification';
import {h, totalSize, w} from '../../tools/Dimensions';
import MainComponent from '../landingComponents/MainComponent';
import HeaderComponent from '../landingComponents/HeaderComponent';
import {NoobaContext} from '../../provider/provider';
import texts from '../../constant/texts';

const styles = StyleSheet.create({
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

export default class ChangeUserPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldMdp: '',
      newMdp: '',
      confirmMdp: '',
      showAlert: false,
      title: '',
      alertMessage: '',
      spinner: false,
      errorText: '',
    };
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      alertMessage: '',
    });
  };

  FieldInput = (state, set, title) => {
    return (
      <TextInput
        secureTextEntry
        mode="outlined"
        label={title}
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
        value={state}
        onChangeText={(text) => {
          switch (set) {
            case 1:
              this.setState({oldMdp: text});
              break;
            case 2:
              this.setState({newMdp: text});
              break;
            case 3:
              this.setState({confirmMdp: text});
              break;
            default:
              this.setState({oldMdp: text});
              break;
          }
        }}
      />
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      spinner,
      showAlert,
      title,
      alertMessage,
      oldMdp,
      newMdp,
      confirmMdp,
      errorText,
    } = this.state;
    const {
      context: {pro},
    } = this;
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
            <IconFoundation style={{alignSelf: 'center'}} name="key" size={70} color="white" />

            {this.FieldInput(oldMdp, 1, 'Mot de passe actuel')}
            {this.FieldInput(newMdp, 2, 'Nouveau mot de passe')}
            {this.FieldInput(confirmMdp, 3, 'Confirmation mot de passe')}

            <Text
              style={{
                marginTop: h(2),
                textAlign: 'center',
                color: 'red',
                fontSize: totalSize(1.5),
                marginHorizontal: w(5),
              }}>
              {errorText}
            </Text>
            <Button
              color="white"
              mode="text"
              style={{
                ...styles.ButtonInscrit(pro ? colors.proBlue : colors.brown),
                marginBottom: h(2),
              }}
              labelStyle={{fontSize: totalSize(1.8)}}
              onPress={() => {
                const {
                  context: {user},
                } = this;
                if (newMdp !== confirmMdp) {
                  this.setState({
                    errorText: texts.invalid_change_password_mismatch_text,
                  });
                  return false;
                }
                this.setState({spinner: true});
                updateProfileData({type: 5, oldPassword: oldMdp, newPassword: newMdp}, user.token)
                  .then((response) => {
                    this.setState({spinner: false});
                    const {
                      data: {message},
                    } = response;
                    if (message == 'passwords dont match') {
                      this.setState({
                        errorText: texts.password_change_invalid_password_text,
                      });
                    } else {
                      this.setState({
                        errorText: '',
                        showAlert: true,
                        title: texts.password_change_success_title,
                        alertMessage: texts.password_change_success_text,
                      });
                    }
                  })
                  .catch(() =>
                    this.setState({
                      spinner: false,
                      errorText: '',
                      showAlert: true,
                      title: texts.invalid_login_server_error_title,
                      alertMessage: texts.invalid_login_server_error_text,
                    }),
                  );
              }}>
              Valider
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
      </>
    );
  }
}

ChangeUserPassword.propTypes = {
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

ChangeUserPassword.contextType = NoobaContext;
