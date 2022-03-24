import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

import colors from '../../../constant/colors';
import HeaderComponent from '../../landingComponents/HeaderComponent';
import MainComponent from '../../landingComponents/MainComponent';
import SuivantBtn from '../../landingComponents/SuivantBtn';
import {h, totalSize, w} from '../../../tools/Dimensions';
import stylesGlobal from './stylesGlobal';
import {IsProUserEnabled} from '../../../provider/authentification';

import {NoobaContext} from '../../../provider/provider';

const styles = StyleSheet.create({
  iconContainer: {justifyContent: 'center', alignSelf: 'center', marginTop: h(5)},
  centerText: {
    marginTop: h(5),
    marginHorizontal: w(2),
    textAlign: 'center',
    color: 'white',
    fontSize: totalSize(2),
    marginLeft: w(5),
    marginRight: w(5),
  },
});

export default class AttendreConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
    };
  }

  componentDidMount() {
    const {route, navigation} = this.props;
    const {params} = route;
    const {setUser} = this.context;
    const token = params !== undefined ? params.token : 'token';
    const firstTime = params !== undefined ? params.firstTime : true;
    const user = params !== undefined ? params.user : {};
    navigation.addListener('beforeRemove', async (e) => {
      e.preventDefault();
    });
    if (!firstTime) {
      this.setState({spinner: true});
      IsProUserEnabled(token).then(async (response) => {
        const {data} = response;
        if (data.enabled) {
          user.isEnabled = true;
          await AsyncStorage.setItem('user', JSON.stringify(user));
          setUser(user);
          navigation.navigate('Profil', {
            user,
            pro: true,
            token: user.token,
          });
          this.setState({spinner: false});
        }
        this.setState({spinner: false});
      });
    }
  }

  Content = () => {
    return (
      <>
        <View style={stylesGlobal.mainContainer}>
          <Text style={stylesGlobal.mainText}>Inscription</Text>
          <View style={styles.iconContainer}>
            <Icon name="check-square-o" size={60} color="white" />
          </View>

          <Text style={styles.centerText}>
            Merci pour votre demande d'inscription ! Nous procédons à la vérification de votre
            compte et vous informerons par e-mail quand vous pourrez accéder à celui-ci
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SuivantBtn
            text="Se Déconnecter"
            bgColor={colors.proBlue}
            onPress={async () => {
              const keys = await AsyncStorage.getAllKeys();
              await AsyncStorage.multiRemove(keys);
              RNRestart.Restart();
            }}
          />
        </View>
      </>
    );
  };

  render() {
    const {navigation} = this.props;
    const {spinner} = this.state;
    return (
      <>
        <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
        <MainComponent bgColor={colors.proBlue}>
          <HeaderComponent
            navigation={navigation}
            height={22}
            showBackButton={false}
            showSubTitle
            showHeaderText
            bgColor={colors.proBlue}
          />
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

AttendreConfirmation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
      firstTime: PropTypes.bool.isRequired,
      user: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

AttendreConfirmation.contextType = NoobaContext;
