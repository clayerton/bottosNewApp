import React from 'react';
import {View,Text,Image,StyleSheet,TouchableOpacity} from 'react-native';
import LocalImageAccess from "../../../Tool/View/LocalImageAccess";

const AdvancedItem = props =>{
    const _onPress = (value,itemkey) => {
        // console.log(value)
        const { onPress } = props
        onPress && onPress(value,itemkey)
    }
    const { itemkey, imageUrl, title, } = props
    return (
        <View style={styles.AdvancedItemStyle} >
            <LocalImageAccess
                onChange={()=>_onPress(itemkey)}
                imageList={[]}
                maxFileNum={1}
            >
                <Image style={styles.AdvancedImage} source={imageUrl} />
            </LocalImageAccess>
           {/* <TouchableOpacity activeOpacity={0.5} onPress={()=>_onPress(itemkey)}>
                <Image style={styles.AdvancedImage} source={imageUrl} />
            </TouchableOpacity>*/}
            <Text style={styles.AdvancedText}>{title}</Text>
            {props.hasOwnProperty('info') ? <Text style={styles.AdvancedInfo}>{props.info}</Text>:null}
        </View>
    )
};
export default AdvancedItem;

const styles = StyleSheet.create({
    AdvancedItemStyle:{
        margin:1,
        borderWidth:1,
        borderColor:'#DFEFFE',
        backgroundColor:'#fff',
        marginLeft:8,
        marginRight:8,
        marginTop:16,
        alignItems:'center',
        borderRadius:3,
        paddingBottom:13,

    },
    AdvancedImage:{
        width:250,
        height:145,
        marginTop:16,
        marginBottom:16,
    },
    AdvancedText:{
        color:'#046FDB',
        fontSize:16,
        lineHeight:22,
        height:22,
    },
    AdvancedInfo:{
        fontSize:12,
        color:'#8395A7',
        lineHeight:17,
        marginTop:8,
        fontWeight:'bold',
    }
});