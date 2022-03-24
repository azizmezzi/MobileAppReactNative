import React, {Component} from 'react';
import {Text, Keyboard, View} from 'react-native';
import PropTypes from 'prop-types';

import {TextInput} from 'react-native-paper';
import colors from '../../../constant/colors';

import SuivantBtn from '../../landingComponents/SuivantBtn';
import texts from '../../../constant/texts';
import stylesGlobal from './stylesGlobal';
import GlobalRender from '../../main/GlobalRender';

export default class NumTva extends Component {
  constructor(props) {
    super(props);
    this.textInputRef2 = React.createRef();
    this.state = {
      tva: '',
      showAlert: false,
      title: '',
      message: '',
      showSuivantBtn: true,
    };
  }

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.textInputRef2.blur();
      this.setState({showSuivantBtn: true});
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
    const {tva, showSuivantBtn} = this.state;
    return (
      <>
        <View style={stylesGlobal.mainContainer}>
          <Text style={stylesGlobal.mainText}>Inscription</Text>
          <Text style={stylesGlobal.questionText}>quel est votre numero de TVA ?</Text>
        </View>
        <TextInput
          ref={(tRef) => {
            this.textInputRef2 = tRef;
          }}
          onFocus={() => this.setState({showSuivantBtn: false})}
          onBlur={() => this.setState({showSuivantBtn: true})}
          mode="outlined"
          label="INSCRIVEZ VOTRE N°TVA"
          theme={{
            colors: {
              placeholder: 'white',
              text: 'white',
              primary: 'white',
              underlineColor: 'transparent',
              background: '#4f5356',
            },
          }}
          maxLength={50}
          style={stylesGlobal.fieldStyle}
          value={tva}
          onChangeText={(text) => {
            this.setState({tva: text});
          }}
        />
        {showSuivantBtn && (
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <SuivantBtn
              bgColor={colors.proBlue}
              onPress={() => {
                if (tva === '') {
                  this.setState({
                    showAlert: true,
                    title: texts.invalid_tva_title,
                    message: texts.invalid_tva_text,
                  });
                  return false;
                }
                user.tvaNumber = tva;
                navigation.navigate('Photo', {pro: true, user});
                return true;
              }}
            />
          </View>
        )}
      </>
    );
  };

  render() {
    const {showAlert, title, message} = this.state;

    const {navigation} = this.props;
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
NumTva.propTypes = {
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
        nameEtablissement: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        tvaNumber: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
