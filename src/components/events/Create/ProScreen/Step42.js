/* eslint-disable react/no-array-index-key */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, ScrollView, TextInput} from 'react-native';
import colors from '../../../../constant/colors';
import GlobalRender from '../../../main/GlobalRender';
import SuivantBtn from '../../../landingComponents/SuivantBtn';
import {h, w, totalSize} from '../../../../tools/Dimensions';
import {NoobaContext} from '../../../../provider/provider';
import texts from '../../../../constant/texts';

const styles = StyleSheet.create({
  headerColMidText: {
    marginTop: h(2),
    color: 'white',
    width: w(100),
    textAlign: 'center',
    fontSize: totalSize(2.4),
    textTransform: 'uppercase',
  },
  fieldStyle: (height) => {
    return {
      marginTop: h(2),
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 1,
      marginHorizontal: w(5),
      borderRadius: 20,
      height: height !== undefined ? h(height) : h(12),
      paddingHorizontal: w(2),
      color: 'white',
    };
  },
  mainBrownText: (color) => {
    return {
      marginTop: h(3),
      color: color !== undefined ? color : colors.brown,
      textTransform: 'uppercase',
      fontSize: 18,
      marginLeft: w(3),
      fontWeight: 'bold',
    };
  },
  ColMidText: {color: 'white', fontSize: 15},
  headerGrid: {
    marginTop: h(3),
  },
  headerCol: (width) => {
    return {
      width: w(width),
      alignItems: 'center',
    };
  },
});

export default class Step42 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cadeau: '',
      hideDescText: false,
    };
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      message: '',
    });
  };

  Content = (contextProps) => {
    const {cadeau, hideDescText} = this.state;
    const {navigation} = this.props;
    const {
      context: {pro},
    } = this;
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}>
        <Text style={styles.headerColMidText}>Créer un évènement</Text>

        <Text style={styles.mainBrownText(pro ? colors.proBlue : colors.brown)}>
          QUELLE PROMOTION OU CADEAU SOUHAITEZ-VOUS OFFRIR AUX PARTICIPANTS ?
        </Text>
        <TextInput
          maxLength={100}
          onChangeText={(text) => this.setState({cadeau: text})}
          value={cadeau}
          placeholder={
            hideDescText
              ? ''
              : "Veuillez indiquer la réduction ou le cadeau que vous offrez aux participants. N'hésitez pas à être créatif."
          }
          placeholderTextColor="grey"
          onFocus={() => this.setState({hideDescText: true})}
          onBlur={() => this.setState({hideDescText: false})}
          multiline
          numberOfLines={10}
          style={styles.fieldStyle(16)}
        />

        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <SuivantBtn
            onPress={() => {
              if (cadeau === '') {
                this.setState({
                  showAlert: true,
                  title: texts.invalid_event_promotion_title,
                  message: texts.invalid_event_promotion_text,
                });
                return false;
              }
              const {newEvent, setNewEvent} = contextProps;
              newEvent.promotion = cadeau;
              setNewEvent(newEvent);
              navigation.navigate('Step5');
              return true;
            }}
            bgColor={pro ? colors.proBlue : undefined}
          />
        </View>
      </ScrollView>
    );
  };

  render() {
    const {navigation} = this.props;

    const {showAlert, title, message} = this.state;
    return (
      <NoobaContext.Consumer>
        {(props) => {
          return (
            <GlobalRender
              navigation={navigation}
              showAlert={showAlert}
              title={title}
              message={message}
              type={3}
              Content={() => this.Content(props)}
              hideAlert={() => this.hideAlert()}
            />
          );
        }}
      </NoobaContext.Consumer>
    );
  }
}

Step42.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

Step42.contextType = NoobaContext;
