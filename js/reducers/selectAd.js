'use strict';

import types from '../actions/type';

const initialState = {
	allAdList: [],
	filterList:[],
};

export default function selectAd(state = initialState, action) {
	switch (action.type) {

		case types.AD_FILTER_INIT:
			return Object.assign({},state,{
				filterList:state.allAdList
			});

		case types.SELECT_AD:
			return Object.assign({},state,{
				filterList:action.result,
			});

		case types.GET_ALL_AD:
			return Object.assign({}, state, {
					allAdList:action.allAdList,
					filterList:action.allAdList,
				});
		case types.CLEAR_AD_SELECT:
			return initialState;

		default:
			return state;
	}
}