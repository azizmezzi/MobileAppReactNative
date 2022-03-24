/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import io from 'socket.io-client';
import messaging from '@react-native-firebase/messaging';
import Geolocation from '@react-native-community/geolocation';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-community/async-storage';
import NotifService from '../tools/pushnotif';
import * as RootNavigation from './RootNavigation';
import {getEvents, getBalance} from './events';

const NoobaContext = React.createContext();

class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pro: false,
      newEvent: {},
      eventView: {},
      events: null,
      loggedin: false,
      user: null,
      socket: null,
      focus: false,
      discussions: [],
      notifications: [],
      balance: 0,
      parrainage: 0,
      latitude: 50.854954,
      longitude: 4.30535,
    };
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  async componentDidMount() {
    console.log('aaaaaaaaaaaaaaazzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzaaaaaaaaaaaaaaaaaaaaaa');
    this.PushNotifAndroid();
    if (Platform.OS === 'ios') {
      const jsonNotifs = await AsyncStorage.getItem('Notifications');
      const normalNotifs = jsonNotifs !== null ? JSON.parse(jsonNotifs) : [];
      const newNotifs = normalNotifs.filter((n) => n.ancien === false).length;
      PushNotificationIOS.setApplicationIconBadgeNumber(newNotifs);
    }

    this.CleanSocket();
    const jsonUser = await AsyncStorage.getItem('user');

    if (jsonUser !== null) {
      const user = JSON.parse(jsonUser);
      this.SocketIO(user);
      this.setState({pro: user.isPro, user, loggedin: true});
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
          switch (result) {
            case RESULTS.GRANTED:
              Geolocation.getCurrentPosition((info) => {
                const {
                  coords: {latitude, longitude},
                } = info;
                console.log({latitude, longitude});
                this.setState({latitude, longitude});
                this.getEventBalance(user, latitude, longitude);
              });
              break;
            case RESULTS.BLOCKED:
              Geolocation.getCurrentPosition((info) => {
                const {
                  coords: {latitude, longitude},
                } = info;
                console.log({latitude, longitude});
                this.setState({latitude, longitude});
                this.getEventBalance(user, latitude, longitude);
              });
              break;
          }
        });
      } else {
        Geolocation.getCurrentPosition((info) => {
          const {
            coords: {latitude, longitude},
          } = info;
          console.log({latitude, longitude});
          this.setState({latitude, longitude});
          this.getEventBalance(user, latitude, longitude);
        });
      }
    }
  }

  PushNotifAndroid = () => {
    messaging().onMessage(async (remoteMessage) => {
      const {
        data: {notification},
      } = remoteMessage;
      console.log({remoteMessage});
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
      const {notifications} = this.state;
      if (Notifications !== null) {
        const notification1 = JSON.parse(Notifications);
        const index = notifications.findIndex((not) => not._id === notif._id);

        if (index === -1)
          if (PushNotification && !notif.ancien)
            this.notif.localNotif('sample.mp3', notif.title, notif.text);

        notification1.push(notif);
        await AsyncStorage.setItem('Notifications', JSON.stringify(notification1));
        this.setState({notifications: notification1});
      } else {
        if (PushNotification && !notif.ancien)
          this.notif.localNotif('sample.mp3', notif.title, notif.text);

        await AsyncStorage.setItem('Notifications', JSON.stringify([notif]));
        this.setState({notifications: [notif]});
        if (Platform.OS === 'ios') PushNotificationIOS.setApplicationIconBadgeNumber(notif.length);
      }
      if (Platform.OS === 'ios') PushNotificationIOS.setApplicationIconBadgeNumber(notif.length);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const {
        data: {notification},
      } = remoteMessage;
      console.log({remoteMessage});
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
      const {notifications} = this.state;
      if (Notifications !== null) {
        const notification1 = JSON.parse(Notifications);
        const index = notifications.findIndex((not) => not._id === notif._id);

        if (index === -1)
          if (PushNotification && !notif.ancien)
            this.notif.localNotif('sample.mp3', notif.title, notif.text);

        notification1.push(notif);
        await AsyncStorage.setItem('Notifications', JSON.stringify(notification1));
        this.setState({notifications: notification1});
      } else {
        if (PushNotification && !notif.ancien)
          this.notif.localNotif('sample.mp3', notif.title, notif.text);

        await AsyncStorage.setItem('Notifications', JSON.stringify([notif]));
        this.setState({notifications: [notif]});
        if (Platform.OS === 'ios') PushNotificationIOS.setApplicationIconBadgeNumber(notif.length);
      }
      if (Platform.OS === 'ios') PushNotificationIOS.setApplicationIconBadgeNumber(notif.length);
    });
  };

  SocketIO = (user) => {
    const socket = io.connect('http://18.130.184.230:3000/', {
      query: `token=${user.token}`,
    });
    socket.on('connect', () => {
      this.setState({socket});
      // eslint-disable-next-line no-underscore-dangle
      socket.emit('requestChats');
      socket.on('handleChatsRequest', (data) => {
        this.setState({discussions: data.discussion});
      });
      socket.on('handleChatsRequest', async (data2) => {
        const {notifications} = data2;

        await AsyncStorage.setItem('Notifications', JSON.stringify(notifications));

        this.setState({discussions: data2.discussion, notifications: data2.notifications});
      });
    });
    socket.on('receiveNewMessage', (obj) => {
      const {idDiscussion, newMessage, members} = obj;
      const {discussions} = this.state;
      const discussionIndex = discussions.findIndex((elem) => elem._id === idDiscussion);
      if (discussionIndex !== -1) {
        const discussion = discussions[discussionIndex];
        discussion.messages.push(newMessage);
        discussion.members = members;
        discussions[discussionIndex] = discussion;

        this.setState({discussions});
      }
    });
  };

  getEventBalance = (user, latitude, longitude) => {
    getEvents(user.token, latitude, longitude).then(async (response) => {
      const {data} = response;
      const {events} = data;

      this.setState({events});
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl !== null) {
        this.NavigateToEvent(initialUrl, events);
      }
      Linking.addEventListener('url', (obj) => {
        const {url} = obj;
        this.NavigateToEvent(url, events);
      });
    });
    if (user.isPro) {
      getBalance(user.token).then((response) => {
        const {data} = response;
        const {balance, parrainage} = data;

        this.setState({balance, parrainage});
      });
    }
  };

  NavigateToEvent = (initialUrl, events) => {
    const removeLink = initialUrl.replace('https://nooba.app/', '');
    const splitArray = removeLink.split('/');
    const command = splitArray[0];
    if (command === 'event') {
      const eventId = splitArray[1];
      const pos = events.findIndex((e) => {
        return e._id === eventId;
      });
      if (pos !== -1) {
        const event = events[pos];
        this.ShowEvent(event);
        RootNavigation.navigate('EventView');
      }
    }
  };

  CleanSocket = () => {
    const {socket} = this.state;
    if (socket !== null) {
      socket.emit('disconnectNotif');
    } else {
      console.log('noClean');
    }
  };

  onRegister = (token) => {
    console.log(token);
  };

  onNotif = (notif) => {
    if (notif.userInteraction) {
      RootNavigation.navigate('Notifications');
    }
  };

  handlePerm = (perms) => {
    RootNavigation.navigate('Notifications');
    Alert.alert('Permissions', JSON.stringify(perms));
  };

  setLoggedin = (loggedin) => {
    this.setState({loggedin});
  };

  setUser = (user) => {
    this.setState({user});
  };

  setEvents = (events) => {
    this.setState({events});
  };

  setBalance = (balance) => {
    this.setState({balance});
  };

  ShowEvent = (evet) => {
    this.setState({eventView: evet});
  };

  setPro = (newPro) => {
    this.setState({pro: newPro});
  };

  setNewEvent = (event) => {
    this.setState({newEvent: event});
  };

  setDiscussions = (discussions) => {
    this.setState({discussions});
  };

  setFocus = (focus) => {
    this.setState({focus});
  };

  setSocket = (socket) => {
    this.setState({socket});
  };

  setNotifications = (notifications) => {
    this.setState({notifications});
  };

  setParrainage = (parrainage) => {
    this.setState({parrainage});
  };

  render() {
    const {
      pro,
      newEvent,
      socket,
      eventView,
      events,
      loggedin,
      user,
      discussions,
      focus,
      notifications,
      balance,
      parrainage,
      latitude,
      longitude,
    } = this.state;
    const {children} = this.props;
    return (
      <NoobaContext.Provider
        value={{
          loggedin,
          pro,
          newEvent,
          eventView,
          events,
          user,
          socket,
          focus,
          notifications,
          balance,
          parrainage,
          setSocket: this.setSocket,
          setFocus: this.setFocus,
          discussions,
          setUser: this.setUser,
          setLoggedin: this.setLoggedin,
          setPro: this.setPro,
          setNewEvent: this.setNewEvent,
          ShowEvent: this.ShowEvent,
          setEvents: this.setEvents,
          setBalance: this.setBalance,
          setDiscussions: this.setDiscussions,
          setNotifications: this.setNotifications,
          setParrainage: this.setParrainage,
          latitude,
          longitude,
        }}>
        {children}
      </NoobaContext.Provider>
    );
  }
}

export {Provider, NoobaContext};
