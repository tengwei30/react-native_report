'use strict';

import types from '../actions/type';
const initialState={
	searchAdEditing:false,
	showSearchResult:false,
	resultList:[],
};

export default function searchAd(state=initialState,action){
	switch(action.type){

		case types.SEARCH_AD_EDITE_START:
		return Object.assign({},state,{
			searchAdEditing:true,
		});

		case types.SEARCH_AD_EDITE_SUCCESS:

		let adItem=state.resultList[action.statejson.index];
		Object.assign(adItem,action.statejson);

		return Object.assign({},state,{
			resultList:state.resultList,
			searchAdEditing:false,
		});

		case types.SEARCH_AD_EDITE_INIT:
		return Object.assign({},state,{
			searchAdEditing:false,
		});

		case types.SEARCH_AD_DELETE:

		if(action.index>=0){
			let adItem=state.resultList[action.index];
			adItem.status='STATUS_DELETED';
		}	

		return Object.assign({},state,{
			resultList:state.resultList,
		});

		case types.LOAD_AD_SOURCE:
		
		if(state.resultList[action.index]){
		Object.assign(state.resultList[action.index],action.sourceInfo);	
		}		
		return Object.assign({},state,{
			resultList:state.resultList,
		});

		case types.SEARCH_AD:
		
		return Object.assign({},state,{
			showSearchResult:true,
			resultList:action.adgroupList
		});
		case types.SEARCH_AD_CLEAR:
		return  initialState;
		default:
		return state;
	}
}