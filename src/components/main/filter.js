/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, View, Platform, Text, ScrollView} from 'react-native';
import moment from 'moment';
import {Accordion} from 'native-base';
import {Chip, Button, TextInput} from 'react-native-paper';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import PropTypes from 'prop-types';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, w, totalSize} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import GlobalFunction from '../../GlobleFun/GlobalFunction';
import CentreInteretArray from '../../GlobleFun/CentreInteretArray';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    width: w(100),
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: totalSize(2.5),
    textTransform: 'uppercase',
  },
  eventButtonContent: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    height: h(6),
  },
  eventButton: {
    marginHorizontal: w(2),
    marginVertical: w(2),
    borderColor: 'white',
    borderRadius: 25,
  },
  TextStyme: {
    marginTop: h(1),
    marginBottom: h(2),
    color: 'white',
    width: w(100),
    textAlign: 'center',
    // fontWeight: 'bold',
    fontSize: totalSize(2.4),
    // textTransform: 'uppercase',
  },
  fieldStyle: {
    // marginTop: h(2),
    height: h(5),
    fontSize: totalSize(1.8),
    width: w(37),
    // backgroundColor: 'transparent',
    // borderColor: 'white',
    // borderWidth: 0.5,
    // marginHorizontal: w(5),
    paddingHorizontal: w(0.5),
    // color: 'white',
  },
  fieldStyleMotCle: {
    // marginTop: h(2),
    height: h(5),
    fontSize: totalSize(2.5),
    // backgroundColor: 'transparent',
    // borderColor: 'white',
    // borderWidth: 0.5,
    // marginHorizontal: w(5),
    paddingHorizontal: w(2),
    // color: 'white',
  },
  ButtonInscrit: (color) => {
    return {
      marginTop: h(3),
      alignSelf: 'center',
      color: 'white',
      backgroundColor: color !== undefined ? color : colors.brown,
      width: w(60),
    };
  },
  ButtonInscrit2: {
    marginTop: h(3),
    alignSelf: 'center',
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    width: w(60),
  },
  TextForInput: {
    marginTop: h(2),
    marginBottom: h(1),
    color: 'white',
    width: w(100),
    // textAlign: 'center',
    // fontWeight: 'bold',
    fontSize: totalSize(2.3),

    textTransform: 'uppercase',
  },
});

export default class Filter extends Component {
  constructor(props) {
    super(props);
    const dataArray1 = [
      {
        title: this.First('par distance'),
        content: [
          {text: 'Flandre-Occidentale', type: 1, selected: false},
          {text: 'Anvers', type: 1, selected: false},
          {text: 'Limbourg', type: 1, selected: false},
          {text: 'Brabant Flamand', type: 1, selected: false},
          {text: 'Brabant Wallon', type: 1, selected: false},
          {text: 'Hainaut', type: 1, selected: false},
          {text: 'Liège', type: 1, selected: false},
          {text: 'Namur', type: 1, selected: false},
          {text: 'Luxembourg', type: 1, selected: false},
        ],
      },
      {
        title: this.First(`par centre d'interets`),
        content: [],
      },
      {
        title: this.First('par date'),
        content: [
          {text: 'de', type: 3},
          {text: 'a', type: 3},
        ],
      },
      {
        title: this.First('par mots cles'),
        content: [{text: 'input', type: 4}],
      },

      {
        title: this.First('par genre'),
        content: [
          {text: 'évènement pour célibataires', type: 5, selected: false},
          {text: 'évènement entre filles', type: 5, selected: false},
          {text: 'évènement entre garçons', type: 5, selected: false},
          {text: 'évènement mixte filles/garcons', type: 5, selected: false},
        ],
      },
    ];
    const {route} = props;
    const {pro} = route.params;
    const dataArrayCentreInteret = CentreInteretArray(pro);
    const date = new Date();
    this.state = {
      dataArray1,
      dataArrayCentreInteret,
      motCle: '',
      interests: [],
      showDate1: false,
      showDate2: false,
      date1: date,
      date1String: '',
      date2: date,
      date2String: '',
      isIOSDateModalVisible: false,
      isIOSDateModalVisible2: false,
      regionDistance: 40,
      eventType: [],
      changedRegionDistance: false,
    };
  }

