/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Modal as ReactModal,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import moment from 'moment';
import {Button as PaperButton} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import Modal from 'react-native-modal';
import ModalDropdown from 'react-native-modal-dropdown';
import Geolocation from '@react-native-community/geolocation';

import AsyncStorage from '@react-native-community/async-storage';
import Icon2 from 'react-native-vector-icons/Feather';

import colors from '../../constant/colors';
import GlobalRender from '../main/GlobalRender';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import {updateProfileData} from '../../provider/authentification';
import GlobalFunction from '../../GlobleFun/GlobalFunction';
import {GeolocationState, ModalMapView} from '../../GlobleFun/GeoLocalisation';
import texts from '../../constant/texts';

moment.locale('fr');

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
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
  settingView: {
    height: h(5),
    marginVertical: h(1),
    paddingVertical: h(0.5),
    paddingHorizontal: w(2),
    borderWidth: 0.5,
    borderColor: 'white',
    marginHorizontal: w(2),
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.prenomR = React.createRef();
    this.mapRef = React.createRef();
    this.tvaEtablissementR = React.createRef();
    this.adresseEtablissementR = React.createRef();
    this.dropdownRef = React.createRef();
    this.state = {
      // Particulier
      showAlert: false,
      title: '',
      message: '',
      prenom: 'Kelly',
      prenomEnabled: false,
      dob: new Date(),
      dobEnabled: false,
      sexe: 'femme',
      sexeEnabled: false,
      locality: 'Namur',
      localityEnabled: false,
      langue: 'Français',
      langueEnabled: false,
      isIOSDateModalVisible: false,

      nomEtablissement: 'La Roma Restaurant',
      nomEtablissementEnabled: false,

      tvaEtablissement: '234.555666.77',
      tvaEtablissementEnabled: false,
      localityEtablissement: 'Namur',
      localityEtablissementEnabled: false,
      latitude: 50.854954,
      longitude: 4.30535,
      marker: {latitude: 50.854954, longitude: 4.30535},
      region: '',
    };
  }

  componentDidMount() {
    const {
      context: {user, pro},
    } = this;
    let dob = new Date();
    if (user.dob !== undefined) dob = new Date(user.dob);
    let locality = '';
    if (user.locality !== undefined) locality = user.locality.localisation;
    if (pro) {
      let proAdresse = '';
      if (user.address !== undefined) proAdresse = user.address.localisation;
      this.setState({
        nomEtablissement: user.nameEtablissement,
        tvaEtablissement: user.tvaNumber,
        localityEtablissement: proAdresse,
      });
    } else {
      this.setState({prenom: user.name, dob, sexe: user.gender, locality});
    }

    Geolocation.getCurrentPosition((info) => {
      const {
        coords: {latitude, longitude},
      } = info;

      this.setState({latitude, longitude, marker: {latitude, longitude}});
    });
  }

  updateProfile = (object) => {
    const {
      context: {user, setUser},
    } = this;
    updateProfileData(object, user.token).then(async (response) => {
      const Newuser = response.data.result;
      Newuser.token = user.token;
      await AsyncStorage.setItem('user', JSON.stringify(Newuser));
      setUser(Newuser);
    });
  };

  Geolocation = async (latitude1, longitude1) => {
    await GeolocationState(latitude1, longitude1, false).then((res) => {
      const {address, latitude, longitude} = res;
      this.setState({
        locality: address,
        region: address,
        latitude,
        longitude,
      });
      const locality2 = {
        localisation: address,
        longitude,
        latitude,
      };
      this.updateProfile({locality: locality2, type: 4});
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

  Modal = (showMap) => {
    const {latitude, longitude, marker} = this.state;
    return (
      <ReactModal style={styles.container} animationType="slide" visible={showMap}>
        <ModalMapView
          setMarker={this.setMarker}
          setPosition={this.setPosition}
          Geolocation1={this.Geolocation}
          setModalVisible={() =>
            this.setState({localityEnabled: false, localityEtablissementEnabled: false})
          }
          longitude={longitude}
          latitude={latitude}
          marker={marker}
        />
      </ReactModal>
    );
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  onChange = (event, selectedDate) => {
    const {date} = this.state;
    const newDate = selectedDate || date;
    if (selectedDate !== undefined) {
      if (Platform.OS === 'android') {
        const years = moment().diff(newDate, 'years');
        if (years > 18) {
          this.setState({dob: newDate, dobEnabled: false});
          this.updateProfile({dob: newDate, type: 2});
        } else {
          console.log('years', years);
          this.setState({
            showAlert: true,
            title: texts.invalid_Birth18_title,
            message: texts.invalid_Birth18_text,
          });
        }
      } else {
        console.log({newDate});
        this.setState({dob: newDate, dobEnabled: false});
      }
    }

    // Here
  };

  renderSettings = (label, value, enable, editableChange, textChange, ref, close) => {
    const {dobEnabled} = this.state;
    let icon = null;
    if (enable)
      icon = (
        <TouchableOpacity style={{alignSelf: 'center', marginLeft: w(3)}} onPress={close}>
          <Icon2 name="x-circle" size={20} style={{alignSelf: 'center'}} color="white" />
        </TouchableOpacity>
      );
    switch (ref) {
      case 1:
        return (
          <View style={styles.settingView}>
            <Text style={{color: 'white'}}>{label}</Text>
            <View
              style={{
                flexDirection: 'row',
                // flexWrap: 'wrap',
              }}>
              {enable ? (
                <TextInput
                  onChangeText={textChange}
                  style={{
                    color: 'white',
                    height: h(5),
                    width: w(28),
                    marginRight: w(3),
                    textAlign: 'right',
                  }}
                  maxLength={30}
                  value={value}
                  ref={(input) => {
                    this.prenomR = input;
                  }}
                />
              ) : (
                <Text
                  style={{
                    color: 'white',
                    // height: '100%',
                    // marginRight: w(3),
                  }}
                  value={value}
                  ref={(input) => {
                    this.prenomR = input;
                  }}>
                  {value}
                </Text>
              )}
              <TouchableOpacity style={{alignSelf: 'center'}} onPress={editableChange}>
                <Icon2
                  name={GlobalFunction.Choose(enable, 'check-circle', 'settings')}
                  size={20}
                  style={{alignSelf: 'center', marginLeft: w(3)}}
                  color="white"
                />
              </TouchableOpacity>
              {icon}
            </View>
          </View>
        );

      case 2: {
        return (
          <View style={styles.settingView}>
            {dobEnabled && (
              <DateTimePicker
                testID="dateTimePicker"
                value={value}
                is24Hour
                display="default"
                onChange={this.onChange}
              />
            )}
            <Text style={{color: 'white'}}>{label}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              <TextInput
                editable={false}
                onChangeText={textChange}
                style={{
                  color: 'white',
                  height: '100%',
                  marginRight: w(3),
                }}
                value={moment(value).format('D MMMM YYYY')}

                // editable={enable}
              />
              <TouchableOpacity style={{alignSelf: 'center'}} onPress={editableChange}>
                <Icon2
                  name={GlobalFunction.Choose(enable, 'check-circle', 'settings')}
                  size={20}
                  style={{alignSelf: 'center'}}
                  color="white"
                />
              </TouchableOpacity>
              {icon}
            </View>
          </View>
        );
      }

      case 3:
        return (
          <View style={styles.settingView}>
            <Text style={{color: 'white'}}>{label}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {enable ? (
                <>
                  <ModalDropdown
                    ref={(dropdownRef) => {
                      this.dropdownRef = dropdownRef;
                    }}
                    defaultValue="Vous êtes :"
                    options={['homme', 'femme', 'Autre']}
                    style={{
                      height: '100%',
                      width: w(25),

                      backgroundColor: '#0b232f',

                      color: 'white',
                    }}
                    dropdownTextStyle={{
                      height: h(7),
                      width: w(25),
                      color: 'black',
                    }}
                    textStyle={{
                      color: 'white',
                      fontSize: totalSize(1.4),
                      textAlign: 'left',
                      textTransform: 'uppercase',
                    }}
                    onSelect={(itemPos) => {
                      const {sexeEnabled} = this.state;
                      let item = '';
                      switch (itemPos) {
                        case 0:
                          item = 'homme';
                          break;
                        case 1:
                          item = 'femme';
                          break;
                        case 2:
                          item = 'Autre';
                          break;

                        default:
                          break;
                      }

                      this.setState({
                        sexe: item,
                        sexeEnabled: !sexeEnabled,
                      });
                      this.updateProfile({gender: item, type: 3});
                    }}
                  />
                </>
              ) : (
                <TextInput
                  editable={false}
                  onChangeText={textChange}
                  style={{
                    color: 'white',
                    height: '100%',
                    marginRight: w(3),
                    textTransform: 'uppercase',
                  }}
                  value={value}

                  // editable={enable}
                />
              )}
              {!enable && (
                <TouchableOpacity style={{alignSelf: 'center'}} onPress={editableChange}>
                  <Icon2 name="settings" size={20} style={{alignSelf: 'center'}} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.settingView}>
            <Text style={{color: 'white'}}>{label}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              <TextInput
                editable={false}
                onChangeText={textChange}
                style={{
                  color: 'white',
                  height: '100%',
                  marginRight: w(3),
                }}
                value={value}
              />
              <TouchableOpacity style={{alignSelf: 'center'}} onPress={editableChange}>
                <Icon2
                  name={GlobalFunction.Choose(enable, 'check', 'settings')}
                  size={20}
                  style={{alignSelf: 'center'}}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            {this.Modal(enable)}
          </View>
        );
      case 7:
        return (
          <View style={styles.settingView}>
            <Text style={{color: 'white'}}>{label}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              <TextInput
                editable={enable}
                onChangeText={textChange}
                style={{
                  color: 'white',
                  height: h(5),
                  width: w(28),
                  marginRight: w(3),
                  textAlign: 'right',
                }}
                maxLength={30}
                value={value}
                ref={(input) => {
                  this.tvaEtablissementR = input;
                }}
              />
              <TouchableOpacity style={{alignSelf: 'center'}} onPress={editableChange}>
                <Icon2
                  name={GlobalFunction.Choose(enable, 'check-circle', 'settings')}
                  size={20}
                  style={{alignSelf: 'center'}}
                  color="white"
                />
              </TouchableOpacity>
              {icon}
            </View>
          </View>
        );

      case 8:
        return (
          <View style={styles.settingView}>
            <Text style={{color: 'white'}}>{label}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              <TextInput
                editable={enable}
                onChangeText={textChange}
                style={{
                  color: 'white',
                  height: '100%',
                  marginRight: w(3),
                }}
                value={value}
                ref={(input) => {
                  this.adresseEtablissementR = input;
                }}
              />
              <TouchableOpacity style={{alignSelf: 'center'}} onPress={editableChange}>
                <Icon2
                  name={GlobalFunction.Choose(enable, 'check-circle', 'settings')}
                  size={20}
                  style={{alignSelf: 'center'}}
                  color="white"
                />
              </TouchableOpacity>
              {icon}
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.settingView}>
            <Text style={{color: 'white'}}>{label}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              <TextInput
                editable={false}
                onChangeText={textChange}
                style={{
                  color: 'white',
                  height: '100%',
                  marginRight: w(3),
                }}
                value={value}
                ref={(input) => {
                  switch (ref) {
                    case 1:
                      this.prenomR = input;
                      break;
                    case 2:
                      this.DobR = input;
                      break;

                    case 4:
                      this.localityR = input;
                      break;
                    case 5:
                      this.langueR = input;
                      break;
                    case 6:
                      this.adresseR = input;
                      break;
                    case 7:
                      this.tvaEtablissementR = input;
                      break;
                    case 8:
                      this.adresseEtablissementR = input;
                      break;

                    default:
                      break;
                  }
                }}
                // editable={enable}
              />
              <TouchableOpacity style={{alignSelf: 'center'}} onPress={editableChange}>
                <Icon2
                  name={GlobalFunction.Choose(enable, 'check', 'settings')}
                  size={20}
                  style={{alignSelf: 'center'}}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  Particulier = () => {
    const {
      prenom,
      prenomEnabled,
      dob,
      dobEnabled,
      sexe,
      sexeEnabled,
      locality,
      localityEnabled,
      langue,
      langueEnabled,
      region,
      latitude,
      longitude,
      isIOSDateModalVisible,
    } = this.state;
    const {navigation} = this.props;
    const {
      context: {user},
    } = this;

    return (
      <View>
        {this.renderSettings(
          'Prénom',
          prenom,
          prenomEnabled,
          () => {
            if (!prenomEnabled) {
              this.prenomR.focus();
              this.setState({prenomEnabled: !prenomEnabled});
            } else {
              this.setState({prenomEnabled: !prenomEnabled});
              this.updateProfile({name: prenom, type: 1});
            }
          },
          (text) => {
            if (prenomEnabled) {
              // Here
            }
            this.setState({prenom: text, prenomEnabled: true});
          },
          1,
          () => this.setState({prenom: user.name, prenomEnabled: false}),
        )}
        {this.renderSettings(
          'Date de naissance',
          new Date(user.dob),
          dobEnabled,
          () => {
            if (Platform.OS === 'android') {
              this.setState({dobEnabled: !dobEnabled});
            } else {
              this.setState({isIOSDateModalVisible: !isIOSDateModalVisible});
            }
          },
          () => {
            this.updateProfile({dob, type: 2});
          },
          2,
          () => this.setState({dobEnabled: false}),
        )}
        {this.renderSettings(
          'Sexe',
          sexe,
          sexeEnabled,
          () => {
            this.setState({sexeEnabled: !sexeEnabled});
            setTimeout(() => this.dropdownRef.show(), 100);
          },
          (text) => {
            console.log(text);
            this.updateProfile({gender: sexe, type: 2});
          },
          3,
          () => this.setState({sexeEnabled: false}),
        )}
        {this.renderSettings(
          'Localité',
          locality,
          localityEnabled,
          () => {
            this.setState({localityEnabled: !localityEnabled});
          },
          (text) => {
            const locality2 = {
              locality,
              longitude,
              latitude,
            };
            console.log(text);
            this.updateProfile({locality: locality2, region, type: 2});
          },
          4,
          () => this.setState({localityEnabled: false}),
        )}
        {this.renderSettings(
          'Langue',
          langue,
          langueEnabled,
          () => {
            this.setState({langueEnabled: !langueEnabled});
          },
          (text) => {
            this.setState({langue: text});
          },
          5,
          () => this.setState({langueEnabled: false}),
        )}
        <View style={styles.settingView}>
          <Text style={{color: 'white'}}>Se désinscrire</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => {
                navigation.navigate('Desinscrire');
              }}>
              <Icon2 name="settings" size={20} style={{alignSelf: 'center'}} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.settingView}>
          <Text style={{color: 'white'}}>Modifier mot de passe</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => {
                navigation.navigate('ChangeUserPassword', {pro: false});
              }}>
              <Icon2 name="settings" size={20} style={{alignSelf: 'center'}} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          isVisible={isIOSDateModalVisible}
          onBackdropPress={() => this.setState({isIOSDateModalVisible: false})}>
          <View
            style={{
              backgroundColor: colors.blue,
              height: h(40),
              borderRadius: 50,
              justifyContent: 'center',
            }}>
            <DateTimePicker
              testID="dateTimePicker"
              textColor="white"
              value={dob}
              maximumDate={new Date()}
              is24Hour
              display="spinner"
              locale="fr-FR"
              mode="date"
              onChange={this.onChange}
            />
            <PaperButton
              color="white"
              mode="text"
              labelStyle={{fontSize: totalSize(3)}}
              onPress={() => {
                const years = moment().diff(dob, 'years');
                console.log({years});
                if (years > 18) {
                  this.setState({dobEnabled: false, isIOSDateModalVisible: false});
                  this.updateProfile({dob, type: 2});
                } else {
                  console.log('no');
                  this.setState({
                    isIOSDateModalVisible: false,
                  });
                  setTimeout(() => {
                    this.setState({
                      showAlert: true,
                      title: texts.invalid_Birth18_title,
                      message: texts.invalid_Birth18_text,
                      dob: user.dob,
                    });
                  }, 500);
                }
              }}>
              ENREGISTRER
            </PaperButton>
          </View>
        </Modal>
      </View>
    );
  };

  Professional = () => {
    const {
      nomEtablissement,
      nomEtablissementEnabled,
      // adresseEtablissement,
      // adresseEtablissementEnabled,
      tvaEtablissement,
      tvaEtablissementEnabled,
      localityEtablissement,
      localityEtablissementEnabled,
      langue,
      langueEnabled,
    } = this.state;
    const {navigation} = this.props;
    const {
      context: {user},
    } = this;
    return (
      <View>
        {this.renderSettings(
          'Nom établissement',
          nomEtablissement,
          nomEtablissementEnabled,
          () => {
            if (!nomEtablissementEnabled) {
              this.setState({nomEtablissementEnabled: !nomEtablissementEnabled});
            } else {
              this.setState({nomEtablissementEnabled: !nomEtablissementEnabled});
              this.updateProfile({nomEtablissement, type: 7});
            }
          },
          (text) => {
            if (nomEtablissementEnabled) {
              // Here
            }
            this.setState({nomEtablissement: text, nomEtablissementEnabled: true});
          },
          8,
          () =>
            this.setState({
              nomEtablissementEnabled: false,
              nomEtablissement: user.nameEtablissement,
            }),
        )}

        {this.renderSettings(
          'TVA',
          tvaEtablissement,
          tvaEtablissementEnabled,
          () => {
            this.setState({tvaEtablissementEnabled: !tvaEtablissementEnabled});
            if (!tvaEtablissementEnabled) {
              this.setState({tvaEtablissementEnabled: !tvaEtablissementEnabled});
            } else {
              this.setState({tvaEtablissementEnabled: !tvaEtablissementEnabled});
              this.updateProfile({tva: tvaEtablissement, type: 8});
            }
          },
          (text) => {
            this.setState({tvaEtablissement: text});
          },
          7,
          () => this.setState({tvaEtablissementEnabled: false}),
        )}
        {this.renderSettings(
          'Localité',
          localityEtablissement,
          localityEtablissementEnabled,
          () => {
            this.setState({localityEtablissementEnabled: !localityEtablissementEnabled});
          },
          (text) => {
            console.log(text);
            this.updateProfile({locality: locality2, region, type: 2});
          },
          4,
          () => this.setState({localityEtablissement: false}),
        )}
        {this.renderSettings(
          'Langue',
          langue,
          langueEnabled,
          () => {
            this.setState({langueEnabled: !langueEnabled});
          },
          (text) => {
            this.setState({langue: text});
          },
          5,
          () => this.setState({langueEnabled: false}),
        )}
        <View style={styles.settingView}>
          <Text style={{color: 'white'}}>Se désinscrire</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => {
                navigation.navigate('Desinscrire');
              }}>
              <Icon2 name="settings" size={20} style={{alignSelf: 'center'}} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.settingView}>
          <Text style={{color: 'white'}}>Modifier mot de passe</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => {
                navigation.navigate('ChangeUserPassword', {pro: true});
              }}>
              <Icon2 name="settings" size={20} style={{alignSelf: 'center'}} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  Content = () => {
    const {
      context: {pro},
    } = this;
    return (
      <ScrollView keyboardShouldPersistTaps="always" style={{marginBottom: h(10)}}>
        <Text style={styles.headerColMidText}>Mon Compte</Text>
        {pro ? this.Professional() : this.Particulier()}
      </ScrollView>
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
        type={4}
        Content={() => this.Content()}
        hideAlert={() => this.hideAlert()}
      />
    );
  }
}

Account.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Account.contextType = NoobaContext;
