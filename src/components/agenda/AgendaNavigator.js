/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Agenda from './Agenda';
import Event from '../events/Event';
import ValidParticipation from '../events/ValidParticipation';
import FelicitationDesinscrir from '../events/FelicitationDesincrir';
import Publier from '../events/Create/Publier';
import Filter from '../main/filter';
import Alerts from '../main/Alerts';

import Desincrir from '../events/desincrir';
import Desincrir2 from '../events/desincrir2';
import Felicitation from '../events/Felicitation';
import AnotherProfil from '../profil/AnotherProfil';
import Discussion from '../messagerie/stack/Discussion';

import SignalerUtilisateur from '../profil/SignalerUtilisateur';
import Feedback from '../profil/Feedback';

const AgendaStack = createStackNavigator();

export default class AgendaNavigator extends React.Component {
  render() {
    return (
      <AgendaStack.Navigator headerMode="none" initialRouteName="Agenda">
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Agenda"
          component={Agenda}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="EventView"
          component={Event}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="AnotherProfil"
          component={AnotherProfil}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ValidParticipation"
          component={ValidParticipation}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Felicitation"
          component={Felicitation}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Desincrir"
          component={Desincrir}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Desincrir2"
          component={Desincrir2}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="FelicitationDesinscrir"
          component={FelicitationDesinscrir}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Discussion"
          component={Discussion}
        />
        {/* <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="PublierEvent"
          component={PublierEvent}
        /> */}
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Publier"
          component={Publier}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="SignalerUtilisateur"
          component={SignalerUtilisateur}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Filter"
          component={Filter}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Alerts"
          component={Alerts}
        />
        <AgendaStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Feedback"
          component={Feedback}
        />
      </AgendaStack.Navigator>
    );
  }
}
