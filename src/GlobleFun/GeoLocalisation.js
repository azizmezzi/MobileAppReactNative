/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, {useRef} from 'react';
import {Platform, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import Geocoder from 'react-native-geocoding';
import MapView, {Marker} from 'react-native-maps';
import {Button as PaperButton} from 'react-native-paper';
import texts from '../constant/texts';

import {h, w} from '../tools/Dimensions';

export const GeolocationState = async (latitude, longitude, type) => {
  return new Promise(async (resolve, reject) => {
    const json = await Geocoder.from(latitude, longitude);
    console.log(json.results[0].address_components);
    const googleLocality = json.results[0].address_components.filter((adr) =>
      adr.types.includes('locality'),
    );
    const googleSubLocality = json.results[0].address_components.filter((adr) =>
      adr.types.includes('sublocality'),
    );
    if (googleLocality === undefined) reject('error');
    if (googleLocality.length === 0 && googleSubLocality[0] === undefined) reject('error');
    const finalRegion =
      googleLocality.length > 0 ? googleLocality[0].long_name : googleSubLocality[0].long_name;

    console.log({address: finalRegion, latitude, longitude});
    setTimeout(
      () => {
        if (type)
          resolve({
            lieu: json.results[0].formatted_address,
            region: finalRegion,
            latitude,
            longitude,
          });
        resolve({address: finalRegion, latitude, longitude});
      },
      Platform.OS === 'ios' ? 2000 : 100,
    );
  });
};

export const ModalMapView = (props) => {
  const {setMarker, setPosition, latitude, longitude, marker, setModalVisible, Geolocation1} =
    props;
  const mapRef = useRef(null);

  return (
    <>
      <View
        style={{
          position: 'absolute',
          width: w(100),
          top: h(8),
          zIndex: 1,
        }}>
        <View style={{flexDirection: 'row'}}>
          <GooglePlacesAutocomplete
            placeholder="Recherche"
            fetchDetails
            onPress={(data, details = null) => {
              const {
                geometry: {
                  location: {lat, lng},
                },
              } = details;
              setPosition(lat, lng);
              mapRef.current.animateToRegion(
                {
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
                1000,
              );
            }}
            query={{
              key: texts.google_maps_API_key,
              language: 'fr',
            }}
          />
        </View>
      </View>
      <MapView
        ref={mapRef}
        style={{flex: 1}}
        showsUserLocation
        followsUserLocation
        showsMyLocationButton
        showsPointsOfInterest
        showsCompass
        onPress={(e) => {
          setMarker(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
        }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker coordinate={marker} />
      </MapView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: h(2),
        }}>
        <PaperButton
          mode="contained"
          color="green"
          style={{width: w(49)}}
          onPress={() => {
            setModalVisible(false);
            Geolocation1(marker.latitude, marker.longitude);
          }}>
          Go!
        </PaperButton>
        <PaperButton
          mode="contained"
          color="red"
          style={{width: w(50)}}
          onPress={() => {
            setModalVisible(false);
          }}>
          Fermer
        </PaperButton>
      </View>
    </>
  );
};
