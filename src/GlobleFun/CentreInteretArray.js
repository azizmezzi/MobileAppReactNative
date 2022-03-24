import {View, Text} from 'react-native';
import React from 'react';
import {h, totalSize, w} from '../tools/Dimensions';
import colors from '../constant/colors';

const First = (title, pro) => {
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
          fontSize: totalSize(2),
          paddingLeft: w(5),
          paddingTop: h(1),
          fontWeight: 'bold',
        }}>
        {title}
      </Text>
    </View>
  );
};

const CentreInteretArray = (pro) => [
  {
    title: First('les plus populaires', pro),
    content: [
      'Apero',
      'Tourisme',
      'Course à pied',
      'Vélo',
      'Photographie',
      'Yoga',
      'Activités humanitaires',
      'Voyage',
      'Randonnée',
      'Gaming',
    ],
  },

  {
    title: First(`Activités festives`, pro),
    content: [
      'Faire la fête',
      'Boire un verre',
      'Afterwork',
      'Barbecue',
      'Musique',
      'Discothèque',
      'Festivals',
      'DJ',
      'Apero',
      'Mixologie',
    ],
  },
  {
    title: First('Activités culinaires', pro),
    content: [
      'Manger un bout',
      'Ateliers cuisine',
      'Restaurant',
      'Gastronomie',
      'Brunch',
      'Patisserie',
      'Œnologie (vins)',
      'Zythologie (bières)',
    ],
  },
  {
    title: First('Activités pour les cinéphiles', pro),
    content: ['Aller au cinéma', 'Regarder la télé', 'Films', 'Manga'],
  },
  {
    title: First('Activités jeux', pro),
    content: ['Jeux de société', 'Jeux vidéos', 'Billiard', 'Poker', 'Casino', 'Gaming'],
  },
  {
    title: First('Activités nature', pro),
    content: [
      'Nature',
      'Jardinage',
      'Balade pour chien',
      'Randonnée',
      'Camping ',
      'Balades',
      'Zoo',
      'Visite guidée',
      'Tourisme',
    ],
  },
  {
    title: First(`Activités d'extérieur`, pro),
    content: [
      "Parc d'attraction",
      "Activités d'eau",
      'Moto',
      'Bateau',
      'Paintball',
      'Piscine',
      'Visite guidée',
    ],
  },
  {
    title: First(`Activités high-tech`, pro),
    content: ['Réalité Virtuelle', 'Technologie'],
  },
  {
    title: First(`activités sportives`, pro),
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
      'Course à pied',
      'Danse',
      'Karting',
      'Snowboard',
      'Ski',
      'Ski nautique',
      'Plongée',
      'Rafting',
      'Kayak',
      'Parapente',
      'Parachutisme',
      'Fléchettes',
      'Roller',
      'Patinage ',
      'Skateboard',
      'Padel',
      'Wakeboard',
      'Surf',
      'Athlétisme',
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
      'Vélo',
      'Piscine',
    ],
  },

  {
    title: First(`Loirsirs artistiques`, pro),
    content: [
      'Photographie',
      'Couture',
      'Peinture',
      'Décoration',
      'DIY',
      'Chant',
      'Composition musicale',
      'Dessin',
      'Art Floral',
      'Bricolage',
      'Pièce de théâtre',
      'Musée',
      'Exposition',
      'Mode',
      'Make-up',
      'Humour/Stand up',
      'Concerts',
      'Théâtre',
    ],
  },
  {
    title: First(`LifeStyle`, pro),
    content: [
      'Ecologie',
      'Zéro déchets',
      'Activités humanitaires',
      'Entreprenariat',
      'Yoga',
      'Meditation',
      'Formation',
      'Bien-être',
    ],
  },
  {
    title: First(`Dépaysement`, pro),
    content: ['Wellness', 'Voyage', 'Gîtes', 'Glamping', 'Montgolfière', 'Expérience insolite'],
  },
  {
    title: First(`Activités diverses`, pro),
    content: [
      'Activités pour enfants',
      'Activités insolites',
      'Shopping',
      'Automobile',
      'Bien être animal',
    ],
  },
];

export default CentreInteretArray;
