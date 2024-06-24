import { StyleSheet } from 'react-native';
import { colors } from './colors';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: colors.light,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default globalStyles;