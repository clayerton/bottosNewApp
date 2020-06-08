import React,{Component} from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView, Dimensions,
    ImageBackground,
    TouchableWithoutFeedback,
} from 'react-native'
const { width, height } = Dimensions.get('window')

import Swiper from 'react-native-swiper'
/*import PublicStyle from "../../../../../util/PublicStyle";
import ImageShow from "../../../../forum/ImageShow";*/
// import {reviewAttachmentHandle} from '../../../../../services/memberCollection'
import {Toast} from "antd-mobile-rn/lib/index.native";
import NavStyle from "../../../../Tool/Style/NavStyle";
import Config from '../../../../Tool/Config';
import LongButton from '../../../../Tool/View/BTButton/LongButton'
import {devlog, getRequestBody,getRequestURL,getImageURL} from "../../../../Tool/FunctionTool";
import BTWaitView from "../../../../Tool/View/BTWaitView.config";
import BTFetch from "../../../../Tool/NetWork/BTFetch";
import I18n from "../../../../Tool/Language";
import ImageShow from '../../../../Community/ImageShow'
import BTImageView from '../../../../Tool/View/BTImageView';
export default class PhotoCollectionReviewDetail extends Component{
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
            headerRight:
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => state.params.commitPage()}
                    style={NavStyle.leftButton}>
                    <Text style={NavStyle.rightText}>{I18n.t('tip.submit')} </Text>
                </TouchableOpacity>,
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('task.task_details')}</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }
    constructor(props){
        super(props)
        let data = props.navigation.state.params.data
        let status = data && data.map(({review_status}) => review_status)
        //获取状态参数
        let arr=[];
        for(let i =0 ; i < data.length ; i ++ ){
            arr.push({
                collection_id:data[i].collection_id,
                review_attachment_id:data[i].review_attachment_id,
                collection_attachment_id:data[i].collection_attachment_id,
                status:data[i].review_status
            })
        }
        devlog(arr)
        this.beforeStatus = arr.slice()
        this.state={
            images:[],
            data,
            options: props.navigation.state.params.body,
            status:arr,
            contents:[],
            visible:false,//查看原图
            index:1,//查看图的index
            imageUrl: getImageURL(),
        }
        props.navigation.setParams({
            commitPage: this.commitPage
        })
    }

    componentWillMount(){
        // devlog(this.props.navigation.state.params.data)
    }
    //提交审核结果
    commitPage = () =>{
        devlog(this.state.status,'this.state.status')
        for(let value of this.state.status){
            if( value.status === 0 ){
                Toast.info(I18n.t('review.review_check_image'),1)
                return;
            }
        }
        let afterStatus =  this.state.status.filter((item,index) =>
            item.status !== this.beforeStatus[index].status
        );
        Toast.loading('Loading...', 0)
        let body = {
            collections:JSON.stringify(afterStatus),
            task_id:this.state.options.task_id,
            review_id:this.state.options.review_id,
        }
        let requestBody = getRequestBody(body)
        BTFetch('/review/batchReview', requestBody)
            .then(res => {
                const {code,msg} = res;
                if(code ==='0'){
                    Toast.hide()
                    Toast.success(msg,1);
                    devlog(res)
                    this.props.navigation.state.params.callback(body.task_id);
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

    attachmentShow1(attachment_value,index){
        this.setState({visible: true, index})

    }
    componentDidMount(){
       // devlog(this.state.status,'this.state.status')
    }
    //status 0 没操作 1，通过 2，未通过
    reviewDisagree(collection_attachment_id,index){
        const status = this.state.status.slice()
        const itemStatus = status[index].status
        if (itemStatus === 2) return ;
        let o = {...status[index], status: 2}
        status[index] = o;
        this.setState({ status });

    }
    reviewAgree(collection_attachment_id,index){
        const status = this.state.status.slice()
        const itemStatus = status[index].status
        if (itemStatus === 1) return ;
        let o = {...status[index], status: 1}
        status[index] = o;
        this.setState({ status });


    }
    handleImageErrored1() {
        this.setState({ imageUrl: 'http://139.219.185.167/' });
    }

    render(){
        let nodisAgreement = require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_no_pass_highlightnew.png')
        let disAgreement = require('../../../../BTImage/Base/DataCollectionReview/base_task_data_collection_pass_highlightnew.png')
        return(
            <View style={{flex:1}}>
                <Swiper
                    showsButtons={true}
                    loop={false}
                    showsPagination={false}
                    nextButton={<Image style={styles.swiperImg} source={require('../../../../BTImage/Base/DataCollectionReview/task_review_right.png')} />}
                    prevButton={<Image style={styles.swiperImg} source={require('../../../../BTImage/Base/DataCollectionReview/task_review_left.png')} />}
                >
                    {
                        this.state.data.map((v,i)=>{
                            return <View style={styles.reviewView} key={i}>
                                <TouchableWithoutFeedback onPress={()=>this.attachmentShow1(v.attachment_value,i)}>
                                        <Image
                                            style={styles.img}
                                            //resizeMode={Image.resizeMode.contain}
                                            resizeMode={'cover'}
                                            source={{uri: this.state.imageUrl + v.attachment_med_value}}
                                            onError={this.handleImageErrored1.bind(this)}
                                        />
                                </TouchableWithoutFeedback>
                                <View  style={styles.reviewViewBottom}>
                                    <View style={styles.reviewTextView}>
                                        <Text style={styles.reviewText}>{i+1}/{this.state.data.length}</Text>
                                    </View>
                                    <View style={styles.reviewButton}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={()=>{this.reviewDisagree(v.collection_attachment_id,i)}}
                                        >
                                            <View  style={[styles.reviewButtonText,{marginRight:13,},this.state.status[i].status === 2 ? styles.reviewButtonTextLeft : null]}>
                                                <Image style={styles.taskAgree} source={ nodisAgreement } />
                                                <Text style={[styles.reviewLeft,this.state.status[i].status === 2 ? styles.reviewLeftText : null]}>{I18n.t('dataCollection.hand_already_notpass')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={()=>{this.reviewAgree(v.collection_attachment_id,i)}}
                                        >
                                            <View style={[styles.reviewButtonText,this.state.status[i].status === 1 ? styles.reviewButtonTextRight : null]}>
                                                <Image style={styles.taskAgree} source={ disAgreement } />
                                                <Text style={[styles.reviewLeft,this.state.status[i].status === 1 ? styles.reviewLeftText : null]}>{I18n.t('review.reivew_agree')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                              {
                                    this.state.visible && i == this.state.index &&
                                    <ImageShow post_url={[{post_med_url:v.attachment_value}]}
                                               index={0}
                                               onClose={() => this.setState({visible: false})}
                                    />

                                }
                            </View>
                        })
                    }
                </Swiper>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    collectionDetail:{
        flex:1,
        backgroundColor:'#fff',
    },
    swiperImg:{
        width:45,
        height:32,
    },
    wrapper:{
        flex:1,
    },
    nextButtonText:{
        width:45,
        height:44,
        backgroundColor:'rgba(0,0,0,0.3)',
    },
    reviewView:{
        flex:1,
        position:'relative',
    },
    img:{
        width:width,
        flex:1,
        position:'relative',
        alignItems:'center',
    },
    reviewTextView:{
        alignSelf:'center',
        width:94,
        height:35,
        backgroundColor:'rgba(221,221,221,0.3)',
        borderRadius:14,
        borderWidth:1,
        borderColor:'#ddd',
        marginBottom:37
    },
    reviewText:{
        lineHeight:35,
        textAlign:'center',
        color:'#fff',
        fontSize:18,
    },
    reviewViewBottom:{
        position:'absolute',
        bottom:16,
        width:width -20,
    },
    reviewButton:{
        paddingLeft:15,
        paddingRight:15,
        justifyContent:'center',
        flexDirection:'row',
    },
    reviewButtonText:{
        width:111,
        height:32,
        textAlign:'center',
        borderRadius:16,
        backgroundColor:'#EFF0F3',
        /*borderWidth:1,
        borderColor:'#ddd',*/
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',

    },
    reviewButtonTextLeft:{
        backgroundColor:'#ED1C24',
    },
    reviewButtonTextRight:{
        backgroundColor:'#6DB92C',
    },
    reviewLeft:{
        color:'#D1D5DD',
        fontSize:13,
        fontWeight:'bold',
    },
    reviewRight:{
        color:'#EEF7FF',

    },
    taskAgree:{
        width:32,
        height:32,
        marginRight:10,
    },
    reviewLeftText:{
        color:'#fff',
    },
    rightText:{
        lineHeight:44,
        height: 44,
        color: '#046FDB',
        fontSize: 16,
        backgroundColor: '#ff00f000',
    },
});