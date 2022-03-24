/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Marketplace from './Marketplace';
import Filter from './filter';
import Alerts from './Alerts';
import Event from '../events/Event';
import Publier from '../events/Create/Publier';
import Step0 from '../events/Create/Step0';
import ValidParticipation from '../events/ValidParticipation';
import FelicitationDesinscrir from '../events/FelicitationDesincrir';

import Desincrir from '../events/desincrir';
import Desincrir2 from '../events/desincrir2';
import Felicitation from '../events/Felicitation';
import ImageGlobal from '../events/Global/ImageGlobal';
import AnotherProfil from '../profil/AnotherProfil';
import SignalerUtilisateur from '../profil/SignalerUtilisateur';
import Discussion from '../messagerie/stack/Discussion';
import Feedback from '../profil/Feedback';
import MyAlerts from '../profil/MyAlerts';

const MarketplaceStack = createStackNavigator();

export default class MarketplaceNavigator extends React.Component {
  render() {
    return (
      <MarketplaceStack.Navigator headerMode="none" initialRouteName="Messages">
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Marketplace"
          component={Marketplace}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Filter"
          component={Filter}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Alerts"
          component={Alerts}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="MyAlerts"
          component={MyAlerts}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="EventView"
          component={Event}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="AnotherProfil"
          component={AnotherProfil}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="SignalerUtilisateur"
          component={SignalerUtilisateur}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ValidParticipation"
          component={ValidParticipation}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Felicitation"
          component={Felicitation}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Desincrir"
          component={Desincrir}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Desincrir2"
          component={Desincrir2}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="FelicitationDesinscrir"
          component={FelicitationDesinscrir}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Discussion"
          component={Discussion}
        />
        {/* <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="PublierEvent"
          component={PublierEvent}
        /> */}
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Publier"
          component={Publier}
        />
        {/* <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="UpdateEventPhoto"
          component={UpdateEventPhoto}
        /> */}
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ImageGlobal"
          component={ImageGlobal}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Create Event"
          component={Step0}
        />
        <MarketplaceStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Feedback"
          component={Feedback}
        />
      </MarketplaceStack.Navigator>
    );
  }
}
