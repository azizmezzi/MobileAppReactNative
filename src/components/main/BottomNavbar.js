/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constant/colors';
import {h, w, totalSize} from '../../tools/Dimensions';
import GlobalFunction from '../../GlobleFun/GlobalFunction';

const styles = StyleSheet.create({
  navBarStyle: {
    position: 'absolute',
    bottom: 0,
    height: h(10),
    width: w(100),
  },
  navbarContainer: (pro) => {
    return {
      backgroundColor: pro ? colors.proBlue : colors.brown,
      flex: 1,
      flexDirection: 'row',
      width: w(100),
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
    };
  },
  navbarItem: {
    width: w(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarItemText: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: totalSize(1.5),
  },
  homeCircle: (pro) => {
    return {
      borderWidth: 4,
      borderColor: 'white',
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: pro ? colors.proBlue : '#b27e7f',
      justifyContent: 'center',
      alignItems: 'center',
    };
  },
});

export default function (data) {
  const {pro, props} = data;
  const {state, descriptors, navigation} = props;
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const routeNameToIcon = {
    Profil: 'user',
    Messages: 'comment',
    Agenda: 'calendar',
    Event: 'plus-circle',
    Jeton: 'coins',
  };

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={styles.navBarStyle}>
      <View style={styles.navbarContainer(pro)}>
        {state.routes.map((route, index) => {
          const {name} = route;
          const {options} = descriptors[route.key];
          const label = GlobalFunction.Choose(
            options.tabBarLabel !== undefined,
            options.tabBarLabel,
            GlobalFunction.Choose(options.title !== undefined, options.title, route.name),
          );

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.dispatch(
                CommonActions.reset({
                  routes: [{name: route.name}],
                }),
              );
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const proEventElement = () => {
            return (
              <View style={styles.homeCircle(pro)}>
                <Icon name="plus" size={25} color="white" />
              </View>
            );
          };

          const normalIcons = () => {
            return (
              <>
                <Icon name={routeNameToIcon[name]} size={30} color="white" />
                <Text adjustsFontSizeToFit style={styles.navbarItemText}>
                  {label}
                </Text>
              </>
            );
          };

          const normalMarketplace = () => {
            return (
              <View style={styles.homeCircle(pro)}>
                <Icon name="home" size={37} color="white" />
              </View>
            );
          };

          const elementToRender = GlobalFunction.Choose(
            pro,
            GlobalFunction.Choose(name === 'Event', proEventElement(), normalIcons()),
            GlobalFunction.Choose(name === 'Marketplace', normalMarketplace(), normalIcons()),
          );

          return (
            <TouchableOpacity
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              accessibilityRole="button"
              accessibilityState={GlobalFunction.Choose(isFocused, {selected: true}, {})}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.navbarItem}>
              {elementToRender}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
