/* eslint-disable no-undef */
import 'react-native';
import React from 'react';
import {shallow} from 'enzyme';
import {withContext} from 'shallow-with-context';
import ImageGlobal from '../../../src/components/events/Global/ImageGlobal';

const goBack = jest.fn();
const navigate = jest.fn();
const setOptions = jest.fn();
const push = jest.fn();

const navigation = {goBack, navigate, setOptions, push};

describe('ImageGlobal', () => {
  it('should render', async () => {
    const mockedParams = {
      route: {params: {pro: true}},
      navigation,
    };

    const context = {pro: true, notifications: [], newEvent: {}};

    const ComponentWithContext = withContext(ImageGlobal, context);
    const component = shallow(<ComponentWithContext {...mockedParams} />, {context});
    expect(component).toMatchSnapshot();
  });
});
