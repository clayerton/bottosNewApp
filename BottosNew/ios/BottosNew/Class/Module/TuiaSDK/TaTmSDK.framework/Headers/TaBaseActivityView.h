//
//  TaBaseActivityView.h
//  AdIOSSDK
//
//  Created by lc on 16/11/3.
//  Copyright © 2016年 Ta. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TaSimpleWebViewController.h"
#import "TaUtils.h"
#import "DZYLImageView.h"
#import "DZYLGIFImage.h"

#define Ta_SCREEN_WIDTH      ([[UIScreen mainScreen] bounds].size.width)
#define Ta_SCREEN_HEIGHT     ([[UIScreen mainScreen] bounds].size.height)

@interface TaBaseActivityView : UIView

@property (nonatomic,assign) BOOL canTap;
@property (nonatomic, strong) NSString* ad_title;
@property (nonatomic,strong) UIViewController *parentViewController;

@property (nonatomic,copy) void(^success)(void);
@property (nonatomic,copy) void(^failed)(void);
@property (nonatomic,copy) void(^closed)(void);

-(void)loadRequest;

@end
