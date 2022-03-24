/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable global-require */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-native-loading-spinner-overlay';
import {StyleSheet, TouchableOpacity, View, Text, ScrollView} from 'react-native';
import {Avatar} from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';

import colors from '../../constant/colors';
import {setNotificationAncien} from '../../provider/authentification';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import {getEvents} from '../../provider/events';

moment.locale('fr');

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  mainBrownText: (pro) => {
    return {
      marginTop: h(3),
      color: pro ? colors.proBlue : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(2),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
});

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {spinner: false};
  }

  componentDidMount() {
    const {notifications, user} = this.context;
    notifications.map((notif) => {
      const cloneObj = {...notif};
      if (cloneObj.ancien === false) {
        setNotificationAncien(user.token, cloneObj._id);
      }
      return cloneObj;
    });
  }

  componentWillUnmount() {
    const {notifications, setNotifications} = this.context;
    const newArray = notifications.map((notif) => {
      const cloneObj = {...notif};
      if (cloneObj.ancien === false) {
        cloneObj.ancien = true;
      }
      return cloneObj;
    });
    setNotifications(newArray);
  }

  regroupeParDate = (notification) => {
    if (notification.length > 0) {
      const data = notification.sort((a, b) => a.date > b.date);
      let target = [data[0]];

      let date = data[0].date.substring(0, 10);

      const dataTosend = [];
      for (let i = 1; i < data.length; i += 1) {
        if (date === data[i].date.substring(0, 10)) {
          target.push(data[i]);
        } else {
          date = data[i].date.substring(0, 10);
          dataTosend.push({data: target, date});
          target = [];
        }
      }
      if (target.length > 0) {
        dataTosend.push({data: target, date: new Date(date)});
      }
      return dataTosend;
    }
    return [];
  };

  unique = (arr) => {
    return arr.reduce((acc, current) => {
      const x = acc.find((item) => item.text === current.name);
      if (!x) {
        return acc.concat([current]);
      }
      return acc;
    }, []);
  };

  sortnotif = (newNotifs) => {
    return newNotifs.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  };

  regroupParAncien = (notificationAll) => {
    const notification = this.unique(notificationAll);
    const target = {new: [], old: []};
    if (notification.length > 0) {
      let newNotifs = notification.filter((e) => e.ancien === false);
      newNotifs = this.sortnotif(newNotifs);
      target.new = newNotifs;
      let oldNotifs = notification.filter((e) => e.ancien === true || e.ancien === undefined);
      oldNotifs = this.sortnotif(oldNotifs);

      target.old = oldNotifs;
    }
    return target;
  };

  settitle = (item) => {
    if (item.type === 'inscription') return 'Inscription';
    if (item.type === 'No specific event') return item.title;
    if (item.type === 'Alerte') return item.title;
    if (item.type === 'avis') return 'Avis';
    return item.nameEvent;
  };

  renderItem = (item, index) => {
    const title = this.settitle(item);
    return (
      <TouchableOpacity
        key={index}
        // disabled={item.ancien}
        onPress={() => {
          const {
            context: {pro},
          } = this;
          const {navigation} = this.props;
          if (item.type === 'inscription') navigation.navigate('Profil');
          else if (item.type === 'avis') navigation.navigate('Feedback');
          else if (item.type === 'Alerte') navigation.navigate('Filter', {pro});
          else if (item.type === 'participation') {
            const {
              context: {discussions},
            } = this;
            const pos = discussions.findIndex((x) => x.event === item.idEvent);
            if (pos > -1) navigation.navigate('Discussion', {discussionIndex: pos});
          } else if (
            item.type === 'Un évènement correspond à une alerte' ||
            item.type === 'Un évènement proche'
          ) {
            console.log({item});
            Geolocation.getCurrentPosition((info) => {
              const {
                coords: {latitude, longitude},
              } = info;
              const {ShowEvent, events, user, setEvents} = this.context;
              const pos = events.findIndex((e) => e._id === item.idEvent);
              if (pos === -1) {
                this.setState({spinner: true});
                getEvents(user.token, latitude, longitude).then((response) => {
                  this.setState({spinner: false});
                  setEvents(response.data.events);
                  const pos2 = response.data.events.findIndex((e) => e._id === item.idEvent);
                  console.log(pos2);

                  if (pos2 !== -1) {
                    const event2 = response.data.events[pos2];
                    ShowEvent(event2);
                    navigation.navigate('EventView');
                  }
                });
              } else {
                const event = events[pos];
                ShowEvent(event);
                navigation.navigate('EventView');
              }
            });
          } else if (item.type === 'participation Event' || item.type === 'déscription') {
            const {
              context: {ShowEvent, events},
            } = this;
            const pos = events.findIndex((e) => e._id === item.idEvent);
            if (pos !== -1) {
              const event2 = events[pos];
              ShowEvent(event2);
              navigation.navigate('EventView');
            }
          }
        }}
        style={{
          marginVertical: h(1),
          borderWidth: 1,
          borderRadius: 10,
          borderColor: 'white',
          marginHorizontal: w(3),
          paddingVertical: h(2),
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: w(15), marginLeft: w(1)}}>
            <Avatar.Image
              size={50}
              source={{
                uri:
                  item.type === 'inscription' ||
                  item.type === 'Alerte' ||
                  item.type === 'avis' ||
                  item.type === 'No specific event'
                    ? `http://18.130.184.230:3000/images/${item.userId}.png?t=${new Date()}`
                    : `http://18.130.184.230:3000/events_images/${item.image}`,
              }}
            />
          </View>
          <View
            style={{
              width: w(75),
              flexDirection: 'column',
              alignItems: 'baseline',
              marginLeft: w(3),
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: totalSize(1.9),
                fontWeight: 'bold',
              }}>
              {title}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: totalSize(1.8),
                marginRight: w(2),
              }}>
              {item.text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  Content = (pro) => {
    const {
      context: {notifications},
    } = this;
    const data = this.regroupParAncien(notifications);

    return (
      <ScrollView>
        <View style={{marginBottom: h(10)}}>
          <Text style={styles.headerColMidText}>Notifications</Text>
          {data.new.length > 0 ? <Text style={styles.mainBrownText(pro)}>Nouveau</Text> : null}
          {data.new.length > 0 && data.new.map((notif) => this.renderItem(notif))}
          {data.old.length > 0 ? <Text style={styles.mainBrownText(pro)}>Ancien</Text> : null}
          {data.old.length > 0 && data.old.map((notif) => this.renderItem(notif))}
        </View>
      </ScrollView>
    );
  };

  render() {
    const {navigation, pro} = this.props;
    const {spinner} = this.state;
    return (
      <>
        <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
          <HeaderComponent
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton
            bgColor={pro ? colors.proBlue : colors.brown}
            notif
            goBackAction={() => {
              const {notifications, setNotifications} = this.context;
              const newArray = notifications.map((notif) => {
                const cloneObj = {...notif};
                if (cloneObj.ancien === false) {
                  cloneObj.ancien = true;
                }
                return cloneObj;
              });
              setNotifications(newArray);
              if (pro) {
                navigation.navigate('Profil');
              } else {
                navigation.navigate('Marketplace');
              }
            }}
          />
          {this.Content(pro)}
        </MainComponent>
      </>
    );
  }
}

Notifications.propTypes = {
  pro: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Notifications.contextType = NoobaContext;
