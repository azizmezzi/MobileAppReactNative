import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import PropTypes from 'prop-types';
import {Grid, Row, Col} from 'native-base';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';

const styles = StyleSheet.create({
  headerView: {
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerViewText: {color: 'white', fontSize: totalSize(2)},
  centerView: {
    alignItems: 'center',
  },
  contentView: {
    flexDirection: 'row',
    marginTop: h(3),
  },
  descriptionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(1.8),
    marginTop: h(2),
    marginHorizontal: w(12),
  },
  secondContentView: {
    marginTop: h(2),
  },
  mainBrownText: (pro) => {
    return {
      color: pro ? colors.proBlue : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(2),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
});

export default class Jetons extends Component {
  Content = (pro, balance) => {
    const {navigation} = this.props;
    const {user, parrainage} = this.context;
    const reste = parrainage !== undefined ? parrainage % 3 : 0;

    let checks = reste;
    if (reste === 0) {
      if (parrainage >= 3) {
        checks = 3;
      } else {
        checks = reste;
      }
    }
    const redColors = pro ? colors.proBlue : colors.brown;
    return (
      <View style={{height: h(75)}}>
        <ScrollView>
          <View style={styles.centerView}>
            <View style={styles.contentView}>
              <Icon name="coins" size={30} color="gold" />
              <Text
                style={{
                  color: 'white',
                  fontSize: totalSize(2.2),
                  textTransform: 'uppercase',
                }}>
                {`  ${balance} Jeton(s)`}
              </Text>
            </View>
            <Text style={styles.descriptionText}>
              Nous vous offrons 4 jetons gratuits lors de votre inscription. Un jeton vous permet de
              créer un évènement et de le diffuser sur NOOBA. {'\n'} Au delà de ces jetons offerts,
              vous pouvez vous en procurer ci-dessous ou souscrire un abonnement illimité. Vous
              pouvez également parrainer des amis pour gagner de nouveaux jetons gratuitement
            </Text>
          </View>
          <View style={styles.secondContentView}>
            <Text style={styles.mainBrownText(pro)}>Acheter des jetons</Text>
            <Text
              style={{
                color: '#C15E68',
                fontSize: totalSize(2),
                marginLeft: w(3),
              }}>
              Profitez de nos offres de lancement !
            </Text>
            <Grid style={{marginTop: h(2), marginHorizontal: w(3)}}>
              <Row>
                <Col
                  style={{
                    alignItems: 'center',
                    borderWidth: 0.5,
                    borderRadius: 8,
                    borderColor: 'white',
                    marginHorizontal: w(2),
                    height: h(22),
                  }}>
                  <View style={{height: h(17)}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: h(2),
                        alignSelf: 'center',
                      }}>
                      <Icon name="coins" size={25} color="gold" />
                      <Text style={styles.mainBrownText(pro)}>1</Text>
                    </View>
                    <Text
                      style={{
                        //borderWidth: 5,
                        //borderColor: 'red',
                        textAlign: 'center',
                        height: h(3),
                        color: 'white',
                        fontSize: totalSize(2),
                        marginVertical: h(2),
                      }}>
                      pour <Text style={{color: '#C15E68'}}>4,99€</Text>
                    </Text>
                    <Text style={{fontSize: totalSize(1.5), color: 'white'}}>au lieu de 9,99€</Text>
                  </View>
                  <View style={{width: '100%', height: h(4.75)}}>
                    <Button
                      style={{borderRadius: 8, height: h(4.75)}}
                      labelStyle={{fontSize: totalSize(1.1)}}
                      compact
                      color={pro ? colors.proBlue : colors.brown}
                      mode="contained"
                      onPress={() => navigation.navigate('Offre', {achatJetons: true})}>
                      Bénéficier de l&apos;offre
                    </Button>
                  </View>
                </Col>
                <Col
                  style={{
                    alignItems: 'center',
                    borderWidth: 0.5,
                    borderRadius: 8,
                    borderColor: 'white',
                    marginHorizontal: w(2),
                    height: h(22),
                  }}>
                  <View style={{height: h(17)}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: h(2),
                        alignSelf: 'center',
                      }}>
                      <Icon name="coins" size={25} color="gold" />
                      <Text style={styles.mainBrownText(pro)}>illimités</Text>
                    </View>
                    <Text
                      style={{
                        //borderWidth: 5,
                        //borderColor: 'red',
                        textAlign: 'center',
                        height: h(3),
                        color: 'white',
                        fontSize: totalSize(2),
                        marginVertical: h(2),
                      }}>
                      pour <Text style={{color: '#C15E68'}}>9,99€/mois</Text>
                    </Text>
                    <Text style={{fontSize: totalSize(1.5), textAlign: 'center', color: 'white'}}>
                      au lieu de 19,99€ *
                    </Text>
                  </View>
                  <View style={{width: '100%', height: h(4.75)}}>
                    <Button
                      style={{borderRadius: 8, height: h(4.75)}}
                      labelStyle={{fontSize: totalSize(1.1)}}
                      compact
                      color={pro ? colors.proBlue : colors.brown}
                      mode="contained"
                      onPress={() => navigation.navigate('Offre', {achatJetons: false})}>
                      Bénéficier de l&apos;offre
                    </Button>
                  </View>
                </Col>
              </Row>
            </Grid>
            <Text
              style={{
                color: 'white',
                fontSize: totalSize(1.7),
                marginLeft: w(3),
                marginTop: h(2),
              }}>
              * Abonnement résiliable à tout moment
            </Text>
            <View style={styles.secondContentView}>
              <Text style={styles.mainBrownText(pro)}>Obtenir plus de jetons</Text>
              <Text style={styles.descriptionText}>
                Parrainez 3 amis et bénéficiez d&apos;un jeton gratuit. Voici le lien que vous devez
                leur partager pour gagnez vos jetons supplémentaires:
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(user.codeParrainage);
                }}>
                <Grid style={{marginTop: h(2)}}>
                  <Row
                    style={{
                      alignItems: 'center',
                      borderWidth: 0.5,
                      borderRadius: 8,
                      borderColor: 'white',
                      marginBottom: h(1),
                      marginHorizontal: w(2),
                      paddingVertical: h(1),
                    }}>
                    <Col style={{alignItems: 'center', width: w(10)}}>
                      {/* <Icon name="link" size={30} color="white" /> */}
                    </Col>
                    <Col style={{width: w(70)}}>
                      <Text style={{color: 'white', fontSize: totalSize(2), textAlign: 'center'}}>
                        {user.codeParrainage}
                      </Text>
                    </Col>
                    <Col style={{alignItems: 'center', width: w(20)}}>
                      <Icon name="link" size={20} color="white" />
                    </Col>
                  </Row>
                </Grid>
              </TouchableOpacity>
              <Text
                style={{
                  color: 'white',
                  // textAlign: 'center',
                  fontSize: totalSize(1.8),
                  marginTop: h(2),
                  marginHorizontal: w(8),
                }}>
                Etat d&apos;avancement:
              </Text>
              <Text
                style={{
                  color: 'white',
                  // textAlign: 'center',
                  fontSize: totalSize(1.8),
                  marginTop: h(2),
                  marginHorizontal: w(8),
                }}>
                Vous avez actuellement parrainé {parrainage} personne(s)
              </Text>
              <Grid style={{marginTop: h(2)}}>
                <Row
                  style={{
                    alignItems: 'center',

                    marginBottom: h(1),
                    // marginHorizontal: w(2),
                    // paddingVertical: h(1),
                  }}>
                  <Col style={{alignItems: 'center', width: w(33)}}>
                    <Button
                      style={{width: w(25)}}
                      labelStyle={{fontSize: totalSize(4)}}
                      compact
                      color={checks > 0 ? colors.green : redColors}
                      mode="contained">
                      <Icon
                        name={checks > 0 ? 'check' : 'times'}
                        size={totalSize(4)}
                        color="white"
                      />
                    </Button>
                  </Col>
                  <Col style={{alignItems: 'center', width: w(33)}}>
                    <Button
                      style={{width: w(25)}}
                      labelStyle={{fontSize: totalSize(4)}}
                      compact
                      color={checks > 1 ? colors.green : redColors}
                      mode="contained">
                      <Icon
                        name={checks > 1 ? 'check' : 'times'}
                        size={totalSize(4)}
                        color="white"
                      />
                    </Button>
                  </Col>
                  <Col style={{alignItems: 'center', width: w(33)}}>
                    <Button
                      style={{width: w(25)}}
                      labelStyle={{fontSize: totalSize(4)}}
                      compact
                      color={checks > 2 ? colors.green : redColors}
                      mode="contained">
                      <Icon
                        name={checks > 2 ? 'check' : 'times'}
                        size={totalSize(4)}
                        color="white"
                      />
                    </Button>
                  </Col>
                </Row>
              </Grid>
              <Text
                style={{
                  color: 'white',
                  // textAlign: 'center',
                  fontSize: totalSize(1.8),
                  // marginTop: h(2),
                  marginHorizontal: w(8),
                }}>
                * Vous pouvez parrainer des amis à l&apos;infini.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    const {pro, balance} = this.context;
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
          {this.Content(pro, balance)}
        </MainComponent>
      </>
    );
  }
}

Jetons.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Jetons.contextType = NoobaContext;
