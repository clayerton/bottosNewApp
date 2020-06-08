
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import App from './App';
import React, {Component} from 'react';
import { AppRegistry, DeviceEventEmitter,Text } from "react-native";
import { Provider } from 'react-redux'
import store from './src/Redux'
import {StackNavigator, TabBarBottom, TabNavigator} from "react-navigation";
import CardStackStyleInterpolator from './node_modules/react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import TabBarItem from "./src/Tool/View/TabBarItem";
import Base from "./src/Base/Index";
import GameMain from "./src/Base/Game/GameMain";
import TaskPage from './src/Base/TaskPage/Index';
import RankingListMain from './src/Base/RankingList/RankingListMain'; // 排行榜
import Verified from './src/Base/TaskPage/Verified'; // 实名认证
import AdvancedVerified from './src/Base/TaskPage/AdvancedVerified'; //高级实名认证
import Invite from './src/Base/TaskPage/Invite'; // 邀请好友
import BindEthAddress from './src/Base/TaskPage/BindEthAddress'; // 绑定以太网钱包
import DataCollection from './src/Base/TaskPage/DataCollection/Index'; // 数据采集
import DataReview from './src/Base/TaskPage/DataReview/Index'; // 数据审核
import DataReviewList from './src/Base/TaskPage/DataReview/Item/DataReviewList';
import HandWriteReviewDetail from './src/Base/TaskPage/DataReview/HandWriteReview/HandWriteReviewDetail';
import PhotoCollectionReviewDetail from './src/Base/TaskPage/DataReview/PhotoCollectionReview/PhotoCollectionReviewDetail';
import WankrRegister from './src/Base/TaskPage/CommunityBuild/WankrRegister' //社区共建


import HandWritten from './src/Base/TaskPage/DataCollection/HandWritten/Index';
import PhotoCollection from './src/Base/TaskPage/DataCollection/PhotoCollection/Index';
import ReportDataList from './src/Base/TaskPage/TaskPageDetails';
import DataTaskAppeal from './src/Base/TaskPage/Item/DataTaskAppeal' //申诉详情

import Homepage from "./src/Homepage/Index";
import Community from "./src/Community/Index";
import My from "./src/My/Index";
import Login from "./src/Login/Login";
import Register from "./src/Login/Register";
import Find from './src/Login/FindPassword';
import ServiceTerms from './src/Login/ServiceTerms';
import PrivacyPolicy from './src/Login/PrivacyPolicy';
import BindPhone from "./src/Login/BindPhone";
import SelectionSetting from "./src/Login/SelectionSetting";
import NavStyle from "./src/Tool/Style/NavStyle";
import I18n from './src/Tool/Language/index';
import {addStackRoutes, clearMapForKey, getLocalStorage, setLocalStorage} from './src/Tool/FunctionTool';
import ShopMain from './src/Base/Shop/ShopMain';
import ShopAddAddress from './src/Base/Shop/ShopAddAddress';
import ShopGoodsDetails from './src/Base/Shop/ShopGoodsDetails';
import ShopPayConfirm from './src/Base/Shop/ShopPayConfirm';
import ShopPayList from './src/Base/Shop/ShopPayList';
import ShopPayResults from './src/Base/Shop/ShopPayResults';
import Asset from './src/Base/Asset/Asset';   // 我的资产
import AssetDetail from './src/Base/Asset/AssetDetail';   // 资产详情
import AssetList from './src/Base/Asset/AssetList';   // 瓦力值记录
import AssetIn from './src/Base/Asset/AssetIn';   // 转入
import AssetOut from './src/Base/Asset/AssetOut';
import AssetResults from './src/Base/Asset/AssetResults';
import Sunline from './src/Base/Asset/Sunline';   // 收支记录
import Portrayal from './src/My/PortrayalView'; // 个人画像
import FollowList from './src/My/FollowList'; // 关注列表
import FollowListMe from './src/My/FollowListMe'; // 粉丝数

