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
	publisherReportList:[],
	defaultDataArr:[0,0,0,0],
	xLabels:[''],
};

export default function publisherReport (state=initialState,action){
	switch(action.type){

		case types.PUBLISHER_REPORT_START:
		return Object.assign({},state,{
			searching:true,
		});

		case types.PUBLISHER_REPORT_XLABELS:
		return Object.assign({},state,{
			xLabels:action.xLabels
		});

		case types.PUBLISHER_REPORT_ERROR:
		return Object.assign({},state,{
			searching:false,
		});

		//媒体报表排序
		case types.PUBLISHER_REPORT_SORT:
		let result=[];
		if(action.key=='pub_name'){
			result=state.publisherReportList.sort((a,b)=>action.ascending?a[action.key].localeCompare(b[action.key]):b[action.key].localeCompare(a[action.key]));
		}else{
			result=state.publisherReportList.sort((a,b)=>action.ascending?a[action.key]-b[action.key]:b[action.key]-a[action.key]);
		}
		
		return Object.assign({},state,{
			publisherReportList:result,
		});
		//获取媒体报表数据
		case types.PUBLISHER_REPORT:

		return Object.assign({},state,{
			reportNc:action.reportNc,
			reportNs:action.reportNs,
			reportCtr:action.reportCtr,
			reportCost:action.reportCost,
			defaultDataArr:action.allDataArr,
			publisherReportList:action.reportList,
			searching:false,
		});

		case types.PUBLISHER_REPORT_TYPE_CHANGE:
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
		

		case types.PUBLISHER_REPORT_CLEAR:
		return initialState;
		default :
		return state;
	}
}
