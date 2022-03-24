import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {BlurView} from '@react-native-community/blur';
import AwesomeAlert from 'react-native-awesome-alerts';
import PropTypes from 'prop-types';

import MainComponent from '../landingComponents/MainComponent';
import HeaderComponent from '../landingComponents/HeaderComponent';
import {NoobaContext} from '../../provider/provider';
import colors from '../../constant/colors';

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default function GlobalRender(props) {
  const {pro} = useContext(NoobaContext);
  // eslint-disable-next-line react/prop-types
  const {navigation, showAlert, title, message, spinner, Content, hideAlert, type} = props;
  let bgColor = pro ? colors.proBlue : colors.brown;
  if (type !== undefined)
    if (type === 1) bgColor = colors.proBlue;
    else if (type === 2) bgColor = colors.brown;
  const ViewGlobalScreen = (
    <>
      <HeaderComponent
        navigation={navigation}
        height={9}
        fontsize={30}
        type
        showBackButton={false}
        bgColor={bgColor}
        notif
      />
      <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
      {showAlert && <BlurView style={styles.absolute} blurType="light" blurAmount={10} />}
      {Content()}
    </>
  );

  const ViewPro = (
    <>
      <HeaderComponent
        navigation={navigation}
        height={22}
        showBackButton
        showSubTitle
        showHeaderText
        bgColor={bgColor}
      />
      {Content()}
    </>
  );

  const ViewNormalUser = (
    <>
      <HeaderComponent
        navigation={navigation}
        height={22}
        showBackButton
        showSubTitle
        showHeaderText
      />
      <Spinner visible={spinner} textContent="Loading..." textStyle={{color: '#FFF'}} />
      {showAlert && <BlurView style={styles.absolute} blurType="light" blurAmount={10} />}
      {Content()}
    </>
  );
  const ViewCreateEvent = (
    <>
      <Spinner
        visible={spinner !== undefined ? spinner : false}
        textContent="Loading..."
        textStyle={{color: '#FFF'}}
      />

      <HeaderComponent
        navigation={navigation}
        bgColor={pro ? colors.proBlue : colors.brown}
        height={9}
        fontsize={30}
        type
        showBackButton
      />
      {showAlert && <BlurView style={styles.absolute} blurType="light" blurAmount={10} />}
      {Content()}
    </>
  );

  const ViewAccount = (
    <>
      <HeaderComponent
        bgColor={pro ? colors.proBlue : colors.brown}
        navigation={navigation}
        height={9}
        fontsize={30}
        type
        showBackButton
        notif
      />
      {Content()}
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
        confirmButtonColor={bgColor}
        onConfirmPressed={() => {
          hideAlert();
        }}
        onDismiss={() => {
          hideAlert();
        }}
      />
    </>
  );
  let viewScreen = ViewNormalUser;

  if (type === 1) {
    viewScreen = ViewPro;
  } else if (type === 3) viewScreen = ViewCreateEvent;
  else if (type === 4) viewScreen = ViewAccount;
  return (
    <>
      <MainComponent bgColor={bgColor}>
        {type !== undefined ? viewScreen : ViewGlobalScreen}
      </MainComponent>
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
        confirmButtonColor={bgColor}
        onConfirmPressed={() => {
          hideAlert();
        }}
        onDismiss={() => {
          hideAlert();
        }}
      />
    </>
  );
}

GlobalRender.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
