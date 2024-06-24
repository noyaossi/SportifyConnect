import { StyleSheet } from "react-native";
import { colors } from './colors';
import {fonts} from './fonts';

const loginStyle = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    button: {
        paddingVertical: 7,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
    },
});

export default loginStyle;