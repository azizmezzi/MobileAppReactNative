/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React, {Component} from 'react';
import {
  View,
  KeyboardAvoidingView,
  // TextInput,
  Text,
  ScrollView,
  StyleSheet,
  Keyboard,
  Platform,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import {Avatar, TextInput} from 'react-native-paper';
import IconFa from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import moment from 'moment';
import colors from '../../../constant/colors';
import HeaderComponent from '../../landingComponents/HeaderComponent';
import MainComponent from '../../landingComponents/MainComponent';
import {ReadDiscussion} from '../../../provider/events';
import {h, w, totalSize} from '../../../tools/Dimensions';
import {NoobaContext} from '../../../provider/provider';
import {getParticipant} from '../../../provider/authentification';

moment.locale('fr');

const styles = StyleSheet.create({
  navBarStyle: {
    // backgroundColor: colors.blue,
    // position: 'absolute',
    bottom: 0,
    height: h(10),
    width: w(100),
  },
  navbarContainer: (pro) => {
    return {
      backgroundColor: pro ? colors.proBlue : colors.brown,
      flex: 1,
      flexDirection: 'row',
      width: w(100),
      alignItems: 'center',
      justifyContent: 'space-evenly',
    };
  },
});

export default class Discussion extends Component {
  constructor(props) {
    super(props);
    this.scrollViewRef = React.createRef();
    this.textInputRef = React.createRef();
    this.state = {
      newMsg: '',
    };
  }

  async componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.textInputRef.blur();
    });
    const {user, discussions, setDiscussions} = this.context;
    const {
      route: {
        params: {discussionIndex},
      },
    } = this.props;
    const thisDiscussion = discussions[discussionIndex];
    const memberIndex = thisDiscussion.members.findIndex((m) => m.user === user._id);
    if (memberIndex !== -1) {
      const member = thisDiscussion.members[memberIndex];
      member.vu = true;
      thisDiscussion.members[memberIndex] = member;
    }
    discussions[discussionIndex] = thisDiscussion;
    setDiscussions(discussions);
    await AsyncStorage.setItem('Discussion', JSON.stringify(discussions));
    ReadDiscussion(discussions[discussionIndex]._id, user.token)
      .then(async (data) => {})
      .catch((err) => console.log(err));
  }

  async componentWillUnmount() {
    const {user, discussions, setDiscussions} = this.context;
    const {
      route: {
        params: {discussionIndex},
      },
    } = this.props;
    this.keyboardDidHideListener.remove();
    const thisDiscussion = discussions[discussionIndex];
    const memberIndex = thisDiscussion.members.findIndex((m) => m.user === user._id);
    if (memberIndex !== -1) {
      const member = thisDiscussion.members[memberIndex];
      member.vu = true;
      thisDiscussion.members[memberIndex] = member;
    }
    discussions[discussionIndex] = thisDiscussion;
    setDiscussions(discussions);
    await AsyncStorage.setItem('Discussion', JSON.stringify(discussions));
    ReadDiscussion(discussions[discussionIndex]._id, user.token)
      .then(async (data) => {})
      .catch((err) => console.log(err));
  }

  renderItem = (item, index) => {
    const {user} = this.context;
    // console.log({item});
    return (
      <View style={{marginVertical: h(2)}} key={index}>
        {item.sender === user._id ? (
          <View>
            <Text
              style={{
                color: 'white',
                // alignSelf: 'flex-end',
                fontSize: totalSize(1),
                marginLeft: w(19),
                marginBottom: h(0.5),
              }}>
              {item.name}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{position: 'relative', width: w(12)}}>
                <Avatar.Image
                  style={{alignSelf: 'center', marginLeft: w(2), bottom: 0, position: 'absolute'}}
                  size={w(12)}
                  source={{
                    uri:
                      item.name === 'anonyme'
                        ? `http://18.130.184.230:3000/images/anonyme.png?t=${new Date()}`
                        : `http://18.130.184.230:3000/images/${item.sender}.png?t=${new Date()}`,
                  }}
                />
              </View>
              <View
                style={{
                  paddingHorizontal: w(4),
                  paddingVertical: h(2),
                  borderRadius: 10,
                  backgroundColor: '#2676E1',
                  marginLeft: w(3),
                  marginRight: w(10),
                  flexWrap: 'nowrap',
                  flex: 1,
                }}>
                <Text style={{color: 'white', fontSize: totalSize(1.8)}}>{item.content}</Text>
                <Text style={{color: 'white', alignSelf: 'flex-end', fontSize: totalSize(1)}}>
                  {moment(item.time).format('D MMMM YYYY, HH:m')}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <Text
              style={{
                color: 'white',
                alignSelf: 'flex-end',
                fontSize: totalSize(1),
                marginRight: w(19),
                marginBottom: h(0.5),
              }}>
              {item.name}
            </Text>
            <View style={{flexDirection: 'row-reverse'}}>
              <View style={{position: 'relative', width: w(12)}}>
                <TouchableOpacity
                  key={index}
                  onPress={async () => {
                    const {navigation} = this.props;

                    getParticipant(user.token, item.sender)
                      .then((response) => {
                        const dataE = response.data;
                        navigation.navigate('AnotherProfil', {user: dataE.user});
                      })
                      .catch((e) => console.log(e));
                  }}
                  style={{
                    marginTop: h(2),
                    marginHorizontal: h(1),
                    width: w(12),
                    height: w(12),
                    borderRadius: w(12) / 2,
                    backgroundColor: 'green',
                    alignItems: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Avatar.Image
                    style={{alignSelf: 'center', marginLeft: w(2), bottom: 0, position: 'absolute'}}
                    size={50}
                    source={{
                      uri:
                        item.name === 'anonyme'
                          ? `http://18.130.184.230:3000/images/anonyme.png?t=${new Date()}`
                          : `http://18.130.184.230:3000/images/${item.sender}.png?t=${new Date()}`,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingHorizontal: w(4),
                  paddingVertical: h(2),
                  borderRadius: 10,
                  backgroundColor: '#434B56',
                  marginRight: w(3),
                  marginLeft: w(10),
                  flexWrap: 'nowrap',
                  flex: 1,
                }}>
                <Text style={{color: 'white', fontSize: totalSize(1.8)}}>{item.content}</Text>
                <Text style={{color: 'white', alignSelf: 'flex-end', fontSize: totalSize(1)}}>
                  {moment(item.time).format('D MMMM YYYY, HH:m')}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  NewMsg = (annuler) => {
    const {
      context: {pro, discussions, socket, setDiscussions},
    } = this;
    const {newMsg} = this.state;
    const {
      route: {
        params: {discussionIndex},
      },
    } = this.props;
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={styles.navBarStyle}>
          <View style={styles.navbarContainer(pro)}>
            {/* <IconFa
              style={{marginLeft: w(2), width: w(10), alignSelf: 'center'}}
              name="smile-o"
              size={30}
              color="white"
              // onPress={() => this.setState({showEmojis: !showEmojis})}
            /> */}

            <TextInput
              onFocus={() => {
                setTimeout(() => this.scrollViewRef.scrollToEnd(), 100);
              }}
              ref={(tRef) => {
                this.textInputRef = tRef;
              }}
              multiline
              // disabled={annuler}
              placeholder="Aa"
              dense
              underlineColor="transparent"
              style={{
                underlineColor: 'white',
                overflow: 'hidden',
                // textAlign: 'center',
                // height: h(5.5),
                width: w(90),
                borderRadius: 20,
                backgroundColor: 'white',
                fontSize: totalSize(2),
              }}
              theme={{
                roundness: 20,
                colors: {
                  primary: 'white',
                },
              }}
              value={newMsg}
              onChangeText={(text) => this.setState({newMsg: text})}
              right={
                <TextInput.Icon
                  // disabled={annuler}
                  // style={{marginTop: h(1.75)}}
                  name={() => (
                    <IconFa
                      onPress={async () => {
                        // if (!annuler) {
                        const jsonUser = await AsyncStorage.getItem('user');
                        const user = JSON.parse(jsonUser);
                        const thisDiscussion = discussions[discussionIndex];
                        const newMessage = {
                          content: newMsg !== '' ? newMsg : '👍',
                          time: new Date(),
                          sender: user._id,
                          name: user.isPro ? user.nameEtablissement : user.name,
                          image: user.image,
                        };

                        // eslint-disable-next-line no-underscore-dangle

                        socket.emit('sendNewMessage', {
                          idDiscussion: thisDiscussion._id,
                          newMessage,
                        });
                        thisDiscussion.messages.push(newMessage);
                        thisDiscussion.members.forEach((member) => {
                          if (member.user !== user._id) {
                            // eslint-disable-next-line no-param-reassign
                            member.vu = false;
                          }
                        });
                        discussions[discussionIndex] = thisDiscussion;
                        setDiscussions(discussions);
                        this.setState({newMsg: ''});
                        Keyboard.dismiss();
                        await AsyncStorage.setItem('Discussion', JSON.stringify(discussions));
                        // }
                      }}
                      style={{alignSelf: 'center', width: w(10)}}
                      name={newMsg !== '' ? 'send' : 'thumbs-up'}
                      size={30}
                      color="#2676E1"
                    />
                  )}
                  size={28}
                  color="#2676E1"
                />
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  ContentView = (messages, annuler) => {
    let TextView = (text) => (
      <View
        style={{
          marginTop: h(28),
        }}>
        <Text
          style={{
            color: 'white',
            // textTransform: 'uppercase',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            alignContent: 'center',
            marginTop: h(2),
            fontSize: totalSize(2),
          }}>
          {text}
        </Text>
      </View>
    );
    // if (annuler !== undefined && annuler) return TextView('Évènement annulé');
    if (messages.length === 0) return TextView(`Il n'y a encore aucun message pour cet évènement`);
    return messages.map((item, index) => this.renderItem(item, index));
  };

  render() {
    const {navigation} = this.props;
    const {
      context: {pro, discussions},
    } = this;
    const {
      route: {
        params: {discussionIndex, annuler},
      },
    } = this.props;
    const {messages} = discussions[discussionIndex];
    let test = false;
    if (annuler) {
      test = true;
    }
    // console.log('aaaaaaaaaaaaaaa', annuler);
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
          />
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: w(10),
              }}
            />
            <Text
              style={{
                width: w(80),
                color: 'white',
                fontSize: totalSize(2.1),
                textTransform: 'uppercase',
                textAlign: 'center',
                marginTop: h(2),
              }}>
              {discussions[discussionIndex].eventName}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const {event} = discussions[discussionIndex];
                const {events, ShowEvent} = this.context;
                const pos = events.findIndex((e) => e._id === event);
                if (pos !== -1) {
                  const eventToShow = events[pos];
                  ShowEvent(eventToShow);
                  navigation.navigate('EventView');
                }
              }}
              style={{
                width: w(10),
                marginTop: h(2),
              }}>
              {(annuler === undefined || annuler === false) && (
                <IconFa
                  size={w(8)}
                  style={{
                    color: 'white',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}
                  name="info-circle"
                />
              )}
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={(scrollViewRef) => {
              this.scrollViewRef = scrollViewRef;
            }}
            onContentSizeChange={() => {
              this.scrollViewRef.scrollToEnd();
            }}
            style={{marginHorizontal: w(4)}}
            showsVerticalScrollIndicator={false}>
            {this.ContentView(messages, annuler)}
          </ScrollView>
          {this.NewMsg(test)}
        </MainComponent>
      </>
    );
  }
}

Discussion.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Discussion.contextType = NoobaContext;
