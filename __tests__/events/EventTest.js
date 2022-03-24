/* eslint-disable no-undef */
import 'react-native';
import React from 'react';
import {shallow} from 'enzyme';
import {withContext} from 'shallow-with-context';
import Event from '../../src/components/events/Event';

const goBack = jest.fn();
const navigate = jest.fn();
const setOptions = jest.fn();
const push = jest.fn();

const navigation = {goBack, navigate, setOptions, push};

describe('Event', () => {
  it('should render', async () => {
    const mockedParams = {
      route: {params: {pro: true}},
      navigation,
    };

    const context = {pro: true, notifications: []};

    const ComponentWithContext = withContext(Event, context);
    const component = shallow(<ComponentWithContext {...mockedParams} />, {context});
    expect(component).toMatchSnapshot();
  });
});
