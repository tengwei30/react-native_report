//
//  SwiftToReactBridge.swift
//  AdpReact
//
//  Created by 金 圣琼 on 16/5/24.
//  Copyright © 2016年 Kevin King. All rights reserved.
//

import UIKit


@objc(SwiftToReactBridge)
class SwiftToReactBridge: NSObject {
    
    @objc func printMessage(message: String!) {
        print("ReactCallTest::printMessage => \(message)")
    }
    
    @objc func trackPageBegin(name: String!) {
        
        TalkingData.trackPageBegin(name)
    }
    
    
    @objc func trackPageEnd(name: String!) {
        
        TalkingData.trackPageEnd(name)
    }
    
    
    @objc func showCalendar(name: RCTResponseSenderBlock!) {
        
 
        
    }
    
    @objc func sayHi(msg:String!, callback: RCTResponseSenderBlock) -> Void {  
        
       
        callback(["Swifttt Module recieved your message, content is \"\(msg)\""])
        

    }  
    
    
}




