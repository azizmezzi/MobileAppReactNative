import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {Accordion} from 'native-base';
import {Chip, Searchbar, Button, TextInput} from 'react-native-paper';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

import {createSuggestion} from '../../provider/interestSuggestion';
import colors from '../../constant/colors';

import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import {updateCentreInteret} from '../../provider/authentification';
import GlobalFunction from '../../GlobleFun/GlobalFunction';
import GlobalRender from '../main/GlobalRender';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  TextStyme: {
    marginTop: h(1),
    marginBottom: h(2),
    color: 'white',
    width: w(100),
    textAlign: 'center',
    // fontWeight: 'bold',
    fontSize: totalSize(1.5),
    // textTransform: 'uppercase',
  },
  fieldStyle: {
    // marginTop: h(2),
    height: h(5),
    fontSize: totalSize(2),
    backgroundColor: 'transparent',
    // borderColor: 'white',
    // borderWidth: 0.5,
    // marginHorizontal: w(5),
    paddingHorizontal: w(2),
    color: 'white',
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
  TextForInput: {
    marginTop: h(2),
    marginBottom: h(1),
    color: 'white',
    width: w(100),
    // textAlign: 'center',
    // fontWeight: 'bold',
    fontSize: totalSize(1.4),
    textTransform: 'uppercase',
  },
});

export default class CentreDinterets extends Component {
  constructor(props) {
    super(props);
    const dataArray = [
      {
        title: this.First('les plus populaires'),
        content: [
          'Apero',
          'Tourisme',
          'Course ?? pied',
          'V??lo',
          'Photographie',
          'Yoga',
          'Activit??s humanitaires',
          'Voyage',
          'Randonn??e',
          'Gaming',
        ],
      },

      {
        title: this.First(`Activit??s festives`),
        content: [
          'Faire la f??te',
          'Boire un verre',
          'Afterwork',
          'Barbecue',
          'Musique',
          'Discoth??que',
          'Festivals',
          'DJ',
          'Apero',
          'Mixologie',
        ],
      },
      {
        title: this.First('Activit??s culinaires'),
        content: [
          'Manger un bout',
          'Ateliers cuisine',
          'Restaurant',
          'Gastronomie',
          'Brunch',
          'Patisserie',
          '??nologie (vins)',
          'Zythologie (bi??res)',
        ],
      },
      {
        title: this.First('Activit??s pour les cin??philes'),
        content: ['Aller au cin??ma', 'Regarder la t??l??', 'Films', 'Manga'],
      },
      {
        title: this.First('Activit??s jeux'),
        content: ['Jeux de soci??t??', 'Jeux vid??os', 'Billiard', 'Poker', 'Casino', 'Gaming'],
      },
      {
        title: this.First('Activit??s nature'),
        content: [
          'Nature',
          'Jardinage',
          'Balade pour chien',
          'Randonn??e',
          'Camping ',
          'Balades',
          'Zoo',
          'Visite guid??e',
          'Tourisme',
        ],
      },
      {
        title: this.First(`Activit??s d'ext??rieur`),
        content: [
          "Parc d'attraction",
          "Activit??s d'eau",
          'Moto',
          'Bateau',
          'Paintball',
          'Piscine',
          'Visite guid??e',
        ],
      },
      {
        title: this.First(`Activit??s high-tech`),
        content: ['R??alit?? Virtuelle', 'Technologie'],
      },
      {
        title: this.First(`Activit??s sportives`),
        content: [
          'Football',
          'Basketball',
          'Rugby',
          'Baseball',
          'Badminton',
          'VTT',
          'Hockey',
          'Ping Pong',
          'Volley',
          'Bowling',
          'Squash',
          'Fitness',
          'Tennis',
          'Cyclisme',
          'Natation',
          'Golf',
          'Crossfit',
          'Equitation',
          'Arts martiaux',
          'Musculation',
          'Escalade',
          'Boxe',
          'Running',
          'Trail',
          'Course ?? pied',
          'Danse',
          'Karting',
          'Snowboard',
          'Ski',
          'Ski nautique',
          'Plong??e',
          'Rafting',
          'Kayak',
          'Parapente',
          'Parachutisme',
          'Fl??chettes',
          'Roller',
          'Patinage ',
          'Skateboard',
          'Padel',
          'Wakeboard',
          'Surf',
          'Athl??tisme',
          'Triathlon',
          'Paddle',
          'Jet Ski',
          'Voile',
          'Mini-golf',
          'Aquagym',
          'Aquabiking',
          'Zumba',
          'Tolky',
          'Sport',
          'Trekking',
          'V??lo',
          'Piscine',
        ],
      },

      {
        title: this.First(`Loirsirs artistiques`),
        content: [
          'Photographie',
          'Couture',
          'Peinture',
          'D??coration',
          'DIY',
          'Chant',
          'Composition musicale',
          'Dessin',
          'Art Floral',
          'Bricolage',
          'Pi??ce de th????tre',
          'Mus??e',
          'Exposition',
          'Mode',
          'Make-up',
          'Humour/Stand up',
          'Concerts',
          'Th????tre',
        ],
      },
      {
        title: this.First(`LifeStyle`),
        content: [
          'Ecologie',
          'Z??ro d??chets',
          'Activit??s humanitaires',
          'Entreprenariat',
          'Yoga',
          'Meditation',
          'Formation',
          'Bien-??tre',
        ],
      },
      {
        title: this.First(`D??paysement`),
        content: ['Wellness', 'Voyage', 'G??tes', 'Glamping', 'Montgolfi??re', 'Exp??rience insolite'],
      },
      {
        title: this.First(`Activit??s diverses`),
        content: [
          'Activit??s pour enfants',
          'Activit??s insolites',
          'Shopping',
          'Automobile',
          'Bien ??tre animal',
        ],
      },
    ];

    this.state = {
      search: '',
      interests: [],
      // user: {},
      dataArray,
      spinner: false,
      newsugg: '',
      showAlert: false,
      title: '',
      // toggleCheckBox: false,
    };
  }

