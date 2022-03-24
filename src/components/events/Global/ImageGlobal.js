/* eslint-disable prettier/prettier */
/* eslint-disable global-require */
import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, ScrollView} from 'react-native';
import GridList from 'react-native-grid-list';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary} from 'react-native-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';

import colors from '../../../constant/colors';
import HeaderComponent from '../../landingComponents/HeaderComponent';
import MainComponent from '../../landingComponents/MainComponent';
import SuivantBtn from '../../landingComponents/SuivantBtn';
import {h, w, totalSize} from '../../../tools/Dimensions';
import {NoobaContext} from '../../../provider/provider';
import texts from '../../../constant/texts';
import {images, images2} from '../../../constant/Images';
import {ModifEventImage1, ModifEventImage2} from '../../../provider/events';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    fontSize: totalSize(2.1),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  mainBrownText: (color) => {
    return {
      marginTop: h(3),
      color: color !== undefined ? color : colors.brown,
      textTransform: 'uppercase',
      fontSize: totalSize(2.4),
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
  descriptionText: {
    marginTop: h(1),
    color: 'white',
    fontSize: totalSize(2),
    marginLeft: w(3),
  },
  voirPlus: {
    color: 'white',
    fontSize: totalSize(2),
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    marginRight: w(3),
  },
  iconContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: h(5),
  },
  ImageContainer: {justifyContent: 'center', alignSelf: 'center', marginTop: h(5)},
  Image: {height: h(25), width: w(60)},
});

