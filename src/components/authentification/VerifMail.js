import React, {useState, useContext, useEffect} from 'react';
import {Keyboard, Text, View, ScrollView, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {BlurView} from '@react-native-community/blur';
import RNRestart from 'react-native-restart';
import PropTypes from 'prop-types';

import {h, totalSize, w} from '../../tools/Dimensions';
import HeaderComponent from '../landingComponents/HeaderComponent';
import MainComponent from '../landingComponents/MainComponent';
import colors from '../../constant/colors';
import {ActivateAccount, ResendActivationEmail} from '../../provider/authentification';
import {NoobaContext} from '../../provider/provider';
import texts from '../../constant/texts';
import GlobalFunction from '../../GlobleFun/GlobalFunction';

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  mainContainer: {
    marginTop: h(2),
  },
  ButtonInscrit: (backgroundColor) => {
    return {
      marginTop: h(7),
      alignSelf: 'center',
      color: 'white',
      backgroundColor,
      width: w(50),
    };
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  questionText: {
    textAlign: 'center',
    marginTop: h(10),
    marginHorizontal: w(5),
    color: 'white',
    fontSize: totalSize(1.6),
    textTransform: 'uppercase',
  },
  fieldStyle: {
    marginTop: h(2),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    height: h(6),
  },
  codeFieldRoot: {
    zIndex: 20,
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: w(10),
    height: h(10),
    marginHorizontal: w(0.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: 'white',
    fontSize: totalSize(3.6),
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
  },
});

const CELL_COUNT = 5;

const VerifMail = (props) => {
  const [value, setValue] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [showAlert, setAlert] = useState(false);
  const [title, setTitle] = useState('');
  const [messageAlert, setMessage] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [cellProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const context = useContext(NoobaContext);
  const {navigation} = props;

  const keyboardDidHide = () => {
    ref.current.blur();
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    navigation.addListener('beforeRemove', async (e) => {
      e.preventDefault();
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      RNRestart.Restart();
    });
    return () => {
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, []);

  const hideAlert = () => {
    setAlert(false);
    setTitle('');
    setMessage('');
  };

  const setCode = async (newVal) => {
    setValue(newVal);
    if (newVal.length === CELL_COUNT) {
      if (!Number.isNaN(newVal)) {
        setSpinner(true);
        const {user, setLoggedin, setUser} = context;
        const codeParrainage = await AsyncStorage.getItem('CodeParrainage');
        ActivateAccount(user.token, newVal, codeParrainage)
          .then(async (response) => {
            const {
              data: {message},
            } = response;
            setSpinner(false);
            if (message === 'correct code') {
              user.isActive = true;
              user.isEnabled = !context.user.isPro;
              await AsyncStorage.setItem('user', JSON.stringify(user));

              setLoggedin(true);
              setUser(user);
              navigation.navigate('BienvenueNooba', {
                user: context.user,
                pro: context.user.isPro,
                token: context.user.token,
              });
              /* if (user.isEnabled) {
                
              } else {
                navigation.navigate('AttendreConfirmation', {
                  token: context.user.token,
                  firstTime: true,
                });
              } */
            } else {
              setAlert(true);
              setTitle('Erreur');
              setTitle(texts.invalid_validation_activation_code_title);
              setValue('');
              setMessage(texts.invalid_validation_activation_code_text);
            }
          })
          .catch((err) => {
            setSpinner(false);
            setAlert(true);
            setTitle(texts.invalid_validation_activation_code_title);
            setMessage(texts.invalid_validation_activation_code_text);
            setValue('');
            console.log(err);
          });
      }
    }
  };

  const {
    route: {
      params: {pro},
    },
  } = props;
  return (
    <>
      <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
      <MainComponent bgColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}>
        <HeaderComponent
          bgColor={GlobalFunction.Choose(pro, colors.proBlue, colors.brown)}
          navigation={navigation}
          height={22}
          showBackButton={false}
          showSubTitle
          showHeaderText
        />
        <>
          <ScrollView style={styles.mainContainer}>
            <Text style={styles.mainText}>Inscription</Text>
            <Text style={styles.questionText}>
              Nous vous avons envoyé un code de validation par email pour valider votre compte.
            </Text>
            <Text
              style={{
                marginTop: h(2),
                textAlign: 'center',
                marginLeft: w(5),
                color: 'white',
                fontSize: totalSize(1.6),
                textTransform: 'uppercase',
              }}>
              Il se peut que le code arrive dans vos SPAMS
            </Text>
            <Text style={styles.questionText}>insérez votre code </Text>
            <CodeField
              ref={ref}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...cellProps}
              value={value}
              onChangeText={async (newVal) => setCode(newVal)}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              // textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <View
                  onLayout={getCellOnLayoutHandler(index)}
                  key={index}
                  style={[styles.cellRoot, isFocused && styles.focusCell]}>
                  <Text style={styles.cellText}>
                    {symbol || GlobalFunction.Choose(isFocused, <Cursor />, null)}
                  </Text>
                </View>
              )}
            />
            <Button
              color="white"
              mode="text"
              style={styles.ButtonInscrit(GlobalFunction.Choose(pro, colors.proBlue, colors.brown))}
              labelStyle={{fontSize: totalSize(1.8)}}
              onPress={() => {
                setSpinner(true);
                ResendActivationEmail(context.user.token)
                  .then((response) => {
                    const {data} = response;

                    if (data === 'Email sent') {
                      setSpinner(false);
                      setAlert(true);
                      setTitle(texts.activation_code_resent_title);
                      setMessage(texts.activation_code_resent_text);
                    } else {
                      setSpinner(false);
                      setAlert(true);
                      setTitle(texts.invalid_login_server_error_title);
                      setMessage(texts.invalid_login_server_error_text);
                    }
                  })
                  .catch(() => {
                    setSpinner(false);
                    setAlert(true);
                    setTitle(texts.invalid_login_server_error_title);
                    setMessage(texts.invalid_login_server_error_text);
                  });
              }}>
              Renvoyer
            </Button>
          </ScrollView>
        </>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={title}
          message={messageAlert}
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton
          confirmText="OK"
          confirmButtonColor={colors.brown}
          onConfirmPressed={() => {
            hideAlert();
          }}
          onDismiss={() => {
            hideAlert();
          }}
        />
      </MainComponent>
      {showAlert && (
        <BlurView
          style={styles.absolute}
          // viewRef={this.state.viewRef}
          blurType="light"
          blurAmount={10}
        />
      )}
    </>
  );
};

VerifMail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      pro: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

export default VerifMail;
