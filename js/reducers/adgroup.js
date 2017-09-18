'use strict';

import types from '../actions/type';
import env from '../env';
const initialState = {
	page: 1,
	page_size: 20,
	loaded:false,
	fields: '',
	addAll:false,
	where: '{"startDate":"'+env.filterRangeDate.startDate+'","endDate":"'+env.filterRangeDate.endDate+'"}',
	status:'{}',
	filterRangeDate:{"startDate":env.filterRangeDate.startDate,"endDate":env.filterRangeDate.endDate},
	cid:0,
	cidName:'全部',
	adEditing:false,
	isRefresh:false,
	adding: false,
	backType: '', //状态有四种 success/loadFail/addFail/addAll
	adgroupList: [],
};

export default function adgroup(state = initialState, action) {
	switch (action.type) {
		case types.GET_AD_START:
			return Object.assign({}, state, {
				loaded: false,
				page:1,
				adgroupList:[],
			});
		case types.ADDING_AD:
			return Object.assign({}, state, {
				adding: true,
			});

		//推广计划和广告共享 SEARCH_SET_FILTER_RANGE_DATE	
		case types.SEARCH_SET_FILTER_RANGE_DATE:

		return Object.assign({},state,{
			where:JSON.stringify(Object.assign(JSON.parse(state.where),action.rangeDate)),
			filterRangeDate:action.rangeDate,
		});

		case types.CAM_JUMPTO_AD:
		let camToAdWhere;
		let jumpWhere = JSON.parse(state.where);
		delete jumpWhere["status"];
		camToAdWhere=Object.assign(jumpWhere,{"cid":action.cid});
		return Object.assign({},state,{
			cid:action.cid,
			cidName:action.cidName,
			adgroupList:[],
			status:'{}',
			page:1,
			loaded:false,
			where:JSON.stringify(camToAdWhere),
		});

		case types.SELECT_CAMPAIGN_TO_AD:

			let  CamToAdFilterWhere;
			let CamToAdTmpWhere=JSON.parse(state.where);

			if(action.cid){
				 CamToAdFilterWhere=Object.assign(CamToAdTmpWhere,{"cid":action.cid});
			}else{
				delete CamToAdTmpWhere["cid"];
				CamToAdFilterWhere=CamToAdTmpWhere;
			}

			return Object.assign({},state,{
			 	cid:action.cid,
			 	cidName:action.cidName,
			 	adgroupList:[],
			 	page:1,
			 	loaded:false,
			 	where:JSON.stringify(CamToAdFilterWhere),
			 });
		case types.CHANGE_AD_STATUS:

			let resultWhere;
			let tmpWhere = JSON.parse(state.where);
			if(action.status=='{}'){
				delete tmpWhere["status"];
				resultWhere=JSON.stringify(tmpWhere);
			}else{
				resultWhere=JSON.stringify(Object.assign(tmpWhere,{"status":action.status}));
			}

			return Object.assign({},state,{
				where:resultWhere,
				status:action.status,
				page:1,
				adgroupList:[],
				loaded:false,
			});
		case types.DELETE_AD:
			if(action.index>=0){
				let adItem=state.adgroupList[action.index];
				adItem.status='STATUS_DELETED';
			}	
			return Object.assign({},state,{
				adgroupList:state.adgroupList,
			});

		case types.DELETE_AD_START:
			return Object.assign({}, state, {
				adEditing: true,
			});

		case types.DELETE_AD_INIT:
			return Object.assign({}, state, {
				adEditing: false,
			});
				
		case types.EDITE_AD:
			
			let adItem=state.adgroupList[action.statejson.index];
			Object.assign(adItem,action.statejson);

			return Object.assign({},state,{
				adgroupList:state.adgroupList,
				adEditing:false,
			});
		case types.REFRESH_AD:

			return Object.assign({}, state, {
				isRefresh: true,
				page:1,
			});
			
		case types.LOADED_AD_AGIN:

			return Object.assign({}, state, {
				page:1,
			});
		case types.AD_INFO_CLEAR:
			return initialState;
		case types.LOAD_AD_SOURCE:
			if(state.adgroupList[action.index]){
				Object.assign(state.adgroupList[action.index],action.sourceInfo);	
			}
			
			return Object.assign({},state,{
				adgroupList:state.adgroupList,
			});
		case types.GET_AD:
			switch(action.backType){
				case 'success':

				let page = action.addAll?state.page:state.page + 1;
				let adgroupList=state.isRefresh?action.adgroupList:state.adgroupList.concat(action.adgroupList);
				return Object.assign({}, state, {
					adgroupList:adgroupList,
					addAll:action.addAll,
					adding: action.adding,
					backType:action.backType,
					page: page,
					isRefresh:false,
					loaded:true,
				});
				case 'loadFail':
				case 'addFail':
				return Object.assign({},state,{
					adding:action.adding,
					backType:action.backType,
					isRefresh:false,
					loaded:true,
				});
			}

		default:
			return state;
	}
}