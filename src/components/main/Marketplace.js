/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {StyleSheet, RefreshControl, View, Text, ScrollView} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Spinner from 'react-native-loading-spinner-overlay';
import {Grid, Row, Col} from 'native-base';
import PropTypes from 'prop-types';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import colors from '../../constant/colors';
import MarketplaceCard from './MarketplaceCard';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, w, totalSize} from '../../tools/Dimensions';
import {getDistanceFromLatLonInKm} from '../../tools/utils';
import {NoobaContext} from '../../provider/provider';
import {getEvents, getBalance} from '../../provider/events';

const styles = StyleSheet.create({
  headerGrid: {
    // marginTop: h(3),
  },
  headerCol: (width) => {
    return {
      width: w(width),
      alignItems: 'center',
    };
  },
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  filtercss: {color: 'white', fontSize: totalSize(1.4)},
  cardContainer: {
    marginBottom: h(3),
    marginTop: h(3),
    backgroundColor: colors.brown,
    marginHorizontal: w(5),
    borderRadius: 10,
  },
  cardImage: {
    width: '100%',
  },
  cardFirstLine: {
    flexDirection: 'row',
    marginTop: h(1),
    marginLeft: w(2),
    alignItems: 'center',
  },
  cardSecondLine: {
    flexDirection: 'row',
    marginBottom: h(2),
    marginLeft: w(2),
    alignItems: 'center',
  },
  headerView: {
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerViewText: {color: 'white', fontSize: totalSize(3)},
});

export default class Marketplace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      filterEvents: true,
      latitude: 50.854954,
      longitude: 4.30535,
      spinner: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    setTimeout(() => {
      this.setState({spinner: true});
    }, 5000);
    navigation.addListener('focus', () => {
      this.setState({filterEvents: true});
    });
    Geolocation.getCurrentPosition((info) => {
      const {
        coords: {latitude, longitude},
      } = info;
      this.setState({latitude, longitude});
    });
  }

  Header = (hasFilters) => {
    const {navigation} = this.props;
    return (
      <View>
        <Grid style={styles.headerGrid}>
          <Row>
            <Col style={styles.headerCol(15)} />
            <Col style={styles.headerCol(65)}>
              <Text style={styles.headerColMidText}>activités & évènements</Text>
            </Col>
            <Col
              style={{
                ...styles.headerCol(15),
                marginTop: h(2),
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <Text style={styles.filtercss}>Filtrer</Text>
              <Icon2
                onPress={() => {
                  const {
                    context: {pro},
                  } = this;
                  if (!hasFilters) {
                    navigation.navigate('Filter', {pro});
                  } else {
                    const {events, setEvents} = this.context;
                    setEvents(events);
                    navigation.setParams({
                      filter: {
                        filterGender: [],
                        filterRegion: [],
                        motCle: '',
                        date1String: '',
                        date2String: '',
                        interests: [],
                      },
                    });

                    this.setState({filterEvents: false});
                  }
                }}
                name={hasFilters ? 'close' : 'filter'}
                size={hasFilters ? 28 : 30}
                color="white"
              />
            </Col>
          </Row>
        </Grid>
      </View>
    );
  };

  filter = (events, filter) => {
    const {filterGender, regionDistance, motCle, date1String, date2String, interests} = filter;
    const {latitude, longitude} = this.state;
    let newData = events;
    let hasFilters = false;
    // console.log(filter);
    if (filterGender.length > 0) {
      hasFilters = true;
      newData = events.filter((item) => filterGender.includes(item.type));
    }
    let newDataRegion = newData;

    if (regionDistance) {
      hasFilters = true;
      newDataRegion = newData.filter((item) => {
        const dist = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          item.place.latitude,
          item.place.longitude,
        );
        return dist < regionDistance;
      });
    }
    let newDataMotCle = newDataRegion;

    if (motCle !== '') {
      hasFilters = true;
      newDataMotCle = newData.filter((item) =>
        item.description.toLowerCase().includes(motCle.toLowerCase()),
      );
    }
    let newDataDate1 = newDataMotCle;
    if (date1String !== '') {
      hasFilters = true;
      const date2 = moment(date1String, 'DD-MM-YYYY').format();
      newDataDate1 = newDataMotCle.filter((item) => {
        const date1 = moment(item.date, 'YYYY-MM-DD').format();
        return moment(date1).isSameOrAfter(date2);
      });
    }
    let newDataDate2 = newDataDate1;

    if (date2String !== '') {
      hasFilters = true;
      const date2 = moment(date2String, 'DD-MM-YYYY').format();
      newDataDate2 = newDataDate1.filter((item) => {
        const date1 = moment(item.date, 'YYYY-MM-DD').format();
        return moment(date2).isSameOrAfter(date1);
      });
    }
    let newDataCentreInteret = newDataDate2;
    if (interests.length > 0) {
      hasFilters = true;
      newDataCentreInteret = events.filter((item) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const interest of item.interests) {
          if (interests.includes(interest)) return true;
        }
        return false;
      });
    }

    return {data: newDataCentreInteret, hasFilters};
  };

  filterEventComplet = (eventActuel1, user) => {
    return eventActuel1.filter((item) => {
      let P = [];
      if (item.participants !== undefined) P = item.participants.filter((par) => !par.description);
      return (item.limit !== P.length && user._id !== item.creator) || user._id === item.creator;
    });
  };

  render() {
    const {navigation, route} = this.props;
    const {refreshing, filterEvents, latitude, longitude, spinner} = this.state;
    const {
      context: {pro, user, ShowEvent},
    } = this;
    const {
      context: {events},
    } = this;
    // console.log(route);
    let eventActuel = null;
    let hasFilters = false;
    if (events !== null) {
      const eventActuel1 = events.filter((item) => {
        const date1 = new Date(item.date);
        const date2 = new Date();
        return date1 > date2 && !item.annuler;
      });

      // test event complet
      eventActuel = this.filterEventComplet(eventActuel1, user);
    }
    let data = eventActuel;

    if (route.params !== undefined && filterEvents) {
      const {filter} = route.params;
      console.log(route);

      // console.log('fiiilter', filter);

      const Data = this.filter(eventActuel, filter);
      hasFilters = Data.hasFilters;
      data = Data.data;
    } else {
      if (user !== null && eventActuel !== null) {
        data = eventActuel.filter((item) => {
          const dist = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            item.place.latitude,
            item.place.longitude,
          );
          // console.log(dist);
          return item.creator == user._id || dist < 40;
        });
      }
    }
    if (user !== null) {
      if (user.locality !== undefined && eventActuel !== null) {
        data.sort((a, b) => {
          const placeA = a.place;
          const placeB = b.place;
          return (
            getDistanceFromLatLonInKm(latitude, longitude, placeA.latitude, placeA.longitude) -
            getDistanceFromLatLonInKm(latitude, longitude, placeB.latitude, placeB.longitude)
          );
        });
      }
    }
    return (
      <>
        <Spinner
          visible={spinner ? false : data === null}
          textContent="Loading..."
          textStyle={{color: '#FFF'}}
        />
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
          <HeaderComponent
            bgColor={pro ? colors.proBlue : colors.brown}
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton={false}
            notif
          />
          <View style={{height: h(75)}}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  colors={[pro ? colors.proBlue : colors.brown]}
                  onRefresh={() => {
                    this.setState({refreshing: true});

                    if (user.isPro) {
                      getBalance(user.token).then((response) => {
                        const dataB = response.data;
                        const {balance} = dataB;
                        const {setBalance} = this.context;
                        setBalance(balance);
                      });
                    }

                    Geolocation.getCurrentPosition((info) => {
                      const {
                        coords: {latitude: pLat, longitude: pLong},
                      } = info;
                      // console.log('ssssssssss', user.token, pLat, pLong);
                      getEvents(user.token, pLat, pLong).then((response) => {
                        this.setState({refreshing: false});
                        const {setEvents} = this.context;
                        setEvents(response.data.events);
                      });
                    });
                  }}
                />
              }>
              {this.Header(hasFilters)}
              {data !== null
                ? data.map((event) => {
                    const {_id} = event;
                    return (
                      <MarketplaceCard
                        key={_id}
                        event={event}
                        navigation={navigation}
                        ShowEvent={ShowEvent}
                      />
                    );
                  })
                : null}
            </ScrollView>
          </View>
        </MainComponent>
      </>
    );
  }
}

Marketplace.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Marketplace.contextType = NoobaContext;
