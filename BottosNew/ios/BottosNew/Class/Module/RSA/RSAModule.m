//
//  RSAModule.m
//  BottosNew
//
//  Created by ZZL on 2018/10/16.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "RSAModule.h"
#import "RSAEncryptor.h"
#import "NSString+Encode.h"
#import "Configuration.h"

@implementation RSAModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(encryptString:(NSString *)content callback:(RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    
    @try {
      //----------------------RSA加密示例------------------------
      //使用字符串格式的公钥私钥加密解密
      NSString *encryptStr = [RSAEncryptor encryptString:content publicKey:RSAPublickKey];
//      NSLog(@"加密前:%@", content);
//      NSLog(@"加密后:%@", encryptStr);
      //用私钥解密
//      NSString *decryptString = [RSAEncryptor decryptString:encryptStr privateKey:RSAPrivateKey];
//      NSLog(@"解密后:%@",decryptString);
      
      callback(@[encryptStr]);
      
    } @catch (NSException *exception) {
      
      callback(@[]);

    } @finally {
      
    }
    
  });
}

@end

