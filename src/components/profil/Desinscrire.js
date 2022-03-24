import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TextInput} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import {unsubscribeUser} from '../../provider/authentification';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    width: w(100),
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  TextStyme: {
    marginTop: h(1),
    marginBottom: h(2),
    color: 'white',
    width: w(100),
    textAlign: 'center',
    // fontWeight: 'bold',
    fontSize: totalSize(1.5),
    // textTransform: 'uppercase',
  },

  fieldStyle: {
    marginTop: h(4),
    height: h(5),
    fontSize: totalSize(2),
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 0.5,
    // marginHorizontal: w(5),
    borderRadius: 17,
    paddingHorizontal: w(2),
    color: 'white',
  },
  ButtonInscrit: (pro) => {
    return {
      marginTop: h(3),
      alignSelf: 'center',
      color: 'white',
      backgroundColor: pro ? colors.proBlue : colors.brown,
      width: w(60),
    };
  },
});

export default class Desinscrire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      toggleCheckBox: false,
      toggleCheckBox2: false,
    };
  }

  Content = () => {
    const {message, toggleCheckBox, toggleCheckBox2} = this.state;
    const {
      context: {pro},
    } = this;
    return (
      <View style={{height: h(74)}}>
        <ScrollView>
          <Text style={styles.headerColMidText}>Se désinscrire</Text>
          <Text style={styles.TextStyme}>Vous voulez nous quitter ? 🥺</Text>
          <Text style={{...styles.TextStyme, width: w(90), marginHorizontal: w(5)}}>
            Afin d'améliorer nos services, pourriez-vous nous dire pour quelle raison vous souhaitez
            vous désinscrire?*
          </Text>
          <View style={{marginHorizontal: w(7)}}>
            <TextInput
              onChangeText={(text) => this.setState({message: text})}
              value={message}
              multiline
              numberOfLines={4}
              style={{...styles.fieldStyle, height: h(12)}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginTop: h(5),
              /* 
              marginHorizontal: w(5), */
            }}>
            <CheckBox
              tintColors={{true: 'white', false: 'white'}}
              tintColor="white"
              onCheckColor="white"
              onTintColor="white"
              disabled={false}
              value={toggleCheckBox2}
              onValueChange={(newValue) => this.setState({toggleCheckBox2: newValue})}
            />
            <Text style={{...styles.TextStyme, width: w(80), textAlign: 'left'}}>
              En cochant cette case, je confirme que je souhaite me désinscrire et perdre toutes les
              informations de mon compte.{' '}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginTop: h(2),
              /* 
              marginHorizontal: w(5), */
            }}>
            <CheckBox
              tintColors={{true: 'white', false: 'white'}}
              tintColor="white"
              onCheckColor="white"
              onTintColor="white"
              disabled={false}
              value={toggleCheckBox}
              onValueChange={(newValue) => this.setState({toggleCheckBox: newValue})}
            />
            <Text style={{...styles.TextStyme, width: w(80), textAlign: 'left'}}>
              En cochant cette case, je confirme que je souhaite supprimer les évènements créés et
              que je retire ma participation aux évènements rejoints.{' '}
            </Text>
          </View>

          <Button
            color="white"
            mode="text"
            style={styles.ButtonInscrit(pro)}
            labelStyle={{fontSize: totalSize(2)}}
            onPress={() => {
              const {
                context: {user, socket},
              } = this;
              const {token} = user;
              if (message === '' || !toggleCheckBox || !toggleCheckBox2) {
                console.log('validation error');
              } else {
                unsubscribeUser(token, message).then(async () => {
                  socket.emit('disconnectNotif');
                  const keys = await AsyncStorage.getAllKeys();
                  await AsyncStorage.multiRemove(keys);
                  RNRestart.Restart();
                });
              }
            }}>
            me désinscrire
          </Button>
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
            bgColor={pro ? colors.proBlue : colors.brown}
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton
            notif
          />
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

Desinscrire.contextType = NoobaContext;
