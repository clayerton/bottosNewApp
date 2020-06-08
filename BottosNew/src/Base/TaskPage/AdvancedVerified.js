import React , { PureComponent } from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity, ScrollView,DeviceEventEmitter} from 'react-native';
import NavStyle from "../../Tool/Style/NavStyle";
import I18n from "../../Tool/Language";
//组件
import AdvancedItem from './Item/AdvancedItem';
import LongButton from '../../Tool/View/BTButton/LongButton'
import UserInfo from '../../Tool/UserInfo'
// 自有组件
import LocalImageAccess from '../../Tool/View/LocalImageAccess'
import {requestWithFile} from "../../Tool/NetWork/heightOrderFetch";
import BTWaitView from "../../Tool/View/BTWaitView.config";
import {devlog} from "../../Tool/FunctionTool";
import {Toast} from "antd-mobile-rn";
import Config from "../../Tool/Config";
export default class AdvancedVerified extends PureComponent{

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
            headerLeft: (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.goBack()}
                    style={NavStyle.leftButton}>
                    <Image
                        style={NavStyle.navBackImage}
                        source={require('../../BTImage/navigation_back.png')}
                    />
                </TouchableOpacity>
            ),
            headerRight: <Text style={NavStyle.rightButton}> </Text>,
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('advanced.high_advanced')}</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            onChangeUploadImage1:null,
            onChangeUploadImage2:null,
            onChangeUploadImage3:null

        }

        this.onChangeUploadImage1 = this.onChangeUploadImage1.bind(this)
        this.onChangeUploadImage2 = this.onChangeUploadImage2.bind(this)
        this.onChangeUploadImage3 = this.onChangeUploadImage3.bind(this)
    }

    componentDidMount() {

    }

    //点击立即认证
    onClickSubmitAdvanced() {
        const {onChangeUploadImage1, onChangeUploadImage2, onChangeUploadImage3 } = this.state;
        Toast.hide()
        // return
        if (onChangeUploadImage1 && onChangeUploadImage2 && onChangeUploadImage3) {

            let formData = new FormData()
            formData.append('token', UserInfo.token)

            //防止多次
            BTWaitView.show(I18n.t('tip.wait_text'))
                //sourceURL
                let uri1 = onChangeUploadImage1.path
                let index1 = uri1.lastIndexOf('/')
                let name1 = uri1.substring(index1 + 1, uri1.length)
                let file1 = { uri: uri1,  type: 'application/octet-stream', name: name1 }
                formData.append('main', file1)

                let uri2 = onChangeUploadImage2.path
                let index2 = uri2.lastIndexOf('/')
                let name2 = uri2.substring(index2 + 1, uri2.length)
                let file2 = { uri: uri2, type: 'application/octet-stream', name: name2 }
                formData.append('frontend' , file2)


                let uri3 = onChangeUploadImage3.path
                let index3 = uri3.lastIndexOf('/')
                let name3 = uri3.substring(index3 + 1, uri3.length)
                let file3 = { uri: uri3, type: 'application/octet-stream', name: name3 }
                formData.append('backend' , file3)

            devlog(formData,'formData')
            requestWithFile('/member/photoCertification', formData)
                .then((res) => {
                    devlog(res,formData);

                    BTWaitView.hide()
                    if (res.code === '0') {
                        Toast.info(
                            res.msg,
                            Config.ToestTime,
                            null,
                            false
                        )

                            this.props.navigation.state.params.callback()
                            this.props.navigation.goBack()

                    } else if (res.code === '99') {
                        DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                    } else {
                        devlog(res)
                        Toast.hide()
                        Toast.fail(res.msg, Config.ToestTime, null, false)
                    }
                })
                .catch((error) => {
                    Toast.hide()
                    Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
                })

            }else{
                Toast.info(I18n.t('advanced.task_advanced_phont'), Config.ToestTime, null, false)
            }
    }
    onClickIdentity(value,itemkey) {
        // console.log(value,itemkey,'value')
    }


    onChangeUploadImage1(fileList){
        devlog(fileList)
        this.setState({
            onChangeUploadImage1:fileList&&fileList[0]
        })
    }
    onChangeUploadImage2(fileList){
        this.setState({
            onChangeUploadImage2:fileList&&fileList[0]
        })
    }
    onChangeUploadImage3(fileList){
        this.setState({
            onChangeUploadImage3:fileList&&fileList[0]
        })
    }

    render() {
        const { onChangeUploadImage1 , onChangeUploadImage2, onChangeUploadImage3 } = this.state ;
        return (
            <ScrollView style={NavStyle.container}>
                <View style={styles.AdvancedItemStyle} >
                    <LocalImageAccess
                        onChange={this.onChangeUploadImage1}
                        imageList={[]}
                        maxFileNum={1}
                        showImageList={false}
                    >
                        {this.state.onChangeUploadImage1 ?
                            <Image style={[styles.AdvancedImage,{width:onChangeUploadImage1.width/onChangeUploadImage1.height * 145}]} source={{uri:onChangeUploadImage1.path}} />
                            :
                            <Image style={styles.AdvancedImage} source={require('../../BTImage/Base/Task/task_advanced_step1.png')} />
                        }
                    </LocalImageAccess>
                    <Text style={styles.AdvancedText}>{I18n.t('advanced.task_advanced_step1')}</Text>
                </View>

                <View style={styles.AdvancedItemStyle} >
                    <LocalImageAccess
                        onChange={this.onChangeUploadImage2}
                        imageList={[]}
                        maxFileNum={1}
                        showImageList={false}
                    >
                        {this.state.onChangeUploadImage2 ?
                            <Image style={[styles.AdvancedImage,{width:onChangeUploadImage2.width/onChangeUploadImage2.height * 145}]} source={{uri:onChangeUploadImage2.path}} />
                            :
                            <Image style={styles.AdvancedImage} source={require('../../BTImage/Base/Task/task_advanced_step2.png')} />
                        }
                    </LocalImageAccess>
                    <Text style={styles.AdvancedText}>{I18n.t('advanced.task_advanced_step2')}</Text>
                </View>

                <View style={styles.AdvancedItemStyle} >
                    <LocalImageAccess
                        onChange={this.onChangeUploadImage3}
                        imageList={[]}
                        maxFileNum={1}
                        showImageList={false}
                    >
                        {this.state.onChangeUploadImage3 ?
                            <Image style={[styles.AdvancedImage,{width:onChangeUploadImage3.width/onChangeUploadImage3.height * 145}]} source={{uri:onChangeUploadImage3.path}} />
                            :
                            <Image style={styles.AdvancedImage} source={require('../../BTImage/Base/Task/task_advanced_step3.png')} />
                        }
                    </LocalImageAccess>
                    <Text style={styles.AdvancedText}>{I18n.t('advanced.task_advanced_step4')}</Text>
                    <Text style={styles.AdvancedInfo}>{I18n.t('advanced.task_advanced_step3')}</Text>
                </View>
               {/* {advanced&&
                advanced.map((item)=>{
                        return (
                            <AdvancedItem
                                {...item}
                                onPress={ value => this.onClickIdentity(value)}
                            />
                        )
                    })
                }*/}
                {/*立即注册*/}
                <LongButton
                    onPress={() => {
                        this.onClickSubmitAdvanced()
                    }}
                    style={{ width: 327, height: 50, backgroundColor:'#046FDB', alignSelf:'center',marginTop:32,marginBottom:35,}}
                    textStyle={{color:'#fff', }}
                    title={I18n.t('advanced.submit_advanced')}
                />
            </ScrollView>
        )
    }


}
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