/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Step0 from './Create/Step0';
import Step1 from './Create/Step1';
import Step2 from './Create/Step2';
import Step3 from './Create/Step3';
import Step42 from './Create/ProScreen/Step42';
import Step5 from './Create/Step5';
import Publier from './Create/Publier';
import Step6 from './Create/Step6';
import AnotherProfil from '../profil/AnotherProfil';
// import MyEvents from '../profil/MyEvents';
import Settings from '../profil/Settings';
import ShareEvent from './Create/ProScreen/ShareEvent';
import Event from './Event';
import ValidParticipation from './ValidParticipation';
import Desincrir from './desincrir';
import Desincrir2 from './desincrir2';
import Felicitation from './Felicitation';
import FelicitationDesinscrir from './FelicitationDesincrir';
import Discussion from '../messagerie/stack/Discussion';
import ImageGlobal from './Global/ImageGlobal';
import SignalerUtilisateur from '../profil/SignalerUtilisateur';
import Filter from '../main/filter';
import Alerts from '../main/Alerts';
import Feedback from '../profil/Feedback';
import Jeton from '../jetons/Jetons';
import Offre from '../jetons/Offre';
import Abonnementillimte from '../jetons/abonnementillimte';
import ConfirmeIllimte from '../jetons/confirmeIllimte';
import FelicitationCompteFree from '../jetons/FelicitationCompteFree';

const EventStack = createStackNavigator();

export default class EventNavigator extends React.Component {
  render() {
    return (
      <EventStack.Navigator headerMode="none" initialRouteName="Create Event">
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Create Event"
          component={Step0}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Step1"
          component={Step1}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Step2"
          component={Step2}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Step3"
          component={Step3}
        />
        {/* <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Step4"
          component={Step4}
        /> */}
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Step42"
          component={Step42}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Step5"
          component={Step5}
        />
        {/* <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="StepSave"
          component={StepSave}
        /> */}
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Publier"
          component={Publier}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Step6"
          component={Step6}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ShareEvent"
          component={ShareEvent}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="EventView"
          component={Event}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="AnotherProfil"
          component={AnotherProfil}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ValidParticipation"
          component={ValidParticipation}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Felicitation"
          component={Felicitation}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Desincrir"
          component={Desincrir}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Desincrir2"
          component={Desincrir2}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="FelicitationDesinscrir"
          component={FelicitationDesinscrir}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Discussion"
          component={Discussion}
        />
        {/* <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="PublierEvent"
          component={PublierEvent}
        /> */}
        {/* <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="MyEvents"
          component={MyEvents}
        /> */}
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Settings"
          component={Settings}
        />
        {/* <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="UpdateEventPhoto"
          component={UpdateEventPhoto}
        /> */}
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ImageGlobal"
          component={ImageGlobal}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="SignalerUtilisateur"
          component={SignalerUtilisateur}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Filter"
          component={Filter}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Alerts"
          component={Alerts}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Feedback"
          component={Feedback}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Jeton"
          component={Jeton}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Offre"
          component={Offre}
        />

        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Abonnementillimte"
          component={Abonnementillimte}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ConfirmeIllimte"
          component={ConfirmeIllimte}
        />
        <EventStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="FelicitationCompteFree"
          component={FelicitationCompteFree}
        />
      </EventStack.Navigator>
    );
  }
}
