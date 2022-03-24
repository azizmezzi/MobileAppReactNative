/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import React, {Component} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import colors from '../../constant/colors';

import {h, w, totalSize} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';

moment.locale('fr');

const styles = StyleSheet.create({
  headerGrid: {
    marginTop: h(3),
  },
  headerCol: (width) => {
    return {
      width: w(width),
      alignItems: 'center',
    };
  },
  headerColMidText: {color: 'white', fontSize: totalSize(3)},
  cardContainer: (color, valider) => {
    const validatedColor = color !== undefined ? color : colors.brown;
    return {
      marginBottom: h(2),
      marginTop: h(1),
      backgroundColor: valider ? validatedColor : colors.yellow,
      marginHorizontal: w(5),
      borderRadius: 10,
    };
  },
  cardImage: {
    width: '100%',
    height: h(15),
  },
  cardFirstLine: {
    flexDirection: 'row',
    marginTop: h(1),
    marginLeft: w(2),
    alignItems: 'center',
  },
  cardSecondLine: {
    flexDirection: 'row',
    marginBottom: h(2),
    marginLeft: w(2),
    alignItems: 'center',
  },
  headerView: {
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerViewText: {color: 'white', fontSize: totalSize(3)},
});

export default class MarketplaceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  Content = (navigation, event, ShowEvent) => {
    const {
      context: {user},
      state: {loading},
    } = this;
    const color = event.isPro ? colors.proBlue : colors.brown;
    const index = user.likedEvents.findIndex((e) => e.event == event._id);
    const finalParticipants = event.participants.filter((particip) => !particip.description);
    const imgUri = `http://18.130.184.230:3000/events_images/${event.image}`;
    return (
      <TouchableOpacity
        onPress={() => {
          ShowEvent(event);
          console.log({event});
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
          navigation.navigate('EventView');
        }}
        style={styles.cardContainer(color, event.valider)}>
        <ImageBackground
          onLoadEnd={() => {
            this.setState({
              loading: false,
            });
          }}
          style={styles.cardImage}
          resizeMode="cover"
          source={{uri: imgUri}}>
          <ActivityIndicator
            size="large"
            color={color}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            animating={loading}
          />
        </ImageBackground>
        <View style={styles.cardFirstLine}>
          <Text
            style={{
              width: w(80),
              color: 'white',
              fontWeight: 'bold',
            }}>{`${event.name} - ${event.place.region}`}</Text>

          <IconAntDesign
            style={{width: w(20), alignSelf: 'center'}}
            name={index === -1 ? 'hearto' : 'heart'}
            size={20}
            color="red"
          />
        </View>
        <View style={styles.cardSecondLine}>
          <Text style={{width: w(42), fontSize: totalSize(1.4), color: 'white'}}>
            {moment(event.date).format('D MMM YYYY à HH:mm')}
          </Text>

          <Text
            style={{
              width: w(28),
              fontSize: totalSize(1.4),
              color: 'white',
            }}>{`Public: ${event.type}`}</Text>
          <Icon2 style={{alignSelf: 'center'}} name="user" size={20} color="white" />
          <Text
            style={{
              marginLeft: w(1),
              fontSize: totalSize(1.4),
              color: 'white',
            }}>{`${finalParticipants.length} / ${event.limit}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const {navigation, event, ShowEvent} = this.props;
    return <>{this.Content(navigation, event, ShowEvent)}</>;
  }
}

MarketplaceCard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

MarketplaceCard.contextType = NoobaContext;
