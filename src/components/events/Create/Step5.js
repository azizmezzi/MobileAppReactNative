/* eslint-disable global-require */
import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, ScrollView, Image} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';
import {Button, Chip} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import IconFa from 'react-native-vector-icons/FontAwesome';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFa5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../constant/colors';
import HeaderComponent from '../../landingComponents/HeaderComponent';
import MainComponent from '../../landingComponents/MainComponent';
import SuivantBtn from '../../landingComponents/SuivantBtn';
import {h, totalSize, w} from '../../../tools/Dimensions';
import {NoobaContext} from '../../../provider/provider';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  mainBrownText: (color) => {
    return {
      color: color !== undefined ? color : colors.brown,
      marginTop: h(3),
      textTransform: 'uppercase',
      fontSize: totalSize(2.4),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
});

export default class Step5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameUser: '',
    };
  }

  async componentDidMount() {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
    const {name} = user;
    this.setState({nameUser: name});
  }

  Chips = (array) => {
    console.log(array);
    return (
      <>
        {array.map((item, index) => {
          return (
            <View
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              style={{
                margin: totalSize(0.7),
              }}>
              <Chip
                mode="outlined"
                height={totalSize(3.8)}
                style={{
                  backgroundColor: colors.blue,
                  borderColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  margin: 0,
                }}
                textStyle={{color: 'white', fontSize: totalSize(2)}}>
                {item}
              </Chip>
            </View>
          );
        })}
      </>
    );
  };

  Content = (contextProps) => {
    const {navigation} = this.props;
    const {nameUser} = this.state;
    const {
      context: {pro},
    } = this;
    const {newEvent} = contextProps;

    return (
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}>
        <View style={{width: w(100), flexDirection: 'row', marginTop: h(2)}}>
          <TouchableOpacity
            style={{flexDirection: 'row', marginLeft: w(3)}}
            onPress={() => navigation.navigate('Step1')}>
            <IconFa name="edit" size={27} color="white" />
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                fontSize: totalSize(2),
                marginLeft: w(2),
              }}>
              Modifier
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{position: 'absolute', right: w(5)}}
            onPress={() => {
              navigation.navigate('Create Event');
            }}>
            <IconAntDesign name="delete" size={27} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerColMidText}>Apercu évènement</Text>
        <View style={{width: w(100), flexDirection: 'row', marginTop: h(2)}}>
          <Text
            style={{
              fontSize: totalSize(2),
              color: 'white',
              paddingVertical: h(2),
              paddingHorizontal: w(4),
              textAlign: 'center',
            }}>
            {newEvent.name}
          </Text>
          <TouchableOpacity style={{position: 'absolute', right: w(5)}}>
            <IconAntDesign name="hearto" size={30} color="red" />
          </TouchableOpacity>
        </View>
        <Image
          style={{
            marginTop: h(2),
            height: h(16),
            width: w(100),
          }}
          resizeMode="cover"
          source={{uri: `${newEvent.url}`}}
        />
        {pro ? (
          <Button
            style={{marginHorizontal: w(5), marginVertical: h(3)}}
            icon="calendar-check"
            mode="contained"
            color="red">
            Annuler l'évènement
          </Button>
        ) : (
          <Button
            style={{marginHorizontal: w(5), marginVertical: h(3)}}
            icon="calendar-check"
            mode="contained"
            color="red">
            S&apos;inscrire à l&apos;évènement
          </Button>
        )}

        <View style={{width: w(100), flexDirection: 'row', marginTop: h(2)}}>
          <Text
            style={{
              color: pro ? colors.proBlue : colors.brown,
              textTransform: 'uppercase',
              fontSize: totalSize(2.4),
              marginLeft: w(3),
              fontWeight: 'bold',
            }}>
            Description
          </Text>
          {/* <TouchableOpacity style={{position: 'absolute', right: w(5)}}>
            <IconFa name="share-square-o" size={30} color="white" />
          </TouchableOpacity> */}
        </View>
        <View style={{flexDirection: 'column', marginTop: h(4)}}>
          <View
            style={{
              width: w(100),
              flexDirection: 'row',
              marginLeft: w(4),
              marginBottom: h(1),
            }}>
            <IconAntDesign name="clockcircleo" size={25} color="white" />
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                fontSize: totalSize(1.8),
                marginLeft: w(4),
              }}>
              {moment(newEvent.date).format('D MMM YYYY à HH:mm')}
            </Text>
          </View>
          <View
            style={{
              width: w(100),
              flexDirection: 'row',
              marginLeft: w(4),
              marginBottom: h(1),
            }}>
            <IconEntypo name="location-pin" size={25} color="white" />
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                fontSize: totalSize(1.8),
                flex: 1,
                marginLeft: w(4),
              }}>
              {newEvent.place.localisation}
            </Text>
          </View>
          <View
            style={{
              width: w(100),
              flexDirection: 'row',
              marginLeft: w(4),
              marginBottom: h(1),
            }}>
            <IconEntypo name="users" size={25} color="white" />
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                fontSize: totalSize(1.8),

                marginLeft: w(4),
              }}>
              0/{newEvent.limit} - {newEvent.limit} place(s) encore disponible(s)
            </Text>
          </View>
          <View
            style={{
              marginVertical: h(2),
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 20,
              marginHorizontal: w(2),
            }}>
            <Text
              style={{
                color: 'white',
                paddingVertical: h(2),
                paddingHorizontal: w(4),
                textAlign: 'center',
              }}>
              {newEvent.description}
            </Text>
          </View>
          <View
            style={{
              width: w(100),
              flexDirection: 'row',

              marginBottom: h(1),
            }}>
            <View style={{marginLeft: w(4), width: w(10)}}>
              <IconFa name="hashtag" size={25} color="white" />
            </View>
            <View
              style={{
                // marginLeft: w(2),
                width: w(85),
                flexWrap: 'wrap',
                flex: 1,
                flexDirection: 'row',
                marginRight: w(5),
              }}>
              {this.Chips(newEvent.interests)}
            </View>
          </View>
          {pro ? (
            <View
              style={{
                width: w(100),
                flexDirection: 'row',
                marginLeft: w(4),
                marginBottom: h(1),
              }}>
              <IconAntDesign name="gift" size={25} color="white" />
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'white',
                  fontSize: totalSize(1.8),

                  marginLeft: w(4),
                }}>
                {newEvent.promotion}
              </Text>
            </View>
          ) : null}

          <View
            style={{
              width: w(100),
              flexDirection: 'row',
              marginLeft: w(4),
              marginBottom: h(1),
            }}>
            <IconAntDesign name="infocirlceo" size={25} color="white" />
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                fontSize: totalSize(1.8),

                marginLeft: w(4),
              }}>
              Evènement {newEvent.type}
              {newEvent.minAge !== 0 &&
                newEvent.maxAge !== 0 &&
                ` / ${newEvent.minAge}-${newEvent.maxAge} ans`}
            </Text>
          </View>
          <View
            style={{
              width: w(100),
              flexDirection: 'row',
              marginLeft: w(4),
            }}>
            <IconEntypo name="user" size={25} color="white" />
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                fontSize: totalSize(1.8),

                marginLeft: w(4),
              }}>
              Organisé par {nameUser}
            </Text>
          </View>
        </View>
        {pro === false ? (
          <View
            style={{
              marginTop: h(7),
              marginBottom: h(-8),
              flex: 1,
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <SuivantBtn
              text="valider"
              onPress={async () => {
                navigation.navigate('Publier', {step: false});
              }}
            />
          </View>
        ) : (
          <Button
            mode="contained"
            style={{backgroundColor: colors.proBlue, marginVertical: h(3), marginHorizontal: w(15)}}
            onPress={async () => {
              navigation.navigate('Publier', {step: false});
            }}>
            Publier et payer 1 <IconFa5 name="coins" size={20} color="gold" />
          </Button>
        )}
      </ScrollView>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      context: {pro},
    } = this;
    return (
      <NoobaContext.Consumer>
        {(props) => {
          return (
            <>
              <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
                <HeaderComponent
                  navigation={navigation}
                  height={9}
                  fontsize={30}
                  type
                  // showBackButton
                  bgColor={pro ? colors.proBlue : colors.brown}
                />
                {this.Content(props)}
              </MainComponent>
            </>
          );
        }}
      </NoobaContext.Consumer>
    );
  }
}

Step5.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Step5.contextType = NoobaContext;
