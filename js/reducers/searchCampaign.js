'use strict';

import types from '../actions/type'
const initialState={
	searchCamEditing:false,
	showSearchResult:false,
	resultList:[],
};

export default function searchCampaign(state=initialState,action){
	switch(action.type){

		case types.SEARCH_CAMPAIGN_EDITE_START:
		return Object.assign({},state,{
			searchCamEditing:true,
		});

		case types.SEARCH_CAMPAIGN_EDITE_SUCCESS:

		let capItem=state.resultList[action.statejson.index];
		Object.assign(capItem,action.statejson);

		return Object.assign({},state,{
			resultList:state.resultList,
			searchCamEditing:false,
		});

		case types.SEARCH_CAMPAIGN_EDITE_INIT:
		return Object.assign({},state,{
			searchCamEditing:false,
		});

		case types.SEARCH_CAMPAIGN_DELETE:

		if(action.index>=0){
			let capItem=state.resultList[action.index];
			capItem.status='STATUS_DELETED';
		}	

		return Object.assign({},state,{
			resultList:state.resultList,
		});

		case types.SEARCH_CAMPAIGN:

		return Object.assign({},state,{
			showSearchResult:true,
			resultList:action.campaignList,
		});
		case types.SEARCH_CAMPAIGN_CLEAR:
		return  initialState;
		default:
		return state;
	}
}