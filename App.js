/* eslint-disable react/prefer-stateless-function */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {ActivityIndicator, StyleSheet, View, LogBox} from 'react-native';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';

import {Provider, NoobaContext} from './src/provider/provider';
import Login from './src/components/authentification/Login';
import ForgottenEmail from './src/components/authentification/Password/ForgottenEmail';
import ChangePassword from './src/components/authentification/Password/ChangePassword';
import PasswordChanged from './src/components/authentification/Password/PasswordChanged';
import MainPage from './src/components/authentification/MainPage';
import Register from './src/components/authentification/Register';
import Locality from './src/components/authentification/Locality';
import Gender from './src/components/authentification/Gender';
import NameEtablissementPro from './src/components/authentification/ProScreen/nameEtablissementPro';
import AddressPostal from './src/components/authentification/ProScreen/AddressPostal';
import NumTva from './src/components/authentification/ProScreen/NumTva';
import Status from './src/components/authentification/Status';
import Photo from './src/components/authentification/Photo';
import Naissance from './src/components/authentification/Naissance';
import VerifMail from './src/components/authentification/VerifMail';
import BienvenueNooba from './src/components/authentification/BienvenueNooba';
import AttendreConfirmation from './src/components/authentification/ProScreen/AttendreConfirmation';
import Guide from './src/components/guide/Guide';
import Home from './src/components/main/Home';
import NotifService from './src/tools/pushnotif';
import {navigationRef} from './src/provider/RootNavigation';
import texts from './src/constant/texts';
import {images} from './src/constant/Images';

const Stack = createStackNavigator();
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,

      login: false,
    };
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  async componentDidMount() {
    Geocoder.init(texts.google_maps_API_key, {language: 'fr'});
    LogBox.ignoreAllLogs();
    const value = await AsyncStorage.getItem('user');
    if (value !== null) {
      //  We have data!!
      this.setState({login: true, loading: false});
    } else {
      this.setState({login: false, loading: false});
    }
    FastImage.preload(images);
  }

  onRegister = async (token) => {
    console.log(token);
  };

  onNotif = (notif) => {
    console.log(notif);
  };

  render() {
    const {loading, login} = this.state;
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating
            color="#bc2b78"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      );
    }

    return (
      <Provider>
        <NoobaContext.Consumer>
          {() => {
            return (
              <NavigationContainer ref={navigationRef}>
                <Stack.Navigator headerMode="none" initialRouteName={login ? 'Home' : 'Main'}>
                  <>
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="Main"
                      component={MainPage}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="Login"
                      component={Login}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="ForgottenEmail"
                      component={ForgottenEmail}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="ChangePassword"
                      component={ChangePassword}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="PasswordChanged"
                      component={PasswordChanged}
                    />

                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="Register"
                      component={Register}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="Naissance"
                      component={Naissance}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="Locality"
                      component={Locality}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="VerifMail"
                      component={VerifMail}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="NameEtablissementPro"
                      component={NameEtablissementPro}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="AddressPostal"
                      component={AddressPostal}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="NumTva"
                      component={NumTva}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="Gender"
                      component={Gender}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="Status"
                      component={Status}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="Photo"
                      component={Photo}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="BienvenueNooba"
                      component={BienvenueNooba}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="AttendreConfirmation"
                      component={AttendreConfirmation}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="Guide"
                      component={Guide}
                    />
                    <Stack.Screen
                      options={{...TransitionPresets.SlideFromRightIOS}}
                      name="Home"
                      component={Home}
                    />
                  </>
                </Stack.Navigator>
              </NavigationContainer>
            );
          }}
        </NoobaContext.Consumer>
      </Provider>
    );
  }
}

App.contextType = NoobaContext;
