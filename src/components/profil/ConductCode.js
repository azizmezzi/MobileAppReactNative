/* eslint-disable react/prop-types */
import React, {useContext} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, w, totalSize} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    marginBottom: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  justifiedText: {
    textAlign: 'justify',
    color: 'white',
  },
  mainPoint: {
    marginTop: h(2),
    color: 'white',
    textDecorationLine: 'underline',
  },
});

const regles = [
  'Nous vous demandons de respecter tous les utilisateurs.',
  'Nos valeurs prônent la diversité. Vous devez dès lors respecter les goûts et croyances des autres dans NOOBA. Nous sommes totalement en désaccord avec tout discours de haine, d’intimidation, ou toute discussion grossière, abusive ou misogyne. Nous vous invitons à signaler le profil des utilisateurs qui ne respectent pas ces règles.',
  'Nous vous demandons de vous intéresser à chacun des membres et d’inclure toute personne dans vos échanges sur NOOBA mais également dans la vraie vie lors des évènements organisés.',
  'NOOBA sert avant tout à faire des rencontres amicales. Veuillez vous diriger vers des événements clairement identifiés comme ayant un but de rencontre amoureuse si c’est la raison de votre participation à un évènement. En dehors de ces activités destinées aux célibataires, il est formellement interdit d’importuner ou de draguer les autres utilisateurs. Si c’est le cas, votre profil sera suspendu ou supprimé si vous ne respectez pas cette règle.',
  'Nous ne tolérons aucune activité illégale sur notre application. Si vous êtes coupable d’activités illicites, vous serez définitivement supprimé(e) et dénoncé(e) aux autorités.',
  'Nous n’acceptons aucun spam, sous peine d’exclusion.',
  'NOOBA n’autorise aucune vente et si vous vendez des articles vous risquez d’être bannis de la plateforme.',
];

const reglesPhotos = [
  'nous ne tolérons aucun enfant seul, ceux-ci doivent être vêtus et accompagnés d’au moins un adulte;',
  'ne n’acceptons aucune photo en bikini, maillot de bain, sous-vêtements ou torse nu ;',
  'votre visage doit être clairement visible sur les photos que vous utilisez ;',
  'aucun contenu pornographique ne sera toléré ;',
  'aucune arme à feu ni de photo de chasse ne peut être utilisée sur l’application.',
];

const BulletPoint = (text) => {
  return (
    <Text style={{color: 'white', textAlign: 'justify', marginRight: w(2)}}>
      {'\u2022'} {text}
    </Text>
  );
};

const MiniBulletPoint = (text) => {
  return (
    <View style={{marginLeft: w(5)}}>
      <Text style={{color: 'white', textAlign: 'justify'}}>
        - {text} {'\n'}
      </Text>
    </View>
  );
};

export default function ConductCode(props) {
  const {navigation} = props;
  const context = useContext(NoobaContext);
  const {pro} = context;

  return (
    <>
      <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
        <HeaderComponent
          bgColor={pro ? colors.proBlue : colors.brown}
          navigation={navigation}
          height={9}
          fontsize={30}
          type
          showBackButton
          notif
        />
        <ScrollView style={{marginBottom: h(10)}}>
          <Text style={styles.headerColMidText}>Code de conduite</Text>
          <View style={{marginHorizontal: w(5)}}>
            <Text style={styles.justifiedText}>
              Ce code de conduite regroupe un ensemble de règles. Nos Conditions générales ont été
              rédigées de manière à rendre l’application fiable et responsable pour tous.{' '}
            </Text>
            <Text style={styles.mainPoint}>Régles</Text>
            <View style={{marginTop: h(1)}}>{regles.map((text) => BulletPoint(text))}</View>
            <Text style={styles.mainPoint}>Profil</Text>
            <View style={{marginTop: h(1)}}>
              <Text style={styles.justifiedText}>
                Il est interdit de vous faire passer pour quelqu’un d’autre. Cela entraînera la
                suppression de votre compte et le bannissement définitif.
              </Text>
            </View>
            <Text style={styles.mainPoint}>Photos utilisées</Text>
            <View style={{marginTop: h(1)}}>
              <Text style={styles.justifiedText}>
                Les photos que vous mettez en ligne ne peuvent être que vos propres photos et ne
                doivent en aucun cas afficher d’autres personnes, qui plus est sans leur accord.
                Vous devez détenir les droits si vous publiez une photo ou une vidéo. Vous devez
                obligatoirement publier des photos libres de droit si les photos que vous publiez ne
                sont pas les vôtres.
              </Text>
            </View>
            <View style={{marginTop: h(1)}}>
              <Text style={styles.justifiedText}>
                Les photos de votre profil, des événements ou toute autre photo utilisée dans NOOBA
                doit respecter toute une série de règles:
              </Text>
              <View style={{marginTop: h(1)}}>
                {reglesPhotos.map((text) => MiniBulletPoint(text))}
              </View>
            </View>
            <Text style={styles.mainPoint}>Sécurité</Text>
            <View style={{marginTop: h(1)}}>
              <Text style={styles.justifiedText}>
                Veuillez ne mentionner aucune donnée personnelle à aucun endroit de l’application,
                ou en dehors si quelqu’un vous le demande.
              </Text>
            </View>
            <Text style={styles.mainPoint}>En définitive</Text>
            <View style={{marginTop: h(1), marginBottom: h(5)}}>
              <Text style={styles.justifiedText}>
                NOOBA s’adresse à toute personne de 18 ans ou plus. Nous nous permettrons de
                surveiller les messages et contenus si nous soupçonnons qu’ils violent les consignes
                précitées et qu’ils vont à l’encontre de nos conditions générales.
              </Text>
              <Text style={styles.justifiedText}>
                Si ces différentes règles ne sont pas suivies, vous vous exposez à recevoir un
                avertissement ou à être définitivement banni(e) de NOOBA. Si vous recevez un
                avertissement et que vous n'en tenez pas compte, vous risquez de perdre
                définitivement votre profil.
              </Text>
              <Text style={styles.justifiedText}>
                NOOBA tend à ce que chaque personne passe un agréable moment, dans le respect de la
                dignité humaine, de la tolérance et du respect.
              </Text>
            </View>
          </View>
        </ScrollView>
      </MainComponent>
    </>
  );
}
