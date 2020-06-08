//
//  ClientUpdateModule.m
//  Bottos
//
//  Created by ZZL on 2018/5/29.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "ClientUpdateModule.h"
#import "AFNetworking.h"
#import "YCXToast.h"

@implementation ClientUpdateModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(checkUpdate:(NSString *)url isShowToast:(int)isShowToast textDictionary:(NSDictionary *)textDictionary alertCallback:(RCTResponseSenderBlock)alertCallback)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    
    UIApplication *application = [UIApplication sharedApplication];
    UIWindow *window = [application.windows objectAtIndex:0];

    @try {
      AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
      manager.responseSerializer = [AFJSONResponseSerializer serializer];
      manager.requestSerializer=[AFJSONRequestSerializer serializer];
      manager.responseSerializer.acceptableContentTypes=[NSSet setWithObjects:@"application/json", @"text/json", @"text/javascript",@"text/html",nil];
      
      [manager POST:url parameters:nil progress:^(NSProgress * _Nonnull uploadProgress) {
        
      } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
//        NSLog(@"-----------------------------------success-------------------------------------\n");
//        NSLog(@"%@",responseObject);
//        NSLog(@"--------------------------------------------------------------------------------");

        if (window) {
          
          NSString *CFBundleVersion = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];
          NSString *versionCode = [responseObject objectForKey:@"versionCode"];
          NSString *minSupport = [responseObject objectForKey:@"minSupport"];
          NSString *newVersionContent = [NSString stringWithFormat:@"%@:%@",[textDictionary objectForKey:@"update_new_version"],[responseObject objectForKey:@"versionName"]];

          //需要更新
          if (versionCode.intValue > CFBundleVersion.intValue) {
            UIAlertController *alert = [UIAlertController alertControllerWithTitle:newVersionContent message:[responseObject objectForKey:@"content"] preferredStyle:UIAlertControllerStyleAlert];

            //强制更新
            if (minSupport.intValue > CFBundleVersion.intValue) {

              UIAlertAction *action2 = [UIAlertAction actionWithTitle:[textDictionary objectForKey:@"update_update"] style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
                [application openURL:[NSURL URLWithString:[responseObject objectForKey:@"url"]]];
              }];
              [alert addAction:action2];
              alertCallback(@[[NSNull null], @"0"]);
            }else{//非强制更新
              
              UIAlertAction *action1 = [UIAlertAction actionWithTitle:[textDictionary objectForKey:@"update_cancel"] style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
                
              }];
              UIAlertAction *action2 = [UIAlertAction actionWithTitle:[textDictionary objectForKey:@"update_update"] style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
                [application openURL:[NSURL URLWithString:[responseObject objectForKey:@"url"]]];
              }];
              [alert addAction:action1];
              [alert addAction:action2];
              alertCallback(@[[NSNull null], @"1"]);
            }
            [window.rootViewController presentViewController:alert animated:YES completion:nil];
            
          }else{
            alertCallback(@[[NSNull null], @"0"]);
            if (isShowToast) {
              [YCXToast show:[textDictionary objectForKey:@"update_is_new_version"] controller:window.rootViewController];
            }
          }
        }
        
      } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"---------------------------------------error-----------------------------------------\n");
        NSLog(@"%@",error);
        NSLog(@"-------------------------------------------------------------------------------------");
        
        alertCallback(@[[NSNull null], @"0"]);
        if (isShowToast) {
          [YCXToast show:[textDictionary objectForKey:@"update_offline"] controller:window.rootViewController];
        }
        
      }];
    } @catch (NSException *exception) {
      
      alertCallback(@[[NSNull null], @"0"]);
      if (isShowToast) {
        [YCXToast show:[textDictionary objectForKey:@"update_data_error"] controller:window.rootViewController];
      }
      
    } @finally {
      
    }
    
  });
}

@end
