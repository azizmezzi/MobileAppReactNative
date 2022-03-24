/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {Avatar, Button} from 'react-native-paper';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {getParticipantRaiting, raiting} from '../../provider/events';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';

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

export default class Recommendations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      users: [],
      events: [],
    };
  }

  componentDidMount() {
    const {user} = this.context;
    getParticipantRaiting(user.token)
      .then((response) => {
        const {
          data: {users, events},
        } = response;
        const uniqueUsers = this.verifunique(users);
        const newTab = uniqueUsers.filter((item) => item._id !== user._id);
        const finalTab = Array.from(new Set(newTab.map((a) => a._id))).map((_id) => {
          return newTab.find((a) => a._id === _id);
        });
        console.log({finalTab});
        this.setState({users: finalTab, spinner: false, events});
      })
      .catch(() => this.setState({spinner: false}));
  }

  getUniqueVal = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  verifunique = (tab) => {
    return tab.filter(this.getUniqueVal);
  };

  renderItem = (item, index) => {
    const {users} = this.state;
    const user = users[index];
    console.log({item});
    return (
      <View key={index} style={{marginLeft: w(15), flexDirection: 'row', marginVertical: h(2)}}>
        <Avatar.Image
          size={50}
          source={{uri: `http://18.130.184.230:3000/images/${item._id}.png?t=${new Date()}`}}
        />
        <View style={{marginLeft: w(5), flexDirection: 'column'}}>
          <Text style={{color: 'white', fontWeight: 'bold', marginBottom: h(1)}}>{item.name}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Icon
              name="star"
              onPress={() => {
                user.rating = user.rating === 1 ? 0 : 1;
                users[index] = user;
                this.setState({users});
              }}
              style={{marginRight: w(3)}}
              size={20}
              color={user.rating >= 1 ? 'gold' : 'white'}
            />
            <Icon
              name="star"
              onPress={() => {
                user.rating = user.rating === 2 ? 0 : 2;
                users[index] = user;
                this.setState({users});
              }}
              style={{marginRight: w(3)}}
              size={20}
              color={user.rating >= 2 ? 'gold' : 'white'}
            />
            <Icon
              name="star"
              onPress={() => {
                user.rating = user.rating === 3 ? 0 : 3;
                users[index] = user;
                this.setState({users});
              }}
              style={{marginRight: w(3)}}
              size={20}
              color={user.rating >= 3 ? 'gold' : 'white'}
            />
            <Icon
              name="star"
              onPress={() => {
                user.rating = user.rating === 4 ? 0 : 4;
                users[index] = user;
                this.setState({users});
              }}
              style={{marginRight: w(3)}}
              size={20}
              color={user.rating >= 4 ? 'gold' : 'white'}
            />
            <Icon
              name="star"
              onPress={() => {
                user.rating = user.rating === 5 ? 0 : 5;
                users[index] = user;
                this.setState({users});
              }}
              style={{marginRight: w(3)}}
              size={20}
              color={user.rating >= 5 ? 'gold' : 'white'}
            />
          </View>
        </View>
      </View>
    );
  };

  Content = () => {
    const {
      context: {pro, user},
      state: {users},
    } = this;
    const {events} = this.state;
    return (
      <ScrollView style={{marginBottom: h(10)}}>
        <Text style={styles.headerColMidText}>Recommandations</Text>
        <Text style={{textAlign: 'center', marginHorizontal: w(5), color: 'white'}}>
          Il est important de donner votre recommandation aux personnes qui ont participé à vos
          activités. Cela participe à la fiabilité et à la sécurité de l'app.
        </Text>
        <Text>{'\n'}</Text>
        <Text style={{textAlign: 'center', marginHorizontal: w(5), color: 'white'}}>
          Les personnes qui obtiendront moins de 3 étoiles, recevront un avertissement, ou seront
          exclues définitivement de l'app.
        </Text>
        {users.length !== 0 ? (
          <>
            <Text style={styles.headerColMidText}>Veuillez Noter:</Text>
            <View>{users.map((item, index) => this.renderItem(item, index))}</View>
            <Button
              style={{
                alignSelf: 'center',
                width: w(50),
                marginVertical: h(3),
                backgroundColor: pro ? colors.proBlue : colors.brown,
              }}
              mode="contained"
              onPress={() => {
                const voted = users.filter(
                  (remoteUser) => remoteUser.rating !== undefined && remoteUser.rating !== 0,
                );
                console.log(voted);
                this.setState({spinner: true});
                raiting(user.token, voted, events)
                  .then((response) => {
                    this.setState({spinner: false});
                    const {navigation} = this.props;
                    navigation.navigate('Profil');
                  })
                  .catch((err) => {
                    this.setState({spinner: false});
                  });
              }}>
              Soumettre
            </Button>
          </>
        ) : (
          <Text style={styles.headerColMidText}>Il n'y a pas d'utilisateur à recommander</Text>
        )}
      </ScrollView>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      context: {pro},
      state: {spinner},
    } = this;
    return (
      <>
        <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
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

Recommendations.contextType = NoobaContext;
