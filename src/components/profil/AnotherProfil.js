/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
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
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import {Chip} from 'react-native-paper';
import {Grid, Row, Col} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {RecommendUser} from '../../provider/authentification';
import {NoobaContext} from '../../provider/provider';
import GlobalFunction from '../../GlobleFun/GlobalFunction';

const styles = StyleSheet.create({
  headerView: {
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerViewText: {color: 'white', fontSize: totalSize(2)},
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
    marginHorizontal: w(3),
    marginTop: h(1),
    marginBottom: h(2),
    color: colors.white,
    textAlign: 'justify',
  },
});

export default class AnotherProfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seeMore: true,
      spinner: false,
      visitedProfile: props.route.params.user,
      loading: true,
      savedRating: 0,
    };
  }

  componentDidMount() {
    const {
      context: {user: me},
    } = this;
    console.log({props: this.props});
    const {visitedProfile} = this.state;
    const {recommendations = []} = visitedProfile;
    const index = recommendations.findIndex((a) => a.userId === me._id);
    const savedRating = index !== -1 ? recommendations[index].rating : 0;
    this.setState({savedRating});
  }

  onStarClick = (rating) => {
    const {
      context: {user: me},
    } = this;
    const {visitedProfile} = this.state;
    this.setState({spinner: true});
    RecommendUser(me.token, visitedProfile._id, rating)
      .then(() => {
        this.setState({spinner: false, savedRating: rating});
      })
      .catch(() => this.setState({spinner: false}));
  };

  HorizontalRule = () => {
    return <View style={styles.horizontalRule} />;
  };

  Header = () => {
    const {visitedProfile} = this.state;
    const {recommendations = []} = visitedProfile;
    let average = 0;
    if (recommendations.length !== 0) {
      const ratingSum = recommendations
        .map((o) => o.rating)
        .reduce((a, c) => {
          return a + c;
        });
      average = Math.floor(ratingSum / recommendations.length);
    }
    let localisation = '';
    if (visitedProfile.locality !== undefined) localisation = visitedProfile.locality.localisation;
    const yrs = moment().diff(visitedProfile.dob, 'years', false);
    return (
      <View>
        <Grid style={styles.headerGrid}>
          <Row>
            <Col style={styles.headerCol(17)} />
            <Col style={styles.headerCol(66)}>
              <Text style={styles.headerColMidText}>
                {visitedProfile.isPro ? visitedProfile.nameEtablissement : visitedProfile.name}
              </Text>
              {!visitedProfile.isPro && <Text style={styles.headerColMidText}>{yrs} ans</Text>}
              <Text style={styles.headerColMidText}>{localisation}</Text>
            </Col>
            <Col style={styles.headerCol(17)} />
          </Row>
        </Grid>
        {/* <View
          style={{
            justifyContent: 'center',
            marginTop: h(2),
            alignItems: 'center',
          }}>
          <Icon name="star" size={50} color="gold" />
          <Text style={{position: 'absolute', fontSize: totalSize(1.8), fontWeight: 'bold'}}>
            {average}
          </Text>
        </View>
        <Text
          style={{
            ...styles.headerColMidText,
            alignSelf: 'center',
          }}>{`(${recommendations.length})`}</Text>
      */}
      </View>
    );
  };

  Chips = () => {
    const {seeMore, visitedProfile} = this.state;
    const {navigation} = this.props;
    // const {
    //   context: {pro},
    // } = this;
    let chips = [];
    if (visitedProfile.CentreInteret !== undefined) {
      if (!seeMore) {
        const chips3 = [...visitedProfile.CentreInteret];
        chips = chips3.splice(0, 6);
        console.log(chips);
      } else {
        chips = visitedProfile.CentreInteret;
      }
    }

    return (
      <>
        <Text
          style={styles.mainBrownText(
            GlobalFunction.Choose(visitedProfile.isPro, colors.proBlue, colors.brown),
          )}>
          intérêts
        </Text>
        <View
          style={{
            flexWrap: 'wrap',
            marginTop: h(1),
            marginBottom: h(2),
            marginLeft: w(3),
            // justifyContent: 'center',
            flexDirection: 'row',
          }}>
          {chips.map((item, index) => {
            return (
              <TouchableOpacity
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
                key={index}
                style={{
                  margin: 5,
                }}>
                <Chip
                  mode="outlined"
                  height={totalSize(3.3)}
                  style={{backgroundColor: '#4f5356'}}
                  textStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    margin: 0,
                    color: 'white',
                    fontSize: totalSize(1.5),
                  }}>
                  {item}
                </Chip>
              </TouchableOpacity>
            );
          })}
          {chips.length > 5 && (
            <TouchableOpacity
              onPress={() => {
                this.setState({seeMore: !seeMore});
              }}
              style={{justifyContent: 'center'}}>
              <Text
                style={{
                  color: 'white',
                  textDecorationLine: 'underline',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}>
                {seeMore ? 'Voir Moins' : 'Voir Plus'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  Content = () => {
    const {user} = this.context;
    const {visitedProfile, loading} = this.state;
    const {navigation} = this.props;

    let average = 0;
    const {recommendations = []} = visitedProfile;
    console.log(visitedProfile);
    if (recommendations.length !== 0) {
      const ratingSum = recommendations
        .map((o) => o.rating)
        .reduce((a, c) => {
          return a + c;
        });
      average = Math.floor(ratingSum / recommendations.length);
    }
    return (
      <ScrollView style={{marginBottom: h(15)}}>
        <ImageBackground
          onLoadEnd={() => {
            this.setState({
              loading: false,
            });
          }}
          style={{width: w(100), height: h(40)}}
          resizeMode="contain"
          source={{
            uri:
              visitedProfile.name === 'anonyme'
                ? `http://18.130.184.230:3000/images/anonyme.png?t=${new Date()}`
                : `http://18.130.184.230:3000/images/${visitedProfile._id}.png?t=${new Date()}`,
          }}>
          <ActivityIndicator
            size="large"
            color={colors.brown}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            animating={loading}
          />
        </ImageBackground>
        {this.Header()}
        <Text
          style={styles.mainBrownText(
            GlobalFunction.Choose(visitedProfile.isPro, colors.proBlue, colors.brown),
          )}>
          Description
        </Text>
        <Text style={styles.mainWhiteText}>{visitedProfile.description}</Text>

        {this.Chips()}

        <View style={{marginTop: h(2), marginBottom: h(2), flexDirection: 'row'}}>
          <Text
            style={{
              ...styles.mainBrownText(
                GlobalFunction.Choose(visitedProfile.isPro, colors.proBlue, colors.brown),
              ),
              // width: w(40),
              marginRight: w(6),
            }}>
            Recommandations
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Icon
              name="star"
              style={{marginRight: w(3)}}
              size={w(3.5)}
              color={average > 0 ? 'gold' : 'white'}
            />
            <Icon
              name="star"
              style={{marginRight: w(3)}}
              size={w(3.5)}
              color={average > 1 ? 'gold' : 'white'}
            />
            <Icon
              name="star"
              style={{marginRight: w(3)}}
              size={w(3.5)}
              color={average > 2 ? 'gold' : 'white'}
            />
            <Icon
              name="star"
              style={{marginRight: w(3)}}
              size={w(3.5)}
              color={average > 3 ? 'gold' : 'white'}
            />
            <Icon
              name="star"
              style={{marginRight: w(3)}}
              size={w(3.5)}
              color={average > 4 ? 'gold' : 'white'}
            />
          </View>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: totalSize(2),
              marginLeft: w(2),
            }}>
            {`(${recommendations.length})`}
          </Text>
        </View>

        {/* <Grid style={{marginTop: h(0.5)}}>
          <Row>
            <Col style={{width: w(50)}}>
              <Text style={styles.mainBrownText}>Recommandations</Text>
            </Col>
            <Col
              style={{
                width: w(50),
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Icon
                name="star"
                onPress={() => this.onStarClick(1)}
                size={20}
                color={savedRating > 0 ? 'gold' : 'white'}
              />
              <Icon
                name="star"
                onPress={() => this.onStarClick(2)}
                size={20}
                color={savedRating > 1 ? 'gold' : 'white'}
              />
              <Icon
                name="star"
                onPress={() => this.onStarClick(3)}
                size={20}
                color={savedRating > 2 ? 'gold' : 'white'}
              />
              <Icon
                name="star"
                onPress={() => this.onStarClick(4)}
                size={20}
                color={savedRating > 3 ? 'gold' : 'white'}
              />
              <Icon
                name="star"
                onPress={() => this.onStarClick(5)}
                size={20}
                color={savedRating > 4 ? 'gold' : 'white'}
              />
            </Col>
          </Row>
        </Grid> */}
        {user._id !== visitedProfile._id ? (
          <TouchableOpacity
            // style={{marginTop: h(3)}}
            onPress={() => {
              navigation.navigate('SignalerUtilisateur', {visitedProfile, type: 'user'});
            }}>
            <Text
              style={{
                color: '#82B2DC',
                textTransform: 'uppercase',
                textDecorationLine: 'underline',
                textAlign: 'right',
                marginRight: w(1),
                // marginTop: h(2),
              }}>
              Signaler le profil
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    );
  };

  render() {
    const {spinner} = this.state;
    const {navigation} = this.props;
    const {visitedProfile} = this.state;

    // const {
    //   context: {pro},
    // } = this;
    return (
      <>
        <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
        <MainComponent bgColor={visitedProfile.isPro ? colors.proBlue : colors.brown}>
          <HeaderComponent
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton
            bgColor={visitedProfile.isPro ? colors.proBlue : colors.brown}
            notif
          />
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

AnotherProfil.contextType = NoobaContext;
