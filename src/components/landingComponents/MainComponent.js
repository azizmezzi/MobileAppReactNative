/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import colors from '../../constant/colors';
import {h} from '../../tools/Dimensions';
import {NoobaContext} from '../../provider/provider';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? h(5.5) : StatusBar.currentHeight;

const styles = StyleSheet.create({
  mainStyle: {
    flex: 1,
    backgroundColor: colors.blue,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  container: {
    flex: 1,
  },
});

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default class MainComponent extends Component {
  render() {
    const {children, bgColor, input} = this.props;
    const behavior = Platform.OS === 'ios' ? 'padding' : null;
    return (
      <>
        <NoobaContext.Consumer>
          {() => (
            <>
              {input === undefined ? (
                <View style={styles.mainStyle}>
                  <MyStatusBar backgroundColor={bgColor} barStyle="light-content" />

                  {children}
                </View>
              ) : (
                <KeyboardAvoidingView behavior={behavior} style={{flexGrow: 1}}>
                  <MyStatusBar backgroundColor={bgColor} barStyle="light-content" />

                  <ScrollView bounces={false} style={styles.mainStyle}>
                    <SafeAreaView style={styles.mainStyle}>
                      <View style={{...styles.mainStyle}}>{children}</View>
                    </SafeAreaView>
                  </ScrollView>
                </KeyboardAvoidingView>
              )}
            </>
          )}
        </NoobaContext.Consumer>
      </>
    );
  }
}
