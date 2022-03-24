/* eslint-disable no-undef */
import 'react-native-gesture-handler/jestSetup';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {format} from 'prettier';

// jest.setTimeout(30000);

global.shallow = Enzyme.shallow;
Enzyme.ShallowWrapper.prototype.jsx = function jsx() {
  const placeholder = '{ something: null }';
  const obj = this.debug({ignoreProps: false, verbose: true}).replace(/{\.\.\.}/g, placeholder);

  return format(obj, {
    parser: 'babylon',
    filepath: 'test/setup.mjs',
    trailingComma: 'all',
    semi: false,
    arrowParens: 'always',
  })
    .replace(new RegExp(placeholder, 'g'), '{...}')
    .replace(';<', '<');
};
// the html function just throws errors so it's just reset to be the jsx function
Enzyme.ShallowWrapper.prototype.html = Enzyme.ShallowWrapper.prototype.jsx;

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

jest.mock('@react-native-firebase/messaging', () => {
  return () => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve('myMockToken')),
    onMessage: jest.fn(),
    onNotificationOpenedApp: jest.fn(),
    getInitialNotification: jest.fn(() => Promise.resolve(false)),
  });
});

jest.mock('@react-native-firebase/app', () => {
  return () => ({
    onNotification: jest.fn(),
    onNotificationDisplayed: jest.fn(),
  });
});

jest.mock('socket.io-client', () => {
  return () => ({
    emit: jest.fn(),
  });
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
// jest.mock('@react-native-firebase/app/lib/internal/RNFBNativeEventEmitter')

jest.mock('react-native-push-notification', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    requestPermissions: jest.fn(),
    configure: jest.fn(),
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  createChannel: jest.fn(),
  onRegister: jest.fn(),
  onNotification: jest.fn(),
  addEventListener: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  getChannels: jest.fn(),
  requestPermissions: jest.fn(() => Promise.resolve()),
  getInitialNotification: jest.fn(() => Promise.resolve()),
}));

const {JSDOM} = require('jsdom');

// const jsdom = new JSDOM();
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');

const {window} = jsdom;
function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);
Enzyme.configure({adapter: new Adapter()});

// Ignore React Web errors when using React Native
// allow other errors to propagate if they're relevant
const suppressedErrors =
  /(React does not recognize the.*prop on a DOM element|Unknown event handler property|is using uppercase HTML|Received `true` for a non-boolean attribute `accessible`|The tag.*is unrecognized in this browser)/;
const realConsoleError = console.error;
console.error = (message) => {
  if (message.match(suppressedErrors)) {
    return;
  }
  realConsoleError(message);
};
require('react-native-mock-render/mock');

Enzyme.configure({adapter: new Adapter()});
