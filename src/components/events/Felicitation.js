import React, {Component} from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../../constant/colors';
import {h, w, totalSize} from '../../tools/Dimensions';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';

import {NoobaContext} from '../../provider/provider';

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: h(1),
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(3),
    textTransform: 'uppercase',
  },
  questionText: {
    marginHorizontal: w(5),
    marginTop: h(1),
    textAlign: 'center',
    color: colors.brown,
    fontWeight: 'bold',
    fontSize: totalSize(3.5),
    // textTransform: 'uppercase',
  },
  iconContainer: {textAlign: 'center', marginTop: h(5)},
  mainStyle: (pro) => {
    return {
      height: h(8),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: pro ? colors.proBlue : colors.brown,
      width: w(45),
      marginBottom: h(12),
    };
  },
  suivantText: {
    fontSize: totalSize(2.8),
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  centerView: {
    alignItems: 'center',
  },

  descriptionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    // marginTop: h(1),
    marginHorizontal: w(8),
  },
});

export default class Felicitation extends Component {
  Content = () => {
    const {navigation} = this.props;
    const {pro, eventView} = this.context;

    return (
      <>
        <View style={styles.mainContainer}>
          <Text style={styles.questionText}>Félicitations !</Text>
          <Image
            resizeMode="contain"
            style={{alignSelf: 'center', width: w(15), height: h(15)}}
            // eslint-disable-next-line global-require
            source={require('../../assets/emoji.png')}
          />
        </View>
        <View style={styles.centerView}>
          <Text style={styles.descriptionText}>Vous êtes inscrit(e) à l&apos;évènement:</Text>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: totalSize(3.1),
              marginTop: h(1.5),
              marginBottom: h(1.5),
              marginHorizontal: w(12),
            }}>
            {eventView.name}
          </Text>
          <Text style={styles.descriptionText}>
            Vous pouvez désormais accéder à la messagerie de l&apos;évènement pour discuter avec les
            autres participants.
          </Text>
        </View>

        <View
          style={{
            // flex: 1,
            position: 'absolute',
            bottom: 0,
            marginBottom: h(5),
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            style={styles.mainStyle(pro)}
            onPress={() => {
              navigation.navigate('Marketplace');
            }}>
            <Text style={styles.suivantText}>Suivant </Text>
            <Icon name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  render() {
    const {navigation} = this.props;
    const {pro} = this.context;

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
            notif
          />
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

Felicitation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      pro: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

Felicitation.contextType = NoobaContext;
