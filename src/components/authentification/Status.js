import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import PropTypes from 'prop-types';
import {h, w} from '../../tools/Dimensions';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import SuivantBtn from '../landingComponents/SuivantBtn';

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: h(2),
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    textTransform: 'uppercase',
  },
  questionText: {
    marginTop: h(10),
    marginLeft: w(10),
    color: 'white',
    fontSize: 20,
    textTransform: 'uppercase',
  },
  statusButton: {
    marginHorizontal: w(5),
    marginVertical: w(2),
  },
  statusButtonContent: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    height: h(6),
  },
});

export default class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
    };
  }

  StatusButton = (statusText, state) => {
    const {status} = this.state;
    return (
      <Button
        icon={state === status ? 'check' : null}
        style={styles.statusButton}
        mode="contained"
        color="#4f5356"
        contentStyle={styles.statusButtonContent}
        onPress={() => this.setState({status: state})}>
        {statusText}
      </Button>
    );
  };

  Content = () => {
    const {navigation} = this.props;
    return (
      <>
        <View style={styles.mainContainer}>
          <Text style={styles.mainText}>Inscription</Text>
          <Text style={styles.questionText}>Vous êtes ?</Text>
          <View style={{marginTop: h(3)}}>
            {this.StatusButton('Celibataire', 'celibataire')}
            {this.StatusButton('En Couple', 'en couple')}
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
              navigation.navigate('Photo');
            }}
          />
        </View>
      </>
    );
  };

  render() {
    const {navigation} = this.props;
    return (
      <>
        <MainComponent>
          <HeaderComponent
            navigation={navigation}
            height={22}
            showSubTitle
            showHeaderText
            showBackButton
          />
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

Status.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
