/* eslint-disable react/no-array-index-key */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import {Chip, Button, Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Accordion} from 'native-base';
import leoProfanity from 'leo-profanity';
//import frenchBadwordsList from 'french-badwords-list';
import BadWords from '../../../constant/BadWords';
import colors from '../../../constant/colors';
import SuivantBtn from '../../landingComponents/SuivantBtn';
import {h, totalSize, w} from '../../../tools/Dimensions';
import {NoobaContext} from '../../../provider/provider';
import texts from '../../../constant/texts';
import CentreInteretArray from '../../../GlobleFun/CentreInteretArray';
import GlobalRender from '../../main/GlobalRender';

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  iconContainer: {alignSelf: 'center', marginVertical: h(5)},
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
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
  fieldStyle: (height) => {
    return {
      flex: 1,
      marginTop: h(2),
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 1,
      marginHorizontal: w(5),
      borderRadius: 10,
      height: height !== undefined ? h(height) : h(12),
      paddingHorizontal: w(2),
      color: 'white',
    };
  },
  mainBrownText: (color) => {
    return {
      marginTop: h(3),
      color: color !== undefined ? color : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(2),

      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
  headerGrid: {
    marginTop: h(3),
  },
  ChipStyle: (include, selectedColor) => {
    return {
      backgroundColor: include ? selectedColor : 'rgba(220,220,220,0.2)',
      borderColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      margin: 0,
    };
  },
  headerCol: (width) => {
    return {
      width: w(width),
      alignItems: 'center',
    };
  },
});

