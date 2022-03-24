import React, {Component} from 'react';
import {Text, Keyboard, Modal, View} from 'react-native';
import PropTypes from 'prop-types';
import AwesomeAlert from 'react-native-awesome-alerts';
import {TextInput} from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';

import colors from '../../../constant/colors';
import HeaderComponent from '../../landingComponents/HeaderComponent';
import MainComponent from '../../landingComponents/MainComponent';
import SuivantBtn from '../../landingComponents/SuivantBtn';
import texts from '../../../constant/texts';
import stylesGlobal from './stylesGlobal';
import {GeolocationState, ModalMapView} from '../../../GlobleFun/GeoLocalisation';

export default class AddressPostal extends Component {
  constructor(props) {
    super(props);
    // this.textInputRef = React.createRef();
    this.state = {
      address: '',
      // codePostal: '',

      modalVisible: false,
      latitude: 50.854954,
      longitude: 4.30535,
      marker: {latitude: 50.854954, longitude: 4.30535},

      showAlert: false,
      showSuivantBtn: true,
    };
  }

  componentDidMount() {
    Geolocation.getCurrentPosition((info) => {
      const {
        coords: {latitude, longitude},
      } = info;
      this.Geolocation(latitude, longitude);
      this.setState({latitude, longitude, marker: {latitude, longitude}});
    });
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.setState({showSuivantBtn: true});
      // this.textInputRef.blur();
    });
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  // Geolocation = (latitude, longitude) => {
  //   Geocoder.from(latitude, longitude)
  //     .then((json) => {
  //       const googleLocality = json.results[0].address_components.filter((adr) =>
  //         adr.types.includes('locality'),
  //       );
  //       const googleSubLocality = json.results[0].address_components.filter((adr) =>
  //         adr.types.includes('sublocality'),
  //       );
  //       const finalRegion =
  //         googleLocality.length > 0 ? googleLocality[0].long_name : googleSubLocality[0].long_name;

  //       this.setState({address: finalRegion, latitude, longitude});
  //     })
  //     .catch((error) => console.warn(error));
  // };

  Geolocation = async (latitude1, longitude1) => {
    await GeolocationState(latitude1, longitude1, false).then((res) => {
      const {address, latitude, longitude} = res;
      this.setState({
        address,
        latitude,
        longitude,
      });
    });
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  setPosition = (lat, lng) => {
    this.setState({
      marker: {
        latitude: lat,
        longitude: lng,
      },
      latitude: lat,
      longitude: lng,
    });
  };

  setMarker = (latitude, longitude) => {
    this.setState({
      marker: {
        latitude,
        longitude,
      },
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  Content = () => {
    const {navigation, route} = this.props;
    const {params} = route;
    const {user} = params;
    const {
      address,
      latitude,

      modalVisible,
      longitude,
      marker,

      showSuivantBtn,
      // codePostal,
    } = this.state;
    return (
      <>
        <View style={stylesGlobal.mainContainer}>
          <Text style={stylesGlobal.mainText}>Inscription</Text>
          <Text style={stylesGlobal.questionText}>
            quelle est l&apos;adresse complète de votre etablissement ?
          </Text>
        </View>
        <Modal style={stylesGlobal.container} animationType="slide" visible={modalVisible}>
          <ModalMapView
            setMarker={this.setMarker}
            setPosition={this.setPosition}
            Geolocation1={this.Geolocation}
            setModalVisible={this.setModalVisible}
            longitude={longitude}
            latitude={latitude}
            marker={marker}
          />
        </Modal>

        <TextInput
          editable={false}
          mode="outlined"
          label="LOCALISATION"
          theme={{
            colors: {
              placeholder: 'white',
              text: 'white',
              primary: 'white',
              underlineColor: 'transparent',
              background: '#4f5356',
            },
          }}
          style={stylesGlobal.fieldStyle}
          value={address}
          onChangeText={(text) => this.setState({address: text})}
          right={
            <TextInput.Icon
              onPress={() => this.setModalVisible(true)}
              name="send"
              size={28}
              color="white"
            />
          }
        />

        {/* <TextInput
          ref={(tRef) => {
            this.textInputRef = tRef;
          }}
          onFocus={() => this.setState({showSuivantBtn: false})}
          onBlur={() => this.setState({showSuivantBtn: true})}
          mode="outlined"
          label="CODE POSTAL"
          theme={{
            colors: {
              placeholder: 'white',
              text: 'white',
              primary: 'white',
              underlineColor: 'transparent',
              background: '#4f5356',
            },
          }}
          style={stylesGlobal.fieldStyle}
          value={codePostal}
          onChangeText={(text) => this.setState({codePostal: text})}
        /> */}
        {showSuivantBtn ? (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <SuivantBtn
              bgColor={colors.proBlue}
              onPress={() => {
                if (address === '') {
                  this.setState({
                    showAlert: true,
                    title: texts.invalid_input_title,
                    message: texts.invalid_input_text,
                  });
                  return false;
                }
                user.address = {
                  localisation: address,
                  // codePostal,
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                };
                navigation.navigate('NumTva', {user});
                return true;
              }}
            />
          </View>
        ) : null}
      </>
    );
  };

  render() {
    const {showAlert, title, message} = this.state;
    const {navigation} = this.props;
    const bgColor = colors.proBlue;
    return (
      <>
        <MainComponent bgColor={bgColor}>
          <HeaderComponent
            navigation={navigation}
            height={22}
            showBackButton
            showHeaderText
            showSubTitle
            bgColor={bgColor}
          />
          {this.Content()}
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            message={message}
            title={title}
            closeOnTouchOutside
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton
            confirmText="OK"
            confirmButtonColor={bgColor}
            onConfirmPressed={() => {
              this.hideAlert();
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
AddressPostal.propTypes = {
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
        nameEtablissement: PropTypes.string.isRequired,
        address: PropTypes.string,
        city: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
