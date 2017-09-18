'use strict';

import types from '../actions/type';
import moment from 'moment';
const initialState={
	selectTab:'0',
	loaded:false,
	clearInof:false,
	homeInfo:'',
	hourReportNc:[],
	hourReportNs:[],
	hourReportCtr:[],
	hourReportCost:[],
	chartDataArr:[],
	defaultDataArr:[0,0,0,0],
	envHourDate:{
		startDate:moment(new Date()).format('YYYY-MM-DD'),
		endDate:moment(new Date()).format('YYYY-MM-DD'),
  	},
  	xLabels:['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
};

export default function home (state=initialState,action){
	switch(action.type){
		case types.GET_HOME_START:
		return Object.assign({},state,{
			clearInof:false,
		});
		case types.GET_HOME_INFO:		
		return Object.assign({},state,{
			loaded:action.loaded,
			homeInfo:action.homeInfo
		});

		case types.SET_HOME_DATE_RANGE:		
		return Object.assign({},state,{
			envHourDate:{
				startDate:action.startDate,
				endDate:action.endDate
			}
		});

		case types.GET_HOUR_REPORT:

		return Object.assign({},state,{
			hourReportNc:action.hourReportNc,
			hourReportNs:action.hourReportNs,
			hourReportCtr:action.hourReportCtr,
			hourReportCost:action.hourReportCost,
			defaultDataArr:action.allDataArr,
		});

		case types.CHART_DATE_CHANGE:
			switch(action.value){
				case 0:
				return Object.assign({},state,{
					chartDataArr:state.hourReportNs,
					selectTab:'0',
				});
				case 1:
				return Object.assign({},state,{
					chartDataArr:state.hourReportNc,
					selectTab:'1',
				});
				case 2:
				return Object.assign({},state,{
					chartDataArr:state.hourReportCtr,
					selectTab:'2',
				});
				case 3:
				return Object.assign({},state,{
					chartDataArr:state.hourReportCost,
					selectTab:'3',
				});
				default:
				return state;
			}
		

		case types.HOME_INFO_CLEAR:
		return Object.assign({},initialState,{
			clearInof:true,
		});
		default :
		return state;
	}
}