import Report from './src/My/Item/Report' //举报
import ReportContent from './src/My/Item/ReportContent'

// Settings
import Settings from './src/My/Settings/index';// 设置
import ContactUs from './src/My/Settings/ContactUs';     //联系我们
import VersionLog from './src/My/Settings/VersionLog';     //版本信息
import Feedback from './src/My/Settings/Feedback';     //问题反馈
import Realinfomation from './src/My/Settings/Realinfomation';     //实名信息
import EthAddress from './src/My/Settings/EthAddress';//钱包地址
import PayforPassword from './src/My/Settings/PayforPassword'; //设置支付密码
import PayforPasswordCommit from './src/My/Settings/PayforPasswordCommit'; //确认支付密码
import ModiPassword from './src/My/Settings/ParForPassword/ModiPassword'; //修改支付密码
import ForgetPayPassword from './src/My/Settings/ParForPassword/ForgetPayPassword'; //修改支付密码
import BlackList from './src/My/Item/BlackList'; //黑名单列表

// BaseStrategy


// 社区部分路由组件
import PostPublish from './src/Community/PostPublish'
import PostPrivacyPolicy from './src/Community/PostPrivacyPolicy'
import MessageList from './src/Community/MessageList'
import PersonalPosts from './src/Community/PersonalPosts'
import OnePost from './src/Community/OnePost'
import RedPacketSend from './src/Community/RedPacketSend'
import RedPacketList from './src/Community/RedPacketSend/RedPacketList'
import GeneratePicture from './src/Community/Components/GeneratePicture' //生成图片

// 主页

import HomepagePostList from './src/Homepage/HomepagePostList';

import Config from "./src/Tool/Config";
import {getRequestBody,devlog} from "./src/Tool/FunctionTool";
import BTFetch from "./src/Tool/NetWork/BTFetch";
import UserInfo, {clearData, logUserInfo} from "./src/Tool/UserInfo";
import {Toast} from "antd-mobile-rn";
import codePush from 'react-native-code-push'
import BTPublicWebView from "./src/Tool/View/BTPublicWebView";
import NavigationService from './NavigationService';
import SplashScreen from "react-native-splash-screen";
import BTWaitView from "./src/Tool/View/BTWaitView.config";
import RadarChart from "./src/Base/Asset/RadarChart";// 五维图

import OnboardingPage from './src/OnboardingPage' // 引导页
//Tab 注册
const TabRouteConfigs = {
    Community: {
        screen: Community,
        navigationOptions: {
            tabBarLabel: I18n.t('community.community_tab'),
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={require('./src/BTImage/tabbar_community.png')}
                    selectedImage={require('./src/BTImage/tabbar_community_s.png')}
                />
            ),
        },
    },
    Base: {
        screen: Base,
        navigationOptions: ({navigation}) => ({
            tabBarLabel:I18n.t('base.base_tab2'),
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={require('./src/BTImage/tabbar_base.png')}
                    selectedImage={require('./src/BTImage/tabbar_base_s.png')}
                />
            ),
        }),
    },
    Homepage: {
        screen: Homepage,
        navigationOptions: ({navigation}) => ({
            tabBarLabel:'主页',
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={require('./src/BTImage/tabbar_homepage.png')}
                    selectedImage={require('./src/BTImage/tabbar_homepage_s.png')}
                />
            ),
        }),
    },
    My: {
        screen: My,
        navigationOptions: {
            tabBarLabel: I18n.t('my.my_tab'),
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={require('./src/BTImage/tabbar_my.png')}
                    selectedImage={require('./src/BTImage/tabbar_my_s.png')}
                />
            ),
        },
    }
};
//Tab 配置
const TabNavigatorConfigs = {
    initialRouteName: 'Community',
    tabBarComponent: TabBarBottom,  // TabBarBottom
    tabBarPosition: 'bottom',       // 显示位置，android 默认是显示在页面顶端的
    swipeEnabled: false,             // 是否可以左右滑动切换tab
    animationEnabled: false,         // 切换页面时是否有动画效果
    lazy: false,                     // 懒加载
    backBehavior: 'nome',           // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    tabBarOptions: {
        activeTintColor: '#046FDB', //  激活版块的颜色
        inactiveTintColor: '#596379', // 非激活版块的颜色
        style: {backgroundColor: '#ffffff'},// 背景颜色
        labelStyle: {fontSize: 10}          // 文字大小
    },
    indicatorStyle: {
        height: 0 // 如TabBar下面显示有一条线，可以设高度为0后隐藏
    }
};
const Tab = TabNavigator(TabRouteConfigs, TabNavigatorConfigs);

