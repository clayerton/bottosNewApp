import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Keyboard,
    Image,
    ScrollView,
    StyleSheet,
    Dimensions,
    TextInput,
    DeviceEventEmitter,
} from 'react-native'
import NavStyle from "../../../Tool/Style/NavStyle";
import {getRequestBody,devlog , getRequestURL,getImageURL} from "../../../Tool/FunctionTool";
import BFetch from '../../../Tool/NetWork/BTFetch';
import Config from "../../../Tool/Config";
import UserInfo from "../../../Tool/UserInfo";
import LongButton from "../../../Tool/View/BTButton/LongButton";
import BTWaitView from "../../../Tool/View/BTWaitView.config";
import I18n from "../../../Tool/Language";
import {Toast} from "antd-mobile-rn";

export default class DataTaskAppeal extends Component{

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
                        source={require('../../../BTImage/navigation_back.png')}
                    />
                </TouchableOpacity>
            ),
            headerRight: <Text style={NavStyle.rightButton}> </Text>,
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('task.task_details')}</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }

    constructor(props) {
        super(props);
        this.data = this.props.navigation.state.params.data;
        this.collection_attachment = this.data.collection_attachment;
        this.imageShow = this.collection_attachment.length > 0 ? getImageURL(this.collection_attachment[0].attachment_value) : null;
        this.state = {
            status : true, //申诉状态
            system : this.data.system.system,
            collection_attachment:this.data.collection_attachment,
            collection_id: this.data.collection.collection_id,
            task_id:this.data.collection.task_id,
            appeal:this.data.appeal,
            imageShow:this.imageShow,
        }
    }

    componentDidMount() {
        // devlog(this.props.navigation.state.params.data)

    }

    onClickAppealButton() {

        let body = {
            task_id:this.state.task_id,
            collection_id:this.state.collection_id,
        }
        let requestBody = getRequestBody(body)
        BFetch('/collection/appealCollection', requestBody)
            .then(res => {
                BTWaitView.hide()
                devlog(res)

                if (res.code === '0') {
                    Toast.success(res.msg, Config.ToestTime, null, false)
                    this.props.navigation.goBack();
                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                } else {
                    Toast.hide()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                Toast.hide()
                Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
            })



    }

    handleImageErrored(){

        this.setState({
            imageShow:'http://139.219.185.167/' + this.state.collection_attachment[0].attachment_value,
        })
    }

    render() {
        let appealStatus = null;
        switch (this.state.appeal) {
            case 0 : appealStatus = I18n.t('task.task_submitted');break;
            case 1 : appealStatus = I18n.t('task.task_appeal_success');break;
            case 2 : appealStatus = I18n.t('task.task_appeal_fail');break;
            default : appealStatus = I18n.t('task.task_appeal');
        }
        // devlog(Config.RequestURL + this.state.collection_attachment[0].attachment_value)
        return (
            <View style={NavStyle.container}>
                <View style={styles.headerContent}>
                    <View style={[styles.handDetailHeaderText,{height:32}]}>
                        <Text style={styles.handTextEg}>{I18n.t('task.task_notpass')}</Text>
                    </View>
                    <View style={styles.handMain}>
                        <Text style={styles.handMainText}>{this.state.system}</Text>
                        {/*{this.state.collection_attachment.length > 0 ?
                            <Image style={styles.handMainImg} source={{uri:Config.RequestURL + this.state.collection_attachment[0].attachment_value}}
                                   onError={this.handleImageErrored.bind(this)}
                            />
                            :
                            null
                        }*/}
                        {this.state.imageShow === null ?
                            null
                            :
                            <Image style={styles.handMainImg} source={{uri:this.state.imageShow}}
                                   onError={this.handleImageErrored.bind(this)}
                            />
                        }

                    </View>
                    <View style={styles.handOperating}>
                        <LongButton
                            onPress={() => {
                                this.onClickAppealButton()
                            }}
                            style={[{ width: 111, height: 32, lineHeight:32,  },this.state.status ? styles.unClickStyle : null]}
                            textStyle={[{height:32,lineHeight:32,fontSize:13, },this.state.status ? styles.unClickStyleText : null]}
                            title={appealStatus}
                        />
                    </View>
                </View>
            </View>
        )
    }


}

const styles=StyleSheet.create({
    headerContent:{
        margin:15,
        marginBottom:0,
        backgroundColor:'#fff',
        height:192,
        borderRadius:3,
        borderWidth:1,
        borderColor:'#DFEFFE',
    },

    handDetailHeaderText:{
        height:32,
        borderBottomWidth:1,
        borderColor:'#EFF0F3',
        justifyContent:'center',
    },

    handTextEg:{
        color:'#F15B40',
        fontSize:13,
        paddingLeft:16,
    },
    handMain:{
        height:102,
        borderColor:'#EFF0F3',
        borderBottomWidth:1,
        justifyContent:'center',

    },
    handMainText:{
        height:44,
        lineHeight:44,
        textAlign:'center',
        fontSize:20,
        color:'#333',
    },
    handMainImg:{
        width:226,
        height:50,
        alignSelf:'center',
        marginBottom:8,
    },
    handOperating:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    unClickStyle:{
        backgroundColor: '#fff',
        borderWidth:1,
        borderColor:'#046FDB',
    },
    unClickStyleText:{
        color:'#046FDB',
    }

});