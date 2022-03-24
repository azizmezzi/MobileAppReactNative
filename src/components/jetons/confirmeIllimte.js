/* eslint-disable no-underscore-dangle */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, Image} from 'react-native';
import PropTypes from 'prop-types';
import {Button} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';
import {BlurView} from '@react-native-community/blur';
import AsyncStorage from '@react-native-community/async-storage';
import {AnnulerPremium} from '../../provider/authentification';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';

const styles = StyleSheet.create({
  centerView: {
    alignItems: 'center',
  },
  ButtonInscrit: {
    // marginTop: h(2),
    borderRadius: 5,
    marginBottom: h(5),
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: w(1),
    marginRight: w(1),
    color: 'white',
    borderColor: 'white',
    height: h(7),
    borderWidth: 1,
    // backgroundColor: colors.brown,
    width: w(43),
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default class ConfirmeIllimte extends Component {
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

  Content = () => {
    const {navigation} = this.props;
    return (
      <View style={{height: h(75)}}>
        <ScrollView>
          {/* <View style={styles.centerView}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: totalSize(1.5),
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginTop: h(7),
                marginHorizontal: w(5),
              }}>
              Si vous annulez votre abonnement, vous ne pourrez plus publier vos évènements sur
              NOOBA.
            </Text>
          </View> */}
          <Image
            resizeMode="contain"
            style={{alignSelf: 'center', width: w(15), height: h(15)}}
            // eslint-disable-next-line global-require
            source={require('../../assets/diamond.png')}
          />
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: totalSize(2),
              fontWeight: 'bold',
              marginLeft: w(4),
            }}>
            Abonnement PREMIUM
          </Text>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: totalSize(1.7),
              marginHorizontal: w(5),
              marginTop: h(15),
            }}>
            Etes-vous certain(e) de vouloir vous désabonner?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignContent: 'center',
              alignItems: 'center',
              marginTop: h(16),
              justifyContent: 'center',
            }}>
            <Button
              color="white"
              mode="outlined"
              style={styles.ButtonInscrit}
              labelStyle={{fontSize: totalSize(1.7), textTransform: 'none'}}
              onPress={async () => {
                navigation.goBack();
              }}>
              Annuler
            </Button>
            <Button
              color="white"
              mode="outlined"
              style={{...styles.ButtonInscrit, fontSize: 10, backgroundColor: '#64A549'}}
              labelStyle={{fontSize: totalSize(1.7), textTransform: 'none'}}
              onPress={async () => {
                this.setState({spinner: true});
                const {user, setUser} = this.context;
                AnnulerPremium(user.token).then(async () => {
                  this.setState({spinner: false});
                  user.illimite = false;
                  setUser(user);
                  await AsyncStorage.setItem('user', JSON.stringify(user));
                  navigation.navigate('FelicitationCompteFree');
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
    const {pro, eventView} = this.context;
    const {showAlert, title, message, spinner} = this.state;
    return (
      <>
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
          // confirmText="Yes, delete it"
          confirmButtonColor={pro ? colors.proBlue : colors.brown}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
          onDismiss={() => {
            this.hideAlert();
          }}
        />
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
          <HeaderComponent
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton
            bgColor={pro ? colors.proBlue : colors.brown}
            notif
          />
          <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
          {showAlert && (
            <BlurView
              style={styles.absolute}
              // viewRef={this.state.viewRef}
              blurType="light"
              blurAmount={10}
            />
          )}
          {this.Content(pro, eventView)}
        </MainComponent>
      </>
    );
  }
}

ConfirmeIllimte.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

ConfirmeIllimte.contextType = NoobaContext;
