'use strict';

import types from '../actions/type'
const initialState={
	searching:false,
	showSearchResult:false,
	resultList:[],
	historyList:[],
};

export default function searchAdvertise(state=initialState,action){
	switch(action.type){
		//开始搜索
		case types.SEARCH_ADVERTISER_START:
		return Object.assign({},state,{
			searching:action.searching,
		});
		//从本地存储中获取广告主搜索记录
		case types.INIT_ADVERTISER_HISTORY_LIST:
		return Object.assign({},state,{
			historyList:action.list,
		});
		//添加广告主搜索记录
		case types.ADD_ADVERTISER_HISTORY_LIST:
		return Object.assign({},state,{
			historyList:action.list,
		});
		//清除广告主搜索记录
		case types.CLEAR_ADVERTISER_HISTORY_LIST:
		return Object.assign({},state,{
			historyList:[],
		});
		//获取搜索结果
		case types.SEARCH_ADVERTISER:
		return Object.assign({},state,{
			showSearchResult:true,
			searching:false,
			resultList:action.advertiserList
		});
		//清除搜索结果
		case types.SEARCH_ADVERTISER_CLEAR:
		return  Object.assign({},state,{
			searching:false,
			showSearchResult:false,
			resultList:[],
		});
		default:
		return state;
	}
}