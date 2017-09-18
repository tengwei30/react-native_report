//
//  ExternReactModule.m
//  AdpReact
//
//  Created by 金 圣琼 on 16/5/24.
//  Copyright © 2016年 Kevin King. All rights reserved.
//

#import "AdpReact-Bridging-Header.h"
#import <MapKit/MapKit.h>
#import "RCTViewManager.h"

 @interface RCT_EXTERN_MODULE(SwiftToReactBridge, NSObject)
 
 RCT_EXTERN_METHOD(printMessage:(NSString *)message)
 
 RCT_EXTERN_METHOD(trackPageBegin:(NSString *)name)
 
 RCT_EXTERN_METHOD(trackPageEnd:(NSString *)name)
 
 RCT_EXTERN_METHOD(showCalendar:(RCTResponseSenderBlock)name)
 
 RCT_EXTERN_METHOD(sayHi:(NSString)msg callback:(RCTResponseSenderBlock)callback)  
 
 @end
 