  async componentDidMount() {
    // const jsonUser = await AsyncStorage.getItem('user');
    // const user = JSON.parse(jsonUser);
    // this.setState({user});
    const {
      context: {user, pro},
    } = this;
    const dataArray = [
      {
        t: '1',
        title: this.First(`centres d'int??rets actuel`, pro),
        content: user.CentreInteret,
      },
      {
        title: this.First('les plus populaires', pro),
        content: [
          'Apero',
          'Tourisme',
          'Course ?? pied',
          'V??lo',
          'Photographie',
          'Yoga',
          'Activit??s humanitaires',
          'Voyage',
          'Randonn??e',
          'Gaming',
        ],
      },

      {
        title: this.First(`Activit??s festives`, pro),
        content: [
          'Faire la f??te',
          'Boire un verre',
          'Afterwork',
          'Barbecue',
          'Musique',
          'Discoth??que',
          'Festivals',
          'DJ',
          'Apero',
          'Mixologie',
        ],
      },
      {
        title: this.First('Activit??s culinaires', pro),
        content: [
          'Manger un bout',
          'Ateliers cuisine',
          'Restaurant',
          'Gastronomie',
          'Brunch',
          'Patisserie',
          '??nologie (vins)',
          'Zythologie (bi??res)',
        ],
      },
      {
        title: this.First('Activit??s pour les cin??philes', pro),
        content: ['Aller au cin??ma', 'Regarder la t??l??', 'Films', 'Manga'],
      },
      {
        title: this.First('Activit??s jeux', pro),
        content: ['Jeux de soci??t??', 'Jeux vid??os', 'Billiard', 'Poker', 'Casino', 'Gaming'],
      },
      {
        title: this.First('Activit??s nature', pro),
        content: [
          'Nature',
          'Jardinage',
          'Balade pour chien',
          'Randonn??e',
          'Camping ',
          'Balades',
          'Zoo',
          'Visite guid??e',
          'Tourisme',
        ],
      },
      {
        title: this.First(`Activit??s d'ext??rieur`, pro),
        content: [
          "Parc d'attraction",
          "Activit??s d'eau",
          'Moto',
          'Bateau',
          'Paintball',
          'Piscine',
          'Visite guid??e',
        ],
      },
      {
        title: this.First(`Activit??s high-tech`, pro),
        content: ['R??alit?? Virtuelle', 'Technologie'],
      },
      {
        title: this.First(`activit??s sportives`, pro),
        content: [
          'Football',
          'Basketball',
          'Rugby',
          'Baseball',
          'Badminton',
          'VTT',
          'Hockey',
          'Ping Pong',
          'Volley',
          'Bowling',
          'Squash',
          'Fitness',
          'Tennis',
          'Cyclisme',
          'Natation',
          'Golf',
          'Crossfit',
          'Equitation',
          'Arts martiaux',
          'Musculation',
          'Escalade',
          'Boxe',
          'Running',
          'Trail',
          'Course ?? pied',
          'Danse',
          'Karting',
          'Snowboard',
          'Ski',
          'Ski nautique',
          'Plong??e',
          'Rafting',
          'Kayak',
          'Parapente',
          'Parachutisme',
          'Fl??chettes',
          'Roller',
          'Patinage ',
          'Skateboard',
          'Padel',
          'Wakeboard',
          'Surf',
          'Athl??tisme',
          'Triathlon',
          'Paddle',
          'Jet Ski',
          'Voile',
          'Mini-golf',
          'Aquagym',
          'Aquabiking',
          'Zumba',
          'Tolky',
          'Sport',
          'Trekking',
          'V??lo',
          'Piscine',
        ],
      },

      {
        title: this.First(`Loirsirs artistiques`, pro),
        content: [
          'Photographie',
          'Couture',
          'Peinture',
          'D??coration',
          'DIY',
          'Chant',
          'Composition musicale',
          'Dessin',
          'Art Floral',
          'Bricolage',
          'Pi??ce de th????tre',
          'Mus??e',
          'Exposition',
          'Mode',
          'Make-up',
          'Humour/Stand up',
          'Concerts',
          'Th????tre',
        ],
      },
      {
        title: this.First(`LifeStyle`, pro),
        content: [
          'Ecologie',
          'Z??ro d??chets',
          'Activit??s humanitaires',
          'Entreprenariat',
          'Yoga',
          'Meditation',
          'Formation',
          'Bien-??tre',
        ],
      },
      {
        title: this.First(`D??paysement`, pro),
        content: ['Wellness', 'Voyage', 'G??tes', 'Glamping', 'Montgolfi??re', 'Exp??rience insolite'],
      },
      {
        title: this.First(`Activit??s diverses`, pro),
        content: [
          'Activit??s pour enfants',
          'Activit??s insolites',
          'Shopping',
          'Automobile',
          'Bien ??tre animal',
        ],
      },
    ];
    this.setState({interests: user.CentreInteret, dataArray});
  }