export default class ImageGlobal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: '',
      showBiblio: false,
      pos: null,
      spinner: false,
      showAlert: false,
      title: '',
      message: '',
    };
  }

  componentDidMount() {
    const type = this.props;
    if (type) {
      const {newEvent} = this.context;
      if (newEvent.url !== undefined) {
        this.setState({path: newEvent.url, pos: newEvent.pos});
      }
    }
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  renderImage = (item, index) => {
    const {uri} = item;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          this.setState({path: uri, pos: index});
        }}>
        <FastImage style={{width: w(25), height: h(14)}} resizeMode="cover" source={{uri}} />
      </TouchableOpacity>
    );
  };

  renderGalleryItem = ({item, index}) => {
    const {uri} = item;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          this.setState({path: uri, pos: index, showBiblio: false});
        }}>
        <FastImage style={{width: '100%', height: '100%'}} resizeMode="cover" source={{uri}} />
      </TouchableOpacity>
    );
  };

  UploadImage = () => {
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.4, maxWidth: 500, maxHeight: 500},
      (response) => {
        if (!response.didCancel && !response.error) {
          this.setState({
            path: response.uri,
            pos: null,
          });
        }
      },
    );
  };

  CreateProcess = (contextProps) => {
    const {navigation} = this.props;
    const {newEvent, setNewEvent} = contextProps;
    const {path, pos} = this.state;
    const {
      context: {pro},
    } = this;
    if (path !== '') {
      newEvent.url = path;

      newEvent.pos = pos;
      setNewEvent(newEvent);

      if (pro) {
        navigation.navigate('Step42');
      } else {
        navigation.navigate('Step5');
      }
    } else {
      this.setState({
        showAlert: true,
        title: texts.invalid_Image_title,
        message: texts.invalid_Image_text,
      });
    }
  };

  UpdateProcess = () => {
    const {eventView, events, setEvents, ShowEvent, user} = this.context;
    const {path, pos} = this.state;
    const {navigation} = this.props;

    // eslint-disable-next-line no-underscore-dangle
    const IMAGES = {image: path, eventId: eventView._id};
    this.setState({spinner: true});
    if (pos === null) {
      ModifEventImage1(IMAGES, user.token)
        .then((response) => {
          this.TurnSpinnerOff();
          const {data} = response;

          // eslint-disable-next-line no-underscore-dangle
          const index = events.findIndex((e) => e._id === eventView._id);

          if (index !== -1) {
            events[index] = data.result;
            setEvents(events);
            ShowEvent(data.result);
          }

          navigation.goBack();
        })
        .catch((e) => {
          console.log(e);
          this.TurnSpinnerOff();
        });
    } else {
      // eslint-disable-next-line no-underscore-dangle
      const imageData = {image: `${pos}.jpg`, eventId: eventView._id};
      ModifEventImage2(imageData, user.token)
        .then((response) => {
          this.setState({
            spinner: false,
          });
          const {data} = response;
          // eslint-disable-next-line no-underscore-dangle
          const index = events.findIndex((e) => e._id === eventView._id);

          if (index !== -1) {
            events[index] = data.result;
            setEvents(events);
            ShowEvent(data.result);
          }
          navigation.goBack();
        })
        .catch((e) => {
          console.log(e);
          this.TurnSpinnerOff();
        });
    }
  };

  TurnSpinnerOff = () => {
    this.setState({
      spinner: false,
    });
  };

  Content = (contextProps) => {
    const {
      route: {
        params: {type},
      },
    } = this.props;
    const {
      context: {pro},
    } = this;
    const {path} = this.state;
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}>
        <Text style={styles.headerColMidText}>
          {type ? 'Créer un évènement' : `modifier l'évènement`}
        </Text>
        <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
          Photo d&apos;évènement
        </Text>
        <Text style={styles.descriptionText}>
          Choisissez une photo qui définit votre thème d&apos;évènement
        </Text>
        <View style={{height: h(14)}}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            style={{marginVertical: h(2), height: h(14)}}>
            {images2.map((item, index) => this.renderImage(item, index))}
          </ScrollView>
        </View>
        <TouchableOpacity onPress={() => this.setState({showBiblio: true})}>
          <Text style={styles.voirPlus}>Voir plus</Text>
        </TouchableOpacity>
        <Text style={styles.descriptionText}>Ou importez une photo</Text>
        {path === '' ? (
          <TouchableOpacity activeOpacity={0.8} style={styles.iconContainer}>
            <Icon onPress={this.UploadImage} name="plus-square" size={60} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.UploadImage} style={styles.ImageContainer}>
            <FastImage source={{uri: path}} resizeMode="contain" style={styles.Image} />
          </TouchableOpacity>
        )}
        <View
          style={{
            marginTop: h(3),
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SuivantBtn
            bgColor={pro ? colors.proBlue : undefined}
            onPress={() => {
              if (type) this.CreateProcess(contextProps);
              else this.UpdateProcess();
            }}
          />
        </View>
      </ScrollView>
    );
  };

  Modal = () => {
    return (
      <ScrollView>
        <GridList data={images} numColumns={3} renderItem={this.renderGalleryItem} />
      </ScrollView>
    );
  };

  render() {
    const {
      context: {pro},
      state: {spinner, showBiblio},
      props: {navigation},
    } = this;

    const {showAlert, message, title} = this.state;
    return (
      <NoobaContext.Consumer>
        {(props) => {
          return (
            <>
              <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />

              <MainComponent bgColor={pro ? colors.proBlue : colors.brown}>
                <HeaderComponent
                  navigation={navigation}
                  height={9}
                  fontsize={30}
                  type
                  bgColor={pro ? colors.proBlue : colors.brown}
                  showBackButton
                  goBackAction={() => {
                    if (showBiblio) {
                      this.setState({showBiblio: false});
                    } else {
                      navigation.goBack();
                    }
                  }}
                />
                {showBiblio ? this.Modal() : this.Content(props)}
                <AwesomeAlert
                  show={showAlert}
                  showProgress={false}
                  title={title}
                  message={message}
                  closeOnTouchOutside
                  closeOnHardwareBackPress={false}
                  showCancelButton={false}
                  showConfirmButton
                  confirmText="OK"
                  // confirmText="Yes, delete it"
                  confirmButtonColor={pro ? colors.proBlue : colors.brown}
                  onConfirmPressed={() => {
                    this.hideAlert();
                  }}
                  onDismiss={() => {
                    this.hideAlert();
                  }}
                />
              </MainComponent>
            </>
          );
        }}
      </NoobaContext.Consumer>
    );
  }
}

ImageGlobal.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      type: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

ImageGlobal.contextType = NoobaContext;
