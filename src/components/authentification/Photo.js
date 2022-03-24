/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Spinner from 'react-native-loading-spinner-overlay';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import {BlurView} from '@react-native-community/blur';
import Geolocation from '@react-native-community/geolocation';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import NotifService from '../../tools/pushnotif';
import GlobalFunction from '../../GlobleFun/GlobalFunction';

import colors from '../../constant/colors';
import {h, totalSize, w} from '../../tools/Dimensions';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import SuivantBtn from '../landingComponents/SuivantBtn';
import {register} from '../../provider/authentification';
import texts from '../../constant/texts';
import {getEvents} from '../../provider/events';
import {NoobaContext} from '../../provider/provider';

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
  questionText: {
    color: 'white',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  statusButton: {
    marginHorizontal: w(5),
    marginVertical: w(2),
  },
  statusButtonContent: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    height: h(6),
  },
  iconContainer: {justifyContent: 'center', alignSelf: 'center', marginTop: h(5)},
  ImageContainer: {justifyContent: 'center', alignSelf: 'center', marginTop: h(5)},
  Image: {height: h(25), width: w(60)},
});

export default class Photo extends Component {
  constructor(props) {
    super(props);

    const {params} = props.route || {pro: false};
    const {user} = params;
    let path = '';
    if (user.url !== undefined) path = user.url;
    this.state = {
      path,
      spinner: false,
      showAlert: false,
      title: '',
      message: '',
    };
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  onRegister = (token) => {
    console.log(token);
  };

  onNotif = (notif) => {
    console.log(notif);
  };

  handlePerm = (perms) => {
    Alert.alert('Permissions', JSON.stringify(perms));
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
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

  EndRegister = async (path) => {
    const {navigation, route} = this.props;
    const {params} = route || {pro: false};
    const {pro, user} = params;
    user.isPro = pro;
    if (path !== '') {
      user.url = path;
      const deviceToken = await messaging().getToken();
      user.deviceTokens = [{token: deviceToken}];
      user.isEnabled = !user.isPro;
      this.setState({spinner: true});
      register(user)
        .then(async (res) => {
          this.setState({spinner: false});
          const {data} = res;
          const {token} = res.data;
          const NewUser = data.user;
          NewUser.token = token;
          const {context} = this;
          context.setUser(NewUser);
          context.setPro(user.isPro);
          GlobalFunction.SocketSys(NewUser, context);
          this.FCMNotif(context);
          await AsyncStorage.setItem('user', JSON.stringify(NewUser));
          if (!NewUser.isActive) navigation.navigate('VerifMail', {user: NewUser, pro, token});
          else navigation.navigate('BienvenueNooba', {user: NewUser, pro, token});
          if (user.codeParrainage !== undefined) {
            await AsyncStorage.setItem('CodeParrainage', user.codeParrainage);
          }
        })
        .catch(() => {
          this.setState({spinner: false});
        });
    } else {
      this.setState({
        showAlert: true,
        title: texts.invalid_Image_title,
        message: texts.invalid_Image_text,
      });
    }
  };

  Content = () => {
    const {route} = this.props;
    const {path} = this.state;
    const {params} = route || {pro: false};
    const {pro} = params;

    return (
      <>
        <View style={styles.mainContainer}>
          <Text style={styles.mainText}>Inscription</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: h(10),
              // marginLeft: w(10),
            }}>
            <Text style={{...styles.questionText, marginLeft: w(5), width: w(80)}}>
              Téléchargez votre photo de profil
            </Text>
            {path !== '' && (
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    path: '',
                  })
                }
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: w(8) / 2,
                  width: w(8),
                  height: w(8),
                  backgroundColor: 'white',
                }}>
                <ImageBackground
                  resizeMode="contain"
                  style={{
                    alignSelf: 'center',
                    width: w(6),
                    height: w(6),
                    color: 'white',
                  }}
                  imageStyle={{borderRadius: w(50) / 2}}
                  // eslint-disable-next-line global-require
                  source={require('../../assets/trash.png')}
                />
              </TouchableOpacity>
            )}
          </View>

          {path === '' ? (
            <TouchableOpacity activeOpacity={0.8} style={styles.iconContainer}>
              <Icon
                onPress={() => {
                  launchImageLibrary(
                    {mediaType: 'photo', quality: 0.9, maxWidth: 500, maxHeight: 500},
                    (response) => {
                      if (response.didCancel) {
                        console.log('User cancelled image picker');
                      } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                      } else {
                        this.setState({
                          path: response.uri,
                        });
                      }
                    },
                  );
                }}
                name="plus-square"
                size={60}
                color="white"
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.ImageContainer}>
              <Image source={{uri: path}} resizeMode="contain" style={styles.Image} />
            </View>
          )}
        </View>
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SuivantBtn
            bgColor={pro ? colors.proBlue : undefined}
            onPress={async () => this.EndRegister(path)}
          />
        </View>
      </>
    );
  };

  render() {
    const {navigation, route} = this.props;
    const {params} = route || {pro: false};
    const {showAlert, spinner, title, message} = this.state;

    const {pro} = params;
    return (
      <>
        <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
        <MainComponent bgColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}>
          <HeaderComponent
            navigation={navigation}
            height={22}
            showBackButton
            showSubTitle
            showHeaderText
            bgColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}
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
            confirmButtonColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
            onDismiss={() => {
              this.hideAlert();
            }}
          />
        </MainComponent>
        {showAlert && <BlurView style={styles.absolute} blurType="light" blurAmount={10} />}
      </>
    );
  }
}

Photo.propTypes = {
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

Photo.contextType = NoobaContext;
