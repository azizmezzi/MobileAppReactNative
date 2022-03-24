/* eslint-disable no-underscore-dangle */
import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView, RefreshControl, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';

import colors from '../../../constant/colors';
import HeaderComponent from '../../landingComponents/HeaderComponent';
import MainComponent from '../../landingComponents/MainComponent';
import MarketplaceCard from '../../main/MarketplaceCard';
import {h, totalSize, w} from '../../../tools/Dimensions';
import {NoobaContext} from '../../../provider/provider';
import {getBalance, getEvents} from '../../../provider/events';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  mainBrownText: (color) => {
    return {
      color: color !== undefined ? color : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(1.9),
      marginLeft: w(4),
      fontWeight: 'bold',
    };
  },
  iconContainer: {alignSelf: 'center', marginVertical: h(5)},
});

export default class Step0 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      refreshing: false,
    };
  }

  async componentDidMount() {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);

    this.setState({user});
  }

  Content = (events, ShowEvent) => {
    const {navigation} = this.props;
    const {
      context: {pro, user},
    } = this;
    const {refreshing} = this.state;
    return (
      <View style={{height: h(75)}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              colors={[pro ? colors.proBlue : colors.brown]}
              onRefresh={() => {
                this.setState({refreshing: true});

                if (user.isPro) {
                  getBalance(user.token).then((response) => {
                    const dataB = response.data;
                    const {balance} = dataB;
                    const {setBalance} = this.context;
                    setBalance(balance);
                  });
                }

                Geolocation.getCurrentPosition((info) => {
                  const {
                    coords: {latitude: pLat, longitude: pLong},
                  } = info;

                  getEvents(user.token, pLat, pLong).then((response) => {
                    this.setState({refreshing: false});
                    const {setEvents} = this.context;
                    setEvents(response.data.events);
                  });
                });
              }}
            />
          }>
          <Text style={styles.headerColMidText}>Créer un évènement</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Step1');
            }}
            style={styles.iconContainer}>
            <Icon name="plus-square" size={totalSize(4)} color="white" />
          </TouchableOpacity>
          <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
            Liste des évènements organisés
          </Text>
          {events.map((event) => {
            const {_id} = event;
            return (
              <MarketplaceCard
                key={_id}
                event={event}
                navigation={navigation}
                ShowEvent={ShowEvent}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {user} = this.state;
    const {
      context: {pro},
    } = this;
    return (
      <NoobaContext.Consumer>
        {(props) => {
          const {ShowEvent, events} = props;
          const eventCreated = events.filter((event) => event.creator === user._id);
          eventCreated.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          return (
            <>
              <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
                <HeaderComponent
                  navigation={navigation}
                  height={9}
                  fontsize={30}
                  type
                  showBackButton={false}
                  bgColor={pro ? colors.proBlue : colors.brown}
                  notif
                />
                {this.Content(eventCreated, ShowEvent)}
              </MainComponent>
            </>
          );
        }}
      </NoobaContext.Consumer>
    );
  }
}

Step0.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Step0.contextType = NoobaContext;
