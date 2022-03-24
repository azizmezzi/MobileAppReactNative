import React, {Component} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import PropTypes from 'prop-types';
import Geolocation from '@react-native-community/geolocation';

import colors from '../../constant/colors';
import {h, totalSize, w} from '../../tools/Dimensions';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import SuivantBtn from '../landingComponents/SuivantBtn';
import {getEvents, getBalance} from '../../provider/events';
import {NoobaContext} from '../../provider/provider';

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: h(2),
    marginBottom: h(25),
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  questionText: {
    marginHorizontal: w(5),
    marginTop: h(10),
    textAlign: 'center',
    color: 'white',
    fontSize: totalSize(3.5),
    textTransform: 'uppercase',
  },
  iconContainer: {textAlign: 'center', marginTop: h(5)},
});

export default class BienvenueNooba extends Component {
  Content = () => {
    const {navigation, route} = this.props;
    const {params} = route || {pro: false};
    const {pro, token} = params;
    // console.log({route});
    return (
      <>
        <View style={styles.mainContainer}>
          <Text style={styles.questionText}>Bienvenue sur NOOBA !</Text>
          <Image
            resizeMode="contain"
            style={{alignSelf: 'center', width: w(15), height: h(15)}}
            // eslint-disable-next-line global-require
            source={require('../../assets/emoji.png')}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SuivantBtn
            bgColor={pro ? colors.proBlue : undefined}
            onPress={() => {
              navigation.navigate('Guide', {pro});

              const {context} = this;
              Geolocation.getCurrentPosition((info) => {
                const {
                  coords: {latitude: pLat, longitude: pLong},
                } = info;
                getEvents(token, pLat, pLong)
                  .then((response) => {
                    const dataE = response.data;
                    const {events} = dataE;

                    context.setEvents(events);
                  })
                  .catch((e) => console.log(e));
              });

              if (pro) {
                getBalance(token).then((response) => {
                  const dataB = response.data;
                  const {balance} = dataB;
                  context.setBalance(balance);
                });
              }
            }}
          />
        </View>
      </>
    );
  };

  render() {
    const {navigation, route} = this.props;
    const {params} = route || {pro: false};
    const {pro} = params;
    return (
      <>
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
          <HeaderComponent
            navigation={navigation}
            height={22}
            showBackButton={false}
            showSubTitle
            showHeaderText
            bgColor={pro ? colors.proBlue : colors.brown}
          />
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

BienvenueNooba.propTypes = {
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

BienvenueNooba.contextType = NoobaContext;
