'use strict';

import types from './type';
import adxRequest from '../request';
import {
	HOST_NAME,
	ADVERTISER_LIST_URL,
} from '../api';

export function addingAdvertiserList() {
	return {
		type: types.ADDING_ADVERTISER_LIST
	};
}
//重新load广告主页面开始函数
export function loadAdvertiserListStart() {
	return {
		type: types.LOAD_ADVERTISER_LIST_START
	};
}

export function refreshAdvertiserList() {
	return {
		type: types.REFRESH_ADVERTISER
	};
}

function fetchSuccess(advertiserList, addAll) {

	return {
		type: types.GET_ADVERTISER_LIST,
		adding: false,
		status: 'success',
		addAll: addAll,
		advertiserList,
	}
}

function loadFail() {
	return {
		type: types.GET_ADVERTISER_LIST,
		adding: false,
		status: 'loadFail',
	}
}

function addFail() {
	return {
		type: types.GET_ADVERTISER_LIST,
		adding: false,
		status: 'addFail',
	}
}

export function getAdvertiserList(aoptions) {
	let initialOptions = {
		token: '',
		page: 1,
		fields: '["uid","name","status","adgroup_total","campaign_total","balance"]',
		page_size: 20,
	};

	let options = Object.assign({}, initialOptions, aoptions);
	let filter = encodeURIComponent(options.fields)
	let timestamp = Math.floor((new Date().getTime())/1000);
	let requestURL = `${HOST_NAME}${ADVERTISER_LIST_URL}?access_token=${options.token}&appid=ios&fields=${filter}&page=${options.page}&page_size=${options.page_size}&timestamp=${timestamp}`;

	logger.debug('获取广告主列表url',requestURL)

	return (dispatch) => {

		let successBack=(data)=>{
			logger.debug('获取广告主列表',data);
			if (data.ret_code === 0) {
				let advertiserList = data.ret_msg.list;
				let addAll = advertiserList.length < options.page_size ? true : false;
				dispatch(fetchSuccess(advertiserList, addAll));
			} else if(data.ret_code === 1){
				failBack(data.ret_msg);
			}
		};
		let failBack=(error)=>{
			logger.debug('获取广告主列表失败',error);
			if (aoptions.page > 1) {
				store.dispatch(addFail());
			} else {
				store.dispatch(loadFail());
			}
		};

		return adxRequest({url:requestURL,noPrompt:true},successBack,failBack,getAdvertiserList,aoptions);
	};
};