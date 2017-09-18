'use strict';

import types from '../actions/type';

const initialState={
	selectTab:'0',
	searching:false,
	hourReportNc:[],
	hourReportNs:[],
	hourReportCtr:[],
	hourReportCost:[],
	chartDataArr:[],
	hourReportList:[],
	curCid:0,
	curAid:0,
	curCidName:'全部',
	curAidName:'全部',
	defaultDataArr:[0,0,0,0],
	xLabels:['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
};

export default function hourReport (state=initialState,action){
	switch(action.type){

		case types.HOUR_REPORT_START:
		return Object.assign({},state,{
			searching:true,
		});

		case types.HOUR_REPORT_CUR_CID:
		return Object.assign({},state,{
			curCid:action.curCid,
			curCidName:action.curCidName,
		});

		case types.HOUR_REPORT_CUR_AID:
		return Object.assign({},state,{
			curAid:action.curAid,
			curAidName:action.curAidName,
		});

		case types.HOUR_REPORT_ID_CLEAR:
		return Object.assign({},state,{
			curCid:0,
			curAid:0,
			curCidName:'全部',
			curAidName:'全部',
		});

		case types.HOUR_REPORT_SORT:
		let result=[];

		result=state.hourReportList.sort((a,b)=>action.ascending?a[action.key]-b[action.key]:b[action.key]-a[action.key]);

		return Object.assign({},state,{
			hourReportList:result,
		});

		case types.HOUR_REPORT:

		return Object.assign({},state,{
			hourReportNc:action.hourReportNc,
			hourReportNs:action.hourReportNs,
			hourReportCtr:action.hourReportCtr,
			hourReportCost:action.hourReportCost,
			defaultDataArr:action.allDataArr,
			hourReportList:action.hourReport,
			searching:false,
		});

		case types.HOUR_REPORT_ERROR:

		return Object.assign({},state,{
			searching:false,
		});

		case types.HOUR_REPORT_TYPE_CHANGE:
			switch(action.value){
				case 0:
				return Object.assign({},state,{
					selectTab:'0',
					chartDataArr:state.hourReportNs
				});
				case 1:
				return Object.assign({},state,{
					selectTab:'1',
					chartDataArr:state.hourReportNc
				});
				case 2:
				return Object.assign({},state,{
					selectTab:'2',
					chartDataArr:state.hourReportCtr
				});
				case 3:
				return Object.assign({},state,{
					selectTab:'3',
					chartDataArr:state.hourReportCost
				});
				default:
				return state;
			}
		

		case types.HOUR_REPORT_CLEAR:
		return initialState;
		default :
		return state;
	}
}
