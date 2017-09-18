'use strict';

import types from './type';
import adxRequest from '../request';
import {
	HOST_NAME,
	UPDATE_AD_URL,
	DELETE_AD_URL,
	AD_LIST_URL,
	AD_VIEW_URL,
	AD_SOURCE_URL,
} from '../api';

import {initFilterCampaign} from './campaign';
import {searchInfoCurCid} from './searchInfo';

//清空搜索推广计划的list
export function searchAdClear(){
	return {
		type:types.SEARCH_AD_CLEAR
	}
}
//搜索成功后向搜索结果仓库传递数据
function searchSuccess(adgroupList){
	return{
		type:types.SEARCH_AD,
		adgroupList,
	}
}

//开始加载加载广告
export function getAdgroupStart(){
	return {
		type: types.GET_AD_START
	};
}

//上拉加载广告
export function addingAdgroup(){
	return {
		type: types.ADDING_AD
	};
}

//修改广告筛选状态
export function changeAdStatus(status){
	return {
		type:types.CHANGE_AD_STATUS,
		status,
	}
}

//选定具体推广计划，获取相应广告
export function jumpToAd(cid,cidName){
	return {
		type:types.CAM_JUMPTO_AD,
		cid,
		cidName,
	}
}

//选定具体推广计划，获取相应广告
export function campaignToAd(cid,cidName){
	return {
		type:types.SELECT_CAMPAIGN_TO_AD,
		cid,
		cidName,
	}
}

//编辑广告
export function editeStart(){
	return{
		type:types.DELETE_AD_START,
	}
}

function editeContentSuccess(statejson){
	return {
		type:types.EDITE_AD,
		statejson,
	}
}

export function editeInit(){
	return {
		type:types.DELETE_AD_INIT,
	}
}

//修改搜索广告结果数据的action
export function editeSearchAdStart(){
	return{
		type:types.SEARCH_AD_EDITE_START,
	}
}

export function editeSearchAdSuccess(statejson){
	return{
		type:types.SEARCH_AD_EDITE_SUCCESS,
		statejson,
	}
}

export function editeSearchAdInit(){
	return{
		type:types.SEARCH_AD_EDITE_INIT,
	}
}

export function editeAd(options){

		let timestamp = Math.floor((new Date().getTime())/1000);
		let requestURL = `${HOST_NAME}${UPDATE_AD_URL}?access_token=${options.token}&appid=ios&timestamp=${timestamp}`;

		let postjson={};
		let statejson={};

		for(let name in options){
			if(name!='token'&&name!='index'&&name!='searchAdEdite'){
				postjson[name]=options[name];
			}
			if(name!='token'&&name!='uid'&&name!='cid'&&name!='searchAdEdite'){
				statejson[name]=options[name];
			}
		}
		logger.debug('编辑广告发送的json',postjson);
		logger.debug('编辑广告url',requestURL);
		return (dispatch)=>{

			let successBack=(data)=>{
				logger.debug('广告编辑返回数据',data);
				if(data.ret_code===0){
					//列表中的campaign信息修改成功后，再次请求该条campaign的具体信息，来更新该条campaign的数据
					dispatch(getOneAD(options));

				}else if(data.ret_code===1){
					showToast({msg:'操作失败,'+data.ret_msg}); 
					failBack(data.ret_msg);           	
				}
			};
			let failBack=(error)=>{
				if(!options.searchAdEdite){
					dispatch(editeInit());
				}else{
					dispatch(editeSearchAdInit());
				}	
				logger.debug('编辑广告出错',error);
			};
			
			return adxRequest({url:requestURL,data:postjson,method:'post'},successBack,failBack,editeAd,options);
        };
};

/*获取单条广告的信息*/

