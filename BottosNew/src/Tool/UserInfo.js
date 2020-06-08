import {Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';

//此处存放用户信息
//数据类型为变量

export default class UserInfo {

    //用户信息
    static token = "";
    static mobile = "";
    static avatar_thumb = "";//头像
    static avatar = "";//清晰头像
    static is_certification = 0;//0为未实名认证 1.已认证
    static regdate = 0;//注册时间
    static btos = "0.00";//bto数量
    static hashrate = "0.00";//阳光值
    static email = "";//邮箱
    static is_admin = 0; // 是否管理员，0 则不是，1 则是
    static member_name = "";
    static rank = 0; // 排名
    static tag = null; // 勋章
    static isBlack = 0; // 黑名单
    static group_id = '';
    static gender = '';
    static member_id = 0; // 用户ID
    static openid = ''; // 微信openid


    //是否处于登陆状态
    static isLoginState = false;
    //广告数组
    static adArray = [];

    //设备信息
    static screenW = Dimensions.get('window').width;
    static screenH = Dimensions.get('window').height;
    static brand = DeviceInfo.getBrand();// 获取厂家
    static buildNumber = DeviceInfo.getBuildNumber();// 获取 应用编译版本号
    static carrier = DeviceInfo.getCarrier();// 获取运行商名称
    static deviceCountry = DeviceInfo.getDeviceCountry();//根据区域设置信息获取设备国家。
    static deviceLocale = 'zh';//DeviceInfo.getDeviceLocale();//获取设备的地区
    static deviceIPAddress = ''; ///获取设备 当前网络地址
    static deviceMACAddress = '';//获取网络适配器MAC地址。
    static model = DeviceInfo.getModel();//获取设备模式
    static systemName = DeviceInfo.getSystemName();///获取系统名称
    static systemVersion = DeviceInfo.getSystemVersion();//获取系统版本
    static timezone = DeviceInfo.getTimezone(); // 获取时区
    static uniqueId = DeviceInfo.getUniqueID();///获取设备唯一的ID
    static version = DeviceInfo.getVersion();//获取 版本
    static HotVersion = '2.0.0'; // 热更新版本
    static isEmulator = DeviceInfo.isEmulator(); // 告诉应用程序是否运行在模拟器中
    static currentURL = {}; // 当前IP地址


    constructor() {

        DeviceInfo.getIPAddress().then(ip => {
            UserInfo.deviceIPAddress = ip;
        });

        DeviceInfo.getMACAddress().then(mac => {
            UserInfo.deviceMACAddress = mac;
        });
    }

};

export const clearData = () =>  {
    UserInfo.token = "";
    UserInfo.mobile = "";
    UserInfo.avatar = "";
    UserInfo.avatar_thumb = "";//头像
    UserInfo.is_certification = 0;
    UserInfo.regdate = 0;
    UserInfo.btos = "0.00";
    UserInfo.hashrate = "0.00";
    UserInfo.email = "";
    UserInfo.is_admin = 0;
    UserInfo.member_name = 0;
    UserInfo.rank = 0; // 排名
    UserInfo.tag = null; // 勋章
    UserInfo.isBlack = 0; // 黑名单
    UserInfo.group_id = '';
    UserInfo.gender = '';
    UserInfo.member_id = 0; // 用户ID
    UserInfo.openid = '';
};

export const logUserInfo = () =>  {
    console.log('------------------UserInfo-----------------------');
    console.log('token：', UserInfo.token);
    console.log('phone：', UserInfo.mobile);
    console.log('brand：', UserInfo.brand);
    console.log('buildNumber：', UserInfo.buildNumber);
    console.log('carrier：', UserInfo.carrier);
    console.log('deviceCountry：', UserInfo.deviceCountry);
    console.log('deviceLocale：', UserInfo.deviceLocale);
    console.log('deviceIPAddress：', UserInfo.deviceIPAddress);
    console.log('deviceMACAddress：', UserInfo.deviceMACAddress);
    console.log('model：', UserInfo.model);
    console.log('systemName：', UserInfo.systemName);
    console.log('systemVersion：', UserInfo.systemVersion);
    console.log('timezone：', UserInfo.timezone);
    console.log('uniqueId：', UserInfo.uniqueId);
    console.log('version：', UserInfo.version);
    console.log('isEmulator：', UserInfo.isEmulator);
    console.log('-------------------------------------------------');

};