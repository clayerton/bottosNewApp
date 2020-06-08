
//此处存放常量

import {DeviceEventEmitter} from "react-native";

module.exports={
    //url后缀是
    URLSuffix:'index.php/index',
    IPAddress:[
        {url:'https://app.botfans.org/',key:'测试服务器',index:0},
        // {url:'https://dapp.botfans.org/', key:'正式服务器',index:0},
        // {url:'http://42.159.153.111',key:'备用服务器',index:1},
    ],
    ImageURL:'http://pic.botfans.org/',

    //Toest 显示时间
    ToestTime:2,
    //Toest 网络异常
    ToestFailContent:'网络异常，请稍后再试',
    //热更新版本
    HotVersion:'1.3.4',

    //token超时通知Key
    TokenDeviceEventEmitter:'TokenDeviceEventEmitter',
    //登录完成通知Key
    LoginDeviceEventEmitter:'LoginDeviceEventEmitter',
    //广告通知Key
    AdDeviceEventEmitter:'AdDeviceEventEmitter',
    //登录的本地数据Key
    LoginStorage:'LoginStorage',
    //硬更新存储
    AppUpdate:'AppUpdate',
};