export function getOneAD(options){

	let timestamp = Math.floor((new Date().getTime())/1000);
	let requestURL = `${HOST_NAME}${AD_VIEW_URL}?access_token=${userToken_G}&uid=${options.uid}&aid=${options.aid}&appid=ios&timestamp=${timestamp}`;
	logger.debug('oneAd',requestURL)
	return (dispatch)=>{
		let successBack=(data)=>{
			logger.debug('获取单条广告',data);

			if (data.ret_code === 0) {
				//如果是左拉编辑状态就不pop当前页
				if(!options.statuEdite){
					gNavigator.pop();
				}
				
				if(!options.searchAdEdite){

					dispatch(editeContentSuccess(Object.assign(data.ret_msg,{index:options.index})));
				}else{

					dispatch(editeSearchAdSuccess(Object.assign(data.ret_msg,{index:options.index})));
				}

			} else if (data.ret_code === 1) {
				failBack(data.ret_msg);
			}
		};
		let failBack=(error)=>{
			logger.debug('获取单条广告失败',error);
		};
		return adxRequest({url:requestURL},successBack,failBack,getOneAD,options);
	}
};

//删除广告
function deleteSuccess(index){
	return {
		type:types.DELETE_AD,
		index:index,
	}
}

function deleteFail(){
	return {
		type:types.DELETE_AD,
	}
}

//删除搜索结果中的广告
function deleteSearchSuccess(index){
	return {
		type:types.SEARCH_AD_DELETE,
		index:index,
	}
}

function deleteSearchFail(){
	return {
		type:types.SEARCH_AD_DELETE,
	}
}

export function deleteAd(options){

		let timestamp = Math.floor((new Date().getTime())/1000);
		let requestURL = `${HOST_NAME}${DELETE_AD_URL}?access_token=${options.token}&appid=ios&uid=${options.uid}&aid=${options.aid}&timestamp=${timestamp}`;
		logger.debug('删除广告url',requestURL);

		return (dispatch)=>{

			let successBack=(data)=>{
				logger.debug('删除广告返回数据',data);
				if(data.ret_code===0){

					if(options.searchAdEdite){
						dispatch(deleteSearchSuccess(options.index));
					}else{
						dispatch(deleteSuccess(options.index));
					}

				}else if(data.ret_code===1){
					showToast({msg:'删除失败,'+data.ret_msg});
					failBack(data.ret_msg);         	
				}
			};
			let failBack=(error)=>{
				if(options.searchAdEdite){
					dispatch(deleteSearchFail());
				}else{
					dispatch(deleteFail());
				}  
				logger.debug('删除广告失败',error);
			};

			return adxRequest({url:requestURL},successBack,failBack,deleteAd,options);
        };
};

//获取指定推广计划下所有广告

function getAllAdSuccess(allAdList){
	return{
		type:types.GET_ALL_AD,
		allAdList,
	}
}

export function filterSelectAd(result){
	return{
		type:types.SELECT_AD,
		result,
	}
}

export function clearSelectAd(result){
	return{
		type:types.CLEAR_AD_SELECT,
	}
}

export function InitfilterSelectAd(){
	return{
		type:types.AD_FILTER_INIT,
	}
}

export function getSelectAllAd(aoptions){
	let initialOptions={
		token:'',
		page:1,
		uid:'',
		fields:'["aid","name"]',//'["uid","name"]',
		page_size:100,
	};
	
	let options=Object.assign({},initialOptions,aoptions);
	let timestamp = Math.floor((new Date().getTime())/1000);
	let requestURL = `${HOST_NAME}${AD_LIST_URL}?access_token=${options.token}&appid=ios&page=${options.page}&page_size=${options.page_size}&fields=${options.fields}&uid=${options.uid}&where=${options.where}&timestamp=${timestamp}`;
	logger.debug('获取指定推广计划下广告列表url',requestURL);

	return (dispatch) => {

		let successBack=(data)=>{
			logger.debug('获取指定推广计划下广告列表',data);
			
			if (data.ret_code === 0) {
				//获取cid下的所有的adList成功后相应操作
				dispatch(getAllAdSuccess(data.ret_msg.list));
				dispatch(initFilterCampaign());
				gNavigator.pop();
				dispatch(searchInfoCurCid(options.campaignInfo.cid,options.campaignInfo.name));
			} 
		};
		let failBack=(error)=>{
			logger.debug('获取全部广告列表失败',error);
		};

		return adxRequest({url:requestURL},successBack,failBack,getSelectAllAd,aoptions);

	};
};


