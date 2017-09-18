'use strict';

import types from '../actions/type';
import moment from 'moment';

const initialState={
	curCid:0,
	curAid:0,
	curCidName:'全部',
	curAidName:'全部',
	dataRangeDate:{
		startDate:moment(new Date()).add(-7,'day').format('YYYY-MM-DD'),
		endDate:moment(new Date()).format('YYYY-MM-DD'),
	},
};

export default function searchCampaign(state=initialState,action){
	switch(action.type){

		case types.SEARCH_CUR_CID:
		return Object.assign({},state,{
			curCid:action.curCid,
			curCidName:action.curCidName,
			curAid:0,
			curAidName:'全部',
		});

		case types.SEARCH_CUR_AID:
		return Object.assign({},state,{
			curAid:action.curAid,
			curAidName:action.curAidName,
		});
		case types.SEARCH_SET_RANGE_DATE:
		return Object.assign({},state,{
			dataRangeDate:{
				startDate:action.startDate,
				endDate:action.endDate
			}
		});
		case types.SEARCH_BASIC_INFO_CLEAR:
		return Object.assign({},state,{
			curCid:0,
			curAid:0,
			curCidName:'全部',
			curAidName:'全部',
		});

		case types.SEARCH_INFO_CLEAR:
		return initialState;
		default:
		return state;
	}
}