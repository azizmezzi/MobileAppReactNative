// import 'react-native';
// import React from 'react';
// import rendrer from 'react-test-renderer';
// import Filter from '../src/components/main/filter';
// import {NoobaContext} from '../src/provider/provider';

// const goBack = jest.fn();
// const navigate = jest.fn();
// const setOptions = jest.fn();
// const push = jest.fn();
// const navigation = {goBack, navigate, setOptions, push};

// test('Home snapShot', async () => {
//   const mockedParams = {
//     route: {params: {pro: false}},
//     navigation,
//   };
//   const snap = rendrer.create(
//     <NoobaContext.Provider value={{pro: false, notifications: [], user: []}}>
//       <Filter {...mockedParams} />
//     </NoobaContext.Provider>,
//   );
//   expect(snap).toMatchSnapshot();
// });
