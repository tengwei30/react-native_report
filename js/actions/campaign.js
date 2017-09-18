'use strict';

import types from './type';
import adxRequest from '../request';
import {
	HOST_NAME,
	CAMPAIGN_LIST_URL,
	CAMPAIGN_VIEW_URL,
	UPDATE_CAMPAIGN_URL,
	DELETE_CAMPAIGN_URL,
} from '../api';

//上拉加载推广计划
export function addingCampaign() {
	return {
		type: types.ADDING_CAMPAIGN
	};
}

//推广计筛选划状态改变
export function changeCampaignStatus(status){
	return {
		type:types.CHANGE_CAMPAIGN_STATUS,
		status,
	}
}

//编辑推广计划
export function editeStart(){
	return{
		type:types.EDITE_CAMPAIGN_START,
	}
}

//修改内容成功
function editeContentSuccess(statejson){

	return{
		type:types.EDITE_CAMPAIGN,
		statejson,
	}
}

//修改搜索推广计划的结果的action
export function editeSearchCamStart(){
	return{
		type:types.SEARCH_CAMPAIGN_EDITE_START,
	}
}

export function editeSearchCamSuccess(statejson){
	return{
		type:types.SEARCH_CAMPAIGN_EDITE_SUCCESS,
		statejson,
	}
}

export function editeSearchCamInit(){
	return{
		type:types.SEARCH_CAMPAIGN_EDITE_INIT,
	}
}

export function editeInit(){
	return{
		type:types.EDITE_CAMPAIGN_INIT,
	}
}

export function editeCampaign(options){
	let timestamp = Math.floor((new Date().getTime())/1000);
	let requestURL = `${HOST_NAME}${UPDATE_CAMPAIGN_URL}?access_token=${options.token}&appid=ios&timestamp=${timestamp}`;

	let postjson={};
	let statejson={};
	logger.debug('cam',requestURL)
	for(let name in options){
		if(name!='token'&&name!='index'&&name!='searchCamEdite'){
			postjson[name]=options[name];
		}
		if(name!='token'&&name!='uid'&&name!='cid'&&name!='searchCamEdite'){
			statejson[name]=options[name];
		}
	}

	logger.debug('编辑推广计划传递参数',postjson);

	return (dispatch)=>{

		let successBack=(data)=>{
            logger.debug('编辑推广计划',data);
            if(data.ret_code===0){

            	//列表中的campaign信息修改成功后，再次请求该条campaign的具体信息，来更新该条campaign的数据
            	dispatch(getOneCampaign(options));
            	
            }else if(data.ret_code===1){
				showToast({msg:'操作失败,'+data.ret_msg});
				failBack(data.ret_msg); 	
            }
		};
		let failBack=(error)=>{
			if(!options.searchCamEdite){
				dispatch(editeInit());
			}else{
				dispatch(editeSearchCamInit());
			}   
			logger.debug('编辑推广计划出错',error)
		};

		return adxRequest({url:requestURL,data:postjson,method:'post'},successBack,failBack,editeCampaign,options);
    };
};


/*获取单条campagin的信息*/

export function getOneCampaign(options){

	let timestamp = Math.floor((new Date().getTime())/1000);
	let requestURL = `${HOST_NAME}${CAMPAIGN_VIEW_URL}?access_token=${userToken_G}&uid=${options.uid}&cid=${options.cid}&appid=ios&timestamp=${timestamp}`;
	logger.debug('oneCam',requestURL)
	return (dispatch)=>{
		let successBack=(data)=>{
			logger.debug('获取单条推广计划',data);

			if (data.ret_code === 0) {
				//如果是左拉编辑状态就不pop当前页
				if(!options.statuEdite){
					gNavigator.pop();
				}
				
				if(!options.searchCamEdite){

					dispatch(editeContentSuccess(Object.assign(data.ret_msg,{index:options.index})));
				}else{

					dispatch(editeSearchCamSuccess(Object.assign(data.ret_msg,{index:options.index})));
				}

			} else if (data.ret_code === 1) {
				failBack(data.ret_msg);
			}
		};
		let failBack=(error)=>{
			logger.debug('获取单条推广计划失败',error);
		};
		return adxRequest({url:requestURL},successBack,failBack,getOneCampaign,options);
	}
};

//删除推广计划
function deleteSuccess(index){
	return {
		type:types.DELETE_CAMPAIGN,
		index:index,
	}
}

function deleteFail(){
	return {
		type:types.DELETE_CAMPAIGN,
	}
}

//删除搜索结果中的推广计划成功
function deleteSearchSuccess(index){
	return {
		type:types.SEARCH_CAMPAIGN_DELETE,
		index:index,
	}
}

function deleteSearchFail(){
	return {
		type:types.SEARCH_CAMPAIGN_DELETE,
	}
}

