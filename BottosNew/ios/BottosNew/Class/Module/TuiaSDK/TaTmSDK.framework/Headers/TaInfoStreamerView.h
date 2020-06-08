
//
//  Created by lc on 16/11/3.
//  Copyright © 2016年 Ta. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TaBaseActivityView.h"
//#import "TaAd.h"


//信息流
@interface TaInfoStreamerView : TaBaseActivityView
typedef NS_ENUM(NSInteger, TaInfoStreamType) {
    TaInfoStreamTypeTall,//高的，比例为  750*420
    TaInfoStreamTypeShort,//矮的，比例为 750*180
};
//构造方法，需要传入frame.orgin以确定广告视图位置
+(instancetype)adViewWithOrigin:(CGPoint)origin
                       adslotId:(NSString*)adslotId
                           type:(TaInfoStreamType)type
           parentViewController:(UIViewController*)parentViewController
                   successBlock:(void(^)(void))success
                    failedBlock:(void(^)(void))failed
                    closedBlock:(void(^)(void))closed;


@end
