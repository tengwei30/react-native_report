//
//  AppDelegate.swift
//  AdpReact
//
//  Created by 金 圣琼 on 16/5/23.
//  Copyright © 2016年 Kevin King. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?


    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Override point for customization after application launch.
        TalkingData.sessionStarted("9CC8883E166D08D5A0EC3BD39BAFD1DC", withChannelId: "ios")
      
   /*     
        if (UIDevice.currentDevice().systemVersion as NSString).doubleValue >= 8.0 {
            
            //IOS8  
            //创建UIUserNotificationSettings，并设置消息的显示类类型  
            
 
            
            let notiSettings = UIUserNotificationSettings(forTypes:[.Badge, .Alert, .Sound], categories: nil)
            
            
            application.registerUserNotificationSettings(notiSettings)
            application.registerForRemoteNotifications()
            
        } else { // ios7  
            
            application.registerForRemoteNotificationTypes([.Badge, .Alert, .Sound])
            
        }  
        
        
        
        application.applicationIconBadgeNumber = 2
        
        
    */   
        

        return true
    }

 
    
    func application(application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: NSData) {
     
        let characterSet: NSCharacterSet = NSCharacterSet(charactersInString: "<>")
        
        let deviceTokenString: String = (deviceToken.description as NSString)
            .stringByTrimmingCharactersInSet(characterSet)
            .stringByReplacingOccurrencesOfString( " ", withString: "") as String
        
        print(deviceTokenString)
        
        //sendProviderDeviceToken:deviceToken
        
        
    }
    
    func application(application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: NSError) {
        
        print("didFailToRegisterForRemoteNotificationsWithError")
        print(error)
    }
    
    
    func application(application: UIApplication, didReceiveRemoteNotification userInfo: [NSObject : AnyObject]) {
        // 弹出视图
        
        print("receive")
        
        print(userInfo)
        
    }
    
    func applicationWillResignActive(application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(application: UIApplication) {
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }


}

