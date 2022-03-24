import React, {Component} from 'react';
import {Text, StyleSheet, View, Linking} from 'react-native';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import Share from 'react-native-share';
import colors from '../../../../constant/colors';
import {h, w} from '../../../../tools/Dimensions';
import HeaderComponent from '../../../landingComponents/HeaderComponent';
import MainComponent from '../../../landingComponents/MainComponent';
import {NoobaContext} from '../../../../provider/provider';
import SuivantBtn from '../../../landingComponents/SuivantBtn';

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: h(2),
    marginBottom: h(25),
    height: h(70),
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    textTransform: 'uppercase',
  },
  questionText: {
    marginTop: h(10),
    textAlign: 'center',
    color: 'white',
    fontSize: 35,
    textTransform: 'uppercase',
  },
  descriptionText: {
    marginTop: h(3),
    marginHorizontal: w(2),
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  iconContainer: {textAlign: 'center', marginTop: h(5)},
});

export default class ShareEvent extends Component {
  share = (platform, event) => {
    let message = event.name;
    if (platform === Share.Social.EMAIL && Platform.OS === 'ios') {
      message = `${event.name}\n https://nooba.app/event/${event._id}`;
    }
    const shareOptions = {
      title: 'Share via',
      message,
      subject: `NOOBA - ${event.name}`,
      url: `https://nooba.app/event/${event._id}`,
      social: platform,
      filename: 'test',
    };

    Share.shareSingle(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  ShareFB = (eventView) => {
    const link = `https://nooba.app/event/${eventView._id}`;
    Linking.openURL(`fb-messenger://share?link=${link}`);
  };

  Content = (pro) => {
    const {events} = this.context;
    const lastEvent = events[events.length - 1];
    return (
      <>
        <View style={styles.mainContainer}>
          <Text style={styles.questionText}>Partagez l'évènement !</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: h(1),
              marginHorizontal: w(14),
              justifyContent: 'space-between',
            }}>
            {/* <IconMCI
              color="#3d5a98"
              onPress={() => this.share(Share.Social.FACEBOOK, lastEvent)}
              size={35}
              name="facebook"
            /> */}
            {/* <IconMCI
              color="white"
              onPress={() => this.share(Share.Social.INSTAGRAM, lastEvent)}
              size={35}
              name="instagram"
            /> */}
            <IconMCI
              color="green"
              onPress={() => this.share(Share.Social.WHATSAPP, lastEvent)}
              size={35}
              name="whatsapp"
            />
            {/* <IconMCI
              color="#197fe4"
              onPress={() => this.ShareFB(lastEvent)}
              size={35}
              name="facebook-messenger"
            /> */}
            {/* <IconMCI
              color="white"
              onPress={() => this.share(Share.Social.EMAIL, lastEvent)}
              size={35}
              name="email-open-outline"
            /> */}
          </View>
          <View
            style={{
              marginTop: h(7),
              marginBottom: h(-8),
              flex: 1,
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <SuivantBtn
              bgColor={pro ? colors.proBlue : undefined}
              onPress={async () => {
                console.log('aaaaaaaaa');
                const {navigation} = this.props;

                navigation.navigate('Create Event');
              }}
            />
          </View>
        </View>
      </>
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
            showBackButton={false}
            bgColor={pro ? colors.proBlue : colors.brown}
          />
          {this.Content(pro)}
        </MainComponent>
      </>
    );
  }
}

ShareEvent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

ShareEvent.contextType = NoobaContext;
