/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TextInput,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {Button} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import {createFeedback} from '../../provider/avis';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  question: {
    marginLeft: w(3),
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    width: w(100),
    fontWeight: 'bold',
  },
  input: {
    borderColor: 'white',
    paddingHorizontal: w(2),
    borderWidth: 0.75,
    height: h(6),
    fontSize: totalSize(2),
    borderRadius: 10,
    marginHorizontal: w(6),
    color: 'white',
  },
});

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.scrollViewRef = React.createRef();
    this.state = {
      opinion: '',
      suggestions: '',
      recommend: '',
      reason: '',
      star: 0,
      showAlert: false,
      title: '',
      message: '',
      spinner: false,
    };
  }

  Content = () => {
    const {opinion, suggestions, recommend, star, reason} = this.state;
    const {
      context: {pro},
    } = this;
    const keyboardVerticalOffest = Platform.OS === 'ios' ? h(4) : 0;
    return (
      <View style={{height: h(75)}}>
        <ScrollView
          ref={(scrollViewRef) => {
            this.scrollViewRef = scrollViewRef;
          }}>
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={keyboardVerticalOffest}>
            <Text style={styles.headerColMidText}>Donnez votre avis</Text>
            <Text style={{textAlign: 'center', marginHorizontal: w(10), color: 'white'}}>
              NOOBA est une application très jeune qui vise à s'améliorer chaque jour pour répondre
              le plus possible à vos besoins. Votre avis nous est donc primordial pour pouvoir
              continuer à vous satisfaire.
            </Text>
            <Text style={styles.question}>Que pensez-vous de NOOBA?</Text>
            <TextInput
              maxLength={80}
              multiline
              value={opinion}
              onChangeText={(text) => this.setState({opinion: text})}
              style={styles.input}
            />
            <Text style={styles.question}>
              Quelles sont vos suggestions pour améliorer nos services ?
            </Text>
            <TextInput
              maxLength={80}
              multiline
              value={suggestions}
              onChangeText={(text) => this.setState({suggestions: text})}
              style={styles.input}
            />
            <Text style={styles.question}>Recommanderiez-vous NOOBA à vos proches ?</Text>
            <TextInput
              maxLength={80}
              multiline
              value={recommend}
              onChangeText={(text) => this.setState({recommend: text})}
              style={styles.input}
            />
            <Text style={styles.question}>Pourquoi ?</Text>
            <TextInput
              maxLength={80}
              multiline
              value={reason}
              onChangeText={(text) => this.setState({reason: text})}
              onFocus={() => this.scrollViewRef.scrollToEnd()}
              style={styles.input}
            />
            <Text style={styles.question}>Quelle note générale donneriez-vous à NOOBA ?</Text>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: w(25),
                justifyContent: 'space-between',
              }}>
              <Icon
                name="star"
                onPress={() => {
                  this.setState({star: 1});
                }}
                size={20}
                color={star >= 1 ? 'gold' : 'white'}
              />
              <Icon
                name="star"
                onPress={() => {
                  this.setState({star: 1});
                }}
                size={20}
                color={star >= 2 ? 'gold' : 'white'}
              />
              <Icon
                name="star"
                onPress={() => {
                  this.setState({star: 2});
                }}
                size={20}
                color={star >= 3 ? 'gold' : 'white'}
              />
              <Icon
                name="star"
                onPress={() => {
                  this.setState({star: 4});
                }}
                size={20}
                color={star >= 4 ? 'gold' : 'white'}
              />
              <Icon
                name="star"
                onPress={() => {
                  this.setState({star: 5});
                }}
                size={20}
                color={star >= 5 ? 'gold' : 'white'}
              />
            </View>
          </KeyboardAvoidingView>
          <Button
            style={{
              marginTop: h(6),
              alignSelf: 'center',
              width: w(50),
              marginVertical: h(3),
              backgroundColor: pro ? colors.proBlue : colors.brown,
            }}
            mode="contained"
            onPress={() => {
              if (opinion === '' || suggestions === '' || recommend === '' || reason === '') {
                this.setState({
                  showAlert: true,
                  title: 'Erreur',
                  message: 'Vous devez compléter tous les champs pour envoyer votre formulaire',
                });
                return false;
              }
              this.setState({spinner: true});
              const {
                context: {
                  user: {name, token},
                },
              } = this;
              const obj = {
                nom: name,
                avis: opinion,
                suggestions,
                recommendations: recommend,
                raison: reason,
                note: star,
              };
              createFeedback(token, obj)
                .then(() => {
                  this.setState({spinner: false});
                  this.setState({
                    showAlert: true,
                    title: 'Succès',
                    message: 'Nous avons bien reçu votre avis',
                  });
                })
                .catch(() => {
                  this.setState({spinner: false});
                  this.setState({
                    showAlert: true,
                    title: 'Erreur',
                    message: 'Erreur communication',
                  });
                });
            }}>
            Envoyer
          </Button>
        </ScrollView>
      </View>
    );
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  render() {
    const {navigation} = this.props;
    const {
      context: {pro},
      state: {spinner, showAlert, title, message},
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
          />
          {this.Content()}
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title={title}
            message={message}
            closeOnTouchOutside
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton
            confirmText="OK"
            // confirmText="Yes, delete it"
            confirmButtonColor={pro ? colors.proBlue : colors.brown}
            onConfirmPressed={() => {
              this.hideAlert();
              navigation.goBack();
            }}
            onDismiss={() => {
              this.hideAlert();
            }}
          />
        </MainComponent>
      </>
    );
  }
}

Feedback.contextType = NoobaContext;
