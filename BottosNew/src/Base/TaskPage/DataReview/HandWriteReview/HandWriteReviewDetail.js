import React,{Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet
} from 'react-native'
import NavStyle from "../../../../Tool/Style/NavStyle";
import UserInfo from '../../../../Tool/UserInfo'
import HandWriteReviewHeader from './HandWriteReviewHeader'
import LongButton from '../../../../Tool/View/BTButton/LongButton'
import Config from '../../../../Tool/Config';
import BTImageView from '../../../../Tool/View/BTImageView';
import I18n from "../../../../Tool/Language";
import {devlog, getRequestBody} from "../../../../Tool/FunctionTool";
import {Toast} from "antd-mobile-rn/lib/index.native";
import BTFetch from "../../../../Tool/NetWork/BTFetch";
import BTWaitView from "../../../../Tool/View/BTWaitView.config";
export default class HandWriteReviewDetail extends Component{
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

    constructor(props){
        super(props);
        this.review_id = props.navigation.state.params.body.review_id;
        this.task_id = props.navigation.state.params.body.task_id;
        this.dataAll = props.navigation.state.params.data || [];
        let arr=[];
        for(let i =0 ; i < this.dataAll.length ; i ++ ){
            arr.push({
                collection_id:this.dataAll[i].collection_id,
                collection_attachment_id:this.dataAll[i].collection_attachment_id,
                status:this.dataAll[i].review_status,
            })
        }
        this.beforeStatus = arr.slice();
        this.state ={
            data:this.dataAll,
            status:arr,
        }
    }

    componentDidMount(){
        //devlog(this.state.data);
    }

    //status 0 没操作 1，通过 2，未通过
    //不通过本条审核
    handOperatingError(index){
        const status = this.state.status.slice()
        const itemStatus = status[index].status
        if (itemStatus === 2) return ;
        let o = {...status[index], status: 2}
        status[index] = o;
        this.setState({ status });
    }
    //通过本条审核
    handOperatingRight(index) {
        const status = this.state.status.slice()
        const itemStatus = status[index].status
        if (itemStatus === 1) return ;
        let o = {...status[index], status: 1}
        status[index] = o;
        this.setState({ status });
    }
    //提交审核数据
    handWriteReviewSumit(){
        for(let value of this.state.status){
            if( value.status === 0 ){
                Toast.info(I18n.t('review.review_check_image'),1)
                return;
            }
        }
        //筛选出改变的数据
        let afterStatus =  this.state.status.filter((item,index) =>
            item.status !== this.beforeStatus[index].status
        );

        BTWaitView.show(I18n.t('tip.wait_text'))
        let body = {
            task_id:this.task_id,
            review_id:this.review_id,
            collections:JSON.stringify(afterStatus),

        }
        let requestBody = getRequestBody(body)
        devlog(requestBody)
        BTFetch('/review/batchReview', requestBody)
            .then(res => {
                const {code,msg} = res;
                BTWaitView.hide()
                if(code ==='0'){
                    Toast.success(res.msg, Config.ToestTime, null, false)
                    this.props.navigation.state.params.callback(this.task_id);
                    this.props.navigation.goBack();
                }else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                } else {
                    Toast.hide()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch((error) => {
                Toast.hide()
                Toast.offline(I18n.t('tip.offline'), Config.ToestTime, null, false)
            })

    }

    render(){
        return (
            <ScrollView style={[NavStyle.container,{position:'relative',}]}>
                <Image style={styles.handDetailBgImg} source={require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_hand_write_bg.png')} />
                 <HandWriteReviewHeader />
                {this.state.data &&
                this.state.data.map((v,i)=>{
                    let nodisAgreement = require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_no_pass_highlightnew.png')
                    let disAgreement = require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_pass_highlightnew.png')
                    return (
                        <View style={styles.headerContent} key={i}>
                            <View style={[styles.handDetailHeaderText,{height:32}]}>
                                <Text style={styles.handTextEg}>({i+1}/10)</Text>
                            </View>
                            <View style={styles.handMain}>
                                <Text style={styles.handMainText}>{v.word}</Text>
                                <BTImageView style={styles.handMainImg} source ={v.attachment_value} />
                                {/*<Image style={styles.handMainImg} source={{uri:Config.RequestURL + v.attachment_value}} />*/}
                            </View>
                            <View style={styles.handOperating}>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={()=>{this.handOperatingError(i)}}>
                                    <View style={[
                                        styles.handOperatingButton,
                                        styles.handOperatingLeft,
                                        this.state.status[i].status === 2 ? styles.handOperatingError :null
                                    ]}>
                                        <Image style={[styles.handOperatingImg]}
                                            source={nodisAgreement}
                                        />
                                        <Text style={[
                                            styles.handOperatingButtonText,
                                            this.state.status[i].status === 2 ? styles.handOperatingErrorText :null
                                        ]}>{I18n.t('review.review_disagree')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={()=>{this.handOperatingRight(i)}}>
                                    <View style={[
                                        styles.handOperatingButton,
                                        this.state.status[i].status === 1 ? styles.handOperatingRight :null
                                    ]}>
                                        <Image style={[styles.handOperatingImg]}
                                               source={ disAgreement }
                                        />
                                        <Text style={[
                                            styles.handOperatingButtonText,
                                            this.state.status[i].status === 1 ? styles.handOperatingRightText :null
                                        ]}>{I18n.t('review.reivew_agree')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })
                }
                <View style={styles.handFooter}>
                    <LongButton
                        onPress={() => {
                            this.handWriteReviewSumit()
                        }}
                        style={{width:UserInfo.screenW - 48 ,textAlign:'center', height:50, backgroundColor:'#046FDB',alignSelf:'center'}}
                        textStyle={{ color:'#fff', letterSpacing:0,textAlign:'center', }}
                        title={I18n.t('tip.submit')}
                    />
                </View>
            </ScrollView>
        )
    }
}
const styles=StyleSheet.create({
    handDetailBgImg:{
        width:UserInfo.screenW,
        height:UserInfo.screenW * 1200 / 1125 ,
        position:'absolute',
        left:0,
        top:0,
    },
    headerContent:{
        margin:15,
        marginBottom:0,
        backgroundColor:'#fff',
        height:192,
        borderRadius:3,
    },

    handDetailHeaderText:{
        height:32,
        borderBottomWidth:1,
        borderColor:'#EFF0F3',
        justifyContent:'center',
    },

    handTextEg:{
        color:'#353B48',
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
    handOperatingImg:{
        width:32,
        height:32,
    },
    handOperatingButton:{
        fontSize:13,
        width:111,
        height:32,
        borderRadius:16,
        backgroundColor:'#EFF0F3',
        justifyContent:'center',
        flexDirection:'row',
        alignItems: 'center',
    },
    handOperatingButtonText:{
        fontSize:13,
        lineHeight:32,
        height:32,
        color:'#D1D5DD',

    },
    handOperatingLeft:{
        marginRight:15,
    },
    handOperatingError:{
        backgroundColor:'#ED1C24',
    },
    handOperatingErrorText:{
        color:'#fff',
    },
    handOperatingRight:{
        backgroundColor:'#6DB92C',
    },
    handOperatingRightText:{
        color:'#fff',
    },
    handFooter:{
        marginTop:32,
        marginBottom:23,
        height:50,
        borderRadius:50,
        alignSelf:'center',
    },


});
