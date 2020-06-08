//
//  TaSimpleWebViewController.h
//  AdIOSSDK
//
//  Created by lc on 16/11/6.
//  Copyright © 2016年 Ta. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface TaSimpleWebViewController : UIViewController

@property (nonatomic,strong) NSString *url;
@property (nonatomic, strong) NSString* ad_title;
@property (nonatomic,copy) void(^finished)(void);

@end