//Nav 注册
const StackRouteConfigs = {
    Tab: {
        screen: Tab,
    },
    Login: {
        screen: Login,
    },
    Register: {
        screen: Register,
    },
    Find: {
        screen: Find,
    },
    ServiceTerms: {
        screen: ServiceTerms,
    },
    PrivacyPolicy: {
        screen: PrivacyPolicy,
    },
    BindPhone: {
        screen: BindPhone,
    },
    SelectionSetting: {
        screen: SelectionSetting,
    },
    TaskPage: {
        screen: TaskPage,
    },
    RankingListMain: {
        screen: RankingListMain,
    },
    Verified: {
        screen: Verified,
    },
    AdvancedVerified:{
        screen: AdvancedVerified,
    },
    Invite: {
        screen: Invite,
    },
    BindEthAddress: {
        screen: BindEthAddress,
    },
    DataCollection: {
        screen: DataCollection,
    },
    HandWritten: {
        screen: HandWritten,
    },
    PhotoCollection:{
        screen: PhotoCollection,
    },
    DataReview: {
        screen: DataReview,
    },
    DataReviewList: {
        screen: DataReviewList,
    },
    PhotoCollectionReviewDetail:{
        screen: PhotoCollectionReviewDetail,
    },
    HandWriteReviewDetail: {
        screen: HandWriteReviewDetail,
    },

    ReportDataList:{
        screen: ReportDataList,
    },
    DataTaskAppeal:{
        screen: DataTaskAppeal,
    },
    ShopMain: {
        screen: ShopMain,
    },
    ShopAddAddress: {
        screen: ShopAddAddress,
    },
    ShopGoodsDetails: {
        screen: ShopGoodsDetails,
    },
    ShopPayConfirm: {
        screen: ShopPayConfirm,
    },
    ShopPayList: {
        screen: ShopPayList,
    },
    ShopPayResults: {
        screen: ShopPayResults,
    },
    Asset: {
        screen: Asset,
    },
    AssetDetail: {
        screen: AssetDetail,
    },
    AssetList: {
        screen: AssetList,
    },
    Sunline: {
        screen: Sunline,
    },
    Settings: {
        screen: Settings,
    },
    // GameStrategy: {
    //     screen: GameStrategy,
    // },
    // MedalRaider: {
    //     screen: MedalRaider,
    // },
    // Startrack: {
    //     screen: Startrack,
    // },
    // VIPLevel: {
    //     screen: VIPLevel,
    // },
    Portrayal: {
        screen: Portrayal,
    },
    BTPublicWebView: {
        screen: BTPublicWebView,
    },
    ContactUs: {
        screen: ContactUs,
    },
    VersionLog: {
        screen: VersionLog,
    },
    Feedback: {
        screen: Feedback,
    },
    Realinfomation: {
        screen: Realinfomation,
    },
    EthAddress:{
        screen: EthAddress,
    },
    FollowList: {
        screen: FollowList,
    },
    FollowListMe: {
        screen: FollowListMe,
    },
    PayforPassword: {
        screen: PayforPassword,
    },
    PayforPasswordCommit:{
        screen:  PayforPasswordCommit,
    },
    GameMain:{
        screen:  GameMain,
    },
    ModiPassword: {
        screen: ModiPassword,
    },
    ForgetPayPassword: {
        screen: ForgetPayPassword,
    },
    Report:{
        screen: Report,
    },
    ReportContent: {
        screen: ReportContent,
    },
    AssetIn: {
        screen: AssetIn,
    },
    RadarChart: {
        screen: RadarChart,
    },
    AssetOut: {
        screen: AssetOut,
    },
    AssetResults: {
        screen: AssetResults,
    },
    WankrRegister: {
        screen: WankrRegister,
    },
    BlackList: {
        screen: BlackList,
    },
    HomepagePostList: {
        screen: HomepagePostList,
    },
    GeneratePicture: {
        screen: GeneratePicture,
        navigationOptions:{
            header:null
        }
    }

};
// 引导页
// const Onboarding = StackRouteConfigs({
//     // 引导页
//     OnboardingPage: {
//       screen: OnboardingPage,
//       navigationOptions: {
//         header: null
//       }
//     }
//   })

