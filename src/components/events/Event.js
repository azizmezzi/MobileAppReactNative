/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {
  // SafeAreaView,
  Modal as ReactModal,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  ImageBackground,
  TextInput as ReactTextInput,
  Platform,
  Linking,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import Geocoder from 'react-native-geocoding';
import CheckBox from '@react-native-community/checkbox';
import AwesomeAlert from 'react-native-awesome-alerts';
import Geolocation from '@react-native-community/geolocation';
import {Accordion} from 'native-base';
import {Button, Chip, TextInput, Searchbar, Avatar} from 'react-native-paper';
import leoProfanity from 'leo-profanity';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import IconFa from 'react-native-vector-icons/FontAwesome';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import Share from 'react-native-share';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, w, totalSize} from '../../tools/Dimensions';
import {LikeDislikeEvent, DeleteSavedEvent, AnnulerEvent, ModifEvent} from '../../provider/events';
import {NoobaContext} from '../../provider/provider';
import {getParticipant} from '../../provider/authentification';
import texts from '../../constant/texts';
import GlobalFunction from '../../GlobleFun/GlobalFunction';
import CentreInteretArray from '../../GlobleFun/CentreInteretArray';
import {ModalMapView} from '../../GlobleFun/GeoLocalisation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: w(100),
    height: h(100),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  mainBrownText: {
    marginTop: h(3),
    color: colors.brown,
    textTransform: 'uppercase',
    fontSize: totalSize(3),

    marginLeft: w(3),
    fontWeight: 'bold',
  },
  iconstyle: {
    alignItems: 'center',
    width: w(50),
    height: h(13),
  },
  textStyle: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),

    width: w(40),
  },
  ButtonInscrit: (pro) => {
    return {
      marginTop: h(2),
      marginBottom: h(5),
      alignSelf: 'center',
      color: 'white',
      backgroundColor: GlobalFunction.Choose(pro, colors.proBlue, colors.brown),
      width: w(50),
    };
  },
  fieldStyle: {
    marginTop: h(2),
    marginHorizontal: w(10),
    height: h(20),
  },
  eventButton: {
    marginHorizontal: w(2),
    marginVertical: w(2),
    borderColor: 'white',
    borderRadius: 25,
  },
  eventButtonContent: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    height: h(6),
  },
  participantsLimitFieldStyle: {
    alignSelf: 'center',
    marginTop: h(5),
    backgroundColor: 'transparent',
    width: w(80),
    borderWidth: 1,
    borderColor: 'white',
    height: h(6.5),
    color: 'white',
    borderRadius: 20,
    textAlign: 'center',
    fontSize: totalSize(2.3),
    marginBottom: h(4),
  },
});

