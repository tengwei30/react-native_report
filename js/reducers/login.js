'use strict';
import types from '../actions/type'

const initialState={
	isLoging: false,
    editable:true,
	loggedIn: false,
};

export default function login(state=initialState,action){
	switch(action.type){

		case types.ALLOW_LOGIN:
		return Object.assign({},state,{
			loggedIn:true,
		});

		case types.LOGIN_START:
		return Object.assign({},state,{
			isLoging: true,
			editable:false,
			loggedIn:false,
		});

		case types.LOGIN_IN :
		return Object.assign({},state,{
			isLoging: false,
			editable:true,
			loggedIn:true,
		});

		case types.LOGIN_IN_FAIL :
		return Object.assign({},state,{
			isLoging: false,
			editable:true,
			loggedIn:false,
		});

		case types.LOGIN_OUT :
		return Object.assign({},state,{
			loggedIn: false,
			editable:true,
		});
		
		default:
		return state;
	}
};