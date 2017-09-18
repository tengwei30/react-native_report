'use strict';

import types from '../actions/type';

const initialState = {
	isRefresh:false,
	page: 1,
	loaded:false,
	addAll:false,
	page_size: 20,
	fields: '',
	where: {},
	adding: false,
	status: '', //状态有三种 success/loadFail/addFail
	advertiserList: [],
};

export default function advertiser(state = initialState, action) {
	switch (action.type) {

		case types.LOAD_ADVERTISER_LIST_START:

			return Object.assign({}, state, {
				loaded: false,
			});

		case types.ADDING_ADVERTISER_LIST:

			return Object.assign({}, state, {
				adding: true,
			});
		case types.REFRESH_ADVERTISER:

			return Object.assign({}, state, {
				isRefresh: true,
				page:1,
			});
		case types.GET_ADVERTISER_LIST:
			switch(action.status){
				case 'success':
				let page = action.addAll?state.page:state.page+1;
				let advertiserList=state.isRefresh?action.advertiserList:state.advertiserList.concat(action.advertiserList);
				return Object.assign({}, state, {
					advertiserList:advertiserList,
					adding: action.adding,
					page: page,
					status:action.status,
					isRefresh:false,
					addAll:action.addAll,
					loaded:true,
				});
				case 'loadFail':
				case 'addFail':
				return Object.assign({},state,{
					adding:action.adding,
					status:action.status,
					isRefresh:false,
					loaded:true,
				});
			}

		default:
			return state;
	}
}