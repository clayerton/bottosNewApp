//
//  YCXToast.h
//  实例-ToastView
//
//  Created by ycx on 2017/2/24.
//  Copyright © 2017年 ycx. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface YCXToast : NSObject

/** 显示单行 */
+(void)show:(NSString *)message controller:(UIViewController *)controller;

/** 显示多行
 *  maxLines:最多可显示几行,0为不限制
 */
+(void)show:(NSString *)message maxLines:(NSInteger)maxLines controller:(UIViewController *)controller;

@end
