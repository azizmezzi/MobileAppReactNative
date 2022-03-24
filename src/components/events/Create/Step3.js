import React, {Component} from 'react';
import {StyleSheet, View, TextInput, Text, KeyboardAvoidingView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Button} from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';

import colors from '../../../constant/colors';

import SuivantBtn from '../../landingComponents/SuivantBtn';
import {h, w, totalSize} from '../../../tools/Dimensions';
import {NoobaContext} from '../../../provider/provider';
import texts from '../../../constant/texts';
import GlobalRender from '../../main/GlobalRender';

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
  mainBrownText: (color) => {
    return {
      marginTop: h(3),
      color: color !== undefined ? color : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(2.2),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
  eventButton: {
    marginHorizontal: w(2),
    marginVertical: w(2),
    borderColor: 'white',
    borderRadius: 25,
  },
  eventButtonContent: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    height: h(6),
  },
  fieldStyle: {
    alignSelf: 'center',
    marginTop: h(3),
    backgroundColor: 'transparent',
    width: w(80),
    borderWidth: 1,
    borderColor: 'white',
    height: h(6.5),
    color: 'white',
    borderRadius: 20,
    textAlign: 'center',
    fontSize: totalSize(2.3),
    marginBottom: h(4),
  },
});

export default class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventType: '',
      ageCheckbox: false,
      minAge: 18,
      maxAge: 100,
      limit: 1,
      showAlert: false,
      title: '',
      message: '',
    };
  }

  componentDidMount() {
    const {newEvent} = this.context;
    console.log({newEvent});

    if (newEvent.type !== undefined) {
      this.setState({eventType: newEvent.type});
    }
    if (newEvent.minAge !== undefined && newEvent.maxAge !== undefined) {
      if (newEvent.minAge === 0) {
        this.setState({ageCheckbox: true});
      }
      this.setState({maxAge: newEvent.maxAge, minAge: newEvent.minAge});
    }
    if (newEvent.limit !== undefined) {
      this.setState({limit: newEvent.limit});
    }
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  EventTypeButton = (eventText, state) => {
    const {eventType} = this.state;
    return (
      <Button
        icon={state === eventType ? 'check' : null}
        style={styles.eventButton}
        mode="outlined"
        color="white"
        contentStyle={styles.eventButtonContent}
        onPress={() => this.setState({eventType: state})}>
        {eventText}
      </Button>
    );
  };

  Content = (contextProps) => {
    const {ageCheckbox, maxAge, limit, eventType, minAge} = this.state;
    const {navigation} = this.props;
    const {
      context: {pro, user},
    } = this;
    const ageDisplay = maxAge < 67 ? maxAge : '66+';
    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView style={{marginBottom: h(3)}}>
          <Text style={styles.headerColMidText}>Créer un évènement</Text>
          <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
            Type d&apos;évènement
          </Text>
          {this.EventTypeButton('évènement mixte filles/garcons', 'mixte')}
          {this.EventTypeButton('évènement entre filles', 'girls')}
          {this.EventTypeButton('évènement entre garçons', 'boys')}
          {this.EventTypeButton('évènement pour célibataires', 'celibataire')}
          <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
            Tranche d&apos;âge de l&apos;évènement
          </Text>
          {!ageCheckbox ? (
            <>
              <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <MultiSlider
                  values={[minAge, maxAge]}
                  sliderLength={250}
                  onValuesChange={(arr) => {
                    console.log(arr);
                    this.setState({minAge: arr[0], maxAge: arr[1]});
                  }}
                  min={18}
                  max={67}
                  step={1}
                  allowOverlap
                  snapped
                />
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Text style={{color: 'white'}}>{minAge} ans</Text>
                <Text style={{color: 'white'}}>{ageDisplay} ans</Text>
              </View>
            </>
          ) : null}
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: h(2)}}>
            <CheckBox
              tintColors={{true: 'white', false: 'white'}}
              tintColor="white"
              onCheckColor="red"
              disabled={false}
              value={ageCheckbox}
              style={{marginLeft: w(4), height: w(7)}}
              onValueChange={(newValue) =>
                this.setState({ageCheckbox: newValue, minAge: 18, maxAge: 67})
              }
            />
            <Text style={{color: 'white', marginLeft: w(1)}}>
              Je ne souhaite pas spécifier d&apos;âge
            </Text>
          </View>

          <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
            Nombre de places disponibles, vous compris
          </Text>
          <TextInput
            style={styles.fieldStyle}
            keyboardType="numeric"
            value={limit.toString()}
            onChangeText={(text) => {
              if (Number.parseInt(text, 10) < 501 || text === '') {
                this.setState({limit: text});
              }
            }}
            placeholderTextColor="white"
            placeholder="__"
            returnKeyType="go"
          />
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <SuivantBtn
              bgColor={pro ? colors.proBlue : undefined}
              onPress={() => {
                const yrs = !pro ? moment().diff(user.dob, 'years', false) : 0;
                const {gender} = user;
                if (eventType === '') {
                  this.setState({
                    showAlert: true,
                    title: texts.invalid_event_type_title,
                    message: texts.invalid_event_type_text,
                  });
                } else if (limit <= 1 || limit > 500) {
                  this.setState({
                    showAlert: true,
                    title: texts.invalid_event_limit_title,
                    message: texts.invalid_event_limit_text,
                  });
                } else if (!pro && (minAge > yrs || maxAge < yrs)) {
                  this.setState({
                    showAlert: true,
                    title: texts.invalid_event_age_title,
                    message: texts.invalid_event_age_text,
                  });
                } else if (
                  !pro &&
                  ((gender.toUpperCase() === 'HOMME' && eventType === 'girls') ||
                    (gender.toUpperCase() === 'FEMME' && eventType === 'boys'))
                ) {
                  this.setState({
                    showAlert: true,
                    title: texts.invalid_event_gender_type_title,
                    message: texts.invalid_event_gender_type_text,
                  });
                } else {
                  const {newEvent, setNewEvent} = contextProps;
                  newEvent.type = eventType;
                  if (!ageCheckbox) {
                    newEvent.minAge = minAge;
                    newEvent.maxAge = maxAge;
                  } else {
                    newEvent.minAge = 0;
                    newEvent.maxAge = 101;
                  }
                  newEvent.limit = limit;
                  setNewEvent(newEvent);
                  navigation.navigate('ImageGlobal', {type: true});
                }
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  render() {
    const {navigation} = this.props;
    const {showAlert, title, message} = this.state;

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
              Content={() => this.Content(props)}
              hideAlert={() => this.hideAlert()}
            />
          );
        }}
      </NoobaContext.Consumer>
    );
  }
}

Step3.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Step3.contextType = NoobaContext;