  EventTypeButton = (eventText, state) => {
    const {eventType} = this.state;
    const select = eventType.includes(state);
    return (
      <Button
        icon={select ? 'check' : null}
        style={styles.eventButton}
        mode="outlined"
        color="white"
        contentStyle={styles.eventButtonContent}
        onPress={() => {
          if (eventType.includes(state)) {
            eventType.splice(eventType.indexOf(state), 1);
          } else {
            eventType.push(state);
          }
          this.setState({eventType});
        }}>
        {eventText}
      </Button>
    );
  };

  renderSecondaryContentCentreInteret = (item) => {
    const {interests} = this.state;
    const {pro} = this.context;
    const selectedColor = pro ? colors.proBlue : colors.brown;
    return (
      <View style={{flexWrap: 'wrap', flexDirection: 'row', marginLeft: w(5), marginRight: w(3)}}>
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
                } else {
                  interests.push(interet);
                }
                this.setState({interests});
              }}
              style={{
                backgroundColor: interests.includes(interet)
                  ? selectedColor
                  : 'rgba(220,220,220,0.2)',
                borderColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                margin: 0,
              }}
              textStyle={{color: 'white', fontSize: totalSize(1.8)}}>
              {interet}
            </Chip>
          </View>
        ))}
      </View>
    );
  };

  First = (title) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: 'white',
            textTransform: 'uppercase',
            fontSize: totalSize(2),
            paddingLeft: w(5),
            fontWeight: 'bold',
          }}>
          {title}
        </Text>
      </View>
    );
  };

  onChangeTime1 = (event, selectedDate) => {
    const newDate = selectedDate;
    const {date2, date2String} = this.state;
    console.log({date2String});
    if (newDate !== undefined) {
      if (date2String !== '' && date2 < newDate) {
        this.setState({showDate1: false});
      } else {
        //const dateString = newDate.toISOString();
        //const date = dateString.substring(0, 10);
        const date = moment(newDate).format('DD-MM-YYYY');
        console.log({date});
        this.setState({date1: newDate, showDate1: false, date1String: date});
      }
    } else this.setState({showDate1: false});
  };

  onChangeTime2 = (event, selectedDate) => {
    const newDate = selectedDate;
    const {date1, date1String} = this.state;
    if (newDate !== undefined) {
      if (date1String !== '' && date1 > newDate) {
        // this.setState({showDate2: false});
      } else {
        //const dateString = newDate.toISOString();
        //const date = dateString.substring(0, 10);
        const date = moment(newDate).format('DD-MM-YYYY');
        console.log({date});
        this.setState({date2: newDate, showDate2: false, date2String: date});
      }
    } else this.setState({showDate2: false});
  };

  onIOSChangeTime1 = (event, selectedDate) => {
    const newDate = selectedDate;
    const {date2, date2String} = this.state;
    console.log({date2String});
    if (newDate !== undefined) {
      if (date2String !== '' && date2 < newDate) {
        // this.setState({showDate1: false});
      } else {
        const date = moment(newDate).format('DD-MM-YYYY');
        console.log({date});
        this.setState({date1: newDate, date1String: date});
      }
    }
  };

  onIOSChangeTime2 = (event, selectedDate) => {
    const newDate = selectedDate;
    const {date1, date1String} = this.state;
    if (newDate !== undefined) {
      if (date1String !== '' && date1 > newDate) {
        // this.setState({showDate2: false});
      } else {
        const date = moment(newDate).format('DD-MM-YYYY');
        console.log({date});
        this.setState({date2: newDate, date2String: date});
      }
    }
  };

  openIosModalDate = () => {
    if (Platform.OS === 'android') {
      this.setState({showDate1: true});
    } else {
      this.setState({isIOSDateModalVisible: true});
    }
  };

  openIosModalDate2 = () => {
    if (Platform.OS === 'android') {
      this.setState({showDate2: true});
    } else {
      this.setState({isIOSDateModalVisible2: true});
    }
  };

  renderSecondaryContent = (item) => {
    const {
      motCle,
      dataArrayCentreInteret,
      showDate1,
      showDate2,
      date1,
      date2,
      date1String,
      date2String,
      isIOSDateModalVisible,
      isIOSDateModalVisible2,
      regionDistance,
      changedRegionDistance,
    } = this.state;
    const {route} = this.props;
    const {pro} = route.params;
    if (item.length === 0) {
      return (
        <Accordion
          dataArray={dataArrayCentreInteret}
          expanded={0}
          renderContent={(data) => this.renderSecondaryContentCentreInteret(data.content)}
          headerStyle={{
            backgroundColor: colors.transparent,
          }}
          icon="arrow-down"
          iconStyle={{color: GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}}
          expandedIcon="arrow-up"
          expandedIconStyle={{color: GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}}
          style={{borderColor: colors.blue}}
        />
      );
    }
    // mots cle
    if (item.length === 1) {
      return (
        <View style={{marginHorizontal: w(5)}}>
          <TextInput
            mode="outlined"
            label=""
            style={styles.fieldStyleMotCle}
            value={motCle}
            onChangeText={(text) => this.setState({motCle: text})}
          />
        </View>
      );
    }
    if (item.length === 2) {
      return (
        <View style={{flexDirection: 'row', marginLeft: w(5), alignItems: 'center'}}>
          {GlobalFunction.Choose(
            showDate1,
            <DateTimePicker
              testID="dateTimePicker"
              value={date1}
              is24Hour
              minimumDate={new Date()}
              maximumDate={date2String !== '' ? date2 : undefined}
              display="default"
              onChange={this.onChangeTime1}
            />,
            null,
          )}
          {GlobalFunction.Choose(
            showDate2,
            <DateTimePicker
              testID="dateTimePicker"
              value={date2}
              is24Hour
              minimumDate={date1String !== '' ? date1 : new Date()}
              display="default"
              onChange={this.onChangeTime2}
            />,
            null,
          )}

          <Text
            style={{
              color: 'white',
              fontSize: totalSize(2),
              paddingTop: h(1),
              paddingLeft: w(5),
              paddingRight: w(2),
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            De
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.setState({showDate1: true});
              console.log('click showDate1');
            }}>
            <TextInput
              mode="outlined"
              editable={false}
              label=""
              style={styles.fieldStyle}
              value={date1String}
              onChangeText={(text) => this.setState({motCle: text})}
              right={
                <TextInput.Icon
                  onPress={() => {
                    this.openIosModalDate();
                  }}
                  style={{paddingTop: h(1)}}
                  name="calendar"
                  size={28}
                  color="black"
                />
              }
            />
          </TouchableOpacity>
          <Text
            style={{
              color: 'white',
              fontSize: totalSize(2),

              paddingTop: h(1),
              paddingLeft: w(1),
              paddingRight: w(1),
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            à
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.setState({showDate2: true});
              console.log('click showdate2');
            }}>
            <TextInput
              editable={false}
              mode="outlined"
              label=""
              style={styles.fieldStyle}
              value={date2String}
              onChangeText={(text) => this.setState({motCle: text})}
              right={
                <TextInput.Icon
                  onPress={() => {
                    this.openIosModalDate2();
                  }}
                  style={{paddingTop: h(1)}}
                  name="calendar"
                  size={28}
                  color="black"
                />
              }
            />
          </TouchableOpacity>
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
                display="spinner"
                locale="fr-FR"
                textColor="white"
                value={date1}
                minimumDate={new Date()}
                maximumDate={date2String !== '' ? date2 : undefined}
                is24Hour
                mode="date"
                onChange={this.onIOSChangeTime1}
              />
              <Button
                color="white"
                mode="text"
                labelStyle={{fontSize: totalSize(3)}}
                onPress={() => {
                  const date = moment(date1).format('DD-MM-YYYY');
                  this.setState({isIOSDateModalVisible: false, date1String: date});
                }}>
                Suivant
              </Button>
            </View>
          </Modal>
          <Modal
            isVisible={isIOSDateModalVisible2}
            onBackdropPress={() => this.setState({isIOSDateModalVisible2: false})}>
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
                value={date2}
                minimumDate={date1String !== '' ? date1 : new Date()}
                is24Hour
                display="spinner"
                locale="fr-FR"
                mode="date"
                onChange={this.onIOSChangeTime2}
              />
              <Button
                color="white"
                mode="text"
                labelStyle={{fontSize: totalSize(3)}}
                onPress={() => {
                  const date = moment(date2).format('DD-MM-YYYY');
                  this.setState({isIOSDateModalVisible2: false, date2String: date});
                }}>
                Suivant
              </Button>
            </View>
          </Modal>
        </View>
      );
    }
    if (item.length === 4) {
      return (
        <View style={{marginHorizontal: w(5)}}>
          {this.EventTypeButton('évènement mixte filles/garcons', 'mixte')}
          {this.EventTypeButton('évènement entre filles', 'girls')}
          {this.EventTypeButton('évènement entre garçons', 'boys')}
          {this.EventTypeButton('évènement pour célibataires', 'celibataire')}
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'column',
          width: w(100),
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <MultiSlider
          values={[regionDistance]}
          sliderLength={w(80)}
          onValuesChange={(arr) => {
            this.setState({changedRegionDistance: true, regionDistance: arr[0]});
          }}
          min={10}
          max={200}
          step={1}
          allowOverlap
          snapped
        />
        <Text style={{color: 'white', marginBottom: h(2), fontSize: totalSize(2)}}>
          Moins de {regionDistance} KM
        </Text>
      </View>
    );
  };

  Content = (pro) => {
    const {navigation} = this.props;
    const {
      dataArray1,
      motCle,
      date1String,
      date2String,
      interests,
      regionDistance,
      eventType,
      changedRegionDistance,
    } = this.state;

    return (
      <View style={{height: h(75)}}>
        <ScrollView>
          <Text style={styles.headerColMidText}>Filtres</Text>

          <Accordion
            dataArray={dataArray1}
            expanded
            renderContent={(data) => this.renderSecondaryContent(data.content)}
            headerStyle={{
              backgroundColor: colors.transparent,
            }}
            icon="add"
            iconStyle={{backgroundColor: 'white', fontSize: totalSize(2)}}
            expandedIcon="add"
            expandedIconStyle={{backgroundColor: 'white', fontSize: totalSize(2)}}
            style={{borderColor: colors.blue}}
          />

          <Button
            color="white"
            mode="text"
            style={styles.ButtonInscrit(pro ? colors.proBlue : colors.brown)}
            labelStyle={{fontSize: 12}}
            onPress={() => {
              console.log({
                filterGender: eventType,
                filterRegion: [],
                motCle,
                date1String,
                date2String,
                interests,
              });

              navigation.navigate('Marketplace', {
                filter: {
                  filterGender: eventType,
                  motCle,
                  date1String,
                  date2String,
                  interests,
                  regionDistance: changedRegionDistance ? regionDistance : false,
                },
              });
            }}>
            Appliquer filtres
          </Button>
          <Button
            color="white"
            mode="text"
            style={styles.ButtonInscrit2}
            labelStyle={{fontSize: 12}}
            onPress={() => {
              const filterGender = [];
              const filterRegion = [];

              navigation.navigate('Alerts', {
                regionDistance: changedRegionDistance ? regionDistance : false,
                filterGender,
                filterRegion,
                motCle,
                date1String,
                date2String,
                interests,
              });
            }}>
            creer une alerte
          </Button>
        </ScrollView>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      context: {pro},
    } = this;
    return (
      <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
        <HeaderComponent
          bgColor={pro ? colors.proBlue : colors.brown}
          navigation={navigation}
          height={9}
          fontsize={30}
          type
          showBackButton
          notif
          input
        />
        {this.Content(pro)}
      </MainComponent>
    );
  }
}

Filter.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Filter.contextType = NoobaContext;
