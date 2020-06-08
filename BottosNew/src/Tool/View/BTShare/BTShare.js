import React from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native'
import Modal from 'react-native-modalbox'

const BTShare = props => {
    const onClickClose = () => {
        const { onClickClose } = props
        onClickClose && onClickClose()
    }


    const { title, disabled, style, textStyle, loading } = props
    return (
        <Modal
            style={{flexDirection: 'column', height: 280, backgroundColor: '#FFFF0000',}}
            position={'bottom'}//model视图的位置,top、center、bottom
            entry={'bottom'}//动画的起始位置top、bottom
            ref="modal"
            coverScreen={true}//当true时,modal后面的背景是这个window。比如有navitor时,导航条也会遮住
            backdropPressToClose={true}//点击背景是否关modal视图,当backdrop未false的情况下失效
            backButtonClose={true}//仅安卓,当为true时安卓手机按返回键时modal视图close
            openAnimationDuration={0}
            swipeToClose={false}//是否滑动关闭
            onClosed={onClickClose}
            // onOpened={this.onOpened}
        >
            <View style={{ flexDirection: 'column', marginLeft:8,marginRight:8, backgroundColor: '#FFFFFF',height: 220,borderRadius:8}}>
                <View style={{ flexDirection: 'row',backgroundColor: '#FFFF0000',height: 90}}>
                    <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickCloseShare()}>
                        <Image style = {styles.imageIcon} source={require('../BTImage/PublicComponent/umeng_socialize_wxcircle.png')}/>
                        <Text style = {styles.textIcon}>朋友圈</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickCloseShare()}>
                        <Image style = {styles.imageIcon} source={require('../BTImage/PublicComponent/umeng_socialize_wechat.png')}/>
                        <Text style = {styles.textIcon}>微信</Text>
                    </TouchableOpacity>
                </View>

                <View style={{backgroundColor: '#EFF0F3',height:1,marginTop:20}}/>

                <View style={{ flexDirection: 'row',backgroundColor: '#FFFF0000',height: 90}}>
                    <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickCloseShare()}>
                        <Image style = {styles.imageIcon} source={require('../BTImage/PublicComponent/umeng_socialize_wxcircle.png')}/>
                        <Text style = {styles.textIcon}>举报</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} style={{ alignItems: 'center',width:90,height:90,backgroundColor: '#FF00FF00'}} onPress={() => this.onClickCloseShare()}>
                        <Image style = {styles.imageIcon} source={require('../BTImage/PublicComponent/umeng_socialize_wechat.png')}/>
                        <Text style = {styles.textIcon}>黑名单</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'column',margin:8, backgroundColor: '#FFFFFF',flex:1,borderRadius:8}}>
                <TouchableOpacity activeOpacity={0.5} style={{justifyContent: 'center', alignItems: 'center',flex:1}} onPress={() => onClickClose()}>
                    <Text style = {{width:100,Height:30,lineHeight:30, fontSize: 15,  backgroundColor: '#0F0FFF',color: '#D1D5DD', textAlign: 'center'}}>取消</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default BTShare
const styles = StyleSheet.create({
    Icon: {
        width:50,
        height: 50,
        marginTop:20
    },
    imageIcon: {
        width:50,
        height: 50,
        marginTop:20
    },
    textIcon: {
        width:90,
        height: 20,
        lineHeight:20,
        fontSize: 10,
        color: '#000000',
        textAlign: 'center'
    }
})
