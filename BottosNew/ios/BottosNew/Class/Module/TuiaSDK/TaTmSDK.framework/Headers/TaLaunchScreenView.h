//
//  TaLaunchScreenView.h
//  AdIOSSDK
//
//  Created by lc on 16/11/13.
//  Copyright © 2016年 Ta. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TaBaseActivityView.h"

//开屏广告

@interface TaLaunchScreenView : TaBaseActivityView

//构造方法，

+(instancetype)showAdViewWithAdslotId:(NSString*)adslotId
                         successBlock:(void(^)(void))success
                          failedBlock:(void(^)(void))failed
                        finishedBlock:(void(^)(void))finished
                       userCloseBlock:(void(^)(void))userClose;


@end
