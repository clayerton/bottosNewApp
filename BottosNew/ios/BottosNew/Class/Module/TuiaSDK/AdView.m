//
//  AdView.m
//  BottosNew
//
//  Created by ZZL on 2018/11/16.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "AdView.h"
#import <TaTmSDK/TaTm.h>

@implementation AdView

- (instancetype)init
{
  self = [super init];
  if (self) {
    
  }
  return self;
}

- (void)setDataDic:(NSDictionary *)dataDic
{
  UIWindow *win = [[UIApplication sharedApplication].windows firstObject];
  
  //index:0 启动页广告 id：254969
  //index:1 弹窗广告 id：254951
  //index:2 banner广告 id：254972
  
  switch ([[dataDic objectForKey:@"index"] intValue]) {
    case 0:
    {
        [TaLaunchScreenView showAdViewWithAdslotId:[dataDic objectForKey:@"id"] successBlock:^{
          
        } failedBlock:^{
          NSLog(@"没有开屏广告");
        } finishedBlock:^{
          NSLog(@"展示完毕了");
        } userCloseBlock:^{
          NSLog(@"用户点击关闭了");
        }];
    }
      break;
    case 1:
    {
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        TaScreenView *screen = [TaScreenView adViewWithAdslotId:[dataDic objectForKey:@"id"] parentViewController:win.rootViewController successBlock:^{
          NSLog(@"展示完毕了");
        } failedBlock:^{
          NSLog(@"没有开屏广告");
        } closedBlock:^{
          NSLog(@"用户点击关闭了");
        }];
        [screen show];
      });
    }
      break;
    case 2:
    {
      TaStreamerView *streamer = [TaStreamerView adViewWithOrigin:CGPointMake(0, 0) adslotId:[dataDic objectForKey:@"id"] parentViewController:win.rootViewController successBlock:^{
        NSLog(@"展示完毕了");
      } failedBlock:^{
        NSLog(@"没有开屏广告");
      } closedBlock:^{
        NSLog(@"用户点击关闭了");
      }];
      [self addSubview:streamer];
    }
      break;
      
    default:
      break;
  }
}


@end


