/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Profil from './Profil';
import Settings from './Settings';
import Confidentiality from './Confidentiality';
import ContactezNous from './ContactezNous';
import Desinscrire from './Desinscrire';
import Account from './Account';
import AnotherProfil from './AnotherProfil';
import CentreDinterets from './CentreDinterets';
import Recommendations from './Recommendations';
// import MyEvents from './MyEvents';
import Feedback from './Feedback';
import ConductCode from './ConductCode';
import MyAlerts from './MyAlerts';
import ChangeUserPassword from './ChangeUserPassword';
import SignalerUtilisateur from './SignalerUtilisateur';
import Publier from '../events/Create/Publier';
import Step0 from '../events/Create/Step0';
import Filter from '../main/filter';
import Alerts from '../main/Alerts';

const ProfileStack = createStackNavigator();

export default class ProfileNavigator extends React.Component {
  render() {
    return (
      <ProfileStack.Navigator headerMode="none" initialRouteName="Profil">
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Profil"
          component={Profil}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Settings"
          component={Settings}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Confidentiality"
          component={Confidentiality}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ContactezNous"
          component={ContactezNous}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="CentreDinterets"
          component={CentreDinterets}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Desinscrire"
          component={Desinscrire}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Account"
          component={Account}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="AnotherProfil"
          component={AnotherProfil}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Recommendations"
          component={Recommendations}
        />
        {/* <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="MyEvents"
          component={MyEvents}
        /> */}
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Feedback"
          component={Feedback}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ConductCode"
          component={ConductCode}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="MyAlerts"
          component={MyAlerts}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ChangeUserPassword"
          component={ChangeUserPassword}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="SignalerUtilisateur"
          component={SignalerUtilisateur}
        />

        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Publier"
          component={Publier}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Create Event"
          component={Step0}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Filter"
          component={Filter}
        />
        <ProfileStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Alerts"
          component={Alerts}
        />
      </ProfileStack.Navigator>
    );
  }
}
