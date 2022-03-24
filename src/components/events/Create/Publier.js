/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import IconFa from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {Button} from 'react-native-paper';
import {PublierEventProvider, createEvent, createEvent2} from '../../../provider/events';
import colors from '../../../constant/colors';
import {h, w, totalSize} from '../../../tools/Dimensions';

import {NoobaContext} from '../../../provider/provider';
import texts from '../../../constant/texts';
import GlobalFunction from '../../../GlobleFun/GlobalFunction';
import GlobalRender from '../../main/GlobalRender';

const styles = StyleSheet.create({
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(3),
    textTransform: 'uppercase',
  },
  questionText: {
    marginTop: h(5),
    textAlign: 'center',
    color: 'white',
    fontSize: totalSize(3),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  descriptionText: {
    marginTop: h(3),
    marginHorizontal: w(5),
    textAlign: 'center',
    color: 'white',
    fontSize: totalSize(2.4),
  },
  ButtonInscrit: {
    marginBottom: h(5),
    alignSelf: 'center',
    marginLeft: w(1),
    marginRight: w(1),
    color: 'white',
    borderColor: 'white',
    height: h(4.5),
    width: w(47),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  centerView: {
    alignItems: 'center',
    marginBottom: h(10),
  },
  mainBrownText: (pro) => {
    return {
      color: pro ? colors.proBlue : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(2.1),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
});

export default class Publier extends Component {
  constructor(props) {
    super(props);
    this.state = {showAlert: false, title: '', message: '', spinner: false};
  }

  hideAlert = () => {
    const {title} = this.state;
    const {navigation} = this.props;

    if (title === texts.balanceErrorTitle) {
      this.setState({
        showAlert: false,
        title: '',
        message: '',
      });
      navigation.navigate('Jetons');
    } else {
      this.setState({
        showAlert: false,
        title: '',
        message: '',
      });
    }
  };

  CatchReqError = () => {
    this.setState({
      spinner: false,
      showAlert: true,
      title: 'error',
      message: 'error requeste',
    });
  };

  SaveEventPromise = (response) => {
    const {events, setEvents, socket} = this.context;
    const {navigation} = this.props;
    this.setState({spinner: false});
    const {data} = response;
    events.push(data.result);
    setEvents(events);

    socket.emit('requestChats');
    // navigation.navigate('MyEvents');
    navigation.navigate('Create Event');
  };

  CanCreateEvent = () => {
    const {balance, user} = this.context;
    return !user.illimite && user.isPro ? balance > 0 : true;
  };

  PublierEvent = (response) => {
    const {navigation} = this.props;
    const {balance, setBalance, user, events, setEvents, socket} = this.context;
    this.setState({spinner: false});
    const {data} = response;
    if (data.message !== 'Event Created Error') {
      events.push(data.result);
      setEvents(events);
      if (!user.illimite && user.isPro) setBalance(balance - 1);
      socket.emit('requestChats');
      navigation.navigate('Step6');
    } else {
      this.setState({
        showAlert: true,
        title: 'error',
        message: 'Event Created Error',
      });
    }
  };

  StepView = () => {
    const {
      navigation,
      route: {
        // eslint-disable-next-line react/prop-types
        params: {eventId},
      },
    } = this.props;
    const {
      context: {balance, user},
    } = this;
    const showPayer = user.isPro & !user.illimite;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          alignContent: 'center',
          alignItems: 'center',

          justifyContent: 'center',
        }}>
        <Button
          color="white"
          mode="outlined"
          style={styles.ButtonInscrit}
          labelStyle={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            fontSize: totalSize(1.2),
            textTransform: 'none',
          }}
          onPress={async () => {
            navigation.goBack();
          }}>
          Annuler
        </Button>
        <Button
          color="white"
          testID="stepViewValider"
          mode="outlined"
          style={{...styles.ButtonInscrit, backgroundColor: '#64A549'}}
          labelStyle={{fontSize: totalSize(1.2), textTransform: 'none'}}
          onPress={async () => {
            const {events, setEvents, ShowEvent, setBalance} = this.context;
            if (!this.CanCreateEvent()) {
              this.setState({
                showAlert: true,
                title: texts.balanceErrorTitle,
                message: texts.balanceErrorText,
              });
            } else {
              let valid = false;
              const pos = events.findIndex((x) => x._id === eventId);
              if (pos > -1) {
                const date1 = moment(events[pos].date);
                const date2 = moment();
                valid = date1 > date2;
              }
              if (valid) {
                this.setState({spinner: true});

                PublierEventProvider(eventId, user.token)
                  .then((response) => {
                    this.setState({spinner: false});
                    const {data, status} = response;
                    if (status === 200) {
                      if (pos > -1) {
                        events[pos] = data.result;
                        setEvents(events);
                      }
                      ShowEvent(data.result);
                      if (!user.illimte && user.isPro) setBalance(parseInt(balance, 10) - 1);
                      const {socket} = this.context;
                      socket.emit('requestChats');
                      navigation.navigate('Create Event');
                    }
                  })
                  .catch(() => {
                    this.setState({
                      showAlert: true,
                      title: texts.balanceErrorTitle,
                      message: texts.balanceErrorText,
                    });
                  });
              } else {
                this.setState({
                  showAlert: true,
                  title: texts.eventDepasse,
                  message: texts.eventDepasse,
                });
              }
            }
          }}>
          {showPayer ? 'Valider et payer 1' : 'Valider'}{' '}
          {showPayer ? <IconFa color="gold" size={w(3)} name="coins" /> : ''}
        </Button>
      </View>
    );
  };

  NonStepView = () => {
    const {
      context: {pro, user},
    } = this;
    const showPayer = user.isPro & !user.illimite;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          alignContent: 'center',
          alignItems: 'center',

          justifyContent: 'center',
        }}>
        <Button
          color="white"
          mode="outlined"
          style={styles.ButtonInscrit}
          labelStyle={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            fontSize: totalSize(1.2),
            textTransform: 'none',
          }}
          onPress={async () => {
            const {newEvent} = this.context;
            newEvent.nomCreator = user.name;
            newEvent.participants = GlobalFunction.Choose(
              pro,
              [],
              [{_id: user._id, name: user.name, agenda: true, image: user.image}],
            );
            this.setState({spinner: true});
            newEvent.isPro = pro;

            newEvent.valider = false;
            if (Number.isNaN(newEvent.url)) {
              createEvent(newEvent, user.token)
                .then((response) => {
                  this.SaveEventPromise(response);
                })
                .catch(() => {
                  this.CatchReqError();
                });
            } else {
              createEvent2(newEvent, user.token)
                .then((response) => {
                  this.SaveEventPromise(response);
                })
                .catch(() => {
                  this.CatchReqError();
                });
            }
          }}>
          Annuler et enregistrer
        </Button>
        <Button
          testID="nonStepValider"
          color="white"
          mode="outlined"
          style={{...styles.ButtonInscrit, backgroundColor: '#64A549'}}
          labelStyle={{
            fontSize: totalSize(1.2),
            textTransform: 'none',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}
          onPress={async () => {
            const {newEvent} = this.context;
            newEvent.participants = GlobalFunction.Choose(
              pro,
              [],
              [{_id: user._id, name: user.name, agenda: true, image: user.image}],
            );
            this.setState({spinner: true});
            newEvent.nomCreator = user.name;
            newEvent.isPro = pro;
            newEvent.valider = true;

            if (!this.CanCreateEvent()) {
              this.setState({
                spinner: false,
                showAlert: true,
                title: texts.balanceErrorTitle,
                message: texts.balanceErrorText,
              });
            } else {
              this.setState({spinner: true});

              if (newEvent.pos === null) {
                delete newEvent.pos;

                createEvent(newEvent, user.token)
                  .then((response) => {
                    this.PublierEvent(response);
                  })
                  .catch(() => {
                    this.CatchReqError();
                  });
              } else {
                createEvent2(newEvent, user.token)
                  .then((response) => {
                    this.PublierEvent(response);
                  })
                  .catch(() => {
                    this.CatchReqError();
                  });
              }
            }
          }}>
          {showPayer ? 'Valider et payer 1' : 'Valider'}{' '}
          {showPayer ? <IconFa color="gold" size={w(3)} name="coins" /> : ''}
        </Button>
      </View>
    );
  };

  Content = () => {
    const {
      route: {
        // eslint-disable-next-line react/prop-types
        params: {step},
      },
    } = this.props;
    const {
      context: {pro, newEvent, balance, user},
    } = this;
    let balanceUser = balance;
    if (user.illimite) balanceUser = '∞';
    return (
      <>
        <View>
          <Text style={styles.questionText}>Publier Votre évènement</Text>
          <View
            style={{
              alignSelf: 'center',
              width: w(100),
              height: h(20),
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <IconFa color="white" size={w(15)} name="calendar-check" />
          </View>

          <Text style={styles.descriptionText}>
            Vous êtes sur le point de publier votre évènement
          </Text>

          <Text style={styles.descriptionText}>{newEvent.name}</Text>
        </View>
        {user.isPro && (
          <>
            <Text style={{...styles.mainBrownText(pro), marginLeft: w(5), marginTop: h(7)}}>
              vous avez actuellement :
            </Text>
            <View style={{...styles.centerView}}>
              <View style={{flexDirection: 'row', marginTop: h(6)}}>
                <IconFa name="coins" size={totalSize(2.7)} color="gold" />
                <Text
                  style={{
                    color: 'white',
                    fontSize: totalSize(2.5),
                    textTransform: 'uppercase',
                  }}>
                  {`  ${balanceUser} Jeton(s)`}
                </Text>
              </View>
            </View>
          </>
        )}
        <View style={{marginTop: user.isPro ? h(0) : h(30)}}>
          {GlobalFunction.Choose(step, this.StepView(), this.NonStepView())}
        </View>
      </>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      state: {showAlert, title, message, spinner},
    } = this;
    return (
      <GlobalRender
        navigation={navigation}
        showAlert={showAlert}
        title={title}
        message={message}
        spinner={spinner}
        Content={this.Content}
        hideAlert={this.hideAlert}
      />
    );
  }
}

Publier.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      step: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

Publier.contextType = NoobaContext;
