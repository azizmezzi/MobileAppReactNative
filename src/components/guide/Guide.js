/* eslint-disable global-require */
import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import colors from '../../constant/colors';
import {h, totalSize, w} from '../../tools/Dimensions';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import SuivantBtn from '../landingComponents/SuivantBtn';
import {NoobaContext} from '../../provider/provider';

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: h(2),
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  questionText: {
    marginTop: h(-0.5),
    textAlign: 'center',
    color: 'white',
    marginLeft: w(4),
    marginRight: w(4),
    fontSize: totalSize(3),
    textTransform: 'uppercase',
  },
  guideText: {
    marginTop: h(0.5),
    marginBottom: h(2),
    marginHorizontal: w(2),
    textAlign: 'center',
    color: 'white',
    fontSize: totalSize(1.5),
    marginLeft: w(5),
    marginRight: w(5),
  },
  iconContainer: {textAlign: 'center', marginTop: h(5)},
});

const guideData = [
  {
    icon: require('../../assets/guide/confetti.png'),
    title: 'Bienvenue sur NOOBA',
    content: "Participez à des activités de groupe qui correspondent à vos centres d'intérêts",
  },
  // {
  //   icon: require('../../assets/guide/account.png'),
  //   title: 'Complétez votre profil',
  //   content:
  //     "Ajoutez vos centres d'intérêts sur votre profil et restez informé des activités qui vous correspondent.",
  // },
  {
    icon: require('../../assets/guide/sports.png'),
    title: "Découvrez le fil d'actualité",
    content: `Il vous permet de visualiser les activités proches de chez vous. Celles-ci sont organisées par d'autres personnes comme vous ou par des professionnels.`,
  },
  {
    icon: require('../../assets/guide/messagerie.png'),
    title: 'Discutez au travers de la messagerie de groupe',
    content: `Elle n'est accessible qu'à partir du moment où vous avez confirmé votre participation à une activité et vous permet de discuter avec les autres participants. Pas de discussion individuelle possible dans NOOBA, nous veillons à conserver une dynamique de groupe dans tous les évènements`,
  },
  {
    icon: require('../../assets/guide/calendar.png'),
    title: `Découvrez l'agenda`,
    content: ` Il vous permet de gérer les évènements que vous avez créés, rejoints ou enregistrés. `,
  },
  {
    icon: require('../../assets/guide/coin.png'),
    title: 'Profitez de réductions',
    content: `Les professionnels qui vous proposent des activités offrent des réductions ou des cadeaux en échange de votre participation (à l'appréciation de chaque établissement).`,
  },
];

const proGuideData = [
  {
    icon: require('../../assets/guide/confetti.png'),
    title: 'Bienvenue sur NOOBA !!',
    content:
      "Boostez la visibilité de votre établissement grâce à notre communauté d'utilisateurs à la recherche d'évènements qui correspondent à leurs centres d'intérêts. ",
  },
  {
    icon: require('../../assets/guide/account.png'),
    title: 'Boostez votre fréquentation',
    content:
      'Publiez vos évènements sur NOOBA et remplissez votre établissement et/ou vos activités même en périodes creuses.',
  },
  {
    icon: require('../../assets/guide/calendar.png'),
    title: 'Gérez vos évènements',
    content:
      "Créez et gérez vos évènements depuis votre agenda. Discutez également avec les participants grâce à la messagerie de l'évènement.",
  },
  {
    icon: require('../../assets/guide/sports.png'),
    title: 'Cochez vos intérêts',
    content:
      "Lorsque vous organisez vos évènements, renseignez un maximum d'intérêts afin de toucher le bon public cible !",
  },
  {
    icon: require('../../assets/guide/coin.png'),
    title: 'Proposez des réductions ou cadeaux',
    content:
      'Attirez des groupes de personnes et faites leur bénéficier de promotions/cadeaux en échange de leurs participations.',
  },
];

export default class Guide extends Component {
  constructor(props) {
    super(props);
    this.swiperRef = React.createRef();
    this.state = {
      index: 0,
    };
  }

  componentDidMount() {
    const {route} = this.props;
    const {params} = route || {pro: false};
    const {pro} = params;
    console.log({pro});
  }

  renderItem = (item, index) => (
    <View key={index} style={{width: w(100)}}>
      <View style={{alignItems: 'center'}}>
        <Image
          resizeMode="contain"
          style={{alignSelf: 'center', width: w(23), height: h(23)}}
          // eslint-disable-next-line global-require
          source={item.icon}
        />
      </View>
      <Text style={styles.questionText}>{item.title}</Text>
      <Text style={styles.guideText}>{item.content}</Text>
    </View>
  );

  Content = () => {
    const {navigation, route} = this.props;
    const {params} = route || {pro: false};
    const {pro} = params;
    const {index} = this.state;
    return (
      <>
        <View style={{opacity: index < 4 ? 1 : 0}}>
          <TouchableOpacity
            onPress={() => {
              const {context} = this;
              context.setLoggedin(true);
              if (pro) {
                navigation.navigate('AttendreConfirmation', {
                  token: context.user.token,
                  firstTime: true,
                });
              } else {
                /* if (pro) {
                    navigation.navigate('Profil', {pro});
                  } else {
                    
                  } */
                navigation.navigate('Home', {pro});
              }
            }}
            style={{
              marginTop: h(4),
              marginRight: w(3),
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: totalSize(1.8),
                marginRight: w(2),
                textTransform: 'uppercase',
              }}>
              Skip{' '}
            </Text>
            <Icon2 name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Swiper
          ref={(swiper) => {
            this.swiperRef = swiper;
          }}
          activeDot={
            <View
              style={{
                backgroundColor: 'white',
                width: 8,
                height: 8,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          }
          dot={
            <View
              style={{
                backgroundColor: colors.gris,
                width: 8,
                height: 8,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
              }}
            />
          }
          style={styles.mainContainer}
          showsButtons={false}
          onIndexChanged={(index1) => {
            console.log(index1);
            this.setState({index: index1});
          }}
          loop={false}>
          {pro !== false
            ? proGuideData.map((item, indexe) => this.renderItem(item, indexe))
            : guideData.map((item, indexe) => this.renderItem(item, indexe))}
        </Swiper>

        <View
          style={{
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
            marginBottom: h(-2),
          }}>
          <SuivantBtn
            bgColor={pro ? colors.proBlue : undefined}
            onPress={() => {
              this.swiperRef.scrollBy(1, true);
              if (index === 4) {
                const {context} = this;
                context.setLoggedin(true);
                if (pro) {
                  navigation.navigate('AttendreConfirmation', {
                    token: context.user.token,
                    firstTime: true,
                  });
                } else {
                  /* if (pro) {
                    navigation.navigate('Profil', {pro});
                  } else {
                    
                  } */
                  navigation.navigate('Home', {pro});
                }
              }
            }}
          />
        </View>
      </>
    );
  };

  render() {
    const {navigation, route} = this.props;
    const {params} = route || {pro: false};
    const {pro} = params;
    return (
      <>
        <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
          <HeaderComponent
            navigation={navigation}
            height={15}
            showBackButton={false}
            showSubTitle
            showHeaderText
            bgColor={pro ? colors.proBlue : colors.brown}
          />
          {this.Content()}
        </MainComponent>
      </>
    );
  }
}

Guide.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      pro: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

Guide.contextType = NoobaContext;
