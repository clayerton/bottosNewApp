//
//  TaTmHelper.h
//  AdIOSSDK
//
//  Created by lc on 16/11/1.
//  Copyright © 2016年 Ta. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "TaLaunchScreenView.h"

typedef void (^CloseLaunchADView) ();

#define kURL_ADDRESS            @"https://engine.lvehaisen.com/api/v1/"
//#define kURL_ADDRESS            @"http://engine.pre.duiba.com.cn/api/v1/"

//#define kURL_ADDRESS             @"http://engine.tuiatest.cn/api/v1/"

//#define dzlog(...) TaTmMethodLog(__VA_ARGS__)

//发布时解开
#define dzlog(...)


//推啊媒体广告SDK对外接口
@interface TaTmHelper : NSObject

@property (nonatomic,strong) NSString *appKey;

@property (nonatomic,strong) TaLaunchScreenView *launchScreenAdView;
// 关闭开屏活动页面的回调
@property (nonatomic, copy) CloseLaunchADView closeLaunchADView;
//用appkey初始化
+ (void)setupWithAppKey:(NSString *)key;

/**
 是否打开日志，默认为yes
 
 @param enable <#enable description#>
 */
+ (void)setLogEnable:(BOOL)enable;

/**
 推啊的单例

 @return TaTmHelper
 */
+ (instancetype)helper;

//获取广告
+ (void)getActivitiesWithParameters:(NSDictionary*)param
                       successBlock:(void(^)(id resultObj))success
                        failedBlock:(void(^)(id resultObj))failed;
//获取非标准广告展示型
+ (void)getActivityDataWithAdslotId:(NSString*)adslotId
               parentViewController:(UIViewController*)parentViewController
                       successBlock:(void(^)(id resultObj))success
                        failedBlock:(void(^)(id resultObj))failed;


//非标准广告位 曝光上报（adslotId、activityId、requestId 参数为非标准广告位的请求到的对应参数）

/**
 自定义广告位曝光接口
 (下列参数需要根据接入文档转换为需要的类型)
 
 @param param 请求到的  adslot_id, activity_id, request_id

 */
+ (void)displayAdWithParam:(NSDictionary*)param;

//非标准广告位 点击上报（adslotId、activityId、requestId 参数为非标准广告位的请求到的对应参数）

/**
 自定义广告位点击接口
 (下列参数需要根据接入文档转换为需要的类型)

 @param param 请求到的  adslot_id, activity_id, request_id

 */
+ (void)clickAdWithParam:(NSDictionary*)param;


/**
 标准tm位曝光成功、失败和点击的回调

 @param success 曝光成功回调
 @param failed 曝光失败回调
 @param clicked 点击tm位回调
 */
+ (void)displaySuccess:(void(^)(id resultObj))success displayFailed:(void(^)(id resultObj))failed clickTm:(void(^)(id resultObj))clicked;

@end
