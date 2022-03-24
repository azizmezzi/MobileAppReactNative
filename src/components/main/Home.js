/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-children-prop */
import React from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Keyboard, BackHandler, ActivityIndicator, StyleSheet, View} from 'react-native';

import MarketplaceStack from './MarketplaceNavigator';
import Account from '../profil/Account';
import Event from '../events/Event';
import JetonStack from '../jetons/JetonsNavigator';
import Notifications from '../notifications/Notifications';
import MessagerieStack from '../messagerie/MessagerieNavigator';
import BotomNavbar from './BottomNavbar';
import ProfileNavigator from '../profil/ProfileNavigator';
import EventNavigator from '../events/EventNavigator';
import AgendaNavigator from '../agenda/AgendaNavigator';
import {NoobaContext} from '../../provider/provider';

const Tab = createBottomTabNavigator();
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

// eslint-disable-next-line react/prefer-stateless-function
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // pro: false,
      show: false,
    };
  }

  async componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    const {navigation, route} = this.props;
    const {params} = route || {pro: false};
    console.log({route});
    if (params === undefined) {
      const value = await AsyncStorage.getItem('user');
      const user = JSON.parse(value);
      if (!user.isActive) {
        navigation.navigate('VerifMail', {user, pro: user.isPro, token: user.token});
      } else if (user.isPro && !user.isEnabled) {
        navigation.navigate('AttendreConfirmation', {token: user.token, user, firstTime: false});
      } /* else {
        if (user.isPro) {
          navigation.navigate('Profil');
        } else {
          navigation.navigate('Marketplace');
        }
      } */
      // navigation.navigate('Profil');
    }
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      BackHandler.exitApp();
    });
  }

  _keyboardDidShow = () => {
    this.setState({show: true});
    console.log('hhh');
  };

  _keyboardDidHide = () => {
    this.setState({show: false});
    console.log('hh2h');
  };

  getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const screens = [
      'Step1',
      'Step2',
      'Step3',
      // 'Step4',
      'ImageGlobal',
      'Step42',
      'Step5',
      'Publier',
      // 'StepSave',
      'Step6',
      'Discussion',
    ];
    if (screens.includes(routeName)) {
      return false;
    }
    return true;
  };

  render() {
    const {navigation} = this.props;
    const {show} = this.state;
    const {
      context: {pro, user},
    } = this;
    const init = pro ? 'Profil' : 'Marketplace';
    console.log({pro});
    if (user === null) {
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
      <Tab.Navigator
        headerMode="none"
        initialRouteName={init}
        tabBar={(props) => (show ? <></> : <BotomNavbar {...{props, pro}} />)}>
        {pro ? (
          <>
            <Tab.Screen
              name="Agenda"
              component={AgendaNavigator}
              options={({route}) => ({
                tabBarVisible: this.getTabBarVisibility(route),
              })}
            />
            <Tab.Screen name="Jeton" component={JetonStack} />
            <Tab.Screen
              name="Event"
              options={({route}) => ({
                tabBarVisible: this.getTabBarVisibility(route),
              })}
              component={EventNavigator}
            />
            <Tab.Screen
              name="Messages"
              options={({route}) => ({
                tabBarVisible: this.getTabBarVisibility(route),
              })}
              component={MessagerieStack}
            />
            <Tab.Screen name="Profil" component={ProfileNavigator} />
            <Tab.Screen
              name="Marketplace"
              options={({route}) => ({
                tabBarVisible: this.getTabBarVisibility(route),
              })}
              component={MarketplaceStack}
            />
          </>
        ) : (
          <>
            <Tab.Screen name="Profil" component={ProfileNavigator} />
            <Tab.Screen
              name="Messages"
              options={({route}) => ({
                tabBarVisible: this.getTabBarVisibility(route),
              })}
              component={MessagerieStack}
            />
            <Tab.Screen
              name="Marketplace"
              options={({route}) => ({
                tabBarVisible: this.getTabBarVisibility(route),
              })}
              component={MarketplaceStack}
            />
            <Tab.Screen
              name="Agenda"
              component={AgendaNavigator}
              options={({route}) => ({
                tabBarVisible: this.getTabBarVisibility(route),
              })}
            />
            <Tab.Screen
              name="Event"
              options={({route}) => ({
                tabBarVisible: this.getTabBarVisibility(route),
              })}
              component={EventNavigator}
            />
          </>
        )}
        <Tab.Screen name="Jetons" component={JetonStack} />

        <Tab.Screen
          name="Notifications"
          children={() => <Notifications pro={pro} navigation={navigation} />}
        />
        <Tab.Screen name="Account" component={Account} />
        <Tab.Screen name="EventView" component={Event} />
      </Tab.Navigator>
    );
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Home.contextType = NoobaContext;
