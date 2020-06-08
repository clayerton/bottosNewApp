//
//  AdView.h
//  BottosNew
//
//  Created by ZZL on 2018/11/16.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface AdView : UIView

@property (nonatomic, strong) NSDictionary *dataDic;
@property (nonatomic, copy) RCTDirectEventBlock onClickView;

@end
