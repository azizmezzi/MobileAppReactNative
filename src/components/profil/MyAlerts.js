/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {StyleSheet, View, Text, Switch, ScrollView, BackHandler} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';

import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import {UpdateAlertState} from '../../provider/authentification';
import {TouchableOpacity} from 'react-native-gesture-handler';
import texts from '../../constant/texts';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default class MyAlerts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false,
      title: '',
      message: '',
      spinner: false,
    };
  }

  componentDidMount() {
    const {
      navigation,
      route: {params},
    } = this.props;
    // navigation.addListener('beforeRemove', (e) => {
    //   e.preventDefault();

    //   BackHandler.exitApp();
    // });
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
      item: {},
    });
  };

  renderItem = (item, index) => {
    const {
      context: {user, setUser},
    } = this;
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          marginVertical: h(1),
          marginTop: h(3),
          justifyContent: 'space-evenly',
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', width: w(50)}}>{item.nameAlert}</Text>
        <Switch
          onValueChange={() => {
            user.alerts[index].state = !user.alerts[index].state;
            console.log(user.alerts);
            setUser(user);
            UpdateAlertState(user.alerts, user.token).then(async (response) => {
              const Newuser = response.data.result;
              Newuser.token = user.token;
              await AsyncStorage.setItem('user', JSON.stringify(Newuser));
            });
          }}
          value={item.state}
        />
        <TouchableOpacity
          onPress={() => {
            this.setState({
              showAlert: true,
              title: texts.delete_alert_title,
              message: texts.delete_alert_text,
              item: index,
            });
          }}>
          <IconAntDesign name="delete" size={27} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  Content = (alerts) => {
    console.log({alerts});
    return (
      <ScrollView style={{marginBottom: h(10)}}>
        <Text style={styles.headerColMidText}>Mes alertes</Text>
        <View>{alerts.map((item, index) => this.renderItem(item, index))}</View>
      </ScrollView>
    );
  };

  render() {
    const {
      navigation,
      route: {params},
    } = this.props;
    const {
      context: {pro, user, setUser},
    } = this;
    const {showAlert, title, message, item} = this.state;

    return (
      <>
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
          <HeaderComponent
            bgColor={pro ? colors.proBlue : colors.brown}
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton
            goBackAction={() => {
              if (params !== undefined) navigation.navigate('Marketplace');
              else navigation.navigate('Settings');
            }}
          />
          {this.Content(user.alerts !== undefined ? user.alerts : [])}
        </MainComponent>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={title}
          message={message}
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showConfirmButton
          showCancelButton
          confirmText="Oui"
          cancelText="Non"
          confirmButtonColor={pro ? colors.proBlue : colors.brown}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();

            user.alerts.splice(item, 1);
            console.log(user.alerts);
            setUser(user);

            UpdateAlertState(user.alerts, user.token).then(async (response) => {
              const Newuser = response.data.result;
              Newuser.token = user.token;
              await AsyncStorage.setItem('user', JSON.stringify(Newuser));
            });
          }}
          onDismiss={() => {
            this.hideAlert();
          }}
        />
      </>
    );
  }
}

MyAlerts.contextType = NoobaContext;
