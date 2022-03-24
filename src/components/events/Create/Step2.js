/* eslint-disable no-undef */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, Platform, TouchableOpacity, StyleSheet, View, Text, ScrollView} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import colors from '../../../constant/colors';

import SuivantBtn from '../../landingComponents/SuivantBtn';
import {h, w, totalSize} from '../../../tools/Dimensions';
import {NoobaContext} from '../../../provider/provider';
import texts from '../../../constant/texts';
import {GeolocationState, ModalMapView} from '../../../GlobleFun/GeoLocalisation';
import GlobalRender from '../../main/GlobalRender';

moment.locale('fr');

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  fieldStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
    marginTop: h(5),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    minHeight: h(6),
    width: w(80),
  },

  mainBrownText: (color) => {
    return {
      marginTop: h(3),
      color: color !== undefined ? color : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(2.4),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default class Step2 extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setHours(tomorrow.getHours() + 3);
    this.state = {
      date: tomorrow,
      heure: tomorrow,
      lieu: "Lieu de l'évènement",
      region: '',
      showDate: false,
      showTime: false,
      showAlert: false,
      showMap: false,
      title: '',
      message: '',
      latitude: 50.854954,
      longitude: 4.30535,
      marker: {latitude: 50.854954, longitude: 4.30535},
    };
  }

  componentDidMount() {
    const {newEvent} = this.context;
    if (newEvent.date !== undefined) {
      this.setState({date: newEvent.date, heure: newEvent.date});
    }

    if (newEvent.place !== undefined) {
      this.setState({
        region: newEvent.place.region,
        lieu: newEvent.place.localisation,

        longitude: newEvent.place.longitude,
        latitude: newEvent.place.latitude,
        marker: {latitude: newEvent.place.latitude, longitude: newEvent.place.longitude},
      });
    }

    Geolocation.getCurrentPosition((info) => {
      const {
        coords: {latitude, longitude},
      } = info;

      this.setState({latitude, longitude, marker: {latitude, longitude}});
    });
  }

  hideAlert = () => {
    this.setState({
      spinner: false,
      showAlert: false,
      title: '',
      message: '',
    });
  };

  onChange = (event, selectedDate) => {
    const {date} = this.state;
    const newDate = selectedDate || date;
    this.setState({date: newDate, showDate: Platform.OS === 'ios'});
  };

  onChangeTime = (event, selectedDate) => {
    const {heure, date} = this.state;
    const now = new Date();

    const sameDay = moment(selectedDate).isSame(date, 'day');
    var time_diff = selectedDate.getTime() - now.getTime();
    var days_Diff = time_diff / (1000 * 3600);

    if (sameDay && Math.trunc(days_Diff) >= 3) {
      const newHeure = selectedDate || heure;
      this.setState({heure: newHeure, showTime: Platform.OS === 'ios'});
    } else if (!sameDay) {
      const newHeure = selectedDate || heure;
      this.setState({heure: newHeure, showTime: Platform.OS === 'ios'});
    } else {
      this.setState({
        showAlert: true,
        title: texts.invalid_event_date_title,
        message: texts.invalid_event_date_text,
        showTime: Platform.OS === 'ios',
      });
    }
  };

  Geolocation = async (latitude1, longitude1) => {
    this.setState({spinner: true});
    console.log('spinner on');
    GeolocationState(latitude1, longitude1, true)
      .then((res) => {
        console.log('got response ', res);
        console.log('spinner off');
        const {lieu, region, latitude, longitude} = res;
        this.setState({
          spinner: false,
          lieu,
          region,
          latitude,
          longitude,
        });
      })
      .catch((e) => {
        console.error(e);
        this.setState({spinner: false});
      })
      .finally(() => this.setState({spinner: false}));
  };

  setPosition = (lat, lng) => {
    this.setState({
      marker: {
        latitude: lat,
        longitude: lng,
      },
      latitude: lat,
      longitude: lng,
    });
  };

  setMarker = (latitude, longitude) => {
    this.setState({
      marker: {
        latitude,
        longitude,
      },
    });
  };

  Modal = () => {
    const {latitude, showMap, longitude, marker} = this.state;
    return (
      <Modal style={styles.container} animationType="slide" visible={showMap}>
        <ModalMapView
          setMarker={this.setMarker}
          setPosition={this.setPosition}
          Geolocation1={this.Geolocation}
          setModalVisible={() => this.setState({showMap: false})}
          longitude={longitude}
          latitude={latitude}
          marker={marker}
        />
      </Modal>
    );
  };

  Content = (contextProps) => {
    const {showDate, date, showTime, heure, lieu, region, latitude, longitude} = this.state;
    const {navigation} = this.props;
    const {
      context: {pro},
    } = this;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const dateString = moment(date).format('D MMM YYYY');
    // const dateString = `${day}-${month}-${year}`;
    const timeString = moment(heure).format('HH:mm');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setHours(tomorrow.getHours() + 3);
    const displayType = Platform.OS === 'ios' ? 'spinner' : 'default';

    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-start'}}>
        {this.Modal()}
        <Text style={styles.headerColMidText}>Créer un évènement</Text>
        <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
          Date - heure - lieu
        </Text>

        <TouchableOpacity onPress={() => this.setState({showDate: true, showTime: false})}>
          <View style={styles.fieldStyle}>
            <View style={{marginLeft: w(2), flexDirection: 'row', alignItems: 'center'}}>
              <IconEntypo name="calendar" size={30} color="white" />
              <Text style={{color: 'white', marginLeft: w(2)}}>{dateString}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {showDate ? (
          <>
            <DateTimePicker
              locale="fr-ca"
              testID="dateTimePicker"
              textColor="white"
              value={date}
              minimumDate={tomorrow}
              is24Hour
              display={displayType}
              onChange={this.onChange}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity>
                <Text
                  style={{alignSelf: 'center', color: 'white'}}
                  onPress={() => {
                    this.setState({showDate: false});
                  }}>
                  Fermer
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : null}

        <TouchableOpacity onPress={() => this.setState({showTime: true, showDate: false})}>
          <View style={styles.fieldStyle}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: w(1.5),
                paddingVertical: h(0.5),
                paddingHorizontal: w(1),
              }}>
              <IconEntypo name="clock" size={30} color="white" />
              <Text style={{color: 'white', marginLeft: w(2)}}>{timeString}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {showTime ? (
          <>
            <DateTimePicker
              testID="dateTimePicker"
              value={heure}
              textColor="white"
              mode="time"
              is24Hour
              display={displayType}
              onChange={this.onChangeTime}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity>
                <Text
                  style={{alignSelf: 'center', color: 'white'}}
                  onPress={() => {
                    this.setState({showTime: false});
                  }}>
                  Fermer
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : null}

        <TouchableOpacity onPress={() => this.setState({showMap: true})}>
          <View style={styles.fieldStyle}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: w(1.5),
                paddingVertical: h(0.5),
                paddingHorizontal: w(1),
              }}>
              <IconMCI name="map-marker" size={30} color="white" />
              <Text style={{color: 'white', marginLeft: w(2), flex: 1}}>{lieu}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            marginTop: h(5),
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SuivantBtn
            bgColor={pro ? colors.proBlue : undefined}
            onPress={() => {
              const finalDate = new Date();
              finalDate.setDate(date.getDate());
              finalDate.setMonth(date.getMonth());
              finalDate.setFullYear(date.getFullYear());
              finalDate.setHours(heure.getHours());
              finalDate.setMinutes(heure.getMinutes());

              if (finalDate.getTime() < today.getTime()) {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_event_date_title,
                  message: texts.invalid_event_date_text,
                });
                return false;
              }
              if (lieu === `Lieu de l'évènement`) {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_event_location_title,
                  message: texts.invalid_event_location_text,
                });
                return false;
              }
              const {newEvent, setNewEvent} = contextProps;
              newEvent.place = {
                region,
                localisation: lieu,
                longitude,
                latitude,
              };
              newEvent.date = finalDate;
              setNewEvent(newEvent);
              navigation.navigate('Step3');
              return true;
            }}
          />
        </View>
      </ScrollView>
    );
  };

  render() {
    const {navigation} = this.props;
    const {showAlert, title, message, spinner} = this.state;

    return (
      <NoobaContext.Consumer>
        {(props) => {
          return (
            <GlobalRender
              navigation={navigation}
              showAlert={showAlert}
              title={title}
              message={message}
              type={3}
              spinner={spinner}
              Content={() => this.Content(props)}
              hideAlert={() => this.hideAlert()}
            />
          );
        }}
      </NoobaContext.Consumer>
    );
  }
}

Step2.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Step2.contextType = NoobaContext;
