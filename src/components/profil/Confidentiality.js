/* eslint-disable react/prop-types */
import React, {useContext} from 'react';
import {StyleSheet, View, Text, ScrollView, Switch} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import {DisablePushNotif} from '../../provider/authentification';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  settingView: {
    height: h(5),
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
  },
});

export default function Confidentiality(props) {
  const {navigation} = props;
  const context = useContext(NoobaContext);
  const {pro, user, setUser} = context;
  let bgColor = colors.brown;
  if (pro) bgColor = colors.proBlue;
  return (
    <>
      <MainComponent bgColor={bgColor}>
        <HeaderComponent
          bgColor={bgColor}
          navigation={navigation}
          height={9}
          fontsize={30}
          type
          showBackButton
          notif
        />
        <ScrollView style={{marginBottom: h(10)}}>
          <Text style={styles.headerColMidText}>Conditions générales d'utilisation</Text>
          <View style={styles.settingView}>
            <Text style={{color: 'white', textTransform: 'uppercase'}}>
              Conditions générales d'utilisation
            </Text>
            {/* <Switch
              onValueChange={() => {
                const userN = user;
                userN.PushNotification = !user.PushNotification;
                setUser(userN);
                DisablePushNotif(user.token, user.PushNotification).then(async (response) => {
                  const Newuser = response.data.result;
                  Newuser.token = user.token;
                  await AsyncStorage.setItem('user', JSON.stringify(Newuser));
                });
              }}
              value={user.PushNotification}
            /> */}
          </View>
          <View style={styles.settingView}>
            <Text style={{color: 'white', textTransform: 'uppercase'}}>
              Protection des données personelles
            </Text>
          </View>
        </ScrollView>
      </MainComponent>
    </>
  );
}

Confidentiality.contextType = NoobaContext;
