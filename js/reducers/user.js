'use strict';

import types from '../actions/type';

const initialState = {
	realname:'',
	companyname:'',
	mobile:'',
	email:'',
	QQ:'',
};

export default function userInfo(state = initialState, action) {
	switch(action.type){
		case types.GET_USER_INFO:
		return Object.assign({},state,{
			realname:action.userInfo.realname,
			companyname:action.userInfo.companyname,
			mobile:action.userInfo.mobile,
			email:action.userInfo.email,
			QQ:action.userInfo.QQ,
		});
		case types.EDITE_USER_INFO:
		return Object.assign({},state,action.statejson);
		default:
		return state;
	}
};