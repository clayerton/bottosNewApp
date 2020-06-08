import React , {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native'
import { Toast } from 'antd-mobile-rn'
import NavStyle from "../../Tool/Style/NavStyle";
import BFetch from '../../Tool/NetWork/BTFetch';
import {getRequestBody,devlog} from "../../Tool/FunctionTool";
import BTWaitView from "../../Tool/View/BTWaitView.config";
import Config from "../../Tool/Config"
import I18n from "../../Tool/Language";

function ListFooter(props) {
    return <Text style={{textAlign: 'center'}}>{I18n.t('community.loading_wait')}</Text>
}
export default class ReportDataList extends Component {
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
            headerRight: <TouchableOpacity
                activeOpacity={0.5}
                style={NavStyle.leftButton}>
            </TouchableOpacity>,
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('taskHistory.task_history')}</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground
        }
    }

    constructor(props) {
        super(props);
        this.task_id = this.props.navigation.state.params.task_id ;
        this.state = {
            data:[],
            page:0,
            pack_size:8,
            refreshing: true,
            loading: false,
            animating: false, // loading...
            flatlistHeight:null,
            showText:"",
        }

    }

    componentWillMount() {
        this.setState({
            animating: true
        })
    }

    /*上拉加载模块*/
    onEndReached() {
        //异步回调加载requestData帖子总数
        this.setState({ page: this.state.page + 1 }, () => {
            this.requestData()
        })
    }

    requestData() {
        let body = {
            task_id:this.task_id,
            page:this.state.page + '',
            pack_size:this.state.pack_size + '',
        }
        let requestBody = getRequestBody(body)
        BFetch('/task/getMemberTaskHistory', requestBody)
            .then(res => {
                BTWaitView.hide()
                if (res.code === '0') {
                    // value['status'] = res.data
                    if (res.data.length <= 0){
                        this.setState({
                            showText:I18n.t('taskHistory.task_history_empty'),
                            loading: false,
                            refreshing: false,
                            animating: false // 请求成功关闭Loading...
                        });
                    }else {
                        this.setState({
                            data: [...this.state.data,...res.data],
                            loading: false,
                            refreshing: false,
                            animating: false, // 请求成功关闭Loading...
                            showText:"",
                        })
                        devlog(res)
                    }

                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                } else {
                    Toast.hide()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                Toast.hide()
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            })
    }

    onRefresh() {
        this.setState(
            {
                page: 0,
                refreshing: true,
                loading: false,
                data: []
            },
            () => {
                this.requestData()
            }
        )
    }

    componentDidMount() {
        this.requestData()

    }

    formatTimes(code, boolean) {
        let time = new Date( code * 1000 )
            , year = time.getFullYear()
            , month = time.getMonth() + 1
            , date = time.getDate()
            , hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
            , min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
            , sec = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();

        if (boolean) {
            return year + '/' + month + '/' + date + '';
        } else {
            return year + '-' + month + '-' + date + '  ' + hour + ':' + min + ':' + sec;
        }
    }

    //点击进入申诉页面
    onClickAppeal(task_id,collection_id){
        let body = {
            task_id,
            collection_id,
        }
        let requestBody = getRequestBody(body)
        BTWaitView.show(I18n.t('tip.wait_text'))
        BFetch('/collection/collectionDetail', requestBody)
            .then(res => {
                BTWaitView.hide()
                devlog(res)

                if (res.code === '0') {

                    this.props.navigation.navigate('DataTaskAppeal',{data:res.data});

                } else if (res.code === '99') {
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter, res.msg)
                } else {
                    Toast.hide()
                    Toast.info(res.msg, Config.ToestTime, null, false)
                }
            })
            .catch(res => {
                Toast.hide()
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            })

    }

    renderItem(item){
        let status = null , colorShow = null;
        switch (item.item.status){
            case 0: status = I18n.t('dataCollection.hand_already_end') ; colorShow = '#596379';
                break;
            case 1: status = I18n.t('dataCollection.hand_doing'); colorShow = '#6DB92C';
                break;
            case 2: status = I18n.t('dataCollection.hand_already_submit') ; colorShow = '#006BFF';
                break;
            case 3: status = I18n.t('dataCollection.hand_already_audit') ; colorShow = '#6DB92C';
                break;
            case 4: status = I18n.t('dataCollection.hand_already_notpass') ; colorShow = '#F14F48';
                break;
            case 5: status = I18n.t('dataCollection.hand_already_pass') ; colorShow = '#006BFF';
                break;
        }
        let time = this.formatTimes(item.item.created_at,false);
        return (
            <View style={styles.reportBg} key={item.item.id}>
               <View style={styles.reportHeaderView}>
                   <Text style={styles.reportHeader}>{item.item.task_name}</Text>
                   {/*点击进入申诉页面*/}
                   {item.item.status === 4 && item.item.task_id ===10 ?
                       <TouchableOpacity
                           activeOpacity={0.5}
                           onPress={()=>this.onClickAppeal(item.item.task_id,item.item.id)}
                           style={styles.reportHeaderImg}
                       >
                           <Image style={{width:16,height:16}} source={require('../../BTImage/Base/DataCollectionReview/base_task_page_detail_right.png')} />
                       </TouchableOpacity>
                        :
                       null
                   }

               </View>
                <View style={styles.reportList}>
                    <Text style={[styles.reportListText,styles.reportListTextRight]}>{I18n.t('taskHistory.taskHistory_id')}:</Text>
                    <Text style={styles.reportListText}>{item.item.id}</Text>
                </View>
                <View style={styles.reportList}>
                    <Text style={[styles.reportListText,styles.reportListTextRight]}>{I18n.t('taskHistory.tash_start_time')}:</Text>
                    <Text style={styles.reportListText}>{time}</Text>
                </View>
                <View style={styles.reportList}>
                    <Text style={[styles.reportListText,styles.reportListTextRight]}>{I18n.t('taskHistory.task_status')}:</Text>
                    <Text style={[styles.reportListText,{color:colorShow}]}>{status}</Text>
                </View>
            </View>
        )
    }


    render(){
        let dataLength = this.state.data.length;


        return (
            <View style={[NavStyle.container,styles.reportContent]}>

                {dataLength > 0 ?
                    <View style={{flex:1}}>
                        <FlatList
                            data={this.state.data}
                            renderItem={(item)=>this.renderItem(item)}
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                            onEndReached={() => this.onEndReached()}
                            onEndReachedThreshold={0.2}
                            keyExtractor={item => item.id.toString()}
                        />
                    </View>
                    :
                    <View style={{flex:1}}>
                        <Text style={{backgroundColor:'#ff000000',marginTop:100,textAlign: 'center',fontSize:20,color:'#596379'}}>{this.state.showText}</Text>
                    </View>
                }


            </View>
        )
    }
}
const styles = StyleSheet.create({
    reportContent:{
        flex:1,
        paddingBottom:22,
    },
    reportBg:{
        margin:16,
        marginBottom:0,
        backgroundColor:'#fff',
        borderRadius:3,
        paddingTop:16,
        paddingBottom:16,
        paddingLeft:16,
        borderWidth:1,
        borderColor: '#DFEFFE',
    },
    reportHeaderView:{
        height:20,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    reportHeader: {
        fontSize: 14,
        color: '#353B48',
        fontWeight:'bold',
        height:20,
        lineHeight:20,
    },
    reportHeaderImg:{
        width:48,
        height:20,
        justifyContent: 'center',
        alignItems:'center',
    },
    reportList:{
        flex:1,
        flexDirection:'row',
        marginTop:8,
        height:20,
    },
    reportListText:{
        lineHeight:20,
        fontSize:14,
        color:'#596379',

    },
    reportListTextRight:{
        marginRight:10,
    },
});