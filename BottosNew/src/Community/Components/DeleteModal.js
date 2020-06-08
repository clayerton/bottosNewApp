import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import I18n from '../../Tool/Language'
import {Modal} from "antd-mobile-rn/lib/index.native";
const DeleteModal = props => {
    const deletePost = () => {
        const {onPress , style} = props
        // 弹出删除帖子确认框

        Modal.alert(
            I18n.t('community.delete_post'),
            I18n.t('community.sure_delete_post'),
            [
                { text: I18n.t('tip.cancel'), onPress: () => console.log(2222) },
                { text: I18n.t('tip.confirm'), onPress:  ()=> onPress &&  onPress && onPress() }
            ]
        )
    }
   
    return (
        <TouchableOpacity 
            activeOpacity={0.5}
            onPress={deletePost}
        >
            <Text style={{
                color: '#1677CB',
                borderWidth: 0,
                height: 18,
                fontSize: 12,
                paddingLeft: 6
            }}> {I18n.t('community.delete')}</Text>
        </TouchableOpacity>
    )




}
export default DeleteModal