export default class Step1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nom: '',
      description: '',
      interests: [],
      showAlert: false,
      title: '',
      message: '',
      CentreIn: false,
      search: '',
      dataArray: [],
    };
  }

  componentDidMount() {
    const {setNewEvent, pro} = this.context;
    const dataArray = CentreInteretArray(pro);
    this.setState({dataArray});
    setNewEvent({});
    leoProfanity.add(BadWords);
    console.log({BadWords});
    // leoProfanity.add(frenchBadwordsList.array);
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
      hideDescText: false,
      hideTitleText: false,
    });
  };

  selectInteret = (interests, interet) => {
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
  };

  renderSecondaryContent = (item) => {
    const {interests} = this.state;
    const {pro} = this.context;
    const selectedColor = pro ? colors.proBlue : colors.brown;
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
              height={totalSize(3.8)}
              onPress={() => {
                this.selectInteret(interests, interet);
              }}
              style={styles.ChipStyle(interests.includes(interet), selectedColor)}
              textStyle={{color: 'white', fontSize: totalSize(2)}}>
              {interet}
            </Chip>
          </View>
        ))}
      </View>
    );
  };

  Chips = () => {
    const {interests} = this.state;
    return (
      <View style={{flexWrap: 'wrap', width: w(100), flexDirection: 'row'}}>
        {interests.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                margin: 7,
              }}>
              <Chip
                selectedColor="white"
                selected={interests.includes(item)}
                onPress={() => {
                  if (interests.includes(item)) {
                    interests.splice(interests.indexOf(item), 1);
                  } else {
                    interests.push(item);
                  }
                  this.setState({interests});
                }}
                mode="outlined"
                height={totalSize(3.6)}
                style={{
                  backgroundColor: colors.blue,
                  borderColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  margin: 0,
                }}
                textStyle={{color: 'white', fontSize: totalSize(2)}}>
                {item}
              </Chip>
            </View>
          );
        })}
      </View>
    );
  };

  Content = (contextProps) => {
    const {nom, description, interests, hideDescText, hideTitleText} = this.state;
    const {navigation} = this.props;
    const {
      context: {pro},
    } = this;
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}>
        <Text style={styles.headerColMidText}>Créer un évènement</Text>
        <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
          Nom de l&apos;évènement
        </Text>
        <TextInput
          placeholder={hideTitleText ? '' : "Ce nom apparaîtra dans le fil d'actualité NOOBA"}
          placeholderTextColor="grey"
          maxLength={50}
          onChangeText={(text) => this.setState({nom: text})}
          value={nom}
          fontSize={totalSize(1.6)}
          onFocus={() => this.setState({hideTitleText: true})}
          onBlur={() => this.setState({hideTitleText: false})}
          style={styles.fieldStyle(7)}
          returnKeyType={'go'}
        />
        <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
          Description de l&apos;évènement
        </Text>
        <TextInput
          onChangeText={(text) => this.setState({description: text})}
          value={description}
          maxLength={500}
          fontSize={totalSize(1.6)}
          placeholder={
            hideDescText
              ? ''
              : "Soyez créatif(-ve), c'est le moment de donner envie aux autres membres de rejoindre votre évènement!"
          }
          placeholderTextColor="grey"
          onFocus={() => this.setState({hideDescText: true})}
          onBlur={() => this.setState({hideDescText: false})}
          multiline
          numberOfLines={10}
          blurOnSubmit
          style={styles.fieldStyle(16)}
          returnKeyType="go"
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: h(3),
            paddingHorizontal: w(3),
            width: w(100),
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: pro ? colors.proBlue : colors.brown,
              textTransform: 'uppercase',
              fontSize: totalSize(2),
              fontWeight: 'bold',
            }}>
            Centres d&apos;intérêt
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: totalSize(2),
              fontWeight: 'bold',
            }}>
            (5max)
          </Text>
        </View>

        <Text
          style={{
            marginTop: h(0.5),
            color: 'white',

            fontSize: totalSize(1.7),
            marginLeft: w(3),
          }}>
          Ajouter les intérêts concernés par votre activité
        </Text>
        <TouchableOpacity
          onPress={() => {
            this.setState({CentreIn: true});
          }}
          style={styles.iconContainer}>
          <Icon
            name="plus-square"
            size={totalSize(4)}
            color={pro ? colors.proBlue : colors.brown}
          />
        </TouchableOpacity>

        {this.Chips()}

        <View
          style={{
            marginTop: h(7),
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SuivantBtn
            onPress={() => {
              if (nom === '') {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_event_name_title,
                  message: texts.invalid_event_name_text,
                });
                return false;
              }
              if (description === '' || description.length < 15) {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_event_description_title,
                  message: texts.invalid_event_description_text,
                });
                return false;
              }
              if (interests.length === 0) {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_event_interests_title,
                  message: texts.invalid_event_interests_text,
                });
                return false;
              }

              if (leoProfanity.check(nom) || leoProfanity.check(description)) {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_event_name_badwords_title,
                  message: texts.invalid_event_name_badwords_text,
                });
                return false;
              }
              const {newEvent, setNewEvent} = contextProps;
              newEvent.name = nom;
              newEvent.description = description;
              newEvent.interests = interests;
              setNewEvent(newEvent);
              navigation.navigate('Step2');
              return true;
            }}
            bgColor={pro ? colors.proBlue : undefined}
          />
        </View>
      </ScrollView>
    );
  };

  Content2 = () => {
    const {dataArray, interests, search} = this.state;
    const {
      context: {pro},
    } = this;
    let finalArray = [];
    if (search === '') {
      finalArray = dataArray;
      const it = finalArray.find((item) => item.t !== undefined);
      if (it !== undefined) it.content = interests;
    } else {
      dataArray.forEach((element) => {
        const newObj = {title: element.title, content: []};
        element.content.forEach((c) => {
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
            iconStyle={{color: pro ? colors.proBlue : colors.brown, marginRight: w(5)}}
            expandedIcon="arrow-up"
            expandedIconStyle={{color: pro ? colors.proBlue : colors.brown, marginRight: w(5)}}
            style={{borderColor: colors.blue}}
          />
        </ScrollView>
        <Button
          color="white"
          mode="text"
          style={styles.ButtonInscrit(pro ? colors.proBlue : colors.brown)}
          labelStyle={{fontSize: totalSize(2)}}
          onPress={() => {
            this.setState({CentreIn: false});
          }}>
          {`Valider (${interests.length})`}
        </Button>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;

    const {showAlert, title, message, CentreIn} = this.state;
    return (
      <NoobaContext.Consumer>
        {(props) => {
          return (
            <GlobalRender
              navigation={navigation}
              showAlert={showAlert}
              title={title}
              message={message}
              type={3}
              Content={() => (CentreIn ? this.Content2() : this.Content(props))}
              hideAlert={() => this.hideAlert()}
            />
          );
        }}
      </NoobaContext.Consumer>
    );
  }
}

Step1.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Step1.contextType = NoobaContext;
