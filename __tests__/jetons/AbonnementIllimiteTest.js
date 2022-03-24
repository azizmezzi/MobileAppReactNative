/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-undef */
import 'react-native';
import React from 'react';
import {shallow} from 'enzyme';
import {Button} from 'react-native-paper';
import {withContext} from 'shallow-with-context';
import Abonnementillimte from '../../src/components/jetons/abonnementillimte';

const goBack = jest.fn();
const navigate = jest.fn();
const setOptions = jest.fn();
const push = jest.fn();
const navigation = {goBack, navigate, setOptions, push};
const illimiteUser = {
  _id: '60c9d782abb4d6c00d0a084d',
  subscription: {unsub: false, raison: ''},
  isActive: true,
  parrainage: 0,
  description: '',
  CentreInteret: ['Voyage', 'Billard', 'Festival', 'Jeux de societe'],
  PushNotification: true,
  illimite: true,
  email: 'nawoni9471@awinceo.com',
  password: '$2b$10$zxMlA3fcajAojwiVMhIbe.Oz9Hcr.IfuytleDNaU0JQSnEs7Aw2DS',
  name: 'Samer',
  isPro: false,
  deviceTokens: [
    {
      token:
        'dbwj2A2uokj3hyKFDuHGvx:APA91bE8Pdp8pgUZnCC90TN4iWFPUHDZthXW-bU9xKZ7H76HKDuOXZqMNR1kcBO3I9ll0jbbIgXxwpWPYPZsuXGiekiqWwS3HFPG6NzF-mvTZPLkyZne9Jt8MnGFXXHMKWW6PcdRgJ2t',
      _id: '60c9d782abb4d6c00d0a084e',
    },
    {
      token:
        'dfM5rtlpSeysTgOpR1Bulu:APA91bGUsTzLDbf05uPpshiQnHLqUj4YtB7jrjkCU2BfWXJ0-snMK5CPc8QP-CEW3QoiR_XjKXyPRLIALLdPVNwvldV07LRQRHNwVhTCy8yml_myqLWYFOqMq-mPn0QmpFFE-QZ496k-',
      _id: '60ca0b53c3521ac4b6b54e39',
    },
    {
      token:
        'fgsb8VNhTeuNmtFJF2-EID:APA91bFMDWxqDLM1xhlQ-rkPki4bmD1qftUNPw4VIMdLK5c1TRFgsaK7jyPeW0E_gSN_yRzyMV68v6swpDEPDe5l_657FOieqNE-2sF62MMzr8gRj0HVROZyqAocpradp-hAaqIQZxAU',
      _id: '60cc801185079cedf28eaa86',
    },
    {
      token:
        'eTN-q5poSMCgOf4cQfqN_D:APA91bG71n8FWc2XZWhcHptw1OGG0PO50GndlsmnimWuhlK8lfwGhIKnqTBugj0Ng26gDmZa48S9P_JvcThxqfZFiWfI3Q3BCyqsAUTeg8xcUSom4XecUIwIoRwA7EBetR1adq0XCs2b',
      _id: '60d1de4785079cedf28eaabd',
    },
    {
      token:
        'dkBPpgd7TZqcm72mQ6_15U:APA91bEUNGpHLyeiPMn_7hM1KlX65uMhnun6lphFhaeaUmtJoY2Rx1l1r1snp8C6wnbaozwJwUxxCBEM4uDwZwJt1ZqgMhYv6c4_fVLmYkUHzcYRV6tNMiQruUkt37VLHuJtk6KD8A3D',
      _id: '60e72c90c109d904bcd29c05',
    },
  ],
  image: 'file-1625239971675.png',
  codeParrainage: 'b7hsyhtlt',
  gender: 'homme',
  dob: '1998-03-15T10:50:07.000Z',
  locality: {localisation: 'Ariana', longitude: '10.1647233', latitude: '36.8665367'},
  activationCode: 65167,
  account: '0xbb6eb41854C5135690c4137E346688687438Dff8',
  privateKey:
    '4dc83a1be1ba249c9b786fa364c4ae1cbe3b8a60daf5015038114fcfc7d48b2650f54b85e8f89f4b89d4ce547975105cbdf2aad943fb74c6aa0c9b21c90630791abfab9b488b48f9ce46e684eac7f3e6d0605907d562b47c264b7a2dfb2e9eb429ea2d764425a1c2e90e0e73bd076ed2f539749b6484951d9ebe9d2c1f39e79ec93a2f6cf0af710672fd5cdea27ef06f4ef5c30fe2eb99dabab4ecfa5d1b15dbf5ea',
  alerts: [],
  likedEvents: [{_id: '60dd8240c109d904bcd29b45', event: '60dadff9c109d904bcd29b09'}],
  recommendations: [],
  __v: 0,
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGM5ZDc4MmFiYjRkNmMwMGQwYTA4NGQiLCJlbWFpbCI6Im5hd29uaTk0NzFAYXdpbmNlby5jb20iLCJpYXQiOjE2MjU4MTk0NTJ9.1y-uAMytw8XxGes3SopevYPIUbPhCllBQLA_SHjwbuI',
};
describe('abonnement illimte', () => {
  it('abonnement illimte snapShot', async () => {
    const mockedParams = {
      route: {params: {pro: false}},
      navigation,
    };

    const context = {
      pro: false,
      balance: 0,
      user: illimiteUser,
      events: [],
      notifications: [],
    };

    const ComponentWithContext = withContext(Abonnementillimte, context);
    const component = shallow(<ComponentWithContext {...mockedParams} />, {context});

    expect(component).toMatchSnapshot();
  });
  it('Hide Alert Test', async () => {
    const mockedParams = {
      route: {params: {pro: false, step: true, eventId: '60e6e8aac109d904bcd29bdd'}},
      navigation,
    };
    const context = {
      pro: false,
      balance: 0,
      user: illimiteUser,
      events: [],
      notifications: [],
    };
    const ComponentWithContext = withContext(Abonnementillimte, context);
    const component = shallow(<ComponentWithContext {...mockedParams} />, {context});
    const instance = component.instance();
    instance.hideAlert();

    expect(component.state('showAlert')).toBe(false);
    expect(component.state('title')).toBe('');
    expect(component.state('message')).toBe('');
  });
  it('content view', async () => {
    const mockedParams = {
      route: {params: {pro: false, step: true, eventId: '60e6e8aac109d904bcd29bdd'}},
      navigation,
    };
    const context = {
      pro: false,
      balance: 0,
      user: illimiteUser,
      events: [],
      notifications: [],
    };

    const ComponentWithContext = withContext(Abonnementillimte, context);
    const component = shallow(<ComponentWithContext {...mockedParams} />, {context});
    const instance = component.instance();
    const component2 = shallow(instance.Content());
    component2.find(Button).first().props().onPress();
    // component2.simulate('press');
    expect(navigate).toHaveBeenCalled();

    expect(component2).toMatchSnapshot();
  });
});
