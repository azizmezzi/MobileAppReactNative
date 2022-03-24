import React, {Component} from 'react';
import {Text, StyleSheet, ScrollView, Platform, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import IconEntypo from 'react-native-vector-icons/Entypo';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import {h, totalSize, w} from '../../tools/Dimensions';

import SuivantBtn from '../landingComponents/SuivantBtn';
import Locality from './Locality';
import texts from '../../constant/texts';
import GlobalRender from '../main/GlobalRender';

moment.locale('fr');

const styles = StyleSheet.create({
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
    marginTop: h(7),
    marginLeft: w(10),
    color: 'white',
    fontSize: totalSize(1.8),
    textTransform: 'uppercase',
  },
  fieldStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
    marginTop: h(5),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    height: h(6),
    width: w(80),
  },
  iconCalendar: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    marginRight: w(1),
    marginTop: -h(1.5),
  },
  textInp: {
    color: 'white',
    fontSize: totalSize(2.1),
    marginLeft: w(3),
  },
});

export default class Naissance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      show: false,
      locality: '',
      showAlert: false,
      title: '',
      message: '',
      latitude: 50.854954,
      longitude: 4.30535,
    };
  }

  onChange = (event, selectedDate) => {
    const {date} = this.state;
    const d = selectedDate || date;
    this.setState({date: d, show: Platform.OS === 'ios'});
  };

  changeLocality = (newLocality, latitude, longitude) => {
    this.setState({locality: newLocality, latitude, longitude});
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  Content = () => {
    const {navigation, route} = this.props;
    const {params} = route;
    const {user} = params;
    const {show, date, longitude, latitude, locality} = this.state;
    const thisDay = new Date();
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.mainContainer}>
          <Text style={styles.mainText}>Inscription</Text>
          <Text style={styles.questionText}>quelle est votre date de naissance ?</Text>
          <TouchableOpacity onPress={() => this.setState({show: true})}>
            <View style={styles.fieldStyle}>
              <View style={{marginLeft: w(2), flexDirection: 'row', alignItems: 'center'}}>
                <IconEntypo name="calendar" size={30} color="white" />
                <Text style={{color: 'white', marginLeft: w(2)}}>
                  {moment(date).format('D MMMM YYYY')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {show && (
            <>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                is24Hour
                textColor="white"
                maximumDate={thisDay}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={this.onChange}
              />
              {Platform.OS === 'ios' ? (
                <TouchableOpacity>
                  <Text
                    style={{alignSelf: 'center', color: 'white'}}
                    onPress={() => {
                      this.setState({show: false});
                    }}>
                    Fermer
                  </Text>
                </TouchableOpacity>
              ) : null}
            </>
          )}

          <Locality locality={locality} changeLocality={this.changeLocality} />
        </View>
        <View
          style={{
            marginTop: h(7),
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SuivantBtn
            onPress={() => {
              const today = new Date();
              if (date.getTime() >= today.getTime()) {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_Birth_title,
                  message: texts.invalid_Birth_text,
                });
                return false;
              }
              if (locality === '') {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_Locality_title,
                  message: texts.invalid_Locality_text,
                });
                return false;
              }
              const years = moment().diff(date, 'years');
              if (years < 18) {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_Birth18_title,
                  message: texts.invalid_Birth18_text,
                });
                return false;
              }
              user.dob = date.getTime();
              // eslint-disable-next-line react/prop-types
              user.locality = {
                localisation: locality,
                longitude,
                latitude,
              };
              navigation.navigate('Photo', {pro: false, user});
              return true;
            }}
          />
        </View>
      </ScrollView>
    );
  };

  render() {
    const {navigation} = this.props;
    const {showAlert, title, message} = this.state;

    return (
      <GlobalRender
        navigation={navigation}
        showAlert={showAlert}
        title={title}
        message={message}
        type={2}
        Content={() => this.Content()}
        hideAlert={() => this.hideAlert()}
      />
    );
  }
}

Naissance.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        dob: PropTypes.number,
        // locality: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
