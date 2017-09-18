'use strict';
import {
	AsyncStorage,
} from 'react-native';

import {
	HOST_NAME,
	USER_LOGIN_URL,
	API_KEY,
	USER_LOGIN_INFO,
} from '../api';
import sha1 from 'sha1';
import types from './type';

const USER_LOGIN_REQUEST_URL = HOST_NAME + USER_LOGIN_URL;
const createLoginUrl = (username, password) => {

	let timestamp = Math.floor((new Date().getTime())/1000);
	let signature = sha1(`${API_KEY}&${username}&${password}&${timestamp}`);

	let requestURL = `${USER_LOGIN_REQUEST_URL}?name=${username}&passwd=${password}&signature=${signature}&timestamp=${timestamp}&appid=ios`;
	return requestURL;
}

export function saveUserInfo(userInfo) {
	let loginUserInfo = {};
	AsyncStorage.getItem(USER_LOGIN_INFO)
		.then((value) => {
			value = JSON.parse(value);
			Object.assign(loginUserInfo, value, userInfo);
				//有该字段合并后再次存储
			AsyncStorage.setItem(USER_LOGIN_INFO, JSON.stringify(loginUserInfo));
		});
}

//点击登陆按钮在get验证前的UI变化
export function loginStart() {
	return {
		type: types.LOGIN_START
	}
}

//验证本地存储的token,通过则进入广告主列表
export function allowLogin(token, id, password, operatortype) {

	return {
		type: types.ALLOW_LOGIN,
	}
}

//后台自动登录后更新state中的token
export function refreshToken(token) {

	return {
		type: types.REFRESH_TOKEN,
		token,
	}
}

function fetchSuccess(username, password, userInfo) {

	//存储用户信息
	saveUserInfo({
		username: username,
		password: password,
		id: userInfo.id,
		token: userInfo.token,
	});
	//给全局变量赋值
	userToken_G = userInfo.token;
	userId_G = userInfo.id;
	userpassword_G = password;

	return {
		type: types.LOGIN_IN,
		loggedIn: true,
		editable: true,
		isLoging: false,
	}
}

function fetchFail() {
	return {
		type: types.LOGIN_IN_FAIL,
	}
}

export function loginIn(username, password) {

	return (dispatch) => {

		let requestURL = createLoginUrl(username, password);
		//登陆开始，发送请求UI变化
		dispatch(loginStart());
		logger.debug('登陆url',requestURL)
		return fetch(requestURL)
			.then((response) => {
				logger.debug(response)
				return response.json();
			})
			.then((responseData) => {
				logger.debug('登陆数据', responseData)
				if (responseData.ret_code === 0) {
					dispatch(fetchSuccess(username, password, responseData.ret_msg));

				} else {

					let errorMsg = responseData.ret_code < 0 ? '网络错误，请稍后重试' : responseData.ret_msg;
					showToast({msg:errorMsg});
					dispatch(fetchFail());
				}
			})
			.catch((error) => {
				showToast({msg:'登陆有误，请联系系统管理员'});
				dispatch(fetchFail());
			})
			.done();
	}
}

export function backstageLogin(fn, params) {

	return (dispatch) => {
		let promise = new Promise((resolve, reject) => {
			AsyncStorage.getItem(USER_LOGIN_INFO)
				.then((value) => {
					value = JSON.parse(value);
					let requestURL = createLoginUrl(value.username, value.password);
					logger.debug('后台登陆url',requestURL);
					fetch(requestURL)
						.then((response) => {
							return response.json();
						})
						.then((responseData) => {
							if (responseData.ret_code === 0) {
								let token = responseData.ret_msg.token;
								//将新的token存入本地
								saveUserInfo({
									token: token
								});

								//后台重新登陆后，给全局userToken_G重新赋值
								userToken_G = token;
								//如果fn有，就传递更新token后的参数给fn
								if (fn) {
									resolve(Object.assign(params, {
										token: token
									}));
								}

							} else if (responseData.ret_code === 1) {
								showToast({msg:'用户信息有错误，' + responseData.ret_msg+'请重新登录'},()=>{dispatch(loginOut())});
							}
						})
						.catch((error) => {
							showToast({msg:'身份验证有错误,请联系系统管理员'});
						});
				})

		});
		promise.then((params) => {
			fn && dispatch(fn(params));
		}, () => {
			logger.debug('后台登陆失败')
		});
	}
}

export function loginOut() {
	//清空本地存储的token
	AsyncStorage.removeItem(USER_LOGIN_INFO);
	gNavigator.popToTop();
	return {
		type: types.LOGIN_OUT,
	}
}