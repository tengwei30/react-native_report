'use strict';

import moment from 'moment';
import types from './type';
import adxRequest from '../request';
import {
    HOST_NAME,
    DAILY_REPORT,
} from '../api';

export function dailyChartChange(value){
	return{
		type:types.DAILY_REPORT_TYPE_CHANGE,
		value,
	}
}

export function dailyChartStart(){
	return{
		type:types.DAILY_REPORT_START
	}
}

export function dailyXlabelsChange(rangeDate){

	let xLabels=handXLabel(rangeDate);
	return{
		type:types.DAILY_REPORT_XLABELS,
		xLabels,
	}
}

export function dailyChartClear(value){
	return{
		type:types.DAILY_REPORT_CLEAR,
		value,
	}
}

//日报表升降序action
export function dailyReportSort(key,ascending){
	return{
		type:types.DAILY_REPORT_SORT,
		key,
		ascending,
	}
}

function handXLabel(rangDate){
    let xLabels;

    let diffDay=moment(rangDate.endDate).diff(moment(rangDate.startDate),'days');
    
    if(diffDay==0){
        xLabels=[rangDate.startDate];
    }else if(diffDay==1){
        xLabels=[rangDate.startDate,rangDate.endDate];
    }else {
        let newArr=[];
        for(let i=0; i<diffDay-1;i++){
           newArr.push(moment(rangDate.startDate).add(i+1,'day').format('YYYY-MM-DD'));
        }
        newArr.push(rangDate.endDate);
        newArr.unshift(rangDate.startDate);
        xLabels=newArr;
    }
    return xLabels;
}

function fetchDailyReportSuccess(report,rangDate){

	let reportNs=[];
	let reportNc=[];
	let reportCtr=[];
	let reportCost=[];
	let reportList=[];
	let allNs=0;
	let allNc=0;
	let allCost=0;

	let diffDay=moment(rangDate.endDate).diff(moment(rangDate.startDate),'days');

	for(let i=0; i<diffDay+1; i++){
		let date=moment(rangDate.startDate).add(i,'days').format('YYYY-MM-DD');
		reportNs.push(0);
		reportNc.push(0);
		reportCtr.push(0);
		reportCost.push(0);
		reportList.push({date:date,ns:0,nc:0,ctr:0.000,cost:0});
	}

	for(let j=0; j<reportList.length; j++){
		for(let i=report.length-1; i>=0; i--){
			if(reportList[j].date==report[i].date){

				let nsValue=parseFloat(report[i].ns);
				reportNs[j]=reportList[j].ns=nsValue;
				allNs+=report[i].ns*1;

				let ncValue=parseFloat(report[i].nc);
				reportNc[j]=reportList[j].nc=ncValue;
				allNc+=report[i].nc*1;

				let defaultctr=report[i].ctr.split('%')[0];
				let ctrValue=defaultctr==0?defaultctr:parseFloat(defaultctr);
				reportList[j].ctr=ctrValue;
				reportCtr[j]=ctrValue*100;

				let costValue=parseFloat(report[i].cost);
				reportCost[j]=reportList[j].cost=costValue;
				allCost+=report[i].cost*1;
			}
			
		}
	}
	
	let allCtr=((allNc/allNs)*100).toFixed(3);
	let allDataArr=[allNs,allNc,isNaN(allCtr)?0:allCtr,allCost.toFixed(2)];

	return {
		type:types.DAILY_REPORT,
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
		type:types.DAILY_REPORT_ERROR,
	}
}
export function dailyReport (aoptions){
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
	let requestURL=`${HOST_NAME}${DAILY_REPORT}?access_token=${options.token}&timestamp=${timestamp}&uid=${options.uid}&cid=${options.cid}&aid=${options.aid}&appid=ios&page_size=${options.page_size}&time_range=${options.time_range}`;
		logger.debug('日报表url',requestURL);

	return (dispatch) => {

		let successBack=(data)=>{
			logger.debug('日报表数据',data);
			if (data.ret_code === 0) {
				let reportList = data.ret_msg.list;
				let rangeDate={
					startDate:options.start_date,
					endDate:options.end_date
				};

				dispatch(fetchDailyReportSuccess(reportList,rangeDate));
				dispatch(dailyXlabelsChange(rangeDate));
				dispatch(dailyChartChange(0));
				
			} else if (data.ret_code === 1) {
				dispatch(fetchFail());	
			}
		};
		let failBack=(error)=>{
			logger.debug('获取日报表失败',error);
			dispatch(fetchFail());
		};

		return adxRequest({url:requestURL},successBack,failBack,dailyReport,aoptions);
	};
};