import React,{Component} from 'react'
import {DeviceEventEmitter,View, Text,FlatList, StyleSheet,Image,TouchableOpacity,Modal} from 'react-native'

import NavStyle from "../../Tool/Style/NavStyle";
import BTFetch from "../../Tool/NetWork/BTFetch";
import {Toast,} from "antd-mobile-rn/lib/index.native";
import {getRequestBody,devlog,getRequestURL,getImageURL} from "../../Tool/FunctionTool";
import UserInfo from "../../Tool/UserInfo";
import Config from "../../Tool/Config";
import Swiper from 'react-native-swiper';
import I18n from "../../Tool/Language";
import BTWaitView from "../../Tool/View/BTWaitView.config";

export default class GameMain extends Component{

    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            headerLeft: (
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()} style={NavStyle.leftButton}>
                    <Image style={NavStyle.navBackImage} source={require('../../BTImage/navigation_back.png')}/>
                </TouchableOpacity>
            ),
            headerTitle: <Text style={NavStyle.navTitle}>{I18n.t('base.game_title')}</Text>,
            headerRight: (
                <TouchableOpacity  style={NavStyle.rightButton}>
                </TouchableOpacity>
            ),
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
            adArray: [],
            time_show:0,
            modal:false,
            currency_name:'', //昨日获取奖励的类型
            reward_num:0, //昨日奖励的数量
            game_time:0, //今日玩游戏的时间
        };

    }

    componentDidMount() {
        this.adInit();

        let body = {
            token:UserInfo.token,
        };
        let requestBody = getRequestBody(body);

        BTWaitView.show(I18n.t('tip.wait_text'));
        BTFetch("/game/gameLink", requestBody)
            .then(res => {
                BTWaitView.hide();
                if (res.code === '0') {
                    devlog("++++++++++++",res);
                    this.setState({
                        dataArray:res.data,
                    });

                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    Toast.info(res.msg,Config.ToestTime,null,false);
                }
            })
            .catch(res => {
                BTWaitView.hide();
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            });
          
            this.game_reward_info()
    }

    // 获取最新的游戏时长信息
    game_reward_info() {
        let body = {
            token:UserInfo.token,
        };
        let requestBody = getRequestBody(body);
        //游戏时长
        BTFetch('/game/reward_info',requestBody)
        .then(res => {
            devlog('游戏时长',res)

            if(res.code === '0' ){
                let reward_num = parseInt(res.data.reward_num)
               let time = res.data.game_time ? parseInt(res.data.game_time/60) : 0
                this.setState({
                    currency_name:res.data.currency_name, //昨日获取奖励的类型
                    reward_num:reward_num, //昨日奖励的数量
                    game_time:time, //今日玩游戏的时间
                })
            }
        }).catch(res => {
            BTWaitView.hide();
            Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
        });
    }

    //广告资源通知
    adInit = () => {
        devlog(UserInfo.adArray.length,11111)
        for (let i = 0 ; i < UserInfo.adArray.length; i++){
            let ads = UserInfo.adArray[i];
            if (ads.flag === 'game_top_ad' && ads.status === 1){
                if (ads.ad !== null && ads.ad != undefined){
                    this.setState({
                        adArray:ads.ad,
                    })
                }
            }
        }
    }

    onClickAd(url) {
        if (url === '' || url === undefined || url === null)
            return;
        this.props.navigation.navigate('BTPublicWebView',{url:url,navTitle:I18n.t('tip.ad_title')});
    }

    gameTime(time){
        this.setState(prevState => ({
            time_show:time,
        }))
        devlog({time:this.state.time_show})
    }

    onClickCell(index,game_link_id) {

        let obj = this.state.dataArray[index];

        if (obj.type === 0){

            Toast.info(obj.toest,Config.ToestTime,null,false);

        } else if (obj.type === 1) {

            if (obj.url === '' || obj.url === undefined || obj.url === null)
                return;
            //为游戏计时 
            let options = {
                callback: (time) => {
                    this.gameTime(time);
                    this.game_reward_info()
                }
            };
            this.props.navigation.navigate('BTPublicWebView',{url:obj.url,navTitle:obj.title,options,game_link_id,icon:obj.icon});

        } else if (obj.type === 2) {

        }

    }

    render() {
        let swiperWidth = UserInfo.screenW;
        let swiperHeight = swiperWidth / 5 * 2;
        // devlog('******swiperWidth********',this.state);
        // devlog('*******swiperHeight*******',swiperHeight);
        const { currency_name, game_time, reward_num } = this.state;
        // devlog(this.state.adArray,'值')
        return (
            <View style={[NavStyle.container,{position:'relative'}]}>
                {/* <View style={styles.time}>
                    <Text style={{fontSize:14,color:'red'}}>游戏时间：{parseInt(this.state.time_show/60)}</Text>
                </View>         */}
                {
                    this.state.adArray&&this.state.adArray.length > 0 ?
                        <View style={{height:swiperHeight + 16,position:'relative',}}>
                            <Swiper style={{height:swiperHeight + 16}}
                                    showsButtons={false}
                                    loop={true}
                                    showsPagination={true}
                                    autoplay={true}                //自动轮播
                                    autoplayTimeout={4}                //每隔4秒切换*/
                                    paginationStyle={{bottom: 3}}
                                    dotStyle={{backgroundColor: '#9B9B9B', width: 3, height: 3, borderRadius: 4,}}
                                    activeDotStyle={{backgroundColor: '#000000', width: 3, height: 3, borderRadius: 4,}}
                            >
                                {this.state.adArray.map((value, index) => {
                                    // devlog('*******getRequestURL() + value.file*******',getImageURL(value.file)) ;

                                    return (
                                        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClickAd(value.url)} style={{justifyContent: 'center', alignItems: 'center',}}>
                                            <Image style={{backgroundColor: '#ffffff', height:swiperHeight, width:swiperWidth, resizeMode: Image.resizeMode.contain,}}  source={{ uri: getImageURL(value.file)}}/>
                                        </TouchableOpacity>
                                    )
                                })}
                            </Swiper>
                            {/* 游戏挖矿及计时 */}
                            
                                <View style={styles.gameRule}>
                                    <TouchableOpacity  activeOpacity={0.5} onPress={(e)=>{this.onOpenModal(e)}}>
                                        <Text style={styles.gameRuleText}>{I18n.t('game.gameRule')}</Text>
                                    </TouchableOpacity>
                                </View> 
                            <View style={[styles.gameInfo,{ top:swiperHeight - 26 }]}>
                                <Text style={styles.gameInfoText}>{I18n.t('game.gameHarvest')} {reward_num} {currency_name},{I18n.t('game.gameTodayTime')}{game_time}{I18n.t('task.task_minute')}</Text>
                            </View> 
                        </View>
                        :
                        <View style={{marginTop:16}} />
                }
                <View style={{flex:1}}>
                    <FlatList
                        ref={(flatList)=>this._flatList = flatList}
                        renderItem={this._renderItem}
                        onEndReachedThreshold={0}
                        showsVerticalScrollIndicator={false}
                        data={this.state.dataArray}
                        style={styles.goodsFlatList}>
                    </FlatList>
                </View>

                {/* 弹出规则框 */}
                <Modal
                     animationType={"none"}
                     transparent={true}
                     visible={this.state.modal}
                >
                    <View style={{width: UserInfo.screenW,height: UserInfo.screenH, alignItems: 'center',}}>
                        <View style={{width:310,backgroundColor:'#fff',borderWidth:1,borderColor:'#DFEFFE',borderRadius:8,marginTop:126,}}>
                            <View style={{height:57,paddingTop:16,borderBottomColor:'#EFF0F3',borderBottomWidth:1}}>
                                <Text style={{lineHeight:33,fontSize:24,color:'#353B48',textAlign:'center'}}>{I18n.t('game.gameRule')}</Text>
                            </View>
                            <Text style={[styles.modalText,{marginTop:16,}]}> {I18n.t('game.gameTip1')}</Text>
                            <Text style={styles.modalText}> {I18n.t('game.gameTip2')}</Text>
                            <Text style={styles.modalText}> {I18n.t('game.gameTip3')}</Text>
                            <Text style={styles.modalText}> {I18n.t('game.gameTip5')}</Text>
                            <Text style={{fontSize:12,lineHeight:17,color:'#8395A7',paddingLeft:9,paddingRight:9,marginTop:20,}}>
                                {I18n.t('game.gameTip4')}
                            </Text>
                            {/* <View style={{flex:1,borderTopColor:'#EFF0F3',borderTopWidth:1,}}> */}
                                <TouchableOpacity    
                                    activeOpacity={0.5}
                                    style={{height:50,borderTopColor:'#EFF0F3',borderTopWidth:1,}}
                                    onPress={()=>this.onClose()}
                                >
                                    <Text style={{
                                        fontSize:20,
                                        color:'#353B48',
                                        textAlign:'center',
                                        paddingTop:16,
                                        }}>{I18n.t('game.gameUnderStand')}</Text>
                                </TouchableOpacity>
                            {/* </View> */}
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    onOpenModal(event){
        devlog({event})
        // event.preventDefault();    // 阻止默认事件
        // event.stopPropagation();

        this.setState({
            modal:true,
        })
    }
    onClose(){
        this.setState({
            modal:false,
        })
    }
    _renderItem = (item) => {
        let img = item.item.icon;
        let widthImage = UserInfo.screenW - 32;
        let heightImage = widthImage / 3;
        // devlog('+++++++++',getImageURL(img));

        return  (
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.onClickCell(item.index,item.item.game_link_id)}>
                <View style={{alignItems:'center', backgroundColor: '#ffffff', width:widthImage, height:heightImage, marginBottom:16, borderRadius:3}}>
                    <Image style={{ borderRadius: 3,width:widthImage, height:heightImage, resizeMode: Image.resizeMode.contain,}} source={{uri:getImageURL(img)}}/>
                </View>
            </TouchableOpacity>
        )
    };

}

const styles = StyleSheet.create({
    time:{
        position:'absolute',
        top:20,
        right:0,
        zIndex:999,
    },

    goodsFlatList: {
        width: UserInfo.screenW - 32,
        marginLeft: 16,
        marginRight: 16,
    },
    cell:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: '#ffffff',
        height:96,
        marginBottom:16,
        borderRadius:3
    },
    gameInfo:{
        paddingLeft:13,
        // backgroundColor: 'rgba(53,59,72,0.50)',
        backgroundColor: '#353B48',
        height:26,
        opacity:0.5,
        position:'absolute',
        width:UserInfo.screenW,
    },
    gameInfoText:{
        fontSize:14,
        color:'#fff',
        lineHeight:26,
    },
    gameRule:{
        backgroundColor:'rgba(53,59,72,0.50)',
        borderRadius:8,
        height:26,
        position:'absolute',
        right:8,
        top:8,
    },
    gameRuleText:{
        color:'#fff',
        fontSize:14,
        lineHeight:26,
        paddingLeft:9,
        paddingRight:9,
    },
    modalText:{
        fontSize:16,
        color:'#353B48',
        lineHeight:22,
        paddingLeft:36,
        paddingRight:36,
        marginBottom:8,
    }
});
