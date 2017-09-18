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
	isRefresh:false,
	camEditing:false,
	adding: false,
	backType: '', //状态有四种 success/loadFail/addFail/addAll
	campaignList: [],
};

export default function campaign(state = initialState, action) {
	switch (action.type) {
		case types.ADDING_CAMPAIGN:

			return Object.assign({}, state, {
				adding: true,
			});

		case types.GET_CAMPAIGN_START:

			return Object.assign({}, state, {
				loaded: false,
				page:1,
				campaignList:[],
			});

		//推广计划和广告共享 SEARCH_SET_FILTER_RANGE_DATE	
		case types.SEARCH_SET_FILTER_RANGE_DATE:

		return Object.assign({},state,{
			where:JSON.stringify(Object.assign(JSON.parse(state.where),action.rangeDate)),
			filterRangeDate:action.rangeDate,
		});

		case types.CHANGE_CAMPAIGN_STATUS:

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
				loaded:false,
				page:1,
				campaignList:[],
			});
		case types.DELETE_CAMPAIGN:

			if(action.index>=0){
				let capItem=state.campaignList[action.index];
				capItem.status='STATUS_DELETED';
			}			
			return Object.assign({},state,{
				campaignList:state.campaignList
			});

		case types.EDITE_CAMPAIGN_START:
			return Object.assign({}, state, {
				camEditing: true,
			});

		case types.EDITE_CAMPAIGN_INIT:
			return Object.assign({}, state, {
				camEditing: false,
			});

		case types.EDITE_CAMPAIGN:

			let capItem=state.campaignList[action.statejson.index];
			Object.assign(capItem,action.statejson);

			return Object.assign({},state,{
				campaignList:state.campaignList,
				camEditing:false,
			});
		case types.REFRESH_CAMPAIGN:

			return Object.assign({}, state, {
				isRefresh: true,
				page:1,
			});
		case types.CAMPAIGN_CHANGE:
			return initialState;
		case types.GET_CAMPAIGN:
			switch(action.backType){
				case 'success':

				let page = action.addAll?state.page:state.page + 1;
				
				let campaignList=state.isRefresh?action.campaignList:state.campaignList.concat(action.campaignList);

				return Object.assign({}, state, {
					campaignList:campaignList,
					addAll:action.addAll,
					adding: action.adding,
					page: page,
					backType:action.backType,
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