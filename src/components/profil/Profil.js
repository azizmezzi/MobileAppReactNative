import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Chip, TextInput, Button} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {Grid, Row, Col} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';

import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import {updateDescription, UpdateUserPhoto} from '../../provider/authentification';
import GlobalFunction from '../../GlobleFun/GlobalFunction';

const styles = StyleSheet.create({
  headerView: {
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerViewText: {color: 'white', fontSize: totalSize(2.4)},
  headerGrid: {
    marginTop: h(3),
  },
  headerCol: (width) => {
    return {
      width: w(width),
      alignItems: 'center',
    };
  },
  headerColMidText: {color: 'white', fontSize: totalSize(2), textAlign: 'center'},
  horizontalRule: {
    borderBottomColor: 'white',
    marginHorizontal: w(35),
    marginVertical: h(2),
    borderBottomWidth: 1.5,
  },
  mainBrownText: (color) => {
    return {
      color: color !== undefined ? color : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(1.8),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
  mainWhiteText: {
    marginBottom: h(2),
    color: colors.white,
    marginLeft: w(3),
  },
  fieldStyle: {
    marginTop: h(2),
    marginHorizontal: w(5),
    // height: h(8),
  },
  ButtonInscrit: (pro) => {
    return {
      marginTop: h(2),
      marginBottom: h(5),
      alignSelf: 'center',
      color: 'white',
      backgroundColor: pro ? colors.proBlue : colors.brown,
      width: w(50),
    };
  },
});

export default class Profil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isVisible: false,
      description: '',
    };
  }

  HorizontalRule = () => {
    return <View style={styles.horizontalRule} />;
  };

  Header = (user) => {
    const {
      context: {pro},
    } = this;
    const yrs = !pro ? moment().diff(user.dob, 'years', false) : 0;
    let localisation = '';
    if (user.locality !== undefined) localisation = user.locality.localisation;
    return (
      <>
        <View style={{alignItems: 'center', alignSelf: 'center', justifyContent: 'center'}}>
          <Text style={styles.headerColMidText}>
            {user.isPro ? user.nameEtablissement : user.name}
          </Text>
          {pro === false && yrs > 0 ? <Text style={styles.headerColMidText}>{yrs} ans</Text> : null}
          <Text style={styles.headerColMidText}>{localisation}</Text>
        </View>
        {this.HorizontalRule()}
      </>
    );
  };

  Chips = (data) => {
    const {navigation} = this.props;

    let dataSource = [];
    if (data !== undefined) dataSource = data;
    return (
      <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
        {dataSource.map((item, index) => {
          return (
            <TouchableOpacity
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

                navigation.navigate('Marketplace', {
                  screen: 'Marketplace',
                  params: {filter},
                });
              }}
              style={{
                margin: 5,
              }}>
              <Chip
                mode="outlined"
                height={totalSize(3.3)}
                style={{
                  backgroundColor: '#4f5356',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  margin: 0,
                }}
                textStyle={{
                  color: 'white',
                  fontSize: totalSize(1.7),
                }}>
                {item}
              </Chip>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  UploadImage = async () => {
    const {user, setUser, events, setEvents} = this.context;
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.9, maxWidth: 400, maxHeight: 400},
      (response) => {
        if (!response.didCancel && !response.error) {
          const {uri} = response;
          const {image} = user;
          UpdateUserPhoto(user.token, user._id, uri, image).then(async (serverResponse) => {
            const {
              data: {result},
            } = serverResponse;
            user.image = result;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            events.forEach((event) => {
              const {participants} = event;
              participants.forEach((participant, indexParticipant) => {
                const {_id} = participant;
                if (_id === user._id) {
                  participants[indexParticipant].image = result;
                }
              });
            });
            setEvents(events);
          });
        }
      },
    );
  };

  Content = () => {
    const {navigation} = this.props;
    const {
      context: {pro, user},
      state: {loading},
    } = this;
    const {recommendations = []} = user;
    let average = 0;
    if (recommendations.length !== 0) {
      const ratingSum = recommendations
        .map((o) => o.rating)
        .reduce((a, c) => {
          return a + c;
        });
      average = Math.floor(ratingSum / recommendations.length);
    }
    return (
      <ScrollView style={{marginBottom: h(10)}}>
        <ImageBackground
          onLoadEnd={() => {
            this.setState({
              loading: false,
            });
          }}
          style={{width: w(100), height: h(40)}}
          resizeMode="contain"
          source={{
            uri: `http://18.130.184.230:3000/images/${user._id}.png?t=${new Date()}`,
          }}>
          <ActivityIndicator
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            size="large"
            color={colors.brown}
            animating={loading}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: h(4),
              marginHorizontal: w(3),
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Settings');
              }}>
              <Icon2 name="settings" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.UploadImage}>
              <IconMCI name="camera-plus" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        {this.Header(user)}
        <Grid>
          <Row>
            <Col style={{width: w(80)}}>
              <Text
                style={styles.mainBrownText(
                  GlobalFunction.Choose(pro, colors.proBlue, colors.brown),
                )}>
                Description
              </Text>
            </Col>
            <Col style={{width: w(20), alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  console.log('edit');
                  this.setState({isVisible: true, description: user.description});
                }}>
                <Icon2 name="edit" size={20} color="white" />
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
        <Text style={{...styles.mainWhiteText, marginRight: w(7)}}>{user.description}</Text>
        <Grid>
          <Row>
            <Col style={{width: w(80)}}>
              <Text
                style={styles.mainBrownText(
                  GlobalFunction.Choose(pro, colors.proBlue, colors.brown),
                )}>
                {GlobalFunction.Choose(
                  user.isPro,
                  `intérêts concernés par ${user.nameEtablissement}`,
                  `intérêts de ${user.name}`,
                )}
              </Text>
            </Col>
            <Col style={{width: w(20), alignItems: 'center'}}>
              <Icon2
                onPress={() => {
                  console.log('edit');
                  navigation.navigate('CentreDinterets');
                }}
                name="edit"
                size={20}
                color="white"
              />
            </Col>
          </Row>
        </Grid>
        {this.Chips(user.CentreInteret)}
        <Grid style={{marginVertical: h(3), marginBottom: h(7)}}>
          <Row>
            <Col style={{width: w(50)}}>
              <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
                Recommandations
              </Text>
            </Col>
            <Col
              style={{
                width: w(40),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                name="star"
                size={20}
                color={GlobalFunction.Choose(average > 0, 'gold', 'white')}
              />
              <Icon
                name="star"
                size={20}
                color={GlobalFunction.Choose(average > 1, 'gold', 'white')}
              />
              <Icon
                name="star"
                size={20}
                color={GlobalFunction.Choose(average > 2, 'gold', 'white')}
              />
              <Icon
                name="star"
                size={20}
                color={GlobalFunction.Choose(average > 3, 'gold', 'white')}
              />
              <Icon
                name="star"
                size={20}
                color={GlobalFunction.Choose(average > 4, 'gold', 'white')}
              />
            </Col>
            <Col style={{width: w(10)}}>
              <Text style={{color: 'white'}}>{`(${recommendations.length})`}</Text>
            </Col>
          </Row>
        </Grid>
      </ScrollView>
    );
  };

  render() {
    const {navigation} = this.props;
    const {isVisible, description} = this.state;
    const {
      context: {pro, setUser, user},
    } = this;

    return (
      <>
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
          <HeaderComponent
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton={false}
            bgColor={pro ? colors.proBlue : colors.brown}
            notif
          />
          <Modal isVisible={isVisible} onBackdropPress={() => this.setState({isVisible: false})}>
            <View
              style={{
                backgroundColor: 'white',
                // height: h(40),
                borderRadius: 50,
                justifyContent: 'center',
              }}>
              <TextInput
                mode="outlined"
                label="Description"
                multiline
                style={styles.fieldStyle}
                value={description}
                onChangeText={(text) => {
                  this.setState({description: text});
                }}
              />
              <Button
                color="white"
                mode="text"
                style={styles.ButtonInscrit(pro)}
                labelStyle={{fontSize: totalSize(1.8)}}
                onPress={async () => {
                  user.description = description;
                  updateDescription(user.token, user.description).then(async () => {
                    await AsyncStorage.setItem('user', JSON.stringify(user));
                    setUser(user);
                  });
                  this.setState({isVisible: false});
                }}>
                ENREGISTRER
              </Button>
            </View>
          </Modal>
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

Profil.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Profil.contextType = NoobaContext;
