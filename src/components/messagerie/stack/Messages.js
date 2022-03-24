/* eslint-disable no-underscore-dangle */
import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {Searchbar} from 'react-native-paper';
import moment from 'moment';
import IconFa from 'react-native-vector-icons/FontAwesome';
import colors from '../../../constant/colors';
import HeaderComponent from '../../landingComponents/HeaderComponent';
import MainComponent from '../../landingComponents/MainComponent';
import {h, w, totalSize} from '../../../tools/Dimensions';
import {NoobaContext} from '../../../provider/provider';

moment.locale('fr');

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

  renderItem = (item, index) => {
    const {navigation} = this.props;
    const {events, user, discussions} = this.context;
    const eventIndex = events.findIndex((e) => e._id === item.event);
    const isMyEvent = eventIndex !== -1 && events[eventIndex].creator === user._id;
    const {messages, members} = item;
    const myMembershipIndex = members.findIndex((m) => m.user === user._id);
    const isSeen = members[myMembershipIndex].vu;
    const lastMessage = messages[messages.length - 1];
    const discussionIndex = discussions.findIndex((e) => e._id === item._id);
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Discussion', {discussionIndex, annuler: item.annuler});
        }}
        key={index}
        style={{
          marginVertical: h(1),
          borderWidth: 1,
          borderRadius: 15,
          borderColor: 'white',
          marginHorizontal: w(3),
          paddingVertical: h(2),
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              textAlign: 'left',
              textTransform: 'uppercase',
              marginLeft: w(3),
              width: w(60),
              color: '#86B1E1',
              fontWeight: 'bold',
              fontSize: totalSize(1.8),
            }}>
            {item.eventName}
          </Text>

          <View
            style={{
              width: w(8),
            }}>
            {/* {isMyEvent && isSeen && (
              <IconFa style={{marginRight: w(2)}} name="star" size={w(3.5)} color="gold" />
            )} */}
            {!isSeen && (
              <IconFa style={{marginRight: w(2)}} name="circle" size={w(3.5)} color="green" />
            )}
            {item.active && (
              <IconFa
                style={{position: 'absolute', right: w(2)}}
                name="circle"
                size={w(3.5)}
                color="green"
              />
            )}
          </View>
        </View>
        {isMyEvent && (
          <Text
            style={{
              textAlign: 'right',
              color: 'gray',
              // width: w(15),
              marginRight: w(3),
              fontSize: totalSize(1.2),
            }}>
            Organisateur
          </Text>
        )}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              textAlign: 'left',
              color: 'white',
              marginLeft: w(3),
              width: w(70),

              fontSize: totalSize(1.6),
            }}>
            {lastMessage !== undefined
              ? `${lastMessage.name}: ${lastMessage.content.split('\n')[0].substring(0, 25)}`
              : 'Soyez le premier à envoyer un message ici!'}
          </Text>
          <Text
            style={{
              textAlign: 'left',
              color: 'gray',
              marginLeft: w(3),
              width: w(12),

              fontSize: totalSize(1.2),
            }}>
            {lastMessage !== undefined && moment(lastMessage.time).format('DD/MM HH:mm')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  /* sortDiscussions = (fDiscussions, user) => {
    const dateSort = fDiscussions.sort((a, b) => {
      const msgsLengthA = a.messages.length;
      const msgsLengthB = b.messages.length;
      if (msgsLengthA === 0 && msgsLengthB === 0) {
        const membershipIndexA = a.members.findIndex((e) => e.user === user._id);
        const membershipIndexB = b.members.findIndex((e) => e.user === user._id);
        if (membershipIndexA === -1 || membershipIndexB === -1) return 0;
        const membershipA = a.members[membershipIndexA];
        const membershipB = b.members[membershipIndexB];
        const dateJoinedA = moment(membershipA.dateRejoint).format();
        const dateJoinedB = moment(membershipB.dateRejoint).format();
        return dateJoinedA < dateJoinedB ? 1 : -1;
      }
      if (msgsLengthA === 0) return 1;
      if (msgsLengthB === 0) return -1;
      const lastMessageA = a.messages[msgsLengthA - 1];
      const lastMessageB = b.messages[msgsLengthB - 1];
      const dateMessageA = moment(lastMessageA.time).format();
      const dateMessageB = moment(lastMessageB.time).format();
      return dateMessageA < dateMessageB ? 1 : -1;
    });
    return dateSort.sort((a, b) => {
      const membershipIndexA = a.members.findIndex((e) => e.user === user._id);
      const membershipIndexB = b.members.findIndex((e) => e.user === user._id);
      if (membershipIndexA === -1 || membershipIndexB === -1) return 0;
      const membershipA = a.members[membershipIndexA];
      const membershipB = b.members[membershipIndexB];
      const vuA = membershipA.vu;
      const vuB = membershipB.vu;
      if (vuA && !vuB) return 1;
      if (vuB && !vuA) return -1;
      return 0;
    });
  }; */

  sortDiscussions = (fDiscussions, user) => {
    return fDiscussions.sort((a, b) => {
      const msgsLengthA = a.messages.length;
      const msgsLengthB = b.messages.length;
      if (msgsLengthA === 0 && msgsLengthB === 0) {
        const membershipIndexA = a.members.findIndex((e) => e.user === user._id);
        const membershipIndexB = b.members.findIndex((e) => e.user === user._id);
        if (membershipIndexA === -1 || membershipIndexB === -1) return 1;
        const membershipA = a.members[membershipIndexA];
        const membershipB = b.members[membershipIndexB];
        const dateJoinedA = moment(membershipA.dateRejoint).format();
        const dateJoinedB = moment(membershipB.dateRejoint).format();
        return dateJoinedA < dateJoinedB ? 1 : -1;
      }
      if (msgsLengthA === 0) {
        const membershipIndexA = a.members.findIndex((e) => e.user === user._id);
        const membershipIndexB = b.members.findIndex((e) => e.user === user._id);
        if (membershipIndexA === -1 || membershipIndexB === -1) return 1;
        const membershipA = a.members[membershipIndexA];
        const lastMessageB = b.messages[msgsLengthB - 1];
        const dateMessageA = moment(membershipA.dateRejoint).format();
        const dateMessageB = moment(lastMessageB.time).format();
        return dateMessageA < dateMessageB ? 1 : -1;
      }
      if (msgsLengthB === 0) {
        const membershipIndexA = a.members.findIndex((e) => e.user === user._id);
        const membershipIndexB = b.members.findIndex((e) => e.user === user._id);
        if (membershipIndexA === -1 || membershipIndexB === -1) return 1;
        const lastMessageA = a.messages[msgsLengthA - 1];
        const membershipB = b.members[membershipIndexB];
        const dateMessageA = moment(lastMessageA.time).format();
        const dateMessageB = moment(membershipB.dateRejoint).format();
        return dateMessageA < dateMessageB ? 1 : -1;
      }
      const lastMessageA = a.messages[msgsLengthA - 1];
      const lastMessageB = b.messages[msgsLengthB - 1];
      const dateMessageA = moment(lastMessageA.time).format();
      const dateMessageB = moment(lastMessageB.time).format();
      return dateMessageA < dateMessageB ? 1 : -1;
    });
  };

  Content = () => {
    const {
      state: {search},
      context: {discussions, events, user},
    } = this;
    let fDiscussions = discussions;
    if (search !== '') {
      fDiscussions = discussions.filter(
        // eslint-disable-next-line prettier/prettier
        (element) => element.eventName.toLowerCase().includes(search.toLowerCase()) === true,
      );
    }
    fDiscussions = fDiscussions.filter((element) => {
      const eventIndex = events.findIndex((e) => e._id === element.event);
      if (eventIndex === -1) return false;
      const tempEvent = events[eventIndex];
      const {annuler, valider} = tempEvent;
      element.annuler = annuler;
      // return !annuler && valider;
      return valider;
    });
    fDiscussions = this.sortDiscussions(fDiscussions, user);

    return (
      <ScrollView>
        <View style={{marginBottom: h(12)}}>
          <Text style={styles.headerColMidText}>Messages</Text>
          <Searchbar
            style={{marginHorizontal: w(2), marginVertical: h(2)}}
            placeholder="Rechercher"
            value={search}
            onChangeText={(searchText) => {
              this.setState({search: searchText});
            }}
          />
          <View>{fDiscussions.map((item, index) => this.renderItem(item, index))}</View>
        </View>
      </ScrollView>
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
            bgColor={pro ? colors.proBlue : colors.brown}
            showBackButton={false}
            notif
          />
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

Messages.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Messages.contextType = NoobaContext;
