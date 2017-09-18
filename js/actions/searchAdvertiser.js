'use strict';
import React,{Component} from 'react';
import {AsyncStorage} from 'react-native';
import {
	HOST_NAME,
	ADVERTISER_LIST_URL,
	ADVERTISER_SEARCH_HISTORY_LIST,
} from '../api';

import types from './type';
import adxRequest from '../request';

//从本地存储获取广告主搜索记录
export function initAdvertiserHistoryList (list){
	return{
		type:types.INIT_ADVERTISER_HISTORY_LIST,
		list,
	}
}

//点击广告主搜索记录，存储改广告主信息
export function addAdvertiserHistoryList (list,data){
	//将重复的记录过滤掉
	let result=list.filter((item)=>{
		return item.uid!=data.uid;
	});

	//list最多为5条
	if(result.length<10){
		result.unshift(data);
	}else{
		result.pop();
		result.unshift(data);
	}
	//将最终结果存入本地存储中
	AsyncStorage.setItem(ADVERTISER_SEARCH_HISTORY_LIST,JSON.stringify(result));
	return{
		type:types.ADD_ADVERTISER_HISTORY_LIST,
		list:result,
	}
}

//清除广告主搜索记录，设置list为[];
export function clearAdvertiserHistoryList (){
	return{
		type:types.CLEAR_ADVERTISER_HISTORY_LIST,
	}
}


//开始搜索广告主
function fetchStart (){
	return {
		type:types.SEARCH_ADVERTISER_START,
		searching:true
	}
}
//搜索广告主成功
function fetchSuccess (advertiserList){
	return {
		type:types.SEARCH_ADVERTISER,
		advertiserList,
	}	
}
//清除广告主搜索结果
export function searchAdvertiserClear (){
	return {
		type:types.SEARCH_ADVERTISER_CLEAR
	}
}
//搜索广告主
export function searchAdvertiser (aoptions){
	let initialOptions={
		token:'',
		page:1,
		fields:'["uid","name"]',
		page_size:12,
	};

	let options=Object.assign({},initialOptions,aoptions);
	let timestamp = Math.floor((new Date().getTime())/1000);
	let requestURL = `${HOST_NAME}${ADVERTISER_LIST_URL}?access_token=${options.token}&appid=ios&fields=${options.fields}&page=${options.page}&page_size=${options.page_size}&timestamp=${timestamp}&where=${options.where}`;

	logger.debug('搜索广告主url',requestURL);
	return (dispatch)=>{

		dispatch(fetchStart());

		let successBack=(data)=>{
			logger.debug('搜索广告主',data)
			if (data.ret_code === 0) {
				let advertiserList = data.ret_msg.list;
				dispatch(fetchSuccess(advertiserList));
			}
		};
		let failBack=(error)=>{
			logger.debug('搜索广告主失败',error)
		};

		return adxRequest({url:requestURL},successBack,failBack,searchAdvertiser,aoptions);
	};
};