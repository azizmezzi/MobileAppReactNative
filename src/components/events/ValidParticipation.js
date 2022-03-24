/* eslint-disable no-underscore-dangle */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';
import {BlurView} from '@react-native-community/blur';

import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, w, totalSize} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import texts from '../../constant/texts';
import {participateInEvent, ReParticipateInEvent} from '../../provider/events';
import GlobalFunction from '../../GlobleFun/GlobalFunction';

const styles = StyleSheet.create({
  headerView: {
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerViewText: {color: 'white', fontSize: totalSize(3)},
  centerView: {
    alignItems: 'center',
  },
  contentView: {
    flexDirection: 'row',
    marginTop: h(3),
  },
  descriptionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    marginTop: h(2),
    marginHorizontal: w(12),
  },
  secondContentView: {
    marginTop: h(2),
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
  ButtonInscrit: {
    alignSelf: 'center',
    marginLeft: w(1),
    marginRight: w(1),
    color: 'white',
    borderColor: 'white',
    width: w(47),
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default class ValidParticipation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      title: '',
      message: '',
      spinner: false,
    };
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

  Content = (pro, eventView) => {
    const {navigation} = this.props;
    const {ShowEvent, events, setEvents, user} = this.context;
    const participantIndex = eventView.participants.findIndex((e) => e._id === user._id);
    const isParticipant = GlobalFunction.Choose(participantIndex !== -1, true, false);
    // const balanceUser = GlobalFunction.Choose(user.illimite, '∞', balance);
    return (
      <View style={{height: h(75)}}>
        <ScrollView>
          <View style={{height: h(65)}}>
            <Text style={{...styles.mainBrownText(pro), marginLeft: w(5), marginTop: h(4)}}>
              Validez votre participation
            </Text>

            <View style={styles.centerView}>
              <Text style={styles.descriptionText}>
                Vous êtes sur le point de valider votre participation à l&apos;évènement :
              </Text>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: totalSize(3.3),

                  marginTop: h(5),
                  marginHorizontal: w(12),
                }}>
                {eventView.name}
              </Text>
            </View>
            {/* <Text style={{...styles.mainBrownText(pro), marginLeft: w(5), marginTop: h(10)}}>
              vous avez actuellement :
            </Text>
            <View style={{...styles.centerView}}>
              <View style={{flexDirection: 'row', marginTop: h(6)}}>
                <Icon name="coins" size={totalSize(2.7)} color="gold" />
                <Text
                  style={{
                    color: 'white',
                    fontSize: totalSize(2.5),
                    textTransform: 'uppercase',
                  }}>
                  {`  ${balanceUser} Jeton(s)`}
                </Text>
              </View>
            </View> */}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignContent: 'center',
              alignItems: 'center',
              marginBottom: h(10),
              justifyContent: 'center',
            }}>
            <Button
              color="white"
              mode="outlined"
              style={styles.ButtonInscrit}
              labelStyle={{
                fontSize: totalSize(1.4),
                textTransform: 'none',
              }}
              onPress={async () => {
                navigation.goBack();
              }}>
              Annuler
            </Button>
            <Button
              color="white"
              mode="outlined"
              style={{...styles.ButtonInscrit, backgroundColor: '#64A549'}}
              labelStyle={{fontSize: totalSize(1.4), textTransform: 'none'}}
              onPress={async () => {
                this.setState({spinner: true});
                if (!isParticipant) {
                  participateInEvent(eventView._id, user.token)
                    .then((response) => {
                      this.setState({spinner: false});
                      navigation.navigate('Felicitation');
                      const {data} = response;
                      console.log(data);
                      eventView.participants.push({
                        _id: user._id,
                        name: user.name,
                        agenda: false,
                        image: user.image,
                      });
                      const pos = events.findIndex((x) => x._id === eventView._id);
                      if (pos > -1) {
                        events[pos] = eventView;
                        setEvents(events);
                      }
                      ShowEvent(eventView);
                      const {socket} = this.context;
                      console.log(socket);
                      socket.emit('requestChats');
                    })
                    .catch((e) => {
                      this.setState({spinner: false});
                      console.log(e);
                    });
                } else {
                  ReParticipateInEvent(eventView._id, user.token)
                    .then(() => {
                      this.setState({spinner: false});
                      navigation.navigate('Felicitation');
                      eventView.participants[participantIndex].description = false;
                      const pos = events.findIndex((x) => x._id === eventView._id);
                      if (pos > -1) {
                        events[pos] = eventView;
                        setEvents(events);
                      }
                      ShowEvent(eventView);
                      const {socket} = this.context;
                      socket.emit('requestChats');
                    })
                    .catch((e) => {
                      this.setState({spinner: false});
                      console.log(e);
                    });
                }
              }}>
              {/*Valider et payer 1<Icon color="gold" size={w(3)} name="coins" />*/}
              Valider
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  };

  contentView = (pro, eventView, showAlert, spinner) => {
    return (
      <>
        <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
        {showAlert && <BlurView style={styles.absolute} blurType="light" blurAmount={10} />}
        {this.Content(pro, eventView)}
      </>
    );
  };

  render() {
    const {navigation} = this.props;
    const {pro, eventView} = this.context;
    const {showAlert, title, message, spinner} = this.state;
    let colorBg = colors.brown;
    if (pro) colorBg = colors.proBlue;
    return (
      <>
        <MainComponent bgColor={colorBg}>
          <HeaderComponent
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton={false}
            bgColor={colorBg}
            notif
          />

          {this.contentView(pro, eventView, showAlert, spinner)}
        </MainComponent>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={title}
          message={message}
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton
          confirmText="OK"
          confirmButtonColor={colorBg}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
          onDismiss={() => {
            this.hideAlert();
          }}
        />
      </>
    );
  }
}

ValidParticipation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

ValidParticipation.contextType = NoobaContext;
