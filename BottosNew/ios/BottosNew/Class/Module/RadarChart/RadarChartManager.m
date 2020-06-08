//
//  RadarChartManager.m
//  BottosNew
//
//  Created by ZZL on 2018/11/7.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "RadarChartManager.h"
#import "RadarChart.h"

@interface RadarChartManager () {

}
@property (nonatomic, strong) RadarChart *chart;
@end

@implementation RadarChartManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  _chart = [[RadarChart alloc]initWithRadarElements:NULL];
  
  return _chart;
}

//导出的属性和方法
RCT_EXPORT_VIEW_PROPERTY(dataArray, NSArray)
RCT_EXPORT_VIEW_PROPERTY(onClickView, RCTBubblingEventBlock)

@end
