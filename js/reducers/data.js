'use strict';

import types from '../actions/type';

const initialState = {
	initPage:0,
	enterTimes:0,
};

export default function dataChart(state = initialState, action){
	switch(action.type){
		case types.INIT_DATA_PAGE:
		return Object.assign({},state,{
			initPage:0,
			enterTimes:state.enterTimes+1,
		});
		default:
		return state;
	}
}