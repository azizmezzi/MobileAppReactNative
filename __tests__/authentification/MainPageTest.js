/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-undef */
// import 'react-native';
import React from 'react';
import {shallow, mount} from 'enzyme';
import {Button} from 'react-native-paper';
import {withContext} from 'shallow-with-context';
import {TouchableOpacity} from 'react-native-gesture-handler';

import MainPage from '../../src/components/authentification/MainPage';
import {NoobaContext} from '../../src/provider/provider';

const goBack = jest.fn();
const navigate = jest.fn();
const setOptions = jest.fn();
const setPro = jest.fn();

const push = jest.fn();

const navigation = {goBack, navigate, setOptions, push};

describe('MainPage', () => {
  it('should render as normal User', async () => {
    const mockedParams = {
      navigation,
    };

    const context = {setPro};

    const ComponentWithContext = withContext(MainPage, context);
    const component = shallow(<ComponentWithContext {...mockedParams} />, {context});
    expect(component).toMatchSnapshot();
  });
  it('should render as pro', async () => {
    const mockedParams = {
      navigation,
    };

    const context = {setPro};

    const ComponentWithContext = withContext(MainPage, context);
    const component = shallow(<ComponentWithContext {...mockedParams} />, {context});
    expect(component).toMatchSnapshot();
  });
  it('go to login', async () => {
    const mockedParams = {
      navigation,
    };
    const context = {setPro};
    const ComponentWithContext = withContext(MainPage, context);
    const component = shallow(<ComponentWithContext {...mockedParams} />, {
      context,
    });
    component.find(Button).first().props().onPress();
    expect(navigate).toHaveBeenCalled();
  });

  it('go to register', async () => {
    const mockedParams = {
      navigation,
    };
    const context = {setPro};
    const ComponentWithContext = withContext(MainPage, context);
    const component = shallow(<ComponentWithContext {...mockedParams} />, {
      context,
    });
    component.find(Button).at(1).props().onPress();
    expect(navigate).toHaveBeenCalled();
  });
  // it('change mode ', async () => {
  //   const mockedParams = {
  //     navigation,
  //   };
  //   // const context = {setPro: setPro()};
  //   // const ComponentWithContext = withContext(MainPage, context);
  //   mount(<MainPage {...mockedParams} />);
  //   // component.find(Button).at(1).props().onPress();
  // });

  //   it('change mode ', async () => {
  //     const mockedParams = {
  //       navigation,
  //     };
  //     const context = {pro: false, setPro};
  //     const component = mount(<MainPage {...mockedParams} />);
  //     component.find(MainPage).dive().find(TouchableOpacity).first().props().onPress();
  //     console.log(component.find(MainPage).dive());
  //     const instance = component.instance();
  //     // expect(component.state('pro')).toBe(true);
  //   });
});
