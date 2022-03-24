/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {StyleSheet, View, Platform, Text, Alert} from 'react-native';
import PropTypes from 'prop-types';
import messaging from '@react-native-firebase/messaging';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TextInput, Button} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
import {BlurView} from '@react-native-community/blur';
import Geolocation from '@react-native-community/geolocation';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import colors from '../../constant/colors';
import GlobalFunction from '../../GlobleFun/GlobalFunction';

import {h, w, totalSize} from '../../tools/Dimensions';
import MainComponent from '../landingComponents/MainComponent';
import HeaderComponent from '../landingComponents/HeaderComponent';
import {login} from '../../provider/authentification';
import {getEvents, getBalance} from '../../provider/events';
import texts from '../../constant/texts';
import {NoobaContext} from '../../provider/provider';
import * as RootNavigation from '../../provider/RootNavigation';

import NotifService from '../../tools/pushnotif';
import FacebookButton from './FacebookButton/FacebookButton';

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
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(3),
    marginTop: h(2),
    textTransform: 'uppercase',
  },
  textConnect: {
    color: '#6495ED',
    fontSize: totalSize(1.1),
    textAlign: 'right',
    marginRight: w(10),
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
  },
  fieldStyle: {
    marginTop: h(2),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    height: h(6),
  },
});

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showAlert: false,
      title: '',
      message: '',
      spinner: false,
      // eslint-disable-next-line react/no-unused-state
      token: '',
      // eslint-disable-next-line react/no-unused-state
      notifPush: false,
    };
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  onRegister = (token) => {
    console.log(token);
    // eslint-disable-next-line react/no-unused-state
    this.setState({token});
  };

  onNotif = (notif) => {
    if (notif.userInteraction) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({notifPush: true});
      RootNavigation.navigate('Notifications');
    }
  };

  handlePerm = (perms) => {
    Alert.alert('Permissions', JSON.stringify(perms));
  };

  hideAlert = () => {
    this.setState({
      spinner: false,
      showAlert: false,
      title: '',
      message: '',
    });
  };

  componentDidMount() {
    Geolocation.getCurrentPosition((info) => {
      const {
        coords: {latitude: pLat, longitude: pLong},
      } = info;
    });
  }

  SetEventBalance = (user, context) => {
    Geolocation.getCurrentPosition((info) => {
      const {
        coords: {latitude: pLat, longitude: pLong},
      } = info;
      getEvents(user.token, pLat, pLong)
        .then((response) => {
          console.log(response);
          const dataE = response.data;
          const {events} = dataE;
          context.setEvents(events);
        })
        .catch(() => {
          this.setState({
            showAlert: true,
            title: 'erreur',
            message: 'erreur du serveur pour events',
          });
        });
    });

    if (user.isPro) {
      getBalance(user.token)
        .then((response) => {
          const dataB = response.data;
          const {balance} = dataB;
          context.setBalance(balance);
        })
        .catch(() => {
          this.setState({
            showAlert: true,
            title: 'erreur',
            message: 'erreur du serveur pour balance',
          });
        });
    }
  };

  FCMNotif = (context) => {
    messaging().onMessage(async (remoteMessage) => {
      const {
        data: {notification},
      } = remoteMessage;
      const notif = JSON.parse(notification);
      const PushNotification = true;
      if (notif.title === undefined) {
        this.notif.localNotif(
          'sample.mp3',
          notif.content.eventName,
          `${notif.content.sender}: ${notif.content.message}`,
        );
      }
      const Notifications = await AsyncStorage.getItem('Notifications');
      const {notifications, setNotifications} = context;
      if (Notifications !== null) {
        const notification1 = JSON.parse(Notifications);
        const index = notifications.findIndex((not) => not._id === notif._id);

        if (index === -1)
          if (PushNotification && !notif.ancien)
            this.notif.localNotif('sample.mp3', notif.title, notif.text);

        notification1.push(notif);
        await AsyncStorage.setItem('Notifications', JSON.stringify(notification1));
        setNotifications(notification1);
      } else {
        if (PushNotification && !notif.ancien)
          this.notif.localNotif('sample.mp3', notif.title, notif.text);

        await AsyncStorage.setItem('Notifications', JSON.stringify([notif]));

        setNotifications([notif]);
        if (Platform.OS === 'ios') PushNotificationIOS.setApplicationIconBadgeNumber(notif.length);
      }
      if (Platform.OS === 'ios') PushNotificationIOS.setApplicationIconBadgeNumber(notif.length);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const {
        data: {notification},
      } = remoteMessage;
      const notif = JSON.parse(notification);
      const PushNotification = true;
      if (notif.title === undefined) {
        this.notif.localNotif(
          'sample.mp3',
          notif.content.eventName,
          `${notif.content.sender}: ${notif.content.message}`,
        );
      }
      const Notifications = await AsyncStorage.getItem('Notifications');
      const {notifications, setNotifications} = context;
      if (Notifications !== null) {
        const notification1 = JSON.parse(Notifications);
        const index = notifications.findIndex((not) => not._id === notif._id);

        if (index === -1)
          if (PushNotification && !notif.ancien)
            this.notif.localNotif('sample.mp3', notif.title, notif.text);

        notification1.push(notif);
        await AsyncStorage.setItem('Notifications', JSON.stringify(notification1));
        setNotifications(notification1);
      } else {
        if (PushNotification && !notif.ancien)
          this.notif.localNotif('sample.mp3', notif.title, notif.text);

        await AsyncStorage.setItem('Notifications', JSON.stringify([notif]));

        setNotifications([notif]);
        if (Platform.OS === 'ios') PushNotificationIOS.setApplicationIconBadgeNumber(notif.length);
      }
      if (Platform.OS === 'ios') PushNotificationIOS.setApplicationIconBadgeNumber(notif.length);
    });
  };

  responseInfoCallback = async (facebookId, error, result2) => {
    const {navigation, route} = this.props;
    const {context} = this;
    const {setUser, setPro, setLoggedin} = context;
    const {params} = route || {pro: false};
    const {pro} = params;
    if (error) {
      this.setState({
        showAlert: true,
        title: 'Error',
        message: `Error fetching data: ${error.toString()}`,
      });
    } else {
      this.setState({spinner: true});
      const deviceToken = await messaging().getToken();
      login(result2.email, facebookId, pro, deviceToken).then(async (res) => {
        this.setState({spinner: false});
        const {data} = res;
        if (data.token === undefined)
          this.setState({
            showAlert: true,
            title: texts.invalid_login_title,
            message: GlobalFunction.Choose(
              data.message === 'User not found',
              texts.invalid_login_message,
              data.message,
            ),
          });
        else {
          const {user} = data;
          user.token = data.token;
          setUser(user);
          setLoggedin(true);
          setPro(user.isPro);

          GlobalFunction.SocketSys(user, context, this);
          this.FCMNotif(context);
          navigation.navigate('Home', {pro, user});

          await AsyncStorage.setItem('user', JSON.stringify(user));

          this.SetEventBalance(user, context);
        }
      });
    }
  };

  handleFacebookLogin = async () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      async (result, err) => {
        if (!result.isCancelled) {
          const dataFb = await AccessToken.getCurrentAccessToken();
          const {accessToken} = dataFb;
          const facebookId = dataFb.userID;
          const responseInfoCallback = async (error, result2) =>
            this.responseInfoCallback(facebookId, error, result2);
          const infoRequest = new GraphRequest(
            '/me',
            {
              accessToken,
              parameters: {
                fields: {string: 'name,picture,email'},
              },
            },
            responseInfoCallback,
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      (error) => {
        console.log(`Login fail with error: ${error}`);
      },
    );
  };

  handleEmailLogin = (email, password, deviceToken) => {
    const {navigation, route} = this.props;
    const {context} = this;
    const {setUser, setPro, setLoggedin} = context;
    const {params} = route || {pro: false};
    const {pro} = params;
    login(email, password, pro, deviceToken)
      .then(async (res) => {
        this.setState({spinner: false});
        const {data} = res;

        if (data.message === 'Logged in Successfully') {
          const {user} = data;
          user.token = data.token;

          setUser(user);
          setPro(user.isPro);

          setLoggedin(true);
          GlobalFunction.SocketSys(user, context);
          this.FCMNotif(context);
          if (user.isPro && !user.isEnabled) {
            this.SetEventBalance(user, context);

            navigation.navigate('AttendreConfirmation', {
              token: user.token,
              user,
              firstTime: false,
            });
          } else if (user.isActive) {
            this.SetEventBalance(user, context);

            navigation.navigate('Home', {pro, user});
          } else {
            this.SetEventBalance(user, context);

            navigation.navigate('VerifMail', {user, pro, token: user.token});
          }

          await AsyncStorage.setItem('user', JSON.stringify(user));
        } else
          this.setState({
            showAlert: true,
            title: texts.invalid_login_title,
            message: GlobalFunction.Choose(
              data.message === 'User not found',
              texts.invalid_login_message,
              data.message,
            ),
          });
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

  render() {
    const {navigation, route} = this.props;
    const {email, password, spinner, showAlert, title, message} = this.state;

    const {params} = route || {pro: false};
    const {pro} = params;

    return (
      <>
        <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
        <MainComponent bgColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)} input>
          <HeaderComponent
            fontsize={60}
            height={22}
            showSubTitle
            showBackButton
            navigation={navigation}
            bgColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}
          />

          <View>
            <Text style={styles.mainText}>s&apos;identifier</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register', {pro})}
              style={{
                marginTop: h(1),
                marginBottom: h(3),

                width: w(100),
              }}>
              <Text style={styles.textConnect}>pas encore inscrit(e) ? s&apos;inscrire</Text>
            </TouchableOpacity>
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
              secureTextEntry
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
              value={password}
              onChangeText={(text) => this.setState({password: text})}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgottenEmail', {pro, email});
              }}
              style={{
                marginTop: h(2),

                width: w(100),
              }}>
              <Text style={styles.textConnect}>mot de passe oublié ?</Text>
            </TouchableOpacity>
            <View style={{marginTop: h(2), alignSelf: 'center'}}>
              <Text style={{color: 'white', fontSize: totalSize(1.8)}}>OU LOGIN VIA</Text>
            </View>
            <FacebookButton clickAction={this.handleFacebookLogin} />
            <Button
              color="white"
              mode="text"
              style={styles.ButtonInscrit(GlobalFunction.Choose(pro, colors.proBlue, colors.brown))}
              labelStyle={{fontSize: totalSize(2)}}
              onPress={async () => {
                if (email !== '' && password !== '') {
                  this.setState({spinner: true});
                  const deviceToken = await messaging().getToken();
                  this.handleEmailLogin(email, password, deviceToken);
                } else {
                  this.setState({
                    spinner: true,
                    showAlert: true,
                    title: texts.invalid_input_title,
                    message: texts.invalid_input_text,
                  });
                }
              }}>
              se connecter
            </Button>
          </View>

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
            confirmButtonColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}
            onConfirmPressed={this.hideAlert}
            onDismiss={this.hideAlert}
          />
        </MainComponent>
        {showAlert && <BlurView style={styles.absolute} blurType="light" blurAmount={10} />}
      </>
    );
  }
}

Login.propTypes = {
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

Login.contextType = NoobaContext;
