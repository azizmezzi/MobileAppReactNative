import {StyleSheet} from 'react-native';
import {h, totalSize, w} from '../../../tools/Dimensions';

const stylesGlobal = StyleSheet.create({
  mainContainer: {
    marginTop: h(2),
  },
  mainText: {
    color: 'white',
    textAlign: 'center',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },
  questionText: {
    marginTop: h(10),
    marginLeft: w(10),
    color: 'white',
    fontSize: totalSize(2),
    textTransform: 'uppercase',
  },

  fieldStyle: {
    marginTop: h(5),
    backgroundColor: '#4f5356',
    marginHorizontal: w(10),
    height: h(6),
  },
});

export default stylesGlobal;
