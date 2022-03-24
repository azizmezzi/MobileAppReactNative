/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import PropTypes from 'prop-types';
import Jeton from './Jetons';
import Offre from './Offre';
import Abonnementillimte from './abonnementillimte';
import ConfirmeIllimte from './confirmeIllimte';
import FelicitationCompteFree from './FelicitationCompteFree';
import {NoobaContext} from '../../provider/provider';

const JetonStack = createStackNavigator();

export default class JetonsNavigator extends React.Component {
  render() {
    const {
      user: {illimite},
    } = this.context;
    const initialRoute = illimite ? 'Abonnementillimte' : 'Jeton';

    return (
      <JetonStack.Navigator headerMode="none" initialRouteName={initialRoute}>
        <JetonStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Jeton"
          component={Jeton}
        />
        <JetonStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Offre"
          component={Offre}
        />

        <JetonStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="Abonnementillimte"
          component={Abonnementillimte}
        />
        <JetonStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="ConfirmeIllimte"
          component={ConfirmeIllimte}
        />
        <JetonStack.Screen
          options={{...TransitionPresets.SlideFromRightIOS}}
          name="FelicitationCompteFree"
          component={FelicitationCompteFree}
        />
      </JetonStack.Navigator>
    );
  }
}

JetonsNavigator.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
JetonsNavigator.contextType = NoobaContext;