export default class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDate: false,
      showHeure: false,
      newDate: new Date(),
      isIOSDateModalVisible: false,
      isParticipating: false,
      isVisible: false,
      isDescriptionModalVisible: false,
      liked: -1,
      spinner: false,
      editName: false,
      newName: '',
      newDescription: '',
      showAlert: false,
      title: '',
      message: '',
      dataArray: [],
      showInterets: false,
      search: '',
      interests: [],
      isTypeAgeModalVisible: false,
      newType: '',
      ageCheckbox: false,
      newMinAge: 18,
      newMaxAge: 100,
      isParticipantsAllowedVisible: false,
      newParticipants: 0,
      latitude: 50.854954,
      longitude: 4.30535,
      marker: {latitude: 50.854954, longitude: 4.30535},
      lieu: "Lieu de l'évènement",
      region: '',
      showMap: false,
    };
  }

  async componentDidMount() {
    const jsonUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(jsonUser);
    const {pro, eventView} = this.context;
    this.setState({newDescription: eventView.description});
    const index = eventView.participants.findIndex((participant) => participant._id === user._id);
    const tempLiked =
      user.likedEvents !== undefined
        ? user.likedEvents.findIndex((x) => x.event === eventView._id)
        : -1;
    this.setState({
      liked: tempLiked,
      isParticipating: index > -1,
      newDescription: eventView.description,
    });
    const dataArray = CentreInteretArray(pro);
    dataArray.forEach((dataAr) => {
      dataAr.content.sort();
    });

    this.setState({dataArray});
    const {
      interests,
      maxAge,
      minAge,
      type,
      limit,
      place: {latitude: savedLatitude, longitude: savedLongitude},
      date,
    } = eventView;
    let state = false;
    if (minAge === 0) state = true;

    this.setState({
      interests,
      ageCheckbox: state,
      newMaxAge: maxAge === 100 ? 100 : maxAge,
      newMinAge: minAge === 0 ? 18 : minAge,
      newType: type,
      newParticipants: limit,
      marker: {latitude: parseFloat(savedLatitude, 10), longitude: parseFloat(savedLongitude, 10)},
      newDate: new Date(date),
    });
    Geolocation.getCurrentPosition((info) => {
      const {
        coords: {latitude, longitude},
      } = info;
      this.setState({latitude, longitude});
    });
  }

  Geolocation = (latitude, longitude) => {
    const {events, setEvents, user, eventView} = this.context;
    Geocoder.from(latitude, longitude)
      .then((json) => {
        const googleLocality = json.results[0].address_components.filter((adr) =>
          adr.types.includes('locality'),
        );
        const googleSubLocality = json.results[0].address_components.filter((adr) =>
          adr.types.includes('sublocality'),
        );
        const finalRegion =
          googleLocality.length > 0 ? googleLocality[0].long_name : googleSubLocality[0].long_name;
        this.setState({
          lieu: json.results[0].formatted_address,
          region: finalRegion,
          latitude,
          longitude,
        });
        const {lieu, region} = this.state;
        const newPlace = {
          region,
          localisation: lieu,
          longitude,
          latitude,
        };
        const index = events.findIndex((e) => e._id === eventView._id);
        if (index !== -1) {
          events[index].place = newPlace;
          setEvents(events);
        }

        ModifEvent(user.token, {
          eventId: eventView._id,
          number: 7,
          place: newPlace,
        })
          .then(() => {
            console.log('done');
          })
          .catch(() => {
            console.log('error');
          });
      })
      .catch((error) => console.warn(error));
  };

  onChangeDate = (event, selectedDate) => {
    const {newDate} = this.state;
    const d = selectedDate || newDate;
    this.setState({newDate: d, showDate: false, showHeure: true});
  };

  onChangeHour = (event, selectedDate) => {
    const {newDate} = this.state;
    const {user, events, setEvents, eventView} = this.context;

    const d = selectedDate || newDate;
    this.setState({newDate: d, showHeure: false});
    const index = events.findIndex((e) => e._id === eventView._id);
    if (index !== -1) {
      events[index].date = d;
      setEvents(events);
    }

    ModifEvent(user.token, {
      eventId: eventView._id,
      number: 3,
      date: d,
    })
      .then(() => {
        console.log('done');
      })
      .catch(() => {
        console.log('error');
      });
  };

  onIOSChangeTime = (event, selectedDate) => {
    const {newDate} = this.state;
    const d = selectedDate || newDate;
    this.setState({newDate: d});
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

  MapModal = () => {
    const {latitude, showMap, longitude, marker} = this.state;
    return (
      <ReactModal style={styles.container} animationType="slide" visible={showMap}>
        <ModalMapView
          setMarker={this.setMarker}
          setPosition={this.setPosition}
          Geolocation1={this.Geolocation}
          setModalVisible={() => this.setState({showMap: false})}
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

  share = (platform, event) => {
    let message = event.name;
    if (platform === Share.Social.EMAIL && Platform.OS === 'ios') {
      message = `${event.name}\n https://nooba.app/event/${event._id}`;
    }
    const shareOptions = {
      title: 'Share via',
      message,
      subject: `NOOBA - ${event.name}`,
      url: `https://nooba.app/event/${event._id}`,
      social: platform,
      filename: 'test',
    };

    Share.shareSingle(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  chipevent = (eventView) => {
    const {navigation} = this.props;
    return (
      <>
        {eventView.interests.map((item, index) => {
          return (
            <TouchableOpacity
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              onPress={() => {
                const filter = {
                  filterGender: {},
                  filterRegion: {},
                  motCle: '',
                  date1String: '',
                  date2String: '',
                  interests: item,
                };
                navigation.navigate('Marketplace', {filter});
              }}
              style={{
                margin: w(1),
              }}>
              <Chip
                mode="outlined"
                height={totalSize(3.3)}
                style={{
                  backgroundColor: colors.blue,
                  borderColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  margin: 0,
                }}
                textStyle={{color: 'white', fontSize: totalSize(1.8)}}>
                {item}
              </Chip>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  Chips = (eventView, eventDepassé) => {
    const {user} = this.context;
    return (
      <View
        style={{
          flexDirection: 'row',
          width: w(87),
        }}>
        <View
          style={{
            marginLeft: w(2),
            width: w(75.5),
            flexWrap: 'wrap',
            flex: 1,
            flexDirection: 'row',
            marginRight: w(5),
          }}>
          {this.chipevent(eventView)}
        </View>
        <View
          style={{
            width: w(8),
          }}>
          {eventView.creator === user._id && eventDepassé && (
            <IconEntypo
              name="edit"
              style={{alignSelf: 'center'}}
              size={18}
              color="white"
              onPress={() => this.setState({showInterets: true})}
            />
          )}
        </View>
      </View>
    );
  };

  composeData = (data) => {
    let target = [];
    const dataTosend = [];
    for (let i = 0; i < data.length; i += 1) {
      target.push(data[i]);
      if (target.length === 6 || data.length - 1 === i) {
        dataTosend.push(target);
        // eslint-disable-next-line no-param-reassign
        target = [];
      }
    }
    return dataTosend;
  };

  navigateProfile = (user, id, navigation) => {
    if (id !== user._id) {
      this.setState({spinner: true});
      getParticipant(user.token, id)
        .then((response) => {
          this.setState({spinner: false});
          const dataE = response.data;
          navigation.navigate('AnotherProfil', {user: dataE.user});
        })
        .catch((e) => console.log(e));
    } else navigation.navigate('Profil');
  };

  participantView = (participants, navigation, index) => {
    const {user} = this.context;
    return (
      <>
        <TouchableOpacity
          key={index}
          onPress={async () => {
            this.navigateProfile(user, participants._id, navigation);
            console.log(participants);
          }}
          style={{
            // flex: 1,
            marginTop: h(2),
            marginHorizontal: h(1),
            width: w(12),
            height: w(12),
            borderRadius: w(12) / 2,
            // backgroundColor: 'green',
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#47e01e', '#236ee0']}
            style={{
              flex: 1,
              width: w(12),
              height: w(12),
              borderRadius: w(12) / 2,
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Avatar.Image
              style={{}}
              size={w(10)}
              source={{
                uri:
                  participants.name === 'anonyme'
                    ? `http://18.130.184.230:3000/images/anonyme.png?t=${new Date()}`
                    : `http://18.130.184.230:3000/images/${participants._id}.png?t=${new Date()}`,
              }}
            />
          </LinearGradient>
        </TouchableOpacity>
      </>
    );
  };

  participantsView = (participants, navigation) => {
    const participantevent = participants.filter(
      (particip) => !particip.description && particip.name !== 'anonyme',
    );
    return (
      <View
        style={{
          marginLeft: w(3),
          marginBottom: h(2),
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}>
        {participantevent.map((participant, index) => {
          return this.participantView(participant, navigation, index);
        })}
      </View>
    );
  };

  renderSecondaryContent = (item) => {
    const {interests} = this.state;
    return (
      <View style={{flexWrap: 'wrap', flexDirection: 'row', marginLeft: w(5)}}>
        {item.map((interet) => (
          <View
            style={{
              margin: 5,
            }}>
            <Chip
              mode="flat"
              selectedColor="white"
              selected={interests.includes(interet)}
              height={totalSize(3.3)}
              onPress={() => {
                if (interests.includes(interet)) {
                  interests.splice(interests.indexOf(interet), 1);
                } else if (interests.length < 5) {
                  interests.push(interet);
                } else if (interests.length === 5) {
                  this.setState({
                    showAlert: true,
                    title: texts.invalid_event_interests_length_title,
                    message: texts.invalid_event_interests_length_text,
                  });
                }
                this.setState({interests});
              }}
              style={{
                backgroundColor: interests.includes(interet)
                  ? colors.brown
                  : 'rgba(220,220,220,0.2)',
                borderColor: 'white',
              }}
              textStyle={{color: 'white', fontSize: totalSize(2)}}>
              {interet}
            </Chip>
          </View>
        ))}
      </View>
    );
  };

  InteretsModal = (contextProps) => {
    const {dataArray, interests, search} = this.state;
    const {pro} = this.context;
    const {eventView} = contextProps;
    let finalArray = [];
    if (search === '') {
      finalArray = dataArray;
      const it = finalArray.find((item) => item.t !== undefined);
      if (it !== undefined) it.content = interests;
    } else {
      dataArray.forEach((el) => {
        const newObj = {title: el.title, content: []};
        el.content.forEach((c) => {
          if (c.toLowerCase().includes(search.toLowerCase(), 0)) {
            newObj.content.push(c);
          }
        });
        if (newObj.content.length !== 0) finalArray.push(newObj);
      });
    }
    return (
      <View style={{height: h(76)}}>
        <ScrollView>
          <Text style={styles.headerColMidText}>centres d&apos;intérêts</Text>
          <Searchbar
            style={{marginHorizontal: w(2), marginVertical: h(2)}}
            placeholder="Rechercher"
            value={search}
            onChangeText={(searchs) => {
              this.setState({search: searchs});
            }}
          />
          <Accordion
            dataArray={finalArray}
            expanded={0}
            renderContent={(data) => this.renderSecondaryContent(data.content)}
            headerStyle={{
              backgroundColor: colors.transparent,
              fontSize: totalSize(1.4),
            }}
            icon="arrow-down"
            iconStyle={{
              color: GlobalFunction.Choose(pro, colors.proBlue, colors.brown),
              marginRight: w(5),
            }}
            expandedIcon="arrow-up"
            expandedIconStyle={{
              color: GlobalFunction.Choose(pro, colors.proBlue, colors.brown),
              marginRight: w(5),
            }}
            style={{borderColor: colors.blue}}
          />
        </ScrollView>
        <Button
          color="white"
          mode="text"
          style={styles.ButtonInscrit(pro)}
          labelStyle={{fontSize: totalSize(2)}}
          onPress={() => {
            this.setState({showInterets: false});
            const {events, user, setEvents} = this.context;
            // eslint-disable-next-line eqeqeq
            const index = events.findIndex((e) => e._id == eventView._id);
            if (index !== -1) {
              events[index].interests = interests;
              setEvents(events);
            }

            ModifEvent(user.token, {
              eventId: eventView._id,
              number: 6,
              interests,
            })
              .then(() => {
                console.log('done');
              })
              .catch(() => {
                console.log('error');
              });
          }}>
          {`Valider (${interests.length})`}
        </Button>
      </View>
    );
  };

  EventTypeButton = (eventText, state) => {
    const {newType} = this.state;
    return (
      <Button
        icon={state === newType ? 'check' : null}
        labelStyle={{fontWeight: 'bold'}}
        style={styles.eventButton}
        mode="outlined"
        color="white"
        contentStyle={styles.eventButtonContent}
        labelStyle={{fontSize: totalSize(1.5)}}
        onPress={() => this.setState({newType: state})}>
        {eventText}
      </Button>
    );
  };

  openIosModalDate = () => {
    if (Platform.OS === 'android') {
      this.setState({showDate: true});
    } else {
      this.setState({isIOSDateModalVisible: true});
    }
  };

  InitialContent = (eventView, user) => {
    const {participants} = eventView;

    const finalParticipantsArray = participants.filter((e) => e.description === false);
    let desincriptionEvent = false;
    const part = participants.findIndex((x) => x._id === user._id);
    if (part > -1) {
      desincriptionEvent = participants[part].description;
    }
    const {
      context: {discussions},
    } = this;
    const discIndex = discussions.findIndex((discElement) => discElement.event === eventView._id);
    const listInscrit = eventView.participants.filter((par) => !par.description);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = moment(eventView.date);
    const dateEvent = new Date(eventView.date);
    const eventDepassé = dateEvent > today;
    const hasPassed = eventDate !== undefined ? moment() > eventDate : true;
    const eventName =
      listInscrit.length === eventView.limit
        ? `${eventView.name} - ${eventView.place.region} (Evènement complet)`
        : `${eventView.name} - ${eventView.place.region}`;
    return {
      finalParticipantsArray,
      desincriptionEvent,
      discIndex,
      tomorrow,
      eventDepassé,
      hasPassed,
      eventName,
      listInscrit,
    };
  };

  LikedEvent = async (events, eventView, user, liked, contextProps) => {
    const {navigation} = this.props;
    const {setEvents} = contextProps;
    if (eventView.valider) {
      if (liked !== -1) {
        user.likedEvents.splice(liked, 1);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        const {setUser} = this.context;
        setUser(user);
        this.setState({liked: -1});
      } else {
        user.likedEvents.push({event: eventView._id});
        await AsyncStorage.setItem('user', JSON.stringify(user));
        const {setUser} = this.context;
        setUser(user);
        this.setState({liked: user.likedEvents.length - 1});
      }
      LikeDislikeEvent(eventView._id, user.token).then(async (response) => {
        const {
          data: {
            result: {likedEvents},
          },
        } = response;
        console.log(likedEvents);
      });
    } else {
      const pos = events.findIndex((x) => x._id === eventView._id);
      if (pos > -1) {
        events.splice(pos, 1);
        setEvents(events);
        const {socket} = this.context;
        socket.emit('requestChats');
        DeleteSavedEvent(eventView._id, user.token);
        navigation.goBack();
      }
    }
  };

  UpdateEventDescription = (contextProps, newDescription) => {
    const {eventView, events, setEvents, user} = contextProps;

    if (leoProfanity.check(newDescription)) {
      this.setState({
        showAlert: true,
        title: texts.invalid_event_name_badwords_title,
        message: texts.invalid_event_name_badwords_text,
      });
      return false;
    }

    this.setState({isDescriptionModalVisible: false});
    // eslint-disable-next-line eqeqeq
    const index = events.findIndex((e) => e._id == eventView._id);
    if (index !== -1) {
      events[index].description = newDescription;
      setEvents(events);
    }

    ModifEvent(user.token, {
      eventId: eventView._id,
      number: 2,
      description: newDescription,
    })
      .then(() => {
        console.log('done');
      })
      .catch(() => {
        console.log('error');
      });
  };

  UpdateEventName = (contextProps, newName, editName) => {
    const {eventView, events, setEvents, user} = contextProps;

    if (leoProfanity.check(newName)) {
      this.setState({
        showAlert: true,
        title: texts.invalid_event_name_badwords_title,
        message: texts.invalid_event_name_badwords_text,
      });
      return false;
    }

    if (!editName) {
      this.setState({newName: eventView.name});
    } else {
      // const {events, setEvents} = this.context;
      // eslint-disable-next-line eqeqeq
      const index = events.findIndex((e) => e._id == eventView._id);
      if (index !== -1) {
        events[index].name = newName;
        setEvents(events);
      }
      ModifEvent(user.token, {
        eventId: eventView._id,
        number: 1,
        name: newName,
      })
        .then(() => {
          console.log('done');
        })
        .catch(() => {
          console.log('error');
        });
    }
    this.setState({editName: !editName});
  };

  UpdateEventLimit = (contextProps, newParticipants, listInscrit) => {
    const {eventView, events, setEvents, user} = contextProps;

    if (parseInt(newParticipants, 10) > listInscrit.length) {
      this.setState({isParticipantsAllowedVisible: false});

      // eslint-disable-next-line eqeqeq
      const index = events.findIndex((e) => e._id == eventView._id);
      if (index !== -1) {
        events[index].limit = newParticipants;
        setEvents(events);
      }
      ModifEvent(user.token, {
        eventId: eventView._id,
        number: 4,
        limit: newParticipants,
      })
        .then(() => {
          console.log('done');
        })
        .catch(() => {
          console.log('error');
        });
    }
  };

  UpdateEventDate = (contextProps, newDate) => {
    const {eventView, events, setEvents, user} = contextProps;

    this.setState({isIOSDateModalVisible: false});
    const index = events.findIndex((e) => e._id === eventView._id);
    if (index !== -1) {
      events[index].date = newDate;
      setEvents(events);
    }

    ModifEvent(user.token, {
      eventId: eventView._id,
      number: 3,
      date: newDate,
    })
      .then(() => {
        console.log('done');
      })
      .catch(() => {
        console.log('error');
      });
  };

  UpdateEventAgeMinMaxType = (contextProps, newMaxAge, newMinAge, newType) => {
    const {eventView, events, setEvents, user} = contextProps;

    this.setState({isTypeAgeModalVisible: false});
    // eslint-disable-next-line eqeqeq
    const index = events.findIndex((e) => e._id == eventView._id);
    if (index !== -1) {
      events[index].maxAge = newMaxAge;
      events[index].minAge = newMinAge;
      events[index].type = newType;
      setEvents(events);
    }
    ModifEvent(user.token, {
      eventId: eventView._id,
      number: 5,
      minAge: newMinAge,
      maxAge: newMaxAge,
      type: newType,
    })
      .then((data) => {
        console.log(data);
      })
      .catch((errorModif) => {
        console.log(errorModif);
      });
  };

  ShareFB = (eventView) => {
    const link = `https://nooba.app/event/${eventView._id}`;
    Linking.openURL(`fb-messenger://share?link=${link}`);
    /* const shareLinkContent = {
      contentType: 'link',
      contentUrl: `https://nooba.app/event/${eventView._id}`,
    };
    MessageDialog.canShow(shareLinkContent)
      .then((canShow) => {
        if (canShow) {
          return MessageDialog.show(shareLinkContent);
        }
        return false;
      })
      .then(
        (result) => {
          if (result.isCancelled) {
            console.log('Share cancelled');
          } else {
            console.log('Share success with postId: ');
          }
        },
        (error) => {
          console.log(`Share fail with error: ${error}`);
        },
      ); */
  };

  ButtonViewS = (contextProps) => {
    const {navigation} = this.props;
    const {eventView, user} = contextProps;
    const {discIndex} = this.InitialContent(eventView, user);
    const MsgPartage = (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{...styles.iconstyle, alignItems: 'center'}}
          onPress={() => {
            if (discIndex !== -1) navigation.navigate('Discussion', {discussionIndex: discIndex});
          }}>
          <View style={{height: h(7), alignContent: 'center'}}>
            <IconAntDesign color="white" size={h(5.5)} name="message1" />
          </View>

          <Text style={styles.textStyle}>Messagerie de l&apos;évènement</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({isVisible: true})} style={styles.iconstyle}>
          <View style={{height: h(7), alignContent: 'center'}}>
            <IconFa name="share-square-o" size={h(5.5)} color="white" />
          </View>
          <Text style={styles.textStyle}>Partager cet évènement</Text>
        </TouchableOpacity>
      </View>
    );

    const EventAnnulerView = (
      <View
        style={{
          marginHorizontal: w(5),
          marginVertical: h(3),
          height: h(5),
          backgroundColor: 'red',
          justifyContent: 'center',
        }}>
        <Text
          style={{textAlign: 'center', color: 'white', fontSize: totalSize(2), fontWeight: 'bold'}}
          // icon="calendar-check"
          mode="contained"
          color="green">
          Évènement annulé
        </Text>
      </View>
    );

    const SeDesincrirView = (
      <Button
        style={{marginHorizontal: w(5), marginVertical: h(3)}}
        labelStyle={{fontWeight: 'bold'}}
        onPress={() => {
          if (eventView.creator !== user._id) {
            navigation.navigate('Desincrir');
          }
        }}
        // icon="calendar-check"
        mode="contained"
        color="red">
        <IconMCI color="white" size={w(5)} name="calendar" />
        <Text> se désinscrire de l&apos;évènement</Text>
      </Button>
    );

    const PublierEVentView = (
      <Button
        style={{marginHorizontal: w(5), marginVertical: h(3)}}
        labelStyle={{fontWeight: 'bold'}}
        onPress={() => {
          navigation.navigate('Publier', {eventId: eventView._id, step: true});
        }}
        // icon="calendar-check"
        mode="contained"
        color="green">
        <IconMCI color="white" size={w(5)} name="calendar" />
        <Text> Publier l&apos;évènement</Text>
      </Button>
    );
    const AnnulerEventView = (
      <Button
        style={{marginHorizontal: w(5), marginVertical: h(3)}}
        labelStyle={{fontWeight: 'bold'}}
        onPress={() => {
          this.setState({
            showAlert: true,
            title: texts.annuler_event_confirmation_title,
            message: texts.annuler_event_confirmation_text,
          });
        }}
        // icon="calendar-check"
        mode="contained"
        color="red">
        <IconMCI color="white" size={w(5)} name="calendar" />
        <Text> Annuler l&apos;évènement</Text>
      </Button>
    );

    const EventCompletView = (
      <View
        style={{
          marginHorizontal: w(5),
          marginVertical: h(3),
          height: h(5),
          backgroundColor: 'red',
          justifyContent: 'center',
        }}>
        <Text
          style={{textAlign: 'center', color: 'white', fontSize: totalSize(2)}}
          mode="contained"
          color="green">
          Evènement complet
        </Text>
      </View>
    );

    const InsrirEventView = (
      <Button
        onPress={async () => {
          navigation.navigate('ValidParticipation');
        }}
        labelStyle={{fontWeight: 'bold'}}
        style={{marginHorizontal: w(5), marginVertical: h(3), fontSize: totalSize(2)}}
        // icon="calendar-check"
        mode="contained"
        color="green">
        <IconMCI color="white" size={w(5)} name="calendar" />
        <Text> S&apos;inscrire à l&apos;évènement</Text>
      </Button>
    );
    const DesincrirView = (
      <Button
        onPress={async () => {
          navigation.navigate('ValidParticipation');
        }}
        labelStyle={{fontWeight: 'bold'}}
        style={{marginHorizontal: w(5), marginVertical: h(3), fontSize: totalSize(2)}}
        // icon="calendar-check"
        mode="contained"
        color="green">
        <IconMCI color="white" size={w(5)} name="calendar" />
        <Text> S&apos;inscrire à l&apos;évènement</Text>
      </Button>
    );

    const EventDepasseView = (
      <Button
        style={{marginHorizontal: w(5), marginVertical: h(3)}}
        labelStyle={{fontWeight: 'bold'}}
        // icon="calendar-check"
        mode="contained"
        color="grey">
        <Text style={{color: 'white'}}>évènement passé</Text>
      </Button>
    );

    return {
      MsgPartage,
      EventAnnulerView,
      SeDesincrirView,
      PublierEVentView,
      AnnulerEventView,
      EventCompletView,
      InsrirEventView,
      DesincrirView,
      EventDepasseView,
    };
  };

  ButtonEvent = (contextProps) => {
    const {eventView, user} = contextProps;
    const {isParticipating} = this.state;
    const {desincriptionEvent, listInscrit} = this.InitialContent(eventView, user);
    const {
      MsgPartage,
      EventAnnulerView,
      SeDesincrirView,
      PublierEVentView,
      AnnulerEventView,
      EventCompletView,
      InsrirEventView,
      DesincrirView,
      EventDepasseView,
    } = this.ButtonViewS(contextProps);

    const {eventDepassé} = this.InitialContent(eventView, user);

    if (!eventDepassé) return EventDepasseView;

    if (eventView.creator === user._id) {
      // createur
      if (!eventView.valider) {
        // publier
        return PublierEVentView;
      }
      if (eventView.annuler) {
        // event annuler
        return EventAnnulerView;
      }
      // event à annuler
      return (
        <>
          {AnnulerEventView}
          {MsgPartage}
        </>
      );
    }
    if (isParticipating) {
      // participant a l'event
      if (desincriptionEvent) {
        // deja désinsrit
        console.log(eventView.participants);
        return DesincrirView;
      }
      // désinscrir
      return (
        <>
          {SeDesincrirView}
          {MsgPartage}
        </>
      );
    }
    if (listInscrit.length === eventView.limit) {
      // event complet
      return EventCompletView;
    }
    // inscription
    return InsrirEventView;
    // event annulé
  };

  Content = (contextProps) => {
    const {navigation} = this.props;
    const {eventView, events, user, pro} = contextProps;
    const {
      editName,
      newName,
      liked,
      isVisible,
      isDescriptionModalVisible,
      isIOSDateModalVisible,
      newDescription,
      isTypeAgeModalVisible,
      newType,
      ageCheckbox,
      newMinAge,
      newMaxAge,
      isParticipantsAllowedVisible,
      newParticipants,
      newDate,
      showDate,
      showHeure,
    } = this.state;
    const {participants} = eventView;
    const {finalParticipantsArray, tomorrow, eventDepassé, hasPassed, eventName, listInscrit} =
      this.InitialContent(eventView, user);

    return (
      <View style={{height: h(75)}}>
        {this.MapModal()}
        <Modal
          isVisible={isDescriptionModalVisible}
          onBackdropPress={() => this.setState({isDescriptionModalVisible: false})}>
          <View
            style={{
              backgroundColor: 'white',
              height: h(40),
              borderRadius: 50,
              justifyContent: 'center',
            }}>
            <TextInput
              mode="outlined"
              label="Description"
              multiline
              style={styles.fieldStyle}
              maxLength={500}
              value={newDescription}
              onChangeText={(text) => {
                this.setState({newDescription: text});
              }}
            />
            <Button
              color="white"
              mode="text"
              style={styles.ButtonInscrit(pro)}
              labelStyle={{fontSize: totalSize(1.75)}}
              onPress={() => this.UpdateEventDescription(contextProps, newDescription)}>
              ENREGISTRER
            </Button>
          </View>
        </Modal>
        <Modal isVisible={isVisible} onBackdropPress={() => this.setState({isVisible: false})}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: h(1),
              marginHorizontal: w(10),
              justifyContent: 'center',
              // justifyContent: 'space-between',
            }}>
            {/* <IconMCI
              onPress={() => {
                this.share(Share.Social.FACEBOOK, eventView);
              }}
              color="#3d5a98"
              size={35}
              name="facebook"
            /> 
            <IconMCI
              onPress={() => this.ShareFB(eventView)}
              color="#00b9ff"
              size={35}
              name="facebook-messenger"
            /> */}
            <IconMCI
              onPress={() => {
                this.share(Share.Social.WHATSAPP, eventView);
              }}
              color="green"
              size={35}
              name="whatsapp"
            />
            {/* <IconMCI
              onPress={() => {
                this.share(Share.Social.EMAIL, eventView);
              }}
              color="white"
              size={35}
              name="email-open-outline"
            /> */}
          </View>
        </Modal>
        <ScrollView>
          <Text style={styles.headerColMidText}>évènement</Text>
          <View
            style={{
              width: w(100),
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-around',
              marginTop: h(2),
            }}>
            <View style={{width: w(75)}}>
              {!editName ? (
                <Text
                  style={{
                    color: 'white',
                    fontSize: totalSize(2),

                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    marginLeft: w(2),
                  }}>
                  {eventName}
                </Text>
              ) : (
                <TextInput
                  style={{
                    width: w(50),
                    height: h(4),
                    backgroundColor: 'transparent',
                    color: 'green',
                  }}
                  theme={{
                    colors: {
                      placeholder: 'white',
                      text: 'white',
                      primary: 'white',
                      underlineColor: 'transparent',
                      background: '#4f5356',
                    },
                  }}
                  value={newName}
                  onChangeText={(text) => this.setState({newName: text})}
                />
              )}
            </View>
            <View style={{width: w(12)}}>
              {eventView.creator === user._id && eventDepassé && (
                <IconEntypo
                  name={GlobalFunction.Choose(editName, 'check', 'edit')}
                  size={22}
                  color="white"
                  onPress={() => this.UpdateEventName(contextProps, newName, editName)}
                />
              )}
            </View>
            <View style={{width: w(12)}}>
              <TouchableOpacity
                onPress={async () => this.LikedEvent(events, eventView, user, liked, contextProps)}>
                {eventView.valider ? (
                  <IconAntDesign
                    name={GlobalFunction.Choose(liked === -1, 'hearto', 'heart')}
                    size={27}
                    color="red"
                  />
                ) : (
                  <IconAntDesign name="delete" size={30} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <ImageBackground
            style={{
              marginTop: h(2),
              height: h(16),
              width: w(100),
            }}
            resizeMode="cover"
            source={{uri: `http://18.130.184.230:3000/events_images/${eventView.image}`}}>
            {eventView.creator === user._id && (
              <TouchableOpacity
                style={{alignSelf: 'flex-end', marginTop: h(1), marginRight: w(4)}}
                onPress={() => {
                  navigation.navigate('ImageGlobal', {type: false});
                }}>
                <IconMCI name="camera" size={30} color="white" />
              </TouchableOpacity>
            )}
          </ImageBackground>
          {this.ButtonEvent(contextProps)}
          <View style={{width: w(100), flexDirection: 'row', marginTop: h(2)}}>
            <Text
              style={{
                color: GlobalFunction.Choose(pro, colors.proBlue, colors.brown),
                textTransform: 'uppercase',
                fontSize: totalSize(2.4),
                marginLeft: w(3),
                marginRight: w(2),
                fontWeight: 'bold',
                width: w(85.5),
              }}>
              Description
            </Text>
            {eventView.creator === user._id && eventDepassé && (
              <IconEntypo
                name="edit"
                size={18}
                color="white"
                onPress={() => {
                  this.setState({isDescriptionModalVisible: true});
                }}
              />
            )}
          </View>
          <View style={{flexDirection: 'column', marginTop: h(2)}}>
            <View
              style={{
                width: w(100),
                flexDirection: 'row',
                marginLeft: w(4),
                marginBottom: h(1),
              }}>
              <View style={{width: w(5.5)}}>
                <IconAntDesign name="clockcircleo" size={w(5.5)} color="white" />
              </View>

              <Text
                style={{
                  alignSelf: 'center',
                  color: 'white',
                  fontSize: totalSize(2),
                  marginRight: w(2),
                  marginLeft: w(4),
                  width: w(75.5),
                }}>
                {moment(eventView.date).format('D MMM YYYY à HH:mm')}
              </Text>
              {eventView.creator === user._id && !hasPassed && eventDepassé && (
                <IconEntypo
                  name="edit"
                  size={18}
                  color="white"
                  onPress={() => this.openIosModalDate()}
                />
              )}
              {showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  textColor="white"
                  value={newDate}
                  minimumDate={tomorrow}
                  is24Hour
                  display="default"
                  mode="date"
                  onChange={this.onChangeDate}
                />
              )}
              {showHeure && (
                <DateTimePicker
                  testID="dateTimePicker"
                  textColor="white"
                  value={newDate}
                  minimumDate={tomorrow}
                  is24Hour
                  display="default"
                  mode="time"
                  onChange={this.onChangeHour}
                />
              )}
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
                    value={newDate}
                    minimumDate={tomorrow}
                    is24Hour
                    display="spinner"
                    locale="fr-FR"
                    mode="datetime"
                    onChange={this.onIOSChangeTime}
                  />
                  <Button
                    color="white"
                    mode="text"
                    style={styles.ButtonInscrit(pro)}
                    labelStyle={{fontSize: totalSize(1.75)}}
                    onPress={() => this.UpdateEventDate(contextProps, newDate)}>
                    ENREGISTRER
                  </Button>
                </View>
              </Modal>
            </View>
            <View
              style={{
                width: w(100),
                flexDirection: 'row',
                marginLeft: w(4),
                marginBottom: h(1),
              }}>
              <View style={{width: w(5.5)}}>
                <IconEntypo name="location-pin" size={w(5.5)} color="white" />
              </View>
              {/* <View style={{flex: 1, flexWrap: 'wrap', flexDirection: 'row', width: w(77.5),}}> */}
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'white',
                  fontSize: totalSize(2),
                  marginRight: w(2),
                  marginLeft: w(4),
                  width: w(75.5),
                }}>
                {`${eventView.place.localisation}`}
              </Text>
              {eventView.creator === user._id && eventDepassé && (
                <IconEntypo
                  name="edit"
                  size={18}
                  color="white"
                  onPress={() => this.setState({showMap: true})}
                />
              )}
            </View>
            {/* </View> */}

            <View
              style={{
                width: w(100),
                flexDirection: 'row',
                marginLeft: w(4),
                marginBottom: h(1),
              }}>
              <View style={{width: w(5.5)}}>
                <IconEntypo name="users" size={w(5.5)} color="white" />
              </View>
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'white',
                  fontSize: totalSize(2),
                  marginRight: w(2),
                  marginLeft: w(4),
                  width: w(75.5),
                }}>
                {finalParticipantsArray.length}/{eventView.limit} -{' '}
                {eventView.limit - finalParticipantsArray.length} places encore disponibles
              </Text>
              {eventView.creator === user._id && eventDepassé && (
                <IconEntypo
                  name="edit"
                  size={18}
                  color="white"
                  onPress={() => this.setState({isParticipantsAllowedVisible: true})}
                />
              )}
            </View>
            <Modal
              isVisible={isParticipantsAllowedVisible}
              onBackdropPress={() => this.setState({isParticipantsAllowedVisible: false})}>
              <View
                style={{
                  backgroundColor: colors.blue,
                  height: h(30),
                  borderRadius: 50,
                  justifyContent: 'center',
                }}>
                <ReactTextInput
                  style={styles.participantsLimitFieldStyle}
                  keyboardType="numeric"
                  value={newParticipants.toString()}
                  onChangeText={(text) => this.setState({newParticipants: text})}
                  placeholderTextColor="white"
                  placeholder="__"
                />
                <Button
                  color="white"
                  mode="text"
                  style={styles.ButtonInscrit(pro)}
                  labelStyle={{fontSize: totalSize(1.5)}}
                  onPress={() => this.UpdateEventLimit(contextProps, newParticipants, listInscrit)}>
                  ENREGISTRER
                </Button>
              </View>
            </Modal>
            <View
              style={{
                marginVertical: h(2),
                borderWidth: 1,
                borderColor: 'white',
                borderRadius: 20,
                marginHorizontal: w(10),
              }}>
              <Text
                style={{
                  fontSize: totalSize(2),
                  color: 'white',
                  paddingVertical: h(2),
                  paddingHorizontal: w(4),
                  textAlign: 'center',
                }}>
                {`${eventView.description}`}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                width: w(100),
                flexDirection: 'row',
                marginLeft: w(4),
                marginBottom: h(1),
              }}>
              <View style={{width: w(5.5)}}>
                <IconFa name="hashtag" size={w(5.5)} color="white" />
              </View>
              {this.Chips(eventView, eventDepassé)}
            </View>
            <View
              style={{
                width: w(100),
                flexDirection: 'row',
                marginLeft: w(4),
                marginBottom: h(1),
              }}>
              <View style={{width: w(5.5)}}>
                <IconAntDesign name="infocirlceo" size={w(5.5)} color="white" />
              </View>
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'white',
                  fontSize: totalSize(2),
                  marginRight: w(2),
                  marginLeft: w(4),
                  width: w(75.5),
                }}>
                Evènement {eventView.type}
                {eventView.minAge !== 0 &&
                  eventView.maxAge !== 0 &&
                  ` / ${eventView.minAge}-${GlobalFunction.Choose(
                    eventView.maxAge < 67,
                    eventView.maxAge,
                    '66+',
                  )} ans`}
              </Text>
              {eventView.creator === user._id && eventDepassé && (
                <IconEntypo
                  name="edit"
                  size={18}
                  color="white"
                  onPress={() => this.setState({isTypeAgeModalVisible: true})}
                />
              )}
            </View>
            <Modal
              isVisible={isTypeAgeModalVisible}
              onBackdropPress={() => this.setState({isTypeAgeModalVisible: false})}>
              <View
                style={{
                  backgroundColor: colors.blue,
                  height: h(80),
                  borderRadius: 50,
                  justifyContent: 'center',
                }}>
                {this.EventTypeButton('évènement mixte filles/garcons', 'mixte')}
                {this.EventTypeButton('évènement girls only', 'girls')}
                {this.EventTypeButton('évènement boys only', 'boys')}
                {this.EventTypeButton('évènement pour célibataires only', 'celibataire')}
                {!ageCheckbox && (
                  <>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                      <MultiSlider
                        values={[newMinAge, newMaxAge]}
                        sliderLength={250}
                        onValuesChange={(arr) => {
                          this.setState({newMinAge: arr[0], newMaxAge: arr[1]});
                        }}
                        min={18}
                        max={67}
                        step={1}
                        allowOverlap
                        snapped
                      />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                      <Text style={{color: 'white'}}>{newMinAge} ans</Text>
                      <Text style={{color: 'white'}}>
                        {GlobalFunction.Choose(newMaxAge < 67, newMaxAge, '66+')} ans
                      </Text>
                    </View>
                  </>
                )}
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: h(2)}}>
                  <CheckBox
                    tintColors={{true: 'white', false: 'white'}}
                    tintColor="white"
                    onCheckColor="red"
                    disabled={false}
                    value={ageCheckbox}
                    style={{marginLeft: w(4), height: w(7)}}
                    onValueChange={(newValue) => {
                      if (newValue)
                        this.setState({ageCheckbox: newValue, newMinAge: 0, newMaxAge: 100});
                      else this.setState({ageCheckbox: newValue, newMinAge: 18, newMaxAge: 100});
                    }}
                  />
                  <Text style={{color: 'white', marginLeft: w(1)}}>
                    Je ne souhaite pas spécifier d&apos;âge
                  </Text>
                </View>
                <Button
                  color="white"
                  mode="text"
                  style={styles.ButtonInscrit(pro)}
                  labelStyle={{fontSize: totalSize(1.5)}}
                  onPress={() =>
                    this.UpdateEventAgeMinMaxType(contextProps, newMaxAge, newMinAge, newType)
                  }>
                  ENREGISTRER
                </Button>
              </View>
            </Modal>
            <View
              style={{
                width: w(100),
                flexDirection: 'row',
                marginLeft: w(4),
              }}>
              <View style={{width: w(5.5)}}>
                <IconEntypo name="user" size={w(5.5)} color="white" />
              </View>
              <View style={{flexDirection: 'row', marginLeft: w(4), marginBottom: h(5)}}>
                <Text
                  style={{
                    alignSelf: 'center',
                    color: 'white',
                    fontSize: totalSize(2),
                  }}>
                  Organisé par{' '}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={async () => {
                    this.navigateProfile(user, eventView.creator, navigation);
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: totalSize(2),
                      color: '#0099ff',
                      textDecorationLine: 'underline',
                    }}>
                    {eventView.nomCreator}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text
            style={{
              color: GlobalFunction.Choose(pro, colors.proBlue, colors.brown),
              textTransform: 'uppercase',
              fontSize: 18,
              marginLeft: w(3),
              fontWeight: 'bold',
            }}>
            Participants
          </Text>

          {this.participantsView(participants, navigation)}
          {eventView.creator !== user._id ? (
            <TouchableOpacity
              style={{alignSelf: 'flex-end', marginRight: w(5)}}
              onPress={() => {
                navigation.navigate('SignalerUtilisateur', {
                  visitedProfile: eventView,
                  type: 'event',
                });
              }}>
              <Text
                style={{
                  color: '#0099ff',
                  textTransform: 'uppercase',
                  textDecorationLine: 'underline',
                }}>
                Signaler l'évènement
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      context: {eventView, ShowEvent, events, setEvents, user, setBalance, balance, pro},
    } = this;
    const {showAlert, title, message, spinner, showInterets} = this.state;

    return (
      <NoobaContext.Consumer>
        {(props) => {
          return (
            <>
              <MainComponent bgColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}>
                <HeaderComponent
                  navigation={navigation}
                  height={9}
                  fontsize={30}
                  type
                  showBackButton
                  bgColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}
                  notif
                  goBackAction={() => {
                    if (showInterets) {
                      this.setState({showInterets: false});
                    } else {
                      navigation.goBack();
                    }
                  }}
                />
                <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />

                {showInterets ? this.InteretsModal(props) : this.Content(props)}
              </MainComponent>
              <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={title}
                message={message}
                closeOnTouchOutside
                closeOnHardwareBackPress={false}
                showCancelButton
                showConfirmButton
                cancelText="Non"
                confirmText="Oui"
                confirmButtonColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}
                onConfirmPressed={() => {
                  this.hideAlert();
                  this.setState({spinner: true});
                  AnnulerEvent(eventView._id, user.token).then((response) => {
                    this.setState({spinner: false});
                    const {data} = response;
                    const pos = events.findIndex((x) => x._id === eventView._id);
                    if (pos > -1) {
                      events[pos] = data.result;
                      setEvents(events);
                    }
                    ShowEvent(data.result);

                    if (!user.illimte) setBalance(parseInt(balance, 10) + 1);

                    const {socket} = this.context;
                    socket.emit('requestChats');
                  });
                }}
                onCancelPressed={() => {
                  this.hideAlert();
                }}
                onDismiss={() => {
                  this.hideAlert();
                }}
              />
            </>
          );
        }}
      </NoobaContext.Consumer>
    );
  }
}

Event.contextType = NoobaContext;