export function deleteCampaign(options){

		let timestamp = Math.floor((new Date().getTime())/1000);
		let requestURL = `${HOST_NAME}${DELETE_CAMPAIGN_URL}?access_token=${options.token}&uid=${options.uid}&cid=${options.cid}&appid=ios&timestamp=${timestamp}`;
		logger.debug('删除推广计划url',requestURL);
				
		return (dispatch)=>{
			
			let successBack=(data)=>{
				logger.debug('删除推广计划',data);
				if(data.ret_code===0){
					if(options.searchCamEdite){
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
				if(options.searchCamEdite){
					dispatch(deleteSearchFail());
				}else{
					dispatch(deleteFail());
				}
				logger.debug('删除推广计划失败',error)
			};

			return adxRequest({url:requestURL},successBack,failBack,deleteCampaign,options);

        };
}
//开始搜索推广计划
export function searchCampaignStart(){
	return {
		type:types.SEARCH_CAMPAIGN_START
	}
}
//清空搜索推广计划的list
export function searchCampaignClear(){
	return {
		type:types.SEARCH_CAMPAIGN_CLEAR
	}
}
//搜索成功后向搜索结果仓库传递数据
function searchSuccess(campaignList){

	return{
		type:types.SEARCH_CAMPAIGN,
		campaignList,
	}
}

//开始加载推广计划
export function getCampaignStart() {
	return {
		type: types.GET_CAMPAIGN_START
	};
}


//获取推广计划
function fetchSuccess(campaignList,addAll) {
	return {
		type: types.GET_CAMPAIGN,
		adding: false,
		addAll:addAll,
		backType: 'success',
		campaignList,
	}
}

function loadFail() {
	return {
		type: types.GET_CAMPAIGN,
		adding: false,
		backType: 'loadFail',
	}
}

function addFail() {
	return {
		type: types.GET_CAMPAIGN,
		adding: false,
		backType: 'addFail',
	}
}

export function getCampaign(aoptions) {
	let initialOptions={
		token:'',
		page:1,
		uid:'',
		where:'{}',
		fields:'[]',//'["cid","name"]',
		page_size:20,
	};

	let options=Object.assign({},initialOptions,aoptions);
	let timestamp = Math.floor((new Date().getTime())/1000);
	let requestURL = `${HOST_NAME}${CAMPAIGN_LIST_URL}?access_token=${options.token}&appid=ios&page=${options.page}&where=${options.where}&page_size=${options.page_size}&fields=${options.fields}&uid=${options.uid}&timestamp=${timestamp}`;

	return (dispatch) => {
		logger.debug('获取推广计划url'+requestURL);

		let successBack=(data)=>{
			logger.debug('获取推广计划列表',data);

			if (data.ret_code === 0) {
				let campaignList = data.ret_msg.list;
				let addAll=campaignList.length<options.page_size?true:false;
				if(options.searchCam){
					dispatch(searchSuccess(campaignList));
				}else if(options.selectCam){
					dispatch(getAllCamSuccess(campaignList));
				}else{
					dispatch(fetchSuccess(campaignList,addAll));
				}

			} else if (data.ret_code === 1) {
				failBack(data.ret_msg);
			}
		};
		let failBack=(error)=>{
			if (aoptions.page >1) {
				dispatch(addFail());
			}else{
				dispatch(loadFail());
			}
			logger.debug('获取推广计划列表失败',error);
		};

		let requestData={url:requestURL};

		options.searchCam?requestData:Object.assign(requestData,{noPrompt:true});

		return adxRequest(requestData,successBack,failBack,getCampaign,aoptions);

	};
};

/*获取所有的推广计划列表*/

//前端根据输入筛选结果

export function filterCampaign(result){
	return{
		type:types.SELECT_CAMPAIGN,
		result,
	}
}

export function initFilterCampaign(){
	return{
		type:types.CAMPAIGN_FILTER_INIT,
	}
}


//选中广告主进入主页面会后台获取所有推广计划列表
function getAllCamSuccess(allCampaignList){
	return {
		type:types.GET_ALL_CAMPAIGN,
		allCampaignList,
	}
}
export function getAllCampaign(aoptions) {
	let initialOptions={
		token:'',
		page:1,
		uid:'',
		where:'{}',
		fields:'[]',//'["cid","name"]',
		page_size:100,
	};

	let options=Object.assign({},initialOptions,aoptions);
	let timestamp = Math.floor((new Date().getTime())/1000);
	let requestURL = `${HOST_NAME}${CAMPAIGN_LIST_URL}?access_token=${options.token}&appid=ios&page=${options.page}&where=${options.where}&page_size=${options.page_size}&fields=${options.fields}&uid=${options.uid}&timestamp=${timestamp}`;

	return (dispatch) => {
		logger.debug('获取推广计划url'+requestURL);

		let successBack=(data)=>{
			logger.debug('获取所有推广计划列表',data);

			if (data.ret_code === 0) {
				dispatch(getAllCamSuccess(data.ret_msg.list));
			} 
		};
		let failBack=(error)=>{
			logger.debug('获取推广计划列表失败',error);
		};

		return adxRequest({url:requestURL,noPrompt:true},successBack,failBack,getAllCampaign,aoptions);

	};
};
//刷新推广计划
export function refreshCampaign (){
	return {
		type:types.REFRESH_CAMPAIGN,
	}
}
//初始化推广计划state
export function campaignChange (){
	return {
		type:types.CAMPAIGN_CHANGE,
	}
}