//
//  ViewController.swift
//  AdpReact
//
//  Created by 金 圣琼 on 16/5/23.
//  Copyright © 2016年 Kevin King. All rights reserved.
//

import UIKit


class ViewController: UIViewController {

    weak var rootView: RCTRootView!
    var seletedDays:[NSTimeInterval] = []
    //var calendar : LDCalendar!

    var callback: RCTResponseSenderBlock!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view, typically from a nib.

        
        // let jsCodeLocation = CodePush.bundleURLForResource("main",withExtension:"jsbundle");
        //let jsCodeLocation=CodePush.bundleURL();

        //let b = NSBundle.mainBundle()
        //let jsCodeLocation = b.URLForResource("main", withExtension: "jsbundle")
        
        #if DEBUG
            let jsCodeLocation = NSURL(string: "http://localhost:8081/index.ios.bundle?platform=ios&dev=true") 
        #else
            let jsCodeLocation=CodePush.bundleURL();
        #endif
        
        let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "adp_react_native", initialProperties: nil, launchOptions: nil) 
        
        
       self.rootView = rootView
       self.view.addSubview(rootView)    
        

    }
    
    override func viewWillLayoutSubviews() {
        
        rootView.frame = self.view.bounds
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

