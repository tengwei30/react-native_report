'use strict';

import moment from 'moment';
import types from './type';
import adxRequest from '../request';
import {
    HOST_NAME,
    PUBLISHER_REPORT,
} from '../api';

export function publisherChartChange(value){
	return{
		type:types.PUBLISHER_REPORT_TYPE_CHANGE,
		value,
	}
}

export function publisherChartStart(){
	return{
		type:types.PUBLISHER_REPORT_START
	}
}

//媒体报表排序action
export function publisherReportSort(key,ascending){
	return{
		type:types.PUBLISHER_REPORT_SORT,
		key,
		ascending,
	}
}

export function publisherChartXLabels(reportList){
	let xLabels=reportList.map((item,index)=>item=item['pub_name']);
	return{
		type:types.PUBLISHER_REPORT_XLABELS,
		xLabels
	}
}

export function publisherChartClear(){
	return{
		type:types.PUBLISHER_REPORT_CLEAR,
	}
}


function fetchPublisherReportSuccess(reportList){

	let reportNs=[];
	let reportNc=[];
	let reportCtr=[];
	let reportCost=[];
	let allNs=0;
	let allNc=0;
	let allCost=0;

	for(let i=0; i<reportList.length; i++){
		let nsValue=parseFloat(reportList[i].ns);
		reportNs.push(nsValue);
		allNs += nsValue*1;

		let ncValue=parseFloat(reportList[i].nc);
		reportNc.push(ncValue);
		allNc += ncValue*1;

		let ctrValue=parseFloat(reportList[i].ctr.split('%')[0]);
		reportCtr.push(ctrValue);

		let costValue=parseFloat(reportList[i].cost);
		reportCost.push(costValue);
		allCost += costValue*1;

	}
	
	let allCtr=((allNc/allNs)*100).toFixed(3);
	let allDataArr=[allNs,allNc,isNaN(allCtr)?0:allCtr,allCost.toFixed(2)];

	return {
		type:types.PUBLISHER_REPORT,
		reportNc,
		reportNs,
		reportCtr,
		reportCost,
		allDataArr,
		reportList,
	}
}

function fetchFail (){
	return {
		type:types.PUBLISHER_REPORT_ERROR,
	}
}
export function publisherReport (aoptions){
	let initialOptions={
		token:'',
		uid:'',
		fields:'', //'["uid","name"]' 
		cid:0,
		page_size:100,
		aid:0,
	};

	let options=Object.assign({},initialOptions,aoptions);
	let timestamp = Math.floor((new Date().getTime())/1000);

	let requestURL=`${HOST_NAME}${PUBLISHER_REPORT}?access_token=${options.token}&timestamp=${timestamp}&uid=${options.uid}&cid=${options.cid}&aid=${options.aid}&appid=ios&page_size=${options.page_size}&time_range=${options.time_range}`;
	logger.debug('媒体报表url',requestURL);

	return (dispatch) => {

		let successBack=(data)=>{
			logger.debug('媒体报表数据',data);
			destroyLoadBox();
			if (data.ret_code === 0) {
				let reportList = data.ret_msg.list;

				dispatch(fetchPublisherReportSuccess(reportList));

				dispatch(publisherChartXLabels(reportList));
				dispatch(publisherChartChange(0));
				
			} else if (data.ret_code === 1) {
				dispatch(fetchFail());	
			}
		};
		let failBack=(error)=>{
			logger.debug('媒体报表失败',error);
			dispatch(fetchFail());
		};
		return adxRequest({url:requestURL},successBack,failBack,publisherReport,aoptions);
	};
};