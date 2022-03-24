import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PropTypes from 'prop-types';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {RemoveDeviceToken} from '../../provider/authentification';
import {NoobaContext} from '../../provider/provider';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  disonnectText: {
    marginTop: h(1),
    marginLeft: w(5),
    color: '#B1DFEB',
    width: w(100),
    fontWeight: 'bold',
    fontSize: totalSize(1.8),
    textTransform: 'uppercase',
  },
});

const settings = [
  {settingName: 'Mon Compte', goTo: 'Account', isNormalOnly: false},
  {settingName: 'Autorisations et confidentialité', goTo: 'Confidentiality', isNormalOnly: false},
  {settingName: 'Code de conduite', goTo: 'ConductCode', isNormalOnly: false},
  {settingName: 'Mes alertes', goTo: 'MyAlerts', isNormalOnly: true},
  {settingName: 'Recommandations', goTo: 'Recommendations', isNormalOnly: false},
  {settingName: 'Donnez votre avis', goTo: 'Feedback', isNormalOnly: false},
  // {settingName: 'Evènements enregistrés', goTo: 'MyEvents'},
  // {settingName: 'Se désinscrire', goTo: 'Desinscrire'},
  {settingName: 'Contactez-nous', goTo: 'ContactezNous', isNormalOnly: false},
  // {settingName: 'Invitez des amis', goTo: ''},
];

export default class Settings extends Component {
  renderItem = (item, index) => {
    const {navigation} = this.props;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          if (item.goTo !== '') {
            navigation.navigate(item.goTo);
          }
        }}
        style={{
          marginVertical: h(1),
          paddingVertical: h(0.5),
          paddingHorizontal: w(2),
          borderWidth: 0.5,
          borderColor: 'white',
          marginHorizontal: w(2),
          borderRadius: 50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{color: 'white', textTransform: 'uppercase'}}>{item.settingName}</Text>
        <IconMI name="navigate-next" color="white" size={20} />
      </TouchableOpacity>
    );
  };

  Content = () => {
    const {pro} = this.context;
    const mSettings = settings.filter((s) => (s.isNormalOnly && !pro) || !s.isNormalOnly);
    return (
      <View style={{height: h(74)}}>
        <ScrollView>
          <Text style={styles.headerColMidText}>Paramètres</Text>
          <View style={{marginTop: h(2)}}>
            {mSettings.map((item, index) => this.renderItem(item, index))}
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              const {
                context: {socket, user},
              } = this;
              const deviceToken = await messaging().getToken();
              RemoveDeviceToken(user.token, deviceToken);

              const keys = await AsyncStorage.getAllKeys();
              await AsyncStorage.multiRemove(keys);
              RNRestart.Restart();
              socket.emit('disconnectNotif');
            }}>
            <Text style={styles.disonnectText}>Se Déconnecter</Text>
          </TouchableOpacity>
          {/* <View
            style={{
              flexDirection: 'row',
              marginTop: h(1),
              marginHorizontal: w(14),
              justifyContent: 'space-between',
            }}>
            <IconMCI color="#3d5a98" size={35} name="facebook" />
            <IconMCI color="white" size={35} name="instagram" />
            <IconMCI color="green" size={35} name="whatsapp" />
            <IconMCI color="#197fe4" size={35} name="facebook-messenger" />
            <IconMCI color="white" size={35} name="email-open-outline" />
          </View> */}
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
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton
            bgColor={pro ? colors.proBlue : colors.brown}
            notif
          />
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

Settings.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Settings.contextType = NoobaContext;
