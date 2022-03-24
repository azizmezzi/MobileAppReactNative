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
import {desincription} from '../../provider/events';

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
    fontSize: totalSize(1.9),

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
      fontSize: totalSize(2),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
  ButtonInscrit: {
    marginBottom: h(5),
    alignSelf: 'center',
    marginLeft: w(1),
    marginRight: w(1),
    color: 'white',
    borderColor: 'white',
    borderWidth: 1,
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

export default class Desincrir extends Component {
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
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  Content = (pro, eventView) => {
    const {navigation} = this.props;
    const {ShowEvent, events, setEvents, user, setBalance, balance} = this.context;

    return (
      <View style={{height: h(75)}}>
        <ScrollView>
          <Text style={{...styles.mainBrownText(pro), marginLeft: w(5), marginTop: h(4)}}>
            Se désinscrire de l&apos;événement
          </Text>

          <View style={styles.centerView}>
            <Text style={styles.descriptionText}>
              Vous êtes sur le point de supprimer votre inscription à l&apos;évènement :
            </Text>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: totalSize(3.2),

                marginTop: h(5),
                marginHorizontal: w(12),
              }}>
              {eventView.name}
            </Text>
          </View>
          {/*<Text style={{...styles.descriptionText, marginTop: h(10)}}>
            Si vous vous désistez 48h avant l&apos;évènement, vous pourrez récupérer votre jeton.
            </Text>*/}

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignContent: 'center',
              alignItems: 'center',
              marginTop: h(36),
              justifyContent: 'center',
            }}>
            <Button
              color="white"
              mode="outlined"
              style={styles.ButtonInscrit}
              labelStyle={{fontSize: totalSize(1.3), textTransform: 'none'}}
              onPress={async () => {
                navigation.goBack();
              }}>
              Annuler
            </Button>
            <Button
              color="white"
              mode="outlined"
              style={{
                ...styles.ButtonInscrit,

                backgroundColor: '#64A549',
              }}
              labelStyle={{fontSize: totalSize(1.3), textTransform: 'none'}}
              onPress={async () => {
                desincription(eventView._id, user.token, false).then((response) => {
                  this.setState({spinner: false});
                  const {data} = response;
                  console.log({aa: data.result});
                  navigation.navigate('FelicitationDesinscrir', {
                    jeton: 1,
                    nomEvent: eventView.name,
                  });
                  const pos = events.findIndex((x) => x._id === eventView._id);
                  if (pos > -1) {
                    events[pos] = data.result;
                    setEvents(events);
                  }
                  ShowEvent(data.result);

                  const {socket} = this.context;
                  socket.emit('requestChats');
                });
                /* const d = new Date(eventView.date);
                const now = new Date();
                d.setDate(d.getDate() - 2);

                if (now < d) {
                  
                } else {
                  console.log(d > now);
                  navigation.navigate('Desincrir2');
                } */
              }}>
              {/*Valider et récupérer 1<Icon color="gold" size={w(2)} name="coins" />*/}
              Valider
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {pro, eventView} = this.context;
    const {showAlert, title, message, spinner} = this.state;
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
          <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
          {showAlert && <BlurView style={styles.absolute} blurType="light" blurAmount={10} />}
          {this.Content(pro, eventView)}
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
          confirmButtonColor={pro ? colors.proBlue : colors.brown}
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

Desincrir.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Desincrir.contextType = NoobaContext;
