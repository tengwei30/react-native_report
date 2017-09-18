//
//  ExternView.m
//  AdpReact
//
//  Created by 金 圣琼 on 16/6/13.
//  Copyright © 2016年 Kevin King. All rights reserved.
//

#import "AdpReact-Bridging-Header.h"
#import <MapKit/MapKit.h>
#import "RCTViewManager.h"

#import "AdpReact-Swift.h"



@interface RCTCalendarManager : RCTViewManager
@end

@implementation RCTCalendarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
    UIWindow *w = [[UIApplication sharedApplication] keyWindow];
    
    return [[LDCalendar alloc] initWithFrame:[w frame]];
}

@end
