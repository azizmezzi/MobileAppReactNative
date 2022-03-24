import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {Button} from 'react-native-paper';

import {h, totalSize, w} from '../../tools/Dimensions';

import SuivantBtn from '../landingComponents/SuivantBtn';
import GlobalRender from '../main/GlobalRender';
import texts from '../../constant/texts';

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  mainContainer: {
    marginTop: h(2),
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  questionText: {
    marginTop: h(10),
    marginLeft: w(5),
    color: 'white',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  genderButton: {
    marginHorizontal: w(5),
    marginVertical: w(2),
  },
  genderButtonContent: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    height: h(6),
  },
});

export default class Gender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: '',
      showAlert: false,
      title: '',
      message: '',
    };
  }

  GenderButton = (genderText, state) => {
    const {gender} = this.state;
    return (
      <Button
        icon={state === gender ? 'check' : null}
        style={styles.genderButton}
        mode="contained"
        color="#4f5356"
        contentStyle={styles.genderButtonContent}
        onPress={() => this.setState({gender: state})}>
        {genderText}
      </Button>
    );
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  Content = () => {
    const {gender} = this.state;
    const {navigation, route} = this.props;
    const {params} = route;
    const {user} = params;
    return (
      <>
        <View style={styles.mainContainer}>
          <Text style={styles.mainText}>Inscription</Text>
          <Text style={styles.questionText}>Vous êtes ?</Text>
          <View style={{marginTop: h(3)}}>
            {this.GenderButton('Une Femme', 'femme')}
            {this.GenderButton('Un Homme', 'homme')}
            {this.GenderButton('Autre', 'autre')}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SuivantBtn
            onPress={() => {
              if (gender === '') {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_Gender_title,
                  message: texts.invalid_Gender_text,
                });
                return false;
              }
              user.gender = gender;
              navigation.navigate('Naissance', {user});
              return true;
            }}
          />
        </View>
      </>
    );
  };

  render() {
    const {navigation} = this.props;
    const {showAlert, title, message} = this.state;

    return (
      <GlobalRender
        navigation={navigation}
        showAlert={showAlert}
        title={title}
        message={message}
        type={2}
        Content={() => this.Content()}
        hideAlert={() => this.hideAlert()}
      />
    );
  }
}

Gender.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        gender: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
