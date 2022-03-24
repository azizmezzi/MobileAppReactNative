/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import PropTypes from 'prop-types';
import {TextInput, Button} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
import Spinner from 'react-native-loading-spinner-overlay';
import {BlurView} from '@react-native-community/blur';
import messaging from '@react-native-firebase/messaging';
import colors from '../../constant/colors';
import Validators from '../../tools/Validators';
import {totalSize, h, w} from '../../tools/Dimensions';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import texts from '../../constant/texts';
import {checkEmailExists} from '../../provider/authentification';
import {NoobaContext} from '../../provider/provider';
import FacebookButton from './FacebookButton/FacebookButton';

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  mainContainer: {
    marginTop: h(2),
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  fieldStyle: {
    marginTop: h(2),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    height: h(6),
  },
  textConnect: {
    color: '#6495ED',
    fontSize: totalSize(1.1, 770),
    textAlign: 'right',
    marginRight: w(10),
    textTransform: 'uppercase',
  },
  ExplicationText: {
    color: 'white',
    fontSize: totalSize(1.2, 770),
    textAlign: 'center',
  },
  BlockExplique: {
    marginTop: h(2),
    alignSelf: 'center',
    width: w(90),
  },
  ButtonInscrit: (backgroundColor) => {
    return {
      marginTop: h(2),
      alignSelf: 'center',
      color: 'white',
      backgroundColor,
      width: w(60),
      marginBottom: h(2),
    };
  },
});

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      name: '',
      email: '',
      password: '',
      confirmMdp: '',
      codeParrainage: '',
      showAlert: false,
      title: '',
      message: '',
      showPassword: false,
      showPasswordConfirm: false,
    };
  }

  hideAlert = (navigation, pro) => {
    const {message} = this.state;
    if (message === texts.invalid_register_account_exists_text) navigation.navigate('Login', {pro});
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  handlePerm = (perms) => {
    Alert.alert('Permissions', JSON.stringify(perms));
  };

  CheckEmail = (email, pro, navigation, user) => {
    this.setState({spinner: true});
    checkEmailExists(email)
      .then((response) => {
        const {data} = response;
        console.log(data, email);
        this.setState({spinner: false});
        if (data === 'User exists') {
          this.setState({
            showAlert: true,
            title: texts.invalid_register_account_exists_title,
            message: texts.invalid_register_account_exists_text,
          });
        } else if (pro) navigation.navigate('NameEtablissementPro', {user});
        else navigation.navigate('Gender', {user});
      })
      .catch(() => {
        this.setState({
          spinner: false,
          showAlert: true,
          title: texts.invalid_login_server_error_title,
          message: texts.invalid_login_server_error_text,
        });
      });
  };

  handleFacebookLogin = () => {
    const {navigation, route} = this.props;
    const {params} = route || {pro: false};
    const {pro} = params;

    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (result, err) => {
        console.log(err);

        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then((dataFb) => {
            const {accessToken} = dataFb;
            const facebookId = dataFb.userID;
            const responseInfoCallback = async (error, result2) => {
              if (error) {
                console.log(`Error fetching data: ${error.toString()}`);
              } else {
                const deviceToken = await messaging().getToken();
                const user = {
                  token: accessToken.toString(),
                  name: result2.name,
                  url: result2.picture.data.url,
                  password: facebookId,
                  email: result2.email,
                  isPro: pro,
                  isActive: true,
                  deviceTokens: [{token: deviceToken}],
                };

                this.CheckEmail(result2.email, pro, navigation, user);
              }
            };
            const infoRequest = new GraphRequest(
              '/me',
              {
                accessToken,
                parameters: {
                  fields: {string: 'name,picture.type(large),email'},
                },
              },
              responseInfoCallback,
            );
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      (error) => {
        console.log(`Login fail with error: ${error}`);
      },
    );
  };

  Content = () => {
    const {
      name,
      email,
      password,
      spinner,
      confirmMdp,
      codeParrainage,
      showPassword,
      showPasswordConfirm,
    } = this.state;
    const {navigation, route} = this.props;
    const {params} = route || {pro: false};
    const {pro} = params;

    return (
      <View style={styles.mainContainer}>
        <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />

        <Text style={styles.mainText}>Inscription</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login', {pro})}
          style={{
            marginTop: h(1),

            width: w(100),
          }}>
          <Text style={styles.textConnect}>
            déja inscrit(e)?
            <Text
              style={{
                ...styles.textConnect,
                textDecorationLine: 'underline',
              }}>
              {' se connecter'}
            </Text>
          </Text>
        </TouchableOpacity>
        <TextInput
          mode="outlined"
          label="PRENOM"
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
          maxLength={25}
          value={name}
          onChangeText={(text) => this.setState({name: text})}
        />
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
        <TextInput
          mode="outlined"
          label="MOT DE PASSE"
          theme={{
            colors: {
              placeholder: 'white',
              text: 'white',
              primary: 'white',
              underlineColor: 'transparent',
              background: '#4f5356',
            },
          }}
          secureTextEntry={!showPassword}
          style={styles.fieldStyle}
          value={password}
          onChangeText={(text) => this.setState({password: text})}
          right={
            <TextInput.Icon
              style={{marginTop: h(1.75)}}
              name={() => (
                <IconMI
                  onPress={() => this.setState({showPassword: !showPassword})}
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  color="white"
                  size={22}
                />
              )}
              size={28}
              color="white"
            />
          }
        />
        <TextInput
          mode="outlined"
          label="CONFIRMATION MOT DE PASSE"
          theme={{
            colors: {
              placeholder: 'white',
              text: 'white',
              primary: 'white',
              underlineColor: 'transparent',
              background: '#4f5356',
            },
          }}
          secureTextEntry={!showPasswordConfirm}
          style={styles.fieldStyle}
          value={confirmMdp}
          onChangeText={(text) => this.setState({confirmMdp: text})}
          right={
            <TextInput.Icon
              style={{marginTop: h(1.75)}}
              name={() => (
                <IconMI
                  onPress={() => this.setState({showPasswordConfirm: !showPasswordConfirm})}
                  name={showPasswordConfirm ? 'visibility-off' : 'visibility'}
                  color="white"
                  size={22}
                />
              )}
              size={28}
              color="white"
            />
          }
        />
        {pro && (
          <TextInput
            mode="outlined"
            label="CODE DE PARRAINAGE (facultatif)"
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
            value={codeParrainage}
            onChangeText={(text) => this.setState({codeParrainage: text})}
          />
        )}
        <FacebookButton clickAction={this.handleFacebookLogin} />
        <View style={styles.BlockExplique}>
          <Text style={styles.ExplicationText}>
            En cliquant sur "s'enregistrer", vous acceptez nos conditions générales de vente, notre
            politique relative à la protection des données personnelles ainsi que notre code de
            conduite. En vous inscrivant, vous acceptez de recevoir des notifications.
          </Text>
        </View>
        <Button
          color="white"
          mode="text"
          style={styles.ButtonInscrit(pro ? colors.proBlue : colors.brown)}
          labelStyle={{fontSize: totalSize(2.1)}}
          onPress={() => {
            if (name === '' || email === '' || password === '' || confirmMdp === '') {
              this.setState({
                showAlert: true,
                title: texts.invalid_input_title,
                message: texts.invalid_input_text,
              });
            } else if (!Validators.validateEmail(email)) {
              this.setState({
                showAlert: true,
                title: texts.invalid_email_title,
                message: texts.invalid_email_text,
              });
            } else if (confirmMdp !== password) {
              this.setState({
                showAlert: true,
                title: texts.invalid_pwd_title,
                message: texts.invalid_pwd_text,
              });
            } else {
              const user = {name, email, password, codeParrainage};
              this.CheckEmail(email, pro, navigation, user);
            }
          }}>
          s&apos;ENREGISTRER
        </Button>
      </View>
    );
  };

  render() {
    const {navigation, route} = this.props;
    const {showAlert, title, message} = this.state;

    const {params} = route || {pro: false};
    const {pro} = params;
    return (
      <>
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown} input>
          <HeaderComponent
            height={18}
            showSubTitle
            showBackButton
            navigation={navigation}
            bgColor={pro ? colors.proBlue : colors.brown}
          />

          {this.Content()}
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title={title}
            message={message}
            closeOnTouchOutside
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton
            confirmText="OK"
            confirmButtonColor={pro ? colors.proBlue : colors.brown}
            onConfirmPressed={() => {
              this.hideAlert(navigation, pro);
            }}
            onDismiss={() => {
              this.hideAlert(navigation, pro);
            }}
          />
        </MainComponent>
        {showAlert && <BlurView style={styles.absolute} blurType="light" blurAmount={10} />}
      </>
    );
  }
}

Register.propTypes = {
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

Register.contextType = NoobaContext;
