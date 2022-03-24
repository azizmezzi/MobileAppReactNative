/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
import React, {Component} from 'react';
import {StyleSheet, Text, ScrollView, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import AsyncStorage from '@react-native-community/async-storage';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconFa from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import MarketplaceCard from '../main/MarketplaceCard';
import {h, w, totalSize} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import GlobalFunction from '../../GlobleFun/GlobalFunction';

LocaleConfig.locales.fr = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default class Agenda extends Component {
  constructor(props) {
    super(props);
    const dates = new Date();
    const month = dates.getMonth() + 1;

    this.state = {
      user: {},
      selectedDate: '',
      month,
    };
  }

  async componentDidMount() {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
    this.setState({user});
  }

  datesAgenda = (events, user) => {
    const dates = [];
    events.forEach((EventValue) => {
      if (EventValue.participants !== undefined) {
        if (user.isPro) {
          if (EventValue.creator === user._id) {
            const date = EventValue.date.substring(0, 10);
            dates.push({day: date, like: false, participate: true, valider: EventValue.valider});
          }
        } else {
          const pos = EventValue.participants.findIndex(
            (x) => x._id === user._id && !x.description,
          );
          if (pos > -1) {
            const date = EventValue.date.substring(0, 10);
            dates.push({day: date, like: false, participate: true, valider: EventValue.valider});
          }
        }
      }
    });
    return dates;
  };

  likedevent = (events, user) => {
    const dates = [];

    if (user.likedEvents !== undefined) {
      user.likedEvents.forEach((Eventliked) => {
        const element = events.find((eventitem) => eventitem._id === Eventliked.event);
        if (element !== undefined) {
          const date = element.date.substring(0, 10);
          dates.push({day: date, like: true, participate: false});
        }
      });
    }
    return dates;
  };

  eventSelected = (events, user, selectedDate) => {
    return events.filter((event) => {
      if (selectedDate !== '') {
        const date = event.date.substring(0, 10);
        const index1 = event.participants.findIndex((item) => item._id === user._id);
        const index2 = user.likedEvents.findIndex((item) => item.event === event._id);
        const index3 = user.isPro ? event.creator === user._id : false;
        return date === selectedDate && (index1 > -1 || index2 > -1 || index3);
      }
      return false;
    });
  };

  dayComponentInit = (dates, date) => {
    const {month} = this.state;
    const calendarDarMoment = moment(date.dateString, 'YYYY-MM-DD').format();
    const today = moment();
    const isToday = today.isSame(calendarDarMoment, 'day');
    const liked = dates.findIndex((item) => item.day === date.dateString && item.like);
    const participate = dates.findIndex((item) => item.day === date.dateString && item.participate);
    return {month, isToday, participate, liked};
  };

  Content = (eventsAll, ShowEvent) => {
    const events = GlobalFunction.checkNull(eventsAll, []);
    const {navigation} = this.props;
    const {user, selectedDate} = this.state;
    const {pro} = this.context;
    let dates = [];
    const color = pro ? colors.proBlue : colors.brown;

    const dates1 = this.datesAgenda(events, user);
    const dates2 = this.likedevent(events, user);
    dates = dates1.concat(dates2);

    const eventSelected = this.eventSelected(events, user, selectedDate);

    return (
      <View style={{height: h(75)}}>
        <ScrollView>
          <Text style={styles.headerColMidText}>Agenda</Text>
          <Calendar
            firstDay={1}
            // eslint-disable-next-line no-unused-vars
            dayComponent={({date, state, marking}) => {
              const {month, isToday, participate, liked} = this.dayComponentInit(dates, date);
              return (
                <TouchableOpacity
                  style={{
                    width: w(20),

                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    marginLeft: w(13),
                  }}
                  onPress={() => this.setState({selectedDate: date.dateString})}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignSelf: 'center',
                    }}>
                    {participate < 0 && liked > -1 && (
                      <IconAntDesign
                        style={{
                          width: w(21),
                          justifyContent: 'center',
                          alignContent: 'center',
                          alignSelf: 'center',
                          alignItems: 'center',
                          position: 'absolute',
                          marginLeft: w(10),
                        }}
                        name="heart"
                        size={w(8)}
                        color="red"
                      />
                    )}

                    {participate > -1 && liked < 0 && (
                      <IconFa
                        style={{
                          width: w(23),
                          justifyContent: 'center',
                          alignContent: 'center',
                          alignSelf: 'center',
                          alignItems: 'center',
                          position: 'absolute',
                        }}
                        name="circle"
                        size={w(12)}
                        color={GlobalFunction.Choose(dates[participate].valider, color, '#D6CB3A')}
                      />
                    )}
                    {participate > -1 && liked > -1 && (
                      <Ionicons
                        style={{
                          width: w(24),
                          justifyContent: 'center',
                          alignContent: 'center',
                          alignSelf: 'center',
                          alignItems: 'center',
                          position: 'absolute',
                          marginLeft: w(10),
                        }}
                        name="ios-heart-circle"
                        size={w(12)}
                        color={color}
                      />
                    )}
                    {participate > -1 && liked > -1 && (
                      <IconFa
                        style={{
                          zIndex: -9999,
                          width: w(21),
                          justifyContent: 'center',
                          alignContent: 'center',
                          alignSelf: 'center',
                          alignItems: 'center',
                          position: 'absolute',
                        }}
                        name="circle"
                        size={w(9)}
                        color="red"
                      />
                    )}
                    {isToday && (
                      <IconFa
                        style={{
                          zIndex: -9999,
                          width: w(23),
                          justifyContent: 'center',
                          alignContent: 'center',
                          alignSelf: 'center',
                          alignItems: 'center',
                          position: 'absolute',
                        }}
                        name="square"
                        size={w(12)}
                        color="black"
                      />
                    )}

                    <Text
                      style={{
                        borderWidth: GlobalFunction.Choose(
                          (participate > -1 || liked > -1) && selectedDate === date.dateString,
                          0.7,
                          0,
                        ),
                        borderColor: 'white',
                        backgroundColor: GlobalFunction.Choose(
                          (participate > -1 || liked > -1) && selectedDate === date.dateString,
                          'rgba(243, 241, 239, 0.2)',
                          'transparent',
                        ),
                        textAlign: 'center',
                        marginLeft: -w(13),
                        color: GlobalFunction.Choose(date.month === month, 'white', 'gray'),
                        fontSize: totalSize(2.5),
                      }}>
                      {date.day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            onVisibleMonthsChange={(months) => {
              this.setState({month: months[0].month});
              console.log('now these months are visible', months);
            }}
            markedDates={{
              '2021-03-16': {selected: true, marked: true, selectedColor: 'blue'},
              '2021-03-17': {marked: true},
              '2021-03-18': {marked: true, dotColor: 'red', activeOpacity: 0},
              '2021-03-19': {disabled: true, disableTouchEvent: true},
            }}
            onDayPress={(day) => {
              this.setState({selectedDate: day.dateString});
            }}
            theme={{
              calendarBackground: colors.blue,
              monthTextColor: 'white',
              dayTextColor: 'white',
              textDisabledColor: 'grey',
            }}
          />
          {eventSelected.map((event) => {
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
    const {
      context: {pro},
    } = this;
    return (
      <NoobaContext.Consumer>
        {(props) => {
          const {ShowEvent, events} = props;
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
                {this.Content(events, ShowEvent)}
              </MainComponent>
            </>
          );
        }}
      </NoobaContext.Consumer>
    );
  }
}

Agenda.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Agenda.contextType = NoobaContext;
