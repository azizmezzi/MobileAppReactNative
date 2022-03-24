import React, {Component} from 'react';
import {Text, StyleSheet, View, Keyboard} from 'react-native';
import PropTypes from 'prop-types';

import {TextInput} from 'react-native-paper';
import colors from '../../../constant/colors';
import {h, totalSize, w} from '../../../tools/Dimensions';
import GlobalRender from '../../main/GlobalRender';
import SuivantBtn from '../../landingComponents/SuivantBtn';
import texts from '../../../constant/texts';

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
    marginTop: h(10),
    marginLeft: w(10),
    color: 'white',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  RemarqueText: {
    marginTop: h(1),
    marginLeft: w(10),
    color: 'white',
    fontSize: totalSize(1.2),
  },
  fieldStyle: {
    marginTop: h(2),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    height: h(6),
  },
});

export default class NameEtablissementPro extends Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();
    this.state = {
      name: '',
      showAlert: false,
      title: '',
      message: '',
      onInputFocus: false,
    };
  }

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.setState({onInputFocus: false});
      this.textInputRef.blur();
    });
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  Content = () => {
    const {navigation, route} = this.props;
    const {params} = route;
    const {user} = params;
    const {name, onInputFocus} = this.state;
    return (
      <>
        <View style={styles.mainContainer}>
          <Text style={styles.mainText}>Inscription</Text>
          <Text style={styles.questionText}>quel est le nom de votre etablissement ?</Text>
        </View>
        <TextInput
          ref={(tRef) => {
            this.textInputRef = tRef;
          }}
          onFocus={() => this.setState({onInputFocus: true})}
          onBlur={() => this.setState({onInputFocus: false})}
          mode="outlined"
          label="TAPEZ ICI LE NOM"
          theme={{
            colors: {
              placeholder: 'white',
              text: 'white',
              primary: 'white',
              underlineColor: 'transparent',
              background: '#4f5356',
            },
          }}
          style={styles.fieldStyle}
          value={name}
          onChangeText={(text) => this.setState({name: text})}
          // right={<TextInput.Icon name="send" size={28} color="white" />}
        />
        <Text style={styles.RemarqueText}>
          Ce nom sera visible par les membres de la communauté{' '}
        </Text>
        {!onInputFocus ? (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <SuivantBtn
              bgColor={colors.proBlue}
              onPress={() => {
                if (name === '') {
                  this.setState({
                    showAlert: true,
                    title: texts.invalid_nameEtablissement_title,
                    message: texts.invalid_nameEtablissement_text,
                  });
                  return false;
                }
                user.nameEtablissement = name;
                navigation.navigate('AddressPostal', {user});
                return true;
              }}
            />
          </View>
        ) : null}
      </>
    );
  };

  render() {
    const {navigation} = this.props;
    const {showAlert, title, message} = this.state;

    return (
      <GlobalRender
        navigation={navigation}
        showAlert={showAlert}
        title={title}
        message={message}
        type={1}
        Content={() => this.Content()}
        hideAlert={() => this.hideAlert()}
      />
    );
  }
}
NameEtablissementPro.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        nameEtablissement: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
