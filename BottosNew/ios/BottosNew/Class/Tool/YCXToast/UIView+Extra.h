//
//  UIView+Extra.h
//  81-SwitchMenuScrollViewController
//
//  Created by ycx on 2017/1/20.
//  Copyright © 2017年 ycx. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIView (Extra)

/** size */
@property (nonatomic,assign) CGSize size;
/** height */
@property (nonatomic,assign) CGFloat height;
/** width */
@property (nonatomic,assign) CGFloat width;
/** x坐标 */
@property (nonatomic,assign) CGFloat x;
/** y坐标 */
@property (nonatomic,assign) CGFloat y;
/** 中心点x坐标 */
@property (nonatomic,assign) CGFloat centerX;
/** 中心点y坐标 */
@property (nonatomic,assign) CGFloat centerY;

@end