// const StackRouteConfigs= {
//      // 引导页
//      Tab: {
//         screen: Tab,
//     },
//      OnboardingPage: {
//         screen: OnboardingPage,
//         navigationOptions: {
//           header: null
//         }
//       }
// }
// 社区路由组件的添加
addStackRoutes(StackRouteConfigs, [PostPublish, PostPrivacyPolicy, MessageList, PersonalPosts, OnePost, RedPacketSend, RedPacketList])
// 主页
// addStackRoutes(StackRouteConfigs, [HomepagePostList ])



//Nav 配置
const StackNavigatorConfigs = {
    initialRouteName: 'Tab',
    // mode: 'modal',
    navigationOptions: {
        headerTitleStyle: NavStyle.navTitle,
        headerStyle: NavStyle.navBackground,
        headerBackImage: require('./src/BTImage/navigation_back.png'),
    },
    transitionConfig: () => ({
        //因为ios 的导航动画默认是从左到右，所以，这里配置一下动画，使用react-navigation已经实现的从左到右的动画，
        //适配Android，不过，需要导入动画
        screenInterpolator: CardStackStyleInterpolator.forHorizontal
    })
};
const Navigator = StackNavigator(StackRouteConfigs, StackNavigatorConfigs);


class MainComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showOnboardingPage: false,
            defaultView:<Text />,
        }
    }
    handleClickButtonToHome(){
        alert(1)
    }
     componentWillMount() {
        if (!this.state.showOnboardingPage) {
            
            this.setState({
            defaultView: (
                <OnboardingPage screenProps={() => this.handleClickButtonToHome()} />
            )
            })
        } else {
            this.setState({
                    defaultView:
                    <Navigator
                        ref={navigatorRef => {
                            NavigationService.setTopLevelNavigator(navigatorRef);
                        }}
                    />
            })
        }
    }
    componentDidMount() {
        


        //读取本地用户信息
        getLocalStorage(
            Config.LoginStorage,
            ret => {
                devlog('----读取到token，赋值给UserInfo------');

                //读取到token，赋值给UserInfo
                UserInfo.token = ret.token;
                UserInfo.mobile = ret.mobile;
                UserInfo.avatar_thumb = ret.avatar_thumb;
                UserInfo.avatar = ret.avatar;
                UserInfo.is_certification = ret.is_certification;
                UserInfo.regdate = ret.regdate;
                UserInfo.btos = ret.btos;
                UserInfo.hashrate = ret.hashrate;
                UserInfo.email = ret.email;
                UserInfo.is_admin = ret.is_admin;
                UserInfo.member_name = ret.member_name;
                UserInfo.rank = ret.rank // 排名
                UserInfo.exp = ret.exp // 积分
                UserInfo.tag = ret.tag // 勋章
                UserInfo.isBlack = ret.isBlack // 勋章
                UserInfo.group_id = ret.group_id
                UserInfo.gender = ret.gender
                UserInfo.member_id = ret.member_id // 用户ID

                //发起登录成功通知
                DeviceEventEmitter.emit(Config.LoginDeviceEventEmitter);
            },
            errMsg => {
                //发起登录通知
                DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,'');
            }
        );

        //同步热更新
        codePush.sync();
        //获取广告列表
        this.getAd();

    }

    //获取广告列表
    getAd(){
        let body = {};
        let requestBody = getRequestBody(body);

        BTFetch("/ad/lists", requestBody)
            .then(res => {
                devlog('------广告-------',res);
                if (res.code === '0') {

                    UserInfo.adArray = res.data;
                    //发起通知
                    DeviceEventEmitter.emit(Config.AdDeviceEventEmitter);

                }else if(res.code === '99'){
                    DeviceEventEmitter.emit(Config.TokenDeviceEventEmitter,res.msg);
                }else{
                    SplashScreen.hide();
                    Toast.info(res.msg,Config.ToestTime,null,false);
                }
            })
            .catch(res => {
                SplashScreen.hide();
                Toast.fail(Config.ToestFailContent,Config.ToestTime,null,false);
            });
    }

    render() {
        return (
            <Provider store={store}>
                {/* {this.state.defaultView} */}
                <Navigator
                    ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            </Provider>
        );
    }
}


