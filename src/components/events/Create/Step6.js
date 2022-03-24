/* eslint-disable global-require */
import React, {Component} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import PropTypes from 'prop-types';

import colors from '../../../constant/colors';
import {h, w, totalSize} from '../../../tools/Dimensions';
import HeaderComponent from '../../landingComponents/HeaderComponent';
import MainComponent from '../../landingComponents/MainComponent';
import SuivantBtn from '../../landingComponents/SuivantBtn';
import {NoobaContext} from '../../../provider/provider';

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: h(2),
    marginBottom: h(25),
  },

  questionText: {
    marginTop: h(10),
    textAlign: 'center',
    color: 'white',
    fontSize: totalSize(3),
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  descriptionText: {
    marginTop: h(5),
    marginHorizontal: w(4),
    textAlign: 'center',
    color: 'white',
    fontSize: totalSize(2.2),
    textTransform: 'uppercase',
  },
});

export default class Step6 extends Component {
  Content = () => {
    const {navigation} = this.props;
    const {
      context: {pro},
    } = this;
    return (
      <>
        <View style={styles.mainContainer}>
          <Text style={styles.questionText}>Félicitations !</Text>
          <Image
            resizeMode="contain"
            style={{alignSelf: 'center', width: w(100), height: h(15), marginTop: h(5)}}
            source={require('../../../assets/emoji.png')}
          />
          <Text style={styles.descriptionText}>
            Votre évènement est désormais publié et visible par les utilisateurs de NOOBA!
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SuivantBtn
            bgColor={pro ? colors.proBlue : undefined}
            span={0}
            onPress={() => {
              if (pro) {
                navigation.navigate('ShareEvent');
              } else {
                navigation.navigate('Create Event');
              }
            }}
          />
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
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

Step6.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Step6.contextType = NoobaContext;
