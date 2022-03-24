/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Discussion from './stack/Discussion';
import Messages from './stack/Messages';
import Event from '../events/Event';
import AnotherProfil from '../profil/AnotherProfil';
import Desincrir from '../events/desincrir';
import Desincrir2 from '../events/desincrir2';
import Felicitation from '../events/Felicitation';
import FelicitationDesinscrir from '../events/FelicitationDesincrir';
import ImageGlobal from '../events/Global/ImageGlobal';
import SignalerUtilisateur from '../profil/SignalerUtilisateur';
import Settings from '../profil/Settings';
import Filter from '../main/filter';
import Alerts from '../main/Alerts';
import Feedback from '../profil/Feedback';

const MessagerieStack = createStackNavigator();

export default class MessagerieNavigator extends React.Component {
  render() {
    return (
      <MessagerieStack.Navigator headerMode="none" initialRouteName="Messages">
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Discussion"
          component={Discussion}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Messages"
          component={Messages}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="EventView"
          component={Event}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="AnotherProfil"
          component={AnotherProfil}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Desincrir"
          component={Desincrir}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Desincrir2"
          component={Desincrir2}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="FelicitationDesinscrir"
          component={FelicitationDesinscrir}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ImageGlobal"
          component={ImageGlobal}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="SignalerUtilisateur"
          component={SignalerUtilisateur}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Settings"
          component={Settings}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Felicitation"
          component={Felicitation}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Filter"
          component={Filter}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Alerts"
          component={Alerts}
        />
        <MessagerieStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Feedback"
          component={Feedback}
        />
      </MessagerieStack.Navigator>
    );
  }
}
