import React, { Component } from 'react';
import {View,Text, Image, TouchableOpacity, StyleSheet, FlatList, DeviceEventEmitter,Clipboard,BVLinearGradient,ScrollView} from 'react-native';
import NavStyle from "../../Tool/Style/NavStyle";
import { Toast } from 'antd-mobile-rn'
import moment from "moment/moment";
import Config from "../../Tool/Config";
import BTFetch from "../../Tool/NetWork/BTFetch";
import {getRequestBody, devlog, getRequestURL, isZHLanguage, calc_v_level_img,getImageURL} from "../../Tool/FunctionTool";
import UserInfo from "../../Tool/UserInfo";
import I18n from "../../Tool/Language";
import BTWaitView from "../../Tool/View/BTWaitView.config";
import LinearGradient from 'react-native-linear-gradient';

export default class RankingListMain extends Component{

    static navigationOptions = ({navigation}) => {
        const {state} = navigation;
        return {
            headerLeft: (
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()} style={NavStyle.leftButton}>
                    <Image style={NavStyle.navBackImage} source={require('../../BTImage/navigation_back.png')}/>
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity  style={NavStyle.rightButton}>
                </TouchableOpacity>
            ),
            headerTitle: <Text style={NavStyle.navTitle}>排行榜</Text>,
            headerTintColor: '#fff',
            headerStyle: NavStyle.navBackground,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            rankingImageName:require('../../BTImage/Base/base_ranking.png'),
            rankingImageWidth:120,
            rankingImageHeight:25,
            rankingData : [],
            rankTypes : [{id: "1", name: "DTO"}],
            myRank: '', //我的名次
            myasset: '', //我的资产
            mygroup_id: '', //我的大V
            rank_type: 'DTO', // 排行榜排序方式
            next_rank_type: '瓦力值', // 下一种排行榜排序方式
            show_rank_type: false,
            show_rank: [],
        };

    }

    componentDidMount() {

        if (!isZHLanguage()){
            this.state.rankingImageName = require('../../BTImage/Base/base_ranking_en.png');
            this.state.rankingImageWidth = 152;
            this.state.rankingImageHeight = 14;
        }

        this.getMember(); //获取排名
        this.getAllRankType();
    }

    //获取所有的排序类型
    getAllRankType() {
        let body = {
            token:UserInfo.token,
        };
        let requestBody = getRequestBody(body);

        BTFetch('/app/getRankType', requestBody)
            .then(res => {
                if (res.code === '0') {
                    this.rankTypes = res.data;
                    if (res.data.length > 0) {
                        this.setState({ show_rank_type: true,show_rank: res.data })
                    }
                    devlog('++++++this.rankTypes++++= ',this.rankTypes);
                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    Toast.info(res.msg,Config.ToestTime,null,false);
                }
            })
            .catch(res => {
            });
    }

    //获取各种排行榜
    changeRankType(nextId) {
        let rank_type = this.state.rank_type;
        // let nextId = this.getNextType(this.rankTypes, rank_type).id;
        this.getMember(nextId)
    }
    getNextType(rankTypes, currentType) {
        // devlog('++++++++++= ',rankTypes);
        if (rankTypes === null || rankTypes === undefined)
            return {id: "1", name: "DTO"};

        let index = rankTypes.findIndex((ele) => ele.name === currentType);
        const len = rankTypes.length;
        if (index === -1) {
            return  {id: "1", name: "DTO"}
        } else {
            let nextIndex = (index ) % len;
            return rankTypes[nextIndex];
        }
    }
    getMember(type = 1) {

        if (type === undefined) {
            type = 1
        }
        let body = {
            token:UserInfo.token,
            type:type,
        };
        let requestBody = getRequestBody(body);

        BTFetch('/member/getMemberRank', requestBody)
            .then(res => {
                devlog('getMemberRank res: ', res);
                if (res.code === '0') {
                    if (!res.data.my_rank.length) {
                        let sum = res.data.my_rank.my_field + ''
                        let field = sum.indexOf('.') > -1 ? sum.substring(0, sum.indexOf('.') + 3) : sum
                        this.setState({
                            myRank: res.data.my_rank.my_rank_count,
                            myasset: field,
                            mygroup_id:res.data.my_rank.group_id,
                        })
                    }
                    let { rank, rank_type } = res.data
                    this.setState({
                        rankingData: rank,
                        rank_type,
                        next_rank_type: this.getNextType(this.rankTypes, rank_type).name
                    })

                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    Toast.info(res.msg,Config.ToestTime,null,false);
                }
            })
            .catch(res => {
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            });
    }
    //跳转到身份画像页面
    navigateToPortrayal(mobile) {
        // TODO
        this.props.navigation.navigate('Portrayal', {mobile});
    }

    renderItem(item) {
        let rank = ''
        let sum = item.item.field + ''
        let field =
            sum.indexOf('.') > -1 ? sum.substring(0, sum.indexOf('.') + 3) : sum
        if (item.index + 1 === 1) {
            rank = (
                <Image style={{ width: 20, height: 30 }} source={require('../../BTImage/Base/base_gold.png')}/>
            )
        } else if (item.index + 1 === 2) {
            rank = (
                <Image style={{ width: 20, height: 30 }} source={require('../../BTImage/Base/base_silver.png')}/>
            )
        } else if (item.index + 1 === 3) {
            rank = (
                <Image style={{ width: 20, height: 30 }} source={require('../../BTImage/Base/base_copper.png')}/>
            )
        } else {
            rank = (
                <Text style={{fontSize: 14, paddingLeft: 2, color: '#9B9B9B'}}>{item.index + 1}</Text>
            )
        }
        let group_level_source = calc_v_level_img(item.item.group_id);

        return (
            <TouchableOpacity activeOpacity={0.5}
                              onPress={() => this.navigateToPortrayal(item.item.mobile)}>
                <View style={styles.listRowView} key={item.index}>
                    <View selectable={true} style={{ marginLeft: 0, width: 66, alignItems: 'center' }}>
                        {rank}
                    </View>
                    <View  style={{width: 28, height: 28 ,marginLeft:24}}>
                        <Image style={{borderRadius:13,flex:1}} source={{ uri:getImageURL(item.item.avatar_thumb) }}/>
                        <Image style={{width: 12, height: 12, position: 'absolute', bottom: 0, right: 0,}} source={group_level_source} />
                    </View>
                    <Text numberOfLines={1} style={{marginLeft:8,fontSize: 14, width:104,lineHeight: 20,height: 20,color: '#353B48',textAlign: 'left' }}>
                        {item.item.member_name}
                    </Text>
                    <Text numberOfLines={1} style={{right:0,fontSize: 14, position: 'absolute',width:105,lineHeight: 20,height: 20,color: '#353B48',textAlign: 'center' }}>
                        {field}
                    </Text>
                </View>
            </TouchableOpacity>

        )
    }
    renderHeader = headerItem => {
        return <Text style={styles.header}>{headerItem.section.key}</Text>
    };

    render() {

        return (
            // <View style={styles.container}>
                <ScrollView style={{flex:1}}>
                <LinearGradient 
                    start={{x:0, y: 1}} end={{x: 1, y: 1}}
                    colors={['#5F72D8','#6E479D']} 
                    style={styles.container}
                >
               
                {/* 个人信息模块 */}
                <View style={styles.personView}>
                    <View>
                        <Text style={styles.personText}>{this.state.myRank}</Text>
                        <Text style={styles.personContain}>名次</Text>
                    </View>
                    <View style={{width:80,height:80,position:'relative'}}>
                        <Image style={{borderRadius:40,width:80,height:80}} source={{uri:getImageURL(UserInfo.avatar_thumb)}}/>
                        <Image style={{width: 24, height: 24, position: 'absolute', bottom: 0, right: 0,}} source={calc_v_level_img(this.state.mygroup_id)} />
                    </View>
                    <View>
                        <Text style={styles.personText}>{this.state.myasset}</Text>
                        <Text style={styles.personContain}>{this.state.next_rank_type}</Text>
                    </View>
                </View>
                {/*排行榜模块*/}
                <View style={styles.list}>
                    {/* 排行规则 */}
                    <View style={styles.rulesBox}>
                        {this.state.show_rank && this.state.show_rank.map((v,i)=>{
                            return (
                                <TouchableOpacity activeOpacity={0.5} onPress={() => {this.changeRankType(v.id)}}>
                                    <View style={[styles.rules,this.state.rank_type === v.name ? styles.rulesColor : null ]}>
                                        <Text style={[styles.rulesText,this.state.rank_type === v.name ? styles.rulesTextColor : null ]}>{v.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                        
                    </View>
                    <View style={styles.listview}>
                        <Text style={styles.listFont}>{I18n.t('base.base_rank_name')}</Text>
                        <Text style={styles.listFont}>{I18n.t('base.base_rank_user')}</Text>
                        <Text style={[styles.listFont,{width:105,}]}>{this.state.rank_type}</Text>
                    </View>
                    <View style={{backgroundColor: '#EEEEEE', height: 1}}/>
                    <FlatList
                        style={this.state.rankingData.length <= 0 ? {height:200} : {}}
                        data={this.state.rankingData}
                        renderItem={item => this.renderItem(item)}
                        // keyExtractor={item => (item.member_id.toString() || item.mobile.toString())}
                    />
                  
                    </View>

                 </LinearGradient>
                </ScrollView>  
            // </View>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#6E479D',
        justifyContent: 'center',
        alignItems: 'center'
    },
    //  个人信息
    personView: {
        width:UserInfo.screenW,
        height:32 + 48 +80,
        paddingTop:32,
        paddingBottom:48,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        paddingLeft:44,
        paddingRight:33,
    },
    personText: {
        fontSize:24,
        color:'#fff',
        fontWeight:'bold',
        lineHeight:33,
        textAlign:'center',

    },
    personContain: {
        fontSize:14,
        color:'#fff',
        lineHeight:20,
        textAlign:'center',
    },
    //排行榜模块
    rulesBox:{
        flexDirection:'row',
        // justifyContent:'center',
        borderRadius:14,
        borderWidth:1,
        borderColor:'#DFEFFE',
        backgroundColor:'#EFF0F3',
        marginBottom:16,
        marginTop:24,
        marginLeft:24,
        marginRight:24,
        flexWrap:'wrap',
    },
    rules: {
        paddingLeft:16,
        paddingRight:14,
        height:26,
        borderRadius:13,
        
    },
    rulesColor: {
        backgroundColor:'#6E479D',
    },
    rulesText: {
        lineHeight:26,
        fontSize:10,
        color:'#353B48',
        fontWeight:'bold',
    },
    rulesTextColor: {
        color:'#fff'
    },
    list: {
        flex: 1,
        backgroundColor:'#FFFFFF',
        width:UserInfo.screenW,
        borderRadius:20,
        overflow: 'hidden'
    },
    listview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 20,
    },
    listFont: {
        width:66,
        fontSize: 14,
        color: '#353B48',
        // backgroundColor:'red',
        textAlign: 'center',
        lineHeight: 20,
    },
    listRowView: {
        // backgroundColor:'yellow',
        flexDirection: 'row',
        // flexWrap: 'wrap',
        alignItems: 'center',
        // justifyContent: 'space-between',
        height: 40,
    },
    text: {
        // backgroundColor:'red',
        alignItems: 'center',
        color: '#9B9B9B',
        fontSize: 14,
        lineHeight: 38,
        width: 66,
        textAlign: 'center',
    },

});
