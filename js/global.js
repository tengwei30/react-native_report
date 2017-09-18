'user strict';

import React, {
    Component
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    PixelRatio,
    AppState,
    NetInfo,
    Platform,
} from 'react-native';

import Toast from 'react-native-root-toast';
import logger from 'js-logger';
import {getUserInfo} from './actions/user';

/*
gNavigator  全局的navigator对象
*/

export default function globalInit() {

    global.toastShowArray=[];
    global.toastBoxArray=[];
    //生成全局悬浮提示框函数
    global.showToast = (options, fn) => {
        let baseOptions = {
            msg: '',
            duration: 1800,
            position: 0,
            animation: true,
            backgroundColor: '#000',
            textColor: '#fff',
            shadow: false,
        };

        Object.assign(baseOptions, options);

        let toast = Toast.show(baseOptions.msg, {
            duration: baseOptions.duration,
            position: baseOptions.position,
            animation: baseOptions.animation,
            backgroundColor: baseOptions.backgroundColor,
            textColor: baseOptions.textColor,
            shadow: baseOptions.shadow,
            onHidden: () => {
                //destroyLoadBox();
                fn && fn();
            }
        });
        toastShowArray.push(toast);
    };

    //收集所有showToast对象，一次全部回收
    global.destroyShowToast = ()=>{
        if(toastShowArray.length==0) return;
        
        for(let i=0; i<toastShowArray.length; i++){
            toastShowArray[i].destroy();
        } 
        toastShowArray.length=0;   
    }

    //生成全局loadding提示框函数
    global.showLoadBox = ()=>{
        global.loaddingToast=Toast.show('', {
                duration:60*60*24*1000,
                position: 0,
                animation: true,
                backgroundColor: '#000',
                textColor: '#fff',
                shadow: false,
                hascomponent:true,
            });
          toastBoxArray.push(loaddingToast);
    };
    //收集所有loadbox对象，一次全部回收
    global.destroyLoadBox = ()=>{
        if(toastBoxArray.length==0) return;
        
        for(let i=0; i<toastBoxArray.length; i++){
            toastBoxArray[i].destroy();
        } 
        toastBoxArray.length=0;   
    }

    //将logger挂在全局对象上
    global.logger = logger;
    logger.useDefaults();

    //如果为生成环境则关闭logger输出
    if (!__DEV__) {
        logger.setLevel(logger.OFF);
    }

    //app 前台后台切换事件监听
    AppState.addEventListener('change', () => {
        //恢复前台运行时，重新请求用户信息，以及时更新用户权限变化
        if (AppState.currentState == 'active' && global.userToken_G) {
            store.dispatch(getUserInfo({
                token: global.userToken_G,
                id: global.userId_G
            }));
        }

        logger.info(AppState.currentState)
    });

    //检测网络连接 赋值全局的网络连接变量
    NetInfo.isConnected.fetch().done((isConnected) => {
        global.networkStatus = isConnected;
        networkNotice(isConnected);
    });

    function handleFirstConnectivityChange(isConnected) {
        networkStatus = isConnected;
        networkNotice(isConnected);
    }
    NetInfo.isConnected.addEventListener(
        'change',
        handleFirstConnectivityChange
    );

    function networkNotice(isConnected) {
        if (!isConnected) {
            showToast({ msg: '您处于离线状态，请检查您的网络设置' });
        }
    }

    //swift&&react native
    if (Platform.OS==='ios') {
        global.SwiftToReactBridge = require('react-native').NativeModules.SwiftToReactBridge;
        SwiftToReactBridge.sayHi("Hi, I am from JS", (msg) => {
            logger.debug(msg);
        });
        global.statistics = (pageName) => {
            SwiftToReactBridge.trackPageBegin(pageName);
            SwiftToReactBridge.trackPageEnd(pageName);
        }
    } else if (Platform.OS === 'android') {
        //android 数据统计代码待加******
        global.statistics = (pageName) => {
            logger.debug('android统计代码待加')
        }
    }
}
