/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {Text, View, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import Geolocation from '@react-native-community/geolocation';

import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';

import {h, totalSize, w} from '../../tools/Dimensions';
import colors from '../../constant/colors';
import {GeolocationState, ModalMapView} from '../../GlobleFun/GeoLocalisation';

const styles = StyleSheet.create({
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  questionText: {
    marginTop: h(4),
    marginLeft: w(10),
    color: 'white',
    fontSize: totalSize(1.8),
    textTransform: 'uppercase',
  },
  questionText2: {
    marginTop: h(1),
    marginLeft: w(10),
    color: 'white',
    fontSize: totalSize(1.1),
  },
  fieldStyle: {
    marginTop: h(5),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    height: h(6),
  },
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default class Locality extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      modalVisible: false,
      latitude: 50.854954,
      longitude: 4.30535,
      marker: {latitude: 50.854954, longitude: 4.30535},

      showAlert: false,
      title: '',
      message: '',
    };
  }

  componentDidMount() {
    Geolocation.getCurrentPosition((info) => {
      const {
        coords: {latitude, longitude},
      } = info;
      const {changeLocality} = this.props;

      this.Geolocation(latitude, longitude, changeLocality);
      console.log({latitude, longitude, marker: {latitude, longitude}});
      this.setState({latitude, longitude, marker: {latitude, longitude}});
    });
  }

  Geolocation = async (latitude1, longitude1) => {
    const {changeLocality} = this.props;

    await GeolocationState(latitude1, longitude1, false).then((res) => {
      const {address, latitude, longitude} = res;
      changeLocality(address, latitude, longitude);
      this.setState({
        latitude,
        longitude,
      });
    });
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
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

  Content = () => {
    const {locality} = this.props;
    const {latitude, modalVisible, longitude, marker} = this.state;
    return (
      <>
        <Modal style={styles.container} animationType="slide" visible={modalVisible}>
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
        <Text style={styles.questionText}>Quelle est votre localité ?</Text>
        <Text style={styles.questionText2}>
          Nous ne divulguerons jamais votre position sur l'application. Votre position servira
          uniquement à vous proposer des activités proches de chez vous.
        </Text>
        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              borderColor: 'white',
              borderWidth: 1,
              marginTop: h(5),
              backgroundColor: '#4f5356',
              marginHorizontal: w(10),
              height: h(6),
              width: w(80),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: w(1.5),
                paddingVertical: h(0.5),
                paddingHorizontal: w(1),
              }}>
              <IconMCI name="map-marker" size={30} color="white" />
              <Text style={{color: 'white', marginLeft: w(2), flex: 1}}>{locality}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  render() {
    const {showAlert, title, message} = this.state;
    return (
      <>
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
          confirmButtonColor={colors.brown}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
          onDismiss={() => {
            this.hideAlert();
          }}
        />
      </>
    );
  }
}