AppRegistry.registerComponent('Wali', () => MainComponent);





// ++++++++++++++++++++++++++++++++++++++++++++++++++
// if(Platform.OS === 'ios'){
//     codePush.sync({
//         updateDialog: {
//             appendReleaseDescription: true,
//             optionalUpdateMessage: '',
//             descriptionPrefix: '',
//             title:'更新提示',
//             optionalUpdateMessage: '',
//             optionalIgnoreButtonLabel:'稍后',
//             optionalInstallButtonLabel:'后台更新',
//             mandatoryUpdateMessage:'',
//             mandatoryContinueButtonLabel:'更新',
//         },
//              mandatoryInstallMode:codePush.InstallMode.IMMEDIATE,
//     deploymentKey: 'SzlCUJAGk5VdeyvN0ipewMaA4oVb4ksvOXqog',
// });
// }else if(Platform.OS === 'android'){
//     codePush.sync({
//         updateDialog: {
//             appendReleaseDescription: true,
//             descriptionPrefix: '',
//             title:'更新提示',
//             optionalUpdateMessage: '',
//             optionalIgnoreButtonLabel:'稍后',
//             optionalInstallButtonLabel:'后台更新',
//             mandatoryUpdateMessage:'',
//             mandatoryContinueButtonLabel:'更新',
//         },
//         mandatoryInstallMode:codePush.InstallMode.IMMEDIATE,
//     deploymentKey: 'KZSMEjSZZ1y8uYqWNeL7vbp2mBR24ksvOXqog',
// });
// }

// ios:SzlCUJAGk5VdeyvN0ipewMaA4oVb4ksvOXqog
// android:KZSMEjSZZ1y8uYqWNeL7vbp2mBR24ksvOXqog
// appendReleaseDescription:true,//是否显示更新description，默认为false
// descriptionPrefix:"更新内容：",//更新说明的前缀。 默认是” Description:
// mandatoryContinueButtonLabel:"立即更新",//强制更新的按钮文字，默认为continue
// mandatoryUpdateMessage:"",//- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
// optionalIgnoreButtonLabel: '稍后',//非强制更新时，取消按钮文字,默认是ignore
// optionalInstallButtonLabel: '后台更新',//非强制更新时，确认文字. Defaults to “Install”
// optionalUpdateMessage: '有新版本了，是否更新？',//非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
//  title: '更新提示'//要显示的更新通知的标题. Defaults to “Update available”.
