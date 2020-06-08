//
//  AdIOSSDK
//
//  Created by lc on 16/11/3.
//  Copyright © 2016年 Ta. All rights reserved.
//

#import "TaBaseActivityView.h"

//浮标
@interface TaDriftView : TaBaseActivityView

//构造方法，需要传入frame.orgin以确定广告视图位置
+(instancetype)adViewWithOrigin:(CGPoint)origin
                       adslotId:(NSString*)adslotId
           parentViewController:(UIViewController*)parentViewController
                   successBlock:(void(^)(void))success
                    failedBlock:(void(^)(void))failed
                    closedBlock:(void(^)(void))closed;


@end
