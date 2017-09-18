'use strict';
import {
	AsyncStorage,
} from 'react-native';

import types from './type';
import md5 from 'md5';
import adxRequest from '../request';
import {backstageLogin,saveUserInfo,loginOut} from './login';
import {
	HOST_NAME,
	USER_INFO_GET,
	USER_INFO_EDITE,
	USER_LOGIN_INFO,
} from '../api';

function editeSuccess(statejson){
	
		if('password' in statejson){
			//异步不能直接使用saveUserInfo更新密码
			let md5Pwd=md5(statejson.password);
			//更新全局变量密码
			userpassword_G=md5Pwd;

			AsyncStorage.getItem(USER_LOGIN_INFO)
			.then((value)=>{
				value=JSON.parse(value);
				Object.assign(value,{password:md5Pwd});
				
				AsyncStorage.setItem(USER_LOGIN_INFO,JSON.stringify(value))
				.then((result)=>{
					//用新密码重新更新token
					store.dispatch(backstageLogin());
				});	
			})
		}

		return{
			type:types.EDITE_USER_INFO,
			statejson,
		}
}

function editeUserInfoFail(msg){
	showToast({msg:'修改失败'+msg});
}

export function editeUserInfo(options){

	let timestamp=Math.floor((new Date().getTime())/1000);
	let requestURL=`${HOST_NAME}${USER_INFO_EDITE}?access_token=${options.token}&appid=ios&timestamp=${timestamp}`;

	let postjson={};
	let statejson={};

	for(let name in options){
		if(name!='token'){
			postjson[name]=options[name];
		}
		if(name!='token'&&name!='id'){
			if(name=='passwd'){
				statejson['password']=options[name];
			}else{
				statejson[name]=options[name];
			}
		}
	}
	logger.info(postjson);
	logger.debug('编辑用户信息url',requestURL);

	return(dispatch)=>{

		let successBack=(data)=>{
			logger.debug('编辑用户信息',data);
			if(data.ret_code==0){
				dispatch(editeSuccess(statejson));
			}else if(data.ret_code==1){
				dispatch(editeUserInfoFail(data.ret_msg));
			}
		};

		let failBack=(error)=>{
			logger.debug('编辑用户信息出错',error);
		};

		return adxRequest({url:requestURL,data:postjson,method:'post'},successBack,failBack,editeUserInfo,options);
	};
};

function fetchSuccess(userInfo){
	//获取广告主列表时获取用户信息，更新权限
	saveUserInfo({
		operatortype:userInfo.operatortype,
	});
	userOperator_G=userInfo.operatortype;
	return{
		type:types.GET_USER_INFO,
		userInfo,
	}
}

export function getUserInfo(options){

	let timestamp=Math.floor((new Date().getTime())/1000);
	let requestURL=`${HOST_NAME}${USER_INFO_GET}?access_token=${options.token}&appid=ios&id=${options.id}&timestamp=${timestamp}`;
	logger.debug('获取用户信息url',requestURL);

	return(dispatch)=>{

		let successBack=(data)=>{
			logger.debug('获取用户信息',data);
			if(data.ret_code==0){
				dispatch(fetchSuccess(data.ret_msg));
			}else if(data.ret_code==1){
				showToast({msg:'获取用户信息出错'+data.ret_msg},()=>{dispatch(loginOut())});
			}
		};

		let failBack=(error)=>{
			logger.debug('获取用户信息出错',error);
		};
		
		return adxRequest({url:requestURL,noPrompt:true},successBack,failBack,getUserInfo,options);
	};
};