  hideAlert = () => {
    this.setState({
      spinner: false,
      showAlert: false,
      title: '',
    });
  };

  // eslint-disable-next-line react/sort-comp
  First = (title, pro) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: pro ? colors.proBlue : colors.brown,
            textTransform: 'uppercase',
            fontSize: totalSize(1.8),
            paddingLeft: w(5),
            fontWeight: 'bold',
          }}>
          {title}
        </Text>
      </View>
    );
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
              // icon="information"
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
              textStyle={{color: 'white', fontSize: totalSize(1.5)}}>
              {interet.charAt(0).toUpperCase() + interet.slice(1)}
            </Chip>
          </View>
        ))}
      </View>
    );
  };

  Content = () => {
    const {navigation} = this.props;
    const {search, newsugg, dataArray, interests, showAlert, title} = this.state;
    const {
      context: {user, setUser, pro},
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
      <ScrollView style={{marginBottom: h(13)}}>
        <Text style={styles.headerColMidText}>centres d&apos;int??rets</Text>

        <Text style={{...styles.TextStyme, width: w(90), marginHorizontal: w(5)}}>
          {pro
            ? `Votre ??tablissement ${user.nameEtablissement} est concern?? par `
            : 'Vous ??tes int??ress??(e) par des ??v??nements qui concernent '}
          les activit??s suivantes :
        </Text>
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
          expanded={1}
          renderContent={(data) => this.renderSecondaryContent(data.content)}
          headerStyle={{
            backgroundColor: colors.transparent,
          }}
          icon="arrow-down"
          iconStyle={{color: GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}}
          expandedIcon="arrow-up"
          expandedIconStyle={{color: GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}}
          style={{borderColor: colors.blue, marginRight: w(5)}}
        />
        <View style={{marginHorizontal: w(7)}}>
          <Text style={styles.TextForInput}>SUGG??RER D&apos;AUTRES ACTIVIT??S</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              mode="outlined"
              label=""
              theme={{
                colors: {
                  placeholder: 'white',
                  text: 'white',
                  primary: 'white',
                  underlineColor: 'transparent',
                  background: '#4f5356',
                },
              }}
              style={{...styles.fieldStyle, width: w(75)}}
              value={newsugg}
              onChangeText={(text) => this.setState({newsugg: text})}
              // right={
              //   <TouchableOpacity style={{backgroundColor: 'red'}}>
              //     <TextInput.Icon
              //       style={{paddingTop: h(1)}}
              //       onPress={() => {
              //         const {
              //           context: {user},
              //         } = this;
              //         const {token, name} = user;
              //         console.log({token, name});
              //         if (newsugg === '') {
              //           console.log('validation error');
              //         } else {
              //           console.log('test');
              //           createSuggestion(token, newsugg, name).then((response) => {
              //             console.log(response);
              //             this.setState({newsugg: ''});
              //           });
              //         }
              //       }}
              //       name="send"
              //       size={28}
              //       color="white"
              //     />
              //   </TouchableOpacity>
              // }
            />
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignContent: 'center',
                width: w(10),
                // alignSelf: 'center',
                alignItems: 'center',
              }}>
              <TextInput.Icon
                style={{paddingTop: h(1)}}
                onPress={() => {
                  const {token} = user;
                  console.log({newsugg});
                  if (newsugg === '') {
                    console.log('validation error');
                  } else {
                    this.setState({spinner: true});
                    createSuggestion(token, newsugg.trim().toLowerCase()).then((response) => {
                      const {data} = response;
                      console.log(data);
                      this.setState({
                        newsugg: '',
                        spinner: false,
                        showAlert: true,
                        title: 'Suggestion envoy??e',
                      });
                    });
                  }
                }}
                name="send"
                size={w(10)}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
        <Button
          color="white"
          mode="text"
          style={styles.ButtonInscrit(GlobalFunction.Choose(pro, colors.proBlue, colors.brown))}
          labelStyle={{fontSize: totalSize(2)}}
          onPress={() => {
            user.CentreInteret = interests;
            console.log('validation');
            this.setState({spinner: true});
            updateCentreInteret(user.token, user.CentreInteret)
              .then(async () => {
                this.setState({spinner: false});
                await AsyncStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                navigation.goBack();
              })
              .catch(() => {
                this.setState({spinner: false});
              });
          }}>
          Valider
        </Button>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={title}
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton
          confirmText="OK"
          confirmButtonColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
          onDismiss={() => {
            this.hideAlert();
          }}
        />
      </ScrollView>
    );
  };

  render() {
    const {navigation} = this.props;
    const {spinner} = this.state;
    return (
      <GlobalRender
        navigation={navigation}
        showAlert={false}
        title=""
        message=""
        type={3}
        spinner={spinner}
        Content={() => this.Content()}
        // hideAlert={() => this.hideAlert()}
      />
    );
  }
}

CentreDinterets.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

CentreDinterets.contextType = NoobaContext;
