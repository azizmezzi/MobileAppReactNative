/* eslint-disable no-undef */
import 'react-native';
import React from 'react';
import {shallow} from 'enzyme';
import {withContext} from 'shallow-with-context';
import Step42 from '../../../../src/components/events/Create/ProScreen/Step42';

const goBack = jest.fn();
const navigate = jest.fn();
const setOptions = jest.fn();
const push = jest.fn();

const navigation = {goBack, navigate, setOptions, push};

describe('Step42', () => {
  it('should render', async () => {
    const mockedParams = {
      route: {params: {pro: true}},
      navigation,
    };

    const context = {pro: true, notifications: []};

    const ComponentWithContext = withContext(Step42, context);
    const component = shallow(<ComponentWithContext {...mockedParams} />, {context});
    expect(component).toMatchSnapshot();
  });
});
