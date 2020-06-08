//
//  TaScreenView.h
//  AdIOSSDK
//
//  Created by lc on 16/11/3.
//  Copyright © 2016年 Ta. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TaBaseActivityView.h"
//插屏
@interface TaScreenView : TaBaseActivityView

//构造方法，
+(instancetype)adViewWithAdslotId:(NSString*)adslotId
             parentViewController:(UIViewController*)parentViewController
                     successBlock:(void(^)(void))success
                      failedBlock:(void(^)(void))failed
                      closedBlock:(void(^)(void))closed;

//覆盖window
-(void)show;

@end
