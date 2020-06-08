import { StyleSheet } from 'react-native'

const PublicStyle = StyleSheet.create({
    leftButton: {
        width: 50,
        height: 44,
        marginLeft: 0,
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0120000',
    },
    rightButton: {
        width: 50,
        height: 44,
        marginRight: 0,
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightText: {
        lineHeight:44,
        height: 44,
        color: '#046FDB',
        fontSize: 16,
    },
    navTitle: {
        flex: 1,
        textAlign: 'center',
        alignSelf: 'center',
        color: '#353B48',
        fontWeight: 'bold',
        fontSize: 16,
    },
    navBackground: {
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: '#ffffff',
        borderBottomWidth:0
    },
    navBackImage: {
        width: 24,
        height: 24
    },
    //统一界面的底色样式
    container: {
        flex:1,
        backgroundColor:'#F7F8FA',
    },
})

export default PublicStyle
