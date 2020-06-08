/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <AVFoundation/AVFoundation.h>
#import "RNUMConfigure.h"
#import <UMAnalytics/MobClick.h>        // 统计组件
#import <UMCommon/UMCommon.h>           // 公共组件是所有友盟产品的基础组件，必选
#import "RNSplashScreen.h"
#import <UMShare/UMShare.h>
#import "Configuration.h"
#import <TaTmSDK/TaTm.h>

@interface AppDelegate () /*<UNUserNotificationCenterDelegate>*/

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //一系列的初始化工作
  [self initAction:launchOptions];

  NSURL *jsCodeLocation;

#ifdef DEBUG
//      jsCodeLocation = [NSURL URLWithString:@"http://192.168.2.98:8081/index.bundle?platform=ios&dev=true&minify=false"];//卫星
      jsCodeLocation = [NSURL URLWithString:@"http://192.168.2.100:8081/index.bundle?platform=ios&dev=true&minify=false"];//刘宇浩
//    jsCodeLocation = [NSURL URLWithString:@"http://192.168.2.207:8081/index.bundle?platform=ios&dev=true&minify=false"];
  //    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  //    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//  jsCodeLocation = [CodePush bundleURL];
#else
  jsCodeLocation = [CodePush bundleURL];
#endif
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Wali"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
//  [RNSplashScreen show];
  [self.window makeKeyAndVisible];
  
  return YES;
}


- (void)initAction:(NSDictionary *)launchOptions{
  
  //----------------------配置友盟SDK产品并统一初始化----------------------
  [UMConfigure setEncryptEnabled:YES]; // optional: 设置加密传输, 默认NO.
  //开发者需要显式的调用此函数，日志系统才能工作
  //  [UMCommonLogManager setUpUMCommonLogManager];
  [UMConfigure setLogEnabled:NO]; // 开发调试时可在console查看友盟日志显示，发布产品必须移除
  [RNUMConfigure initWithAppkey:UMAppKey channel:@"App Store"];
  
  //----------------------统计----------------------
  [MobClick setScenarioType:E_UM_NORMAL|E_UM_DPLUS];
  
  //----------------------分享----------------------
  /*
   设置微信的appKey和appSecret
   [微信平台从U-Share 4/5升级说明]http://dev.umeng.com/social/ios/%E8%BF%9B%E9%98%B6%E6%96%87%E6%A1%A3#1_1
   */
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatSession appKey:@"wx45a525dacee46b3e" appSecret:@"1b9b4c6a3fddc50969753ddbb06e848a" redirectURL:nil];
  /*
   * 移除相应平台的分享，如微信收藏
   */
  //[[UMSocialManager defaultManager] removePlatformProviderWithPlatformTypes:@[@(UMSocialPlatformType_WechatFavorite)]];
  
  /*
   * 打开图片水印
   */
  //[UMSocialGlobal shareInstance].isUsingWaterMark = YES;
  
  /*
   * 关闭强制验证https，可允许http图片分享，但需要在info.plist设置安全域名
   <key>NSAppTransportSecurity</key>
   <dict>
   <key>NSAllowsArbitraryLoads</key>
   <true/>
   </dict>
   */
  [UMSocialGlobal shareInstance].isUsingHttpsWhenShareContent = NO;
  
  //----------------------推啊广告----------------------
  [TaTmHelper setupWithAppKey:@"5SpQW8r7UQKL6sK5d5L9w25Rfhw"];
  //设置SDK 日志输出开关
  [TaTmHelper setLogEnable:NO];
  
}
// 支持所有iOS系统
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  //6.3的新的API调用，是为了兼容国外平台(例如:新版facebookSDK,VK等)的调用[如果用6.2的api调用会没有回调],对国内平台没有影响
  BOOL result = [[UMSocialManager defaultManager] handleOpenURL:url sourceApplication:sourceApplication annotation:annotation];
  if (!result) {
    // 其他如支付等SDK的回调
  }
  return result;
}
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  //6.3的新的API调用，是为了兼容国外平台(例如:新版facebookSDK,VK等)的调用[如果用6.2的api调用会没有回调],对国内平台没有影响
  BOOL result = [[UMSocialManager defaultManager]  handleOpenURL:url options:options];
  if (!result) {
    // 其他如支付等SDK的回调
  }
  return result;
}
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
{
  BOOL result = [[UMSocialManager defaultManager] handleOpenURL:url];
  if (!result) {
    // 其他如支付等SDK的回调
  }
  return result;
}
/*
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [UMessage registerDeviceToken:deviceToken];
  
  NSLog(@"deviceToken：%@",[[[[deviceToken description] stringByReplacingOccurrencesOfString: @"<" withString: @""]
                            stringByReplacingOccurrencesOfString: @">" withString: @""]
                           stringByReplacingOccurrencesOfString: @" " withString: @""]);
}
*/
@end






