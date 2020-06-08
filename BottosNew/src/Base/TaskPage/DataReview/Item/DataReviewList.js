import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';

import { Modal,  } from 'antd-mobile-rn'
import {Toast} from "antd-mobile-rn/lib/index.native";
import NavStyle from "../../../../Tool/Style/NavStyle";
import {devlog, getRequestBody} from "../../../../Tool/FunctionTool";
import LongButton from '../../../../Tool/View/BTButton/LongButton'
import BTFetch from "../../../../Tool/NetWork/BTFetch";
import I18n from "../../../../Tool/Language";
import BTWaitView from "../../../../Tool/View/BTWaitView.config";
import Config from "../../../../Tool/Config";
import HandWriteReviewDetail from "../HandWriteReview/HandWriteReviewDetail";
import PhotoCollectionReviewDetail from "../PhotoCollectionReview/PhotoCollectionReviewDetail";


export default class DataReviewList extends Component{
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
                        source={require('../../../../BTImage/navigation_back.png')}
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
        this.time = props.navigation.state.params.data.review.end_at;
        this.now = props.navigation.state.params.data.review.now;
        this.countdown = this.time - this.now; //当前时间差
        const date = this.getDateData(this.countdown);
        this.attachment = props.navigation.state.params.data.attachment;
        this.task_id = props.navigation.state.params.data.review.task_id;
        this.review_id =  props.navigation.state.params.data.review.review_id;
        this.state={
            timeLeft:date|| 0,
            attachment:this.attachment||[],
            repeat: false //防止重复发送

        }
    }

    componentDidMount() {
        devlog(this.props.navigation.state.params.data);
        this.interval = setInterval(()=> {
            this.countdown -- ;
            const date = this.getDateData(this.countdown);
            if (date && this.countdown >= 0) {
                this.setState({timeLeft:date});
            } else {
                this.stop();
            }
        }, 1000);

    }
    reviewGiveUp() {
        //防止多次发送帖子
        Modal.alert(I18n.t('tip.confirm'), I18n.t('task.task_giveup'), [
            { text: I18n.t('tip.cancel'), onPress: () => devlog('cancel') },
            {
                text: I18n.t('tip.confirm'),
                onPress: ()=>this.giveUpTaskSure()
            }
        ])

    }
    //确认放弃本期任务
    giveUpTaskSure(){
        let body = {
            task_id:this.task_id,
            review_id:this.review_id,
        }
        let requestBody = getRequestBody(body)
        devlog(requestBody,body)
        BTWaitView.show(I18n.t('tip.wait_text'))
        BTFetch('/review/giveupReview', requestBody)
            .then(res => {
                const {code,msg} = res;
                if(code ==='0'){
                    BTWaitView.hide()
                    Toast.success(res.msg, Config.ToestTime, null, false)
                    let task = {
                        task_id: this.task_id
                    }
                    this.props.navigation.state.params.callback(task);
                    this.props.navigation.goBack();
                }else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                } else {
                    Toast.hide()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            }).catch(error=>{
            Toast.hide()
            Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
        })
    }

    reviewDetail(collection_id,group_id,review_id,review_attachment_id) {
        let body = {
            task_id:this.task_id,
            review_attachment_id,
            review_id,
            collection_id,
        };
        let bodyHand = {
            group_id,
            review_id,
            task_id:this.task_id
        }
        let requestBody = getRequestBody(body)
        let requestBodyHand = getRequestBody(bodyHand)
        BTWaitView.show(I18n.t('tip.wait_text'))
        this.task_id === 5 && this.startHandReview(requestBody,body)
        this.task_id === 11 && this.startWriteReview(requestBodyHand,bodyHand)
        this.task_id === 16 && this.startHandReview(requestBody,body)
        this.task_id === 18 && this.startHandReview(requestBody,body)
    }
    //点击进入手写贴详情页面
    startWriteReview(requestBody,body){
        BTFetch('/review/startReview', requestBody)
            .then(res => {
                BTWaitView.hide()
                if (res.code === '0') {
                    const {data } = res
                    let options = {
                        body,
                        data,
                        callback: (task_id) => {
                            this.fecthStatus(task_id);
                        }
                    };
                    devlog(options,'options')
                    this.props.navigation.navigate('HandWriteReviewDetail',options);
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
    //点击进入人脸识别详情页面
    startHandReview(requestBody,body){
        devlog(requestBody)
        BTFetch('/review/startReview', requestBody)
            .then(res => {
                BTWaitView.hide()

                if (res.code === '0') {
                    const {data } = res
                    let options = {
                        body,
                        data,
                        callback: (task_id) => {
                            this.fecthStatus(task_id);
                        }
                    };
                    this.props.navigation.navigate('PhotoCollectionReviewDetail',options);
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

    fecthStatus(task_id){
        let body = {
            task_id,
        }
        let requestBody = getRequestBody(body)
        devlog(requestBody)
        BTFetch('/review/memberReview', requestBody)
            .then(res => {
                BTWaitView.hide()
                if (res.code === '0') {
                    this.setState({
                        attachment:res.data.attachment,
                    })
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


    stop(){
        clearInterval(this.interval);
    }
    componentWillUnmount() {
        this.stop();
    }
    getDateData(diff) {
        if (diff <= 0) {
            return false;
        }
        const timeLeft = {
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
        };
        if (diff >= (365.25 * 86400)) {
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) {
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) {
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;
        return timeLeft;
    }
    //提交本期任务
    saveDraft(){
        let body = {
            task_id:this.task_id,
            review_id:this.review_id,
        }
        let requestBody = getRequestBody(body)
        BTWaitView.show(I18n.t('tip.wait_text'))
        BTFetch('/review/submitReview', requestBody)
            .then(res => {
                const {code,msg} = res;
                devlog(res);
                if(code ==='0'){
                    BTWaitView.hide()
                    Toast.success(res.msg, Config.ToestTime, null, false);
                    let task = {
                        task_id: this.task_id
                    }
                    this.props.navigation.state.params.callback(task);
                    this.props.navigation.goBack();
                }else if (res.code === '99') {
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

    render(){
        return (
            <View style={NavStyle.container}>
                <View style={styles.detailHeader}>
                    <Text style={[styles.detailHeaderTask,{marginRight:20,marginLeft:10,}]}>{I18n.t('task.task_limit_quantity')}</Text>
                    <Text style={[styles.detailHeaderTask,{color:'#000'}]}>{I18n.t('dataCollection.hand_overtime')}
                        {this.state.timeLeft.days < 10 ? '0' + this.state.timeLeft.days:this.state.timeLeft.days}{I18n.t('task.task_day')}
                        {this.state.timeLeft.hours < 10 ? '0' + this.state.timeLeft.hours:this.state.timeLeft.hours}{I18n.t('task.task_hour')}
                        {this.state.timeLeft.min< 10 ? '0' + this.state.timeLeft.min:this.state.timeLeft.min}{I18n.t('task.task_minute')}
                        {this.state.timeLeft.sec< 10 ? '0' + this.state.timeLeft.sec:this.state.timeLeft.sec}{I18n.t('task.task_second')}
                    </Text>
                </View>
                <ScrollView style={{flex:1}}>
                    <View style={styles.detailContent}>
                        {this.state.attachment&&
                            this.state.attachment.map((v,i)=>{
                                let status = '';
                                let numStatus = v.count - v.complete;
                                let statusColor = null;
                                if(numStatus === v.count){
                                    status = I18n.t('review.review_didnot');
                                    statusColor = '#6A6F7B'
                                }else if(numStatus === 0){
                                    status = I18n.t('review.review_finish');
                                    statusColor = '#006BFF'
                                }else{
                                    status = I18n.t('dataCollection.hand_already_audit');
                                    statusColor = '#6DB92C'

                                }
                                return (
                                    <TouchableOpacity
                                        onPress={()=>{this.reviewDetail(
                                            v.collection_id,
                                            v.group_id,
                                            v.review_id,
                                            v.review_attachment_id
                                        )}}
                                        activeOpacity={0.5}
                                        key={i}
                                    >
                                        <View style={styles.reviewDetail}>
                                            <Text style={styles.reviewDetailName}>{I18n.t('review.review_check_list')}{i+1}{I18n.t('review.review_group')}</Text>
                                            <Text style={styles.reviewDetailLine} />
                                            <Text style={styles.reviewDetailText}>{v.complete}/{v.count}</Text>
                                            <Text style={styles.reviewDetailLine} />
                                            <Text style={[styles.reviewDetailText,{color:statusColor}]}>{status}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }

                    </View>
                </ScrollView>
                <View style={styles.detailBottom}>
                    <LongButton
                        onPress={() => {
                            this.reviewGiveUp()
                        }}
                        style={{width:150, height:50, backgroundColor:'#fff', borderWidth:1, borderColor:'#046FDB'}}
                        textStyle={{ color:'#046FDB', letterSpacing:2.6 }}
                        title={I18n.t('dataCollection.collection_gaveup')}
                    />
                    <LongButton
                        onPress={() => {
                            this.saveDraft()
                        }}
                        style={{width:150, height:50, }}
                        textStyle={{ color:'#fff', letterSpacing:2.6 }}
                        title={I18n.t('dataCollection.collection_submit')}
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    detailHeader:{
        flexDirection:'row',
        marginTop:16,
        marginBottom:32,
        marginLeft:16,
        marginRight:16,
        borderBottomWidth:1,
        borderTopWidth:1,
        borderColor:'#D1D5DD',
    },
    detailHeaderTask:{
        fontSize:14,
        color:'#8395A7',
        lineHeight:20,
        alignSelf:'center',
        paddingTop:8,
        paddingBottom:8,
    },
    detailContent:{
        flex:1,
        paddingLeft:16,
        paddingRight:16,
    },
    reviewDetail:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:52,
        paddingLeft:29,
        paddingRight:54,
        marginBottom:16,
        backgroundColor:"#fff",
        borderRadius:3,
    },
    reviewDetailName:{
        lineHeight:20,
        fontSize:14,
        color:'#6A6F7B',
    },
    reviewDetailText:{
        lineHeight:20,
        fontSize:14,
        color:'#006BFF',
    },
    detailBottom:{
        marginTop:46,
        marginBottom:13,
        paddingLeft:15,
        paddingRight:15,
        justifyContent:'space-between',
        flexDirection:'row',
    },
    reviewDetailLine:{
        backgroundColor:'#EFF0F3',
        width:2,
        height:13,
    },
});