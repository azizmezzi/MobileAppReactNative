import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Spinner from 'react-native-loading-spinner-overlay';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {AcheterToken} from '../../provider/authentification';
import {NoobaContext} from '../../provider/provider';

const styles = StyleSheet.create({
  ButtonInscrit: (backgroundColor) => {
    return {
      marginTop: h(7),
      alignSelf: 'center',
      color: 'white',
      backgroundColor,
      width: w(50),
    };
  },
});

export default class Offre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokens: 1,
      spinner: false,
    };
  }

  Content = (pro) => {
    const {tokens} = this.state;
    const {user, setBalance, balance, setUser} = this.context;
    const {
      navigation,
      // eslint-disable-next-line react/prop-types
      route: {
        // eslint-disable-next-line react/prop-types
        params: {achatJetons},
      },
    } = this.props;
    const cout = tokens * 4.99;
    return (
      <View style={{height: h(75)}}>
        <ScrollView>
          <Text
            style={{
              marginTop: h(3),
              textAlign: 'center',
              color: 'white',
              fontSize: totalSize(2),
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}>
            Souscrire un abonnement
          </Text>

          <View
            style={{
              marginTop: h(7),
              alignItems: 'center',
              alignSelf: 'center',
              borderWidth: 0.5,
              borderRadius: 8,
              borderColor: pro ? colors.proBlue : colors.brown,
              marginHorizontal: w(2),
              height: h(20),
              width: w(60),
              flexDirection: 'row',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                height: h(20),
                width: w(20),
              }}>
              <Icon name="coins" size={w(15)} color="gold" />
            </View>
            <View
              style={{
                width: w(20),
                height: h(20),
                alignSelf: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                // alignItems: 'center',
              }}>
              <Text
                style={{
                  marginLeft: w(2),
                  color: 'white',
                  fontSize: totalSize(2),
                  fontWeight: 'bold',
                }}>
                {achatJetons ? 'Jeton' : 'Illimités'}
              </Text>
              <Text
                style={{
                  marginLeft: w(2),
                  color: 'white',
                  fontSize: totalSize(1.8),
                }}>
                {achatJetons ? `${cout.toFixed(2)}€` : '9.99€'}
              </Text>
            </View>

            {achatJetons && (
              <View
                style={{
                  width: w(20),
                  height: h(20),
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({tokens: tokens + 1});
                  }}
                  style={{
                    marginBottom: h(1),
                    height: w(8),
                    width: w(8),
                    borderRadius: w(8) / 2,
                    backgroundColor: pro ? colors.proBlue : colors.brownClair,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="plus" size={w(4)} color="white" />
                </TouchableOpacity>
                <Text
                  style={{
                    marginBottom: h(1),
                    color: 'white',
                    fontSize: totalSize(2),
                    fontWeight: 'bold',
                  }}>
                  {tokens}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({tokens: tokens - 1});
                  }}
                  style={{
                    height: w(8),
                    width: w(8),
                    borderRadius: w(8) / 2,
                    backgroundColor: pro ? colors.proBlue : colors.brown,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="minus" size={w(4)} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View
            style={{
              marginTop: h(2),
              alignItems: 'center',
              alignSelf: 'center',
              borderWidth: 0.5,
              borderRadius: 8,
              borderColor: pro ? colors.proBlue : colors.brown,
              backgroundColor: pro ? colors.proBlue : colors.brownClair,
              marginHorizontal: w(2),
              height: h(15),
              width: w(60),
            }}>
            <View
              style={{
                height: h(8),
                width: w(50),
                borderColor: 'white',
                borderBottomWidth: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  width: w(35),
                  marginLeft: w(2),
                  color: 'white',
                  fontSize: totalSize(1.8),
                }}>
                Total
              </Text>

              <Text
                style={{
                  width: w(15),
                  marginLeft: w(2),
                  color: 'white',
                  fontSize: totalSize(1.8),
                }}>
                {achatJetons ? `${cout.toFixed(2)}€` : '9.99€'}
              </Text>
            </View>

            <View
              style={{
                height: h(7),
                width: w(50),

                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  width: w(35),
                  marginLeft: w(2),
                  color: 'white',
                  fontSize: totalSize(2),
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                }}>
                Total TTC
              </Text>

              <Text
                style={{
                  width: w(15),
                  marginLeft: w(2),
                  color: 'white',
                  fontSize: totalSize(2),
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                }}>
                {achatJetons ? `${cout.toFixed(2)}€` : '9.99€'}
              </Text>
            </View>
          </View>
          <Button
            color="white"
            mode="text"
            style={styles.ButtonInscrit(pro ? colors.proBlue : colors.brown)}
            labelStyle={{fontSize: totalSize(2)}}
            onPress={() => {
              this.setState({spinner: true});
              if (achatJetons) {
                AcheterToken(user.token, tokens)
                  .then(() => {
                    this.setState({spinner: false});
                    navigation.navigate('Jeton');
                    const balance2 = parseInt(tokens, 10) + parseInt(balance, 10);

                    setBalance(balance2);
                  })
                  .catch(() => this.setState({spinner: false}));
              } else {
                AcheterToken(user.token, -1)
                  .then(async () => {
                    this.setState({spinner: false});

                    user.illimite = true;
                    setUser(user);
                    await AsyncStorage.setItem('user', JSON.stringify(user));
                    navigation.navigate('Abonnementillimte');
                  })
                  .catch(() => this.setState({spinner: false}));
              }
            }}>
            Valider
          </Button>
        </ScrollView>
      </View>
    );
  };

  // ContentIllimite = (pro) => {
  //   const {navigation} = this.props;
  //   const {user, setUser} = this.context;
  //   return (
  //     <View style={{height: h(75)}}>
  //       <ScrollView>
  //         <Text
  //           style={{
  //             marginTop: h(3),
  //             textAlign: 'center',
  //             color: 'white',
  //             fontSize: totalSize(2),
  //             textTransform: 'uppercase',
  //             fontWeight: 'bold',
  //           }}>
  //           Souscrire un abonnement
  //         </Text>

  //         <View
  //           style={{
  //             marginTop: h(7),
  //             alignItems: 'center',
  //             alignSelf: 'center',
  //             borderWidth: 0.5,
  //             borderRadius: 8,
  //             borderColor: pro ? colors.proBlue : colors.brown,
  //             marginHorizontal: w(2),
  //             height: h(20),
  //             width: w(60),
  //             flexDirection: 'row',
  //           }}>
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               alignSelf: 'center',
  //               justifyContent: 'center',
  //               alignContent: 'center',
  //               alignItems: 'center',
  //               height: h(20),
  //               width: w(20),
  //             }}>
  //             <Icon name="coins" size={w(15)} color="gold" />
  //           </View>
  //           <View
  //             style={{
  //               width: w(40),
  //               height: h(20),
  //               alignSelf: 'center',
  //               justifyContent: 'center',
  //               alignContent: 'center',
  //               // alignItems: 'center',
  //             }}>
  //             <Text
  //               style={{
  //                 marginLeft: w(2),
  //                 color: 'white',
  //                 fontSize: totalSize(2),
  //                 fontWeight: 'bold',
  //               }}>
  //               Illimités
  //             </Text>
  //             <Text style={{marginLeft: w(2), color: 'white', fontSize: totalSize(1.8)}}>
  //               5.99€
  //             </Text>
  //           </View>
  //         </View>
  //         <View
  //           style={{
  //             marginTop: h(2),
  //             alignItems: 'center',
  //             alignSelf: 'center',
  //             borderWidth: 0.5,
  //             borderRadius: 8,
  //             borderColor: pro ? colors.proBlue : colors.brown,
  //             backgroundColor: pro ? colors.proBlue : colors.brownClair,
  //             marginHorizontal: w(2),
  //             height: h(15),
  //             width: w(60),
  //           }}>
  //           <View
  //             style={{
  //               height: h(8),
  //               width: w(50),
  //               borderColor: 'white',
  //               borderBottomWidth: 1,
  //               flexDirection: 'row',
  //               alignItems: 'center',
  //             }}>
  //             <Text
  //               style={{
  //                 width: w(35),
  //                 marginLeft: w(2),
  //                 color: 'white',
  //                 fontSize: totalSize(1.8),
  //               }}>
  //               Total
  //             </Text>

  //             <Text
  //               style={{
  //                 width: w(15),
  //                 marginLeft: w(2),
  //                 color: 'white',
  //                 fontSize: totalSize(1.8),
  //               }}>
  //               5.99€
  //             </Text>
  //           </View>

  //           <View
  //             style={{
  //               height: h(7),
  //               width: w(50),

  //               flexDirection: 'row',
  //               alignItems: 'center',
  //             }}>
  //             <Text
  //               style={{
  //                 width: w(35),
  //                 marginLeft: w(2),
  //                 color: 'white',
  //                 fontSize: totalSize(2),
  //                 textTransform: 'uppercase',
  //                 fontWeight: 'bold',
  //               }}>
  //               Total TTC
  //             </Text>

  //             <Text
  //               style={{
  //                 width: w(15),
  //                 marginLeft: w(2),
  //                 color: 'white',
  //                 fontSize: totalSize(2),
  //                 textTransform: 'uppercase',
  //                 fontWeight: 'bold',
  //               }}>
  //               5.99€
  //             </Text>
  //           </View>
  //         </View>
  //         <Button
  //           color="white"
  //           mode="text"
  //           style={styles.ButtonInscrit(pro ? colors.proBlue : colors.brown)}
  //           labelStyle={{fontSize: totalSize(2)}}
  //           onPress={() => {
  //             this.setState({spinner: true});
  //             AcheterToken(user.token, -1)
  //               .then(async () => {
  //                 this.setState({spinner: false});

  //                 user.illimite = true;
  //                 setUser(user);
  //                 await AsyncStorage.setItem('user', JSON.stringify(user));
  //                 navigation.navigate('Abonnementillimte');
  //               })
  //               .catch(() => this.setState({spinner: false}));
  //           }}>
  //           Valider
  //         </Button>
  //       </ScrollView>
  //     </View>
  //   );
  // };

  render() {
    const {
      navigation,
      route: {
        params: {achatJetons},
      },
    } = this.props;
    const {pro} = this.context;
    const {spinner} = this.state;
    console.log({achatJetons});
    return (
      <>
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
          <HeaderComponent
            navigation={navigation}
            height={9}
            fontsize={30}
            type
            showBackButton
            bgColor={pro ? colors.proBlue : colors.brown}
            notif
          />
          <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />

          {this.Content(pro)}
        </MainComponent>
      </>
    );
  }
}

Offre.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
Offre.contextType = NoobaContext;
