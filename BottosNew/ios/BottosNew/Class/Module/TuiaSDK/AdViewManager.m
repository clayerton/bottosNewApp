//
//  AdManager.m
//  BottosNew
//
//  Created by ZZL on 2018/11/16.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "AdViewManager.h"
#import "AdView.h"

@interface AdViewManager () {
  
}
@property (nonatomic, strong) AdView *adView;
@end

@implementation AdViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  _adView = [[AdView alloc] init];
  
  return _adView;
}

//导出的属性和方法
RCT_EXPORT_VIEW_PROPERTY(dataDic, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(onClickView, RCTBubblingEventBlock)

@end
