/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';
import {Button} from 'react-native-paper';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {createSignal} from '../../provider/signal';
import {NoobaContext} from '../../provider/provider';
import texts from '../../constant/texts';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    width: w(100),
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  genderButton: {
    marginHorizontal: w(5),
    marginVertical: w(2),
    borderColor: 'white',
    borderWidth: 1,
  },
  genderButtonContent: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    height: h(6),
  },
  input: {
    marginTop: h(2),
    height: h(6),
    fontSize: totalSize(2),
    borderColor: 'white',
    paddingHorizontal: w(2),
    borderWidth: 0.75,
    borderRadius: 10,
    marginHorizontal: w(6),
    color: 'white',
  },
});

const raisons = [
  `Usurpation d'identité`,
  `Faux compte`,
  `Propos inappropriés`,
  `Intimidation ou harcèlement`,
  `Autres`,
];

const raisonEvents = [
  `Faux évènement`,
  `L'organisateur est un faux compte`,
  `Propos inappropriés`,
  `Ne respecte pas le code de conduite`,
  `Autres`,
];

export default class SignalerUtilisateur extends Component {
  constructor(props) {
    super(props);
    this.scrollViewRef = React.createRef();
    this.state = {
      raison: '',
      autreRaison: '',
      showAlert: false,
      title: '',
      message: '',
      spinner: false,
    };
  }

  hideAlert = () => {
    const {navigation} = this.props;
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
    navigation.goBack();
  };

  RaisonButton = (text) => {
    const {raison} = this.state;
    return (
      <Button
        icon={text === raison ? 'check' : null}
        style={styles.genderButton}
        mode="contained"
        color={colors.blue}
        labelStyle={{color: 'white', textTransform: 'none'}}
        contentStyle={styles.genderButtonContent}
        onPress={() => this.setState({raison: text})}>
        {text}
      </Button>
    );
  };

  Content = () => {
    const {
      route: {
        params: {visitedProfile, type},
      },
    } = this.props;
    const {pro, user} = this.context;
    const {raison, autreRaison} = this.state;
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
    const finalRaisons = type === 'user' ? raisons : raisonEvents;
    return (
      <ScrollView
        ref={(scrollViewRef) => {
          this.scrollViewRef = scrollViewRef;
        }}>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={keyboardVerticalOffset}>
          <Text style={styles.headerColMidText}>
            Pourriez-vous nous indiquer quel est le problème rencontré?
          </Text>
          {finalRaisons.map((r) => this.RaisonButton(r))}
          {raison === 'Autres' && (
            <TextInput
              multiline
              maxLength={50}
              value={autreRaison}
              onChangeText={(text) => this.setState({autreRaison: text})}
              style={styles.input}
            />
          )}
          <Button
            style={{
              marginTop: h(10),
              alignSelf: 'center',
              width: w(50),
              marginVertical: h(3),
              backgroundColor: pro ? colors.proBlue : colors.brown,
            }}
            mode="contained"
            onPress={() => {
              if (raison === '') {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_signal_reason_title,
                  message: texts.invalid_signal_reason_text,
                });
                return false;
              }
              this.setState({spinner: true});
              const finalRaison = raison === 'Autres' ? autreRaison : raison;
              createSignal(user.token, visitedProfile._id, finalRaison, type)
                .then((response) => {
                  const {
                    data: {message},
                  } = response;
                  console.log(message);
                  this.setState({spinner: false, showAlert: true, title: 'Succès', message});
                })
                .catch((err) => {
                  this.setState({
                    spinner: false,
                    showAlert: true,
                    title: texts.invalid_login_server_error_title,
                    message: texts.invalid_login_server_error_text,
                  });
                });
            }}>
            Soumettre
          </Button>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      context: {pro},
      state: {showAlert, message, title, spinner},
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
              this.hideAlert(navigation, pro);
            }}
            onDismiss={() => {
              this.hideAlert(navigation, pro);
            }}
          />
        </MainComponent>
      </>
    );
  }
}

SignalerUtilisateur.contextType = NoobaContext;
