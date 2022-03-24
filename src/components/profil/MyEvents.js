/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import MarketplaceCard from '../main/MarketplaceCard';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  mainBrownText: (color) => {
    return {
      color: color !== undefined ? color : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(1.4),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
});

const organizedEvents = [
  // 'Jeux intervillages - Namur',
  // 'Salon Esthétika - Bruxelles',
  // 'Dégustation de bières',
];

const savedEvents = [
  // 'Jeux intervillages - Namur',
  // 'Salon Esthétika - Bruxelles',
  // 'Dégustation de bières',
];

const joinedEvents = [
  // 'Jeux intervillages - Namur',
  // 'Salon Esthétika - Bruxelles',
  // 'Dégustation de bières',
];

export default class MyEvents extends Component {
  renderItem = (item, index) => {
    return (
      <View
        key={index}
        style={{
          marginVertical: h(1),
          paddingVertical: h(0.25),
          paddingHorizontal: w(2),
          marginHorizontal: w(2),
          borderRadius: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontWeight: 'bold', color: 'white'}}>{item.name}</Text>
        <IconAntDesign
          name="arrowright"
          size={20}
          color="white"
          onPress={() => {
            const {navigation} = this.props;

            const {
              context: {ShowEvent},
            } = this;
            ShowEvent(item);
            navigation.navigate('EventView');
          }}
        />
      </View>
    );
  };

  GetMyEvents = (events, id) => {
    const MyEventsList = [];
    const JoinEventsList = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const event of events) {
      if (events.creator === id) {
        MyEventsList.push(event);
      } else {
        const ev = event.participants.find((participant) => participant._id === id);
        if (ev !== undefined) JoinEventsList.push(event);
      }
    }
    return {MyEventsList, JoinEventsList};
  };

  Content = (navigation) => {
    const {
      context: {ShowEvent, events},
    } = this;

    const Myevents = events.filter((even) => !even.valider);
    return (
      <View style={{height: h(70)}}>
        <ScrollView>
          <Text style={styles.headerColMidText}>Evènements enregistrés ({Myevents.length})</Text>
          {Myevents.map((event) => {
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
          {/* <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
            {pro ? 'évènements organisés à venir' : 'évènements organisés'}
          </Text>
          <View style={{marginBottom: h(3)}}>
            {MyEventsList.map((item, index) => this.renderItem(item, index))}
            <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: 22}}>
              ...
            </Text>
          </View>
          <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
            {pro ? 'évènements passés' : 'évènements enregistrés'}
          </Text>
          <View style={{marginBottom: h(3)}}>
            {savedEvents.map((item, index) => this.renderItem(item, index))}
            <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: 22}}>
              ...
            </Text>
          </View>
          {pro === false ? (
            <>
              <Text style={styles.mainBrownText()}>évènements rejoints</Text>
              <View>
                {JoinEventsList.map((item, index) => this.renderItem(item, index))}
                <Text
                  style={{textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: 22}}>
                  ...
                </Text>
              </View>
            </>
          ) : null} */}
        </ScrollView>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      context: {pro},
    } = this;
    return (
      <>
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
          <HeaderComponent
            bgColor={pro ? colors.proBlue : colors.brown}
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton
            goBackAction={() => {
              navigation.navigate('Settings');
            }}
          />
          {this.Content(navigation)}
        </MainComponent>
      </>
    );
  }
}

MyEvents.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

MyEvents.contextType = NoobaContext;
