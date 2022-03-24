/* eslint-disable no-underscore-dangle */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {Button} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';
import {BlurView} from '@react-native-community/blur';

import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, w, totalSize} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import {desincription} from '../../provider/events';

const styles = StyleSheet.create({
  centerView: {
    alignItems: 'center',
  },
  descriptionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    marginTop: h(2),
    marginHorizontal: w(8),
  },
  mainBrownText: (pro) => {
    return {
      color: pro ? colors.proBlue : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(2.7),
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
    height: h(6),
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

export default class Desincrir2 extends Component {
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

  Content = (pro, balance, eventView) => {
    const {navigation} = this.props;
    const {ShowEvent, events, setEvents, user} = this.context;

    return (
      <View style={{height: h(75)}}>
        <ScrollView>
          <Text style={{...styles.mainBrownText(pro), marginLeft: w(5), marginTop: h(4)}}>
            Se désinscrire de l&apos;événement
          </Text>

          <View style={{...styles.centerView, marginTop: h(10)}}>
            <Text style={styles.descriptionText}>
              Malheureusement il est trop tard pour récupérer votre jeton. Souhaitez-vous tout de
              même confirmer votre désinscription ?
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignContent: 'center',
              alignItems: 'center',
              marginTop: h(30),
              justifyContent: 'center',
            }}>
            <Button
              color="white"
              mode="outlined"
              style={styles.ButtonInscrit}
              labelStyle={{fontSize: totalSize(1.8), textTransform: 'none'}}
              onPress={async () => {
                navigation.navigate('Marketplace');
              }}>
              Annuler
            </Button>
            <Button
              color="white"
              mode="outlined"
              style={{
                ...styles.ButtonInscrit,
                fontSize: totalSize(1.8),
                backgroundColor: '#64A549',
              }}
              labelStyle={{fontSize: totalSize(1.8), textTransform: 'none'}}
              onPress={async () => {
                this.setState({spinner: true});
                desincription(eventView._id, user.token, false).then((response) => {
                  this.setState({spinner: false});
                  const {data} = response;
                  console.log({aa: data.result});
                  navigation.navigate('FelicitationDesinscrir', {jeton: 0});
                  console.log(balance);
                  const pos = events.findIndex((x) => x._id === eventView._id);
                  if (pos > -1) {
                    events[pos] = data.result;
                    setEvents(events);
                  }
                  ShowEvent(data.result);
                  const {socket} = this.context;
                  socket.emit('requestChats');
                });
              }}>
              Confirmer
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {pro, balance, eventView} = this.context;
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
          {this.Content(pro, balance, eventView)}
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

Desincrir2.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Desincrir2.contextType = NoobaContext;