//获取广告
function fetchSuccess(adgroupList,addAll) {
	return {
		type: types.GET_AD,
		adding: false,
		addAll:addAll,
		backType: 'success',
		adgroupList,
	}
}

function loadFail() {
	return {
		type: types.GET_AD,
		adding: false,
		backType: 'loadFail',
	}
}

function addFail() {
	return {
		type: types.GET_AD,
		adding: false,
		backType: 'addFail',
	}
}

export function getAdgroup(aoptions) {
	let initialOptions={
		token:'',
		page:1,
		uid:'',
		where:'{}',
		fields:'[]',//'["uid","name"]',
		page_size:20,
	};
	
	let options=Object.assign({},initialOptions,aoptions);
	let timestamp = Math.floor((new Date().getTime())/1000);
	let requestURL = `${HOST_NAME}${AD_LIST_URL}?access_token=${options.token}&appid=ios&page=${options.page}&page_size=${options.page_size}&fields=${options.fields}&uid=${options.uid}&where=${options.where}&timestamp=${timestamp}`;
	logger.debug('获取广告列表url',requestURL);

	return (dispatch) => {

		let successBack=(data)=>{
			logger.debug('获取广告列表',data);

			if (data.ret_code === 0) {
				let adgroupList = data.ret_msg.list;
				let addAll=adgroupList.length<options.page_size?true:false;
				if(options.searchAd){
					dispatch(searchSuccess(adgroupList));
				}else{
					dispatch(fetchSuccess(adgroupList,addAll));
				}

			} else if (data.ret_code === 1) {
				failBack(data.ret_msg);
			}
		};
		let failBack=(error)=>{
			if (aoptions.page > 1) {
				dispatch(addFail());
			}else{
				dispatch(loadFail());
			}
			logger.debug('获取广告列表失败',error);
		};

		let requstData={url:requestURL};
		options.searchAd?requstData:Object.assign(requstData,{noPrompt:true});

		return adxRequest(requstData,successBack,failBack,getAdgroup,aoptions);

	};
};
//异步获取广告的素材
function fetchAdSource(index,sourceInfo){
	return {
		type:types.LOAD_AD_SOURCE,
		index,
		sourceInfo,
	}
}
export function load_ad_source(options){

	let timestamp = Math.floor((new Date().getTime())/1000);
	let filter='["desc_url","material_url","mid"]';
	let requestURL = `${HOST_NAME}${AD_SOURCE_URL}?access_token=${options.token}&fields=${filter}&appid=ios&uid=${options.uid}&aid=${options.aid}&timestamp=${timestamp}`;
	logger.debug('异步加载广告素材url',requestURL);

	return (dispatch)=>{

		let successBack=(data)=>{
			logger.debug('异步加载广告素材初始返回数据',data);
			if(data.ret_code===0){
				let sourceInfo=data.ret_msg;
				Object.assign(sourceInfo,{loaded:true,hasSourceData:true});
				dispatch(fetchAdSource(options.index,sourceInfo));
			}else if(data.ret_code===1){
				if(data.error_code===400005){
					failBack(data.ret_msg)
				}
			}
		};
		let failBack=(error)=>{
			dispatch(fetchAdSource(options.index,{hasSourceData:false,loaded:true}));	
			logger.debug('获取广告素材失败',error);
		};

		return adxRequest({url:requestURL,noPrompt:true,timeout:20000},successBack,failBack,load_ad_source,options);

	};
};
//刷新广告
export function refreshAd (){
	return {
		type:types.REFRESH_AD,
	}
};

//获取新的广告
export function loadedAd (){
	return {
		type:types.LOADED_AD_AGIN,
	}
};
//初始化广告state
export function adChange (){
	return {
		type:types.AD_INFO_CLEAR,
	}
};