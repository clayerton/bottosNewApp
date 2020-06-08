//
//  YCXToast.m
//  实例-ToastView
//
//  Created by ycx on 2017/2/24.
//  Copyright © 2017年 ycx. All rights reserved.
//

#import "YCXToast.h"
#import "UIView+Extra.h"

#define SCREEN_WIDTH [UIScreen mainScreen].bounds.size.width
#define SCREEN_HEIGHT [UIScreen mainScreen].bounds.size.height

#define WIDTH_MARGIN 5 //文字距离父控件的水平间距
#define HEIGHT_MARGIN 3 //文字距离父控件的垂直间距
#define SINGLE_HEIGHT 19.5 //文字高度-单行

#define X_MARGIN 35 //整个视图的水平间距
#define Y_MARGIN 100 //整个视图的距离底部高度

@interface YCXToast()

@end

@implementation YCXToast

static NSString *message_;
static UIViewController *controller_;
static NSInteger maxLines_;

+(void)show:(NSString *)message controller:(UIViewController *)controller{
    
    if (message.length > 20) {
        [YCXToast show:message maxLines:2 controller:controller];
        return;
    }
    message_ = message;
    controller_ = controller;
    maxLines_ = 1;
    [self initView];
    
}

+(void)show:(NSString *)message maxLines:(NSInteger)maxLines controller:(UIViewController *)controller{
    
    message_ = message;
    controller_ = controller;
    maxLines_ = maxLines;
    [self initView];
    
}

+(void)initView{
    CGSize labelSize = [self labelSize];
    CGSize viewSize = CGSizeMake(labelSize.width + 48, labelSize.height + 12);

    UILabel *titleLabel = [[UILabel alloc] init];
    titleLabel.text = message_;
    titleLabel.font = [UIFont systemFontOfSize:16.0];
    titleLabel.textColor = [UIColor whiteColor];
    titleLabel.numberOfLines = maxLines_;
    titleLabel.textAlignment = NSTextAlignmentCenter;
    titleLabel.size = viewSize;
    titleLabel.x = 0;
    titleLabel.y = 0;

    UIView *bottomView = [[UIView alloc] init];
    bottomView.size = viewSize;
    
    // 状态栏
    CGRect rectStatus = [[UIApplication sharedApplication] statusBarFrame];
    // 导航栏（navigationbar）
    CGRect rectNav = controller_.navigationController.navigationBar.frame;

//    NSLog(@"%f",SCREEN_HEIGHT);
//    NSLog(@"%f",rectNav.size.height);
//    NSLog(@"%f",rectStatus.size.height);
    
    bottomView.centerX = SCREEN_WIDTH / 2.0;
    if (controller_.navigationController.navigationBar.hidden) {
        bottomView.centerY = SCREEN_HEIGHT / 4.0 * 3.0 ;
    }else{
        bottomView.centerY = SCREEN_HEIGHT / 4.0 * 3.0 - rectNav.size.height - rectStatus.size.height;
    }
    bottomView.backgroundColor = [UIColor blackColor];
    bottomView.alpha = 1;
    bottomView.layer.masksToBounds = YES;
    bottomView.layer.cornerRadius = 5;
    [bottomView addSubview:titleLabel];
    [controller_.view addSubview:bottomView];
    
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [UIView animateWithDuration:2.5 animations:^{
            bottomView.alpha = 0;
        } completion:^(BOOL finished) {
            [titleLabel removeFromSuperview];
            [bottomView removeFromSuperview];
        }];
    });
}

+(CGSize)labelSize{
    CGSize maxSize = CGSizeMake(SCREEN_WIDTH - 2 * X_MARGIN, 0);
    
    CGSize labelSize = [message_ boundingRectWithSize:maxSize options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:16.0]} context:nil].size;

    if (maxLines_ != 0) {
        
        CGFloat width = SCREEN_WIDTH - 2 * X_MARGIN;
        CGFloat height = SINGLE_HEIGHT * maxLines_;
        
        width = labelSize.width >= width ? width : labelSize.width;
        height = labelSize.height >= height ? height : labelSize.height;
        
        return CGSizeMake(width, height);
    }
    
    return labelSize;
}



@end
