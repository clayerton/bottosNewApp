//
//  Configuration.h
//  PullNumbers
//
//  Created by zhaoziliang on 14-5-15.
//  Copyright (c) 2014年 zhaoziliang. All rights reserved.
//

#import <Foundation/Foundation.h>

#ifdef DEBUG
   #define NSLog(...) NSLog(__VA_ARGS__)
#else
   #define NSLog(...)
#endif

//CodePush Key

//生产环境：
//地址：http://139.219.185.167:3000
//生产：SzlCUJAGk5VdeyvN0ipewMaA4oVb4ksvOXqog
//开发：5Ewedn6vLnyvfmiXcDIqKfQjauPZ4ksvOXqog

//测试环境：
//地址：http://139.219.139.201:3000
//生产：uXTB7W5113QmGtVmrPsswjoFDTpw4ksvOXqog

//屏幕宽
#define ScreenWIDTH [[UIScreen mainScreen] bounds].size.width
//屏幕高
#define ScreenHEIGHT [[UIScreen mainScreen] bounds].size.height

//公钥
#define RSAPublickKey @"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgVybCU0BER5sBYwHVNPzNY+iIgKchmloieZfm5T8qDmSKoZNo6YnPj+LqfilmtMEPFa9jept3kmyMvYX4abx2RQpG1xlq9piMk+vG29b343uyzdOX85NwQJF7vB57gGRF9Cxo8eA+q9ScQo9xEhvh4Y4QVeoa4NaG1xqQ5EAKlQIDAQAB"

//App Store
#define AppStoreURL @"https://itunes.apple.com/cn/app/%E4%BC%98%E7%B1%B3%E5%B9%B3%E5%8F%B0/id1266612371?l=zh&ls=1&mt=8"

//友盟
#define UMAppKey @"5ad44216b27b0a500c000036"

//-----------------------Notification---------------------------
//#define UserInfoNotification @"UserInfoNotification"

//[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(userInfoNotification:) name:UserInfoNotification object:nil];
//
//[[NSNotificationCenter defaultCenter] postNotificationName:@"UserInfoNotification" object:nil userInfo:nil];
//
//#pragma mark --UserInfoNotification
//
//-(void)userInfoNotification:(NSNotification *)notification
//{
//    
//}


