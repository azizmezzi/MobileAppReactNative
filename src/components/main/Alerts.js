/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../../constant/colors';
import {h, w, totalSize} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import texts from '../../constant/texts';
import {CreateAlert} from '../../provider/authentification';
import GlobalRender from './GlobalRender';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    width: w(100),
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: totalSize(3),
    textTransform: 'uppercase',
  },
  ButtonInscrit: (color) => {
    return {
      marginTop: h(18),
      alignSelf: 'center',
      color: 'white',
      backgroundColor: color !== undefined ? color : colors.brown,
      width: w(55),
    };
  },
  fieldStyle: {
    marginTop: h(1),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    height: h(6),
  },
});

export default class Alerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AlertName: '',
      showAlert: false,
      title: '',
      message: '',
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
    const {navigation, route} = this.props;
    const {
      filterGender,
      filterRegion,
      motCle,
      date1String,
      date2String,
      interests,
      regionDistance,
    } = route.params;
    const {AlertName} = this.state;
    const {
      context: {pro, user, setUser},
    } = this;
    console.log({
      filterGender,
      filterRegion,
      motCle,
      date1String,
      date2String,
      interests,
      regionDistance,
    });
    return (
      <ScrollView style={{marginBottom: h(10)}}>
        <Text style={styles.headerColMidText}>Alertes</Text>
        <Text
          style={{
            color: 'white',
            marginHorizontal: w(10),
            textTransform: 'uppercase',
            marginTop: h(15),
            fontSize: 18,
          }}>
          Donnez un nom à cette alerte
        </Text>
        <TextInput
          maxLength={100}
          mode="outlined"
          label="ÉCRIVEZ ICI"
          theme={{
            colors: {
              placeholder: 'white',
              text: 'white',
              primary: 'white',
              underlineColor: 'transparent',
              background: '#4f5356',
            },
          }}
          style={styles.fieldStyle}
          value={AlertName}
          onChangeText={(text) => this.setState({AlertName: text})}
        />
        <Button
          color="white"
          mode="text"
          style={styles.ButtonInscrit(pro ? colors.proBlue : colors.brown)}
          labelStyle={{fontSize: 12}}
          onPress={() => {
            if (AlertName === '') {
              this.setState({
                showAlert: true,
                title: texts.invalid_Alert_title,
                message: texts.invalid_Alert_text,
              });
            } else {
              const alert = {
                nameAlert: AlertName,
                regionsAlert: filterRegion,
                distance: regionDistance,
                CentreInteretAlert: interests,
                DateBeginAlert: date1String,
                DateEndAlert: date2String,
                MotCleAlert: motCle,
                GenreAlert: filterGender,
              };
              CreateAlert(alert, user.token).then(async (response) => {
                const Newuser = response.data.result;
                Newuser.token = user.token;
                await AsyncStorage.setItem('user', JSON.stringify(Newuser));
                setUser(Newuser);

                navigation.navigate('MyAlerts', {back: 'create'});
                // navigation.navigate('Marketplace', {
                //   filter: {
                //     filterGender,
                //     filterRegion,
                //     motCle,
                //     date1String,
                //     date2String,
                //     interests,
                //   },
                // });
              });
            }
          }}>
          Enregistrer alerte
        </Button>
      </ScrollView>
    );
  };

  render() {
    const {showAlert, title, message} = this.state;
    const {navigation} = this.props;
    return (
      <GlobalRender
        navigation={navigation}
        showAlert={showAlert}
        title={title}
        message={message}
        Content={() => this.Content()}
        hideAlert={() => this.hideAlert()}
      />
    );
  }
}

Alerts.contextType = NoobaContext;
