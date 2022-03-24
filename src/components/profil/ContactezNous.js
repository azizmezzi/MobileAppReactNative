import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMCI2 from 'react-native-vector-icons/MaterialIcons';
import IconMCI3 from 'react-native-vector-icons/AntDesign';
import {Button} from 'react-native-paper';
import colors from '../../constant/colors';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import {h, totalSize, w} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';
import texts from '../../constant/texts';

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
    // textAlign: 'center',
    // fontWeight: 'bold',
    fontSize: totalSize(1.3),
    // textTransform: 'uppercase',
  },
  TextForInput: {
    marginTop: h(2),
    marginBottom: h(1),
    color: 'white',
    width: w(100),
    // textAlign: 'center',
    // fontWeight: 'bold',
    fontSize: totalSize(1.4),
    // textTransform: 'uppercase',
  },
  positionIcon: {marginRight: w(10), marginLeft: w(15)},

  fieldStyle: {
    // marginTop: h(2),
    height: h(6),
    fontSize: totalSize(2),
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 0.5,
    // marginHorizontal: w(5),
    borderRadius: 17,
    paddingHorizontal: w(2),
    color: 'white',
  },
  ButtonInscrit: (pro) => {
    return {
      marginTop: h(3),
      alignSelf: 'center',
      color: 'white',
      backgroundColor: pro ? colors.proBlue : colors.brown,
      width: w(50),
    };
  },
});

export default class ContactezNous extends Component {
  constructor(props) {
    super(props);
    this.scrollViewRef = React.createRef();
    this.state = {
      prenom: '',
      email: '',
      message: '',
      showAlert: false,
      title: '',
      alertMessage: '',
    };
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      alertMessage: '',
    });
  };

  componentDidMount() {
    const {
      context: {
        user: {name, email},
      },
    } = this;
    this.setState({email, prenom: name});
  }

  Content = () => {
    const {prenom, email, message} = this.state;
    const {
      context: {pro},
    } = this;
    return (
      <KeyboardAvoidingView behavior="height">
        <ScrollView
          ref={(ref) => {
            this.scrollViewRef = ref;
          }}>
          <Text style={styles.headerColMidText}>Contactez-Nous</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://m.facebook.com/NOOBA-109650880738141');
            }}
            style={{flexDirection: 'row'}}>
            <View>
              <IconMCI3
                color="#3d5a98"
                size={w(8)}
                name="facebook-square"
                style={{...styles.positionIcon}}
              />
            </View>
            <Text style={styles.TextStyme}>via notre page Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://www.instagram.com/nooba.app/');
            }}
            style={{flexDirection: 'row'}}>
            <View>
              <IconMCI color="white" size={w(8)} name="instagram" style={styles.positionIcon} />
            </View>
            <Text style={styles.TextStyme}>via notre compte instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://nooba.app');
            }}
            style={{flexDirection: 'row'}}>
            <View>
              <IconMCI2 color="white" size={w(8)} name="web" style={styles.positionIcon} />
            </View>
            <Text style={styles.TextStyme}>via notre site web</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <View>
              <IconMCI2 color="white" size={w(8)} name="info" style={styles.positionIcon} />
            </View>
            <Text style={styles.TextStyme}>en complétant ce formulaire</Text>
          </View>
          <View style={{marginHorizontal: w(7)}}>
            <Text style={styles.TextForInput}>Prénom *</Text>
            <TextInput
              onChangeText={(text) => this.setState({prenom: text})}
              value={prenom}
              // multiline={true}
              style={styles.fieldStyle}
            />
          </View>
          <View style={{marginHorizontal: w(7)}}>
            <Text style={styles.TextForInput}>Adresse e-mail *</Text>
            <TextInput
              onChangeText={(text) => this.setState({email: text})}
              value={email}
              // multiline={true}
              style={styles.fieldStyle}
            />
          </View>
          <View style={{marginHorizontal: w(7)}}>
            <Text style={styles.TextForInput}>Message *</Text>
            <TextInput
              onChangeText={(text) => this.setState({message: text})}
              value={message}
              multiline
              numberOfLines={4}
              style={{...styles.fieldStyle, height: h(12)}}
              onFocus={() => {
                this.scrollViewRef.scrollToEnd();
              }}
            />
          </View>
          <Button
            onPress={() => {
              this.setState({
                showAlert: true,
                title: texts.contacteznous_message_success_title,
                alertMessage: texts.contacteznous_message_success_text,
              });
            }}
            color="white"
            mode="text"
            style={styles.ButtonInscrit(pro)}
            labelStyle={{fontSize: totalSize(2)}}>
            envoyer
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  render() {
    const {showAlert, title, alertMessage} = this.state;
    const {navigation} = this.props;
    const {
      context: {pro},
    } = this;
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
          {this.Content()}
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title={title}
            message={alertMessage}
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
              navigation.goBack();
            }}
          />
        </MainComponent>
      </>
    );
  }
}

ContactezNous.contextType = NoobaContext;
