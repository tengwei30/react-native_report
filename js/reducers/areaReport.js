'use strict';

import types from '../actions/type';

const initialState={
	selectTab:'0',
	searching:false,
	reportNc:[],
	reportNs:[],
	reportCtr:[],
	reportCost:[],
	chartDataArr:[],
	areaReportList:[],
	defaultDataArr:[0,0,0,0],
	xLabels:['',''],
};

export default function areaReport (state=initialState,action){
	switch(action.type){

		case types.AREA_REPORT_START:
		return Object.assign({},state,{
			searching:true,
		});

		case types.AREA_REPORT_XLABELS:
		return Object.assign({},state,{
			xLabels:action.xLabels
		});

		case types.AREA_REPORT_ERROR:
		return Object.assign({},state,{
			searching:false,
		});

		//地域报表排序
		case types.AREA_REPORT_SORT:
		let result=[];
		if(action.key=='city_name'){
			result=state.areaReportList.sort((a,b)=>action.ascending?a[action.key].localeCompare(b[action.key]):b[action.key].localeCompare(a[action.key]));
		}else{
			result=state.areaReportList.sort((a,b)=>action.ascending?a[action.key]-b[action.key]:b[action.key]-a[action.key]);
		}
		
		return Object.assign({},state,{
			areaReportList:result,
		});
		//获取地域报表数据
		case types.AREA_REPORT:
		return Object.assign({},state,{
			reportNc:action.reportNc,
			reportNs:action.reportNs,
			reportCtr:action.reportCtr,
			reportCost:action.reportCost,
			defaultDataArr:action.allDataArr,
			areaReportList:action.reportList,
			searching:false,
		});

		case types.AREA_REPORT_TYPE_CHANGE:
			switch(action.value){
				case 0:
				return Object.assign({},state,{
					selectTab:'0',
					chartDataArr:state.reportNs
				});
				case 1:
				return Object.assign({},state,{
					selectTab:'1',
					chartDataArr:state.reportNc
				});
				case 2:
				return Object.assign({},state,{
					selectTab:'2',
					chartDataArr:state.reportCtr
				});
				case 3:
				return Object.assign({},state,{
					selectTab:'3',
					chartDataArr:state.reportCost
				});
				default:
				return state;
			}
		

		case types.AREA_REPORT_CLEAR:
		return initialState;
		default :
		return state;
	}
}
