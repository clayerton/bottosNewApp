import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import I18n from '../../Tool/Language'
const PortrayalItemInfo = props =>{
   const _onPress = value =>{
       const {onPress} = props
       onPress && onPress(value)
   }
    const {post_count, follow_count, fans_count} = props;
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop:24,
        }}>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    _onPress('PersonalPosts')
                }}
                style={styles.myports}
            >
                <Text style={styles.myportsText}>{post_count}</Text>
                <Text style={styles.myportsinfo}>{I18n.t('my.my_posts')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    _onPress('FollowList')
                }}
                style={styles.myports}
            >
                <Text style={styles.myportsText}>{follow_count}</Text>
                <Text style={styles.myportsinfo}>{I18n.t('my.my_follow')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    _onPress('FollowListMe')
                }}
                style={styles.myports}
            >
                <Text style={styles.myportsText}>{fans_count}</Text>
                <Text style={styles.myportsinfo}>{I18n.t('my.my_fans')}</Text>
            </TouchableOpacity>
        </View>
    )
}
export default PortrayalItemInfo
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#046FDB',
        height: 32,
        width: 96,
        marginLeft: 8,
        marginRight: 8
    },
    myports: {
        width:98,

    },
    myportsText:{
        textAlign:'center',
        fontSize:16,
        color:'#353B48',
        fontWeight:'bold',
        lineHeight:22,
    },
    myportsinfo:{
        textAlign:'center',
        fontSize:12,
        color:'#8395A7',
        fontWeight:'bold',
        lineHeight: 17,
        marginTop:2,
    }
})