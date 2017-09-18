'use strict';

import types from '../actions/type';

const initialState = {
	allCampaignList: [],
	filterList:[],
};

export default function selectCampaign(state = initialState, action) {
	switch (action.type) {

		case types.CAMPAIGN_FILTER_INIT:
			return Object.assign({},state,{
				filterList:state.allCampaignList
			});

		case types.SELECT_CAMPAIGN:

			return Object.assign({},state,{
				filterList:action.result,
			});

		case types.GET_ALL_CAMPAIGN:
			return Object.assign({}, state, {
					allCampaignList:action.allCampaignList,
					filterList:action.allCampaignList,
				});

		default:
			return state;
	}
}