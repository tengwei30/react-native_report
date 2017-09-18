 'use strict';

import types from './type';
import adxRequest from '../request';
import {
    HOST_NAME,
    ADVERTISER_INFO_URL,
    HOURE_REPORT,
} from '../api';

//清除home state的数据
export function homeInfoClear(){
	return {
		type:types.HOME_INFO_CLEAR,
	}
}
//开始请求home页数据
export function getHomeStart(){
	return{
		type:types.GET_HOME_START,
	}
}
//存储home页小时报表日期
export function homeSetDateRange(rangeDate){
	return {
		type:types.SET_HOME_DATE_RANGE,
		startDate:rangeDate.startDate,
		endDate:rangeDate.endDate,
	}
}
//home也点击数据类型，切换图表数据展示
export function chartDateChange(value){
	return{
		type:types.CHART_DATE_CHANGE,
		value,
	}
}
//小时报表数据类型切换
export function hChartChange(value){
	return{
		type:types.HOUR_REPORT_TYPE_CHANGE,
		value,
	}
}
//小时报表数据请求开始
export function hChartStart(){
	return{
		type:types.HOUR_REPORT_START
	}
}

//小时报表数据清除
export function hChartClear(){
	return{
		type:types.HOUR_REPORT_CLEAR
	}
}

//小时报表数据升降序action
export function hChartSort(key,ascending){
	return{
		type:types.HOUR_REPORT_SORT,
		key,
		ascending,
	}
}

function fetchHomeInfo(homeInfo){
	return {
		type:types.GET_HOME_INFO,
		loaded:true,
		homeInfo,
	}
}

export function home (aoptions){
	let initialOptions={
		token:'',
		uid:'',
		fields:'', //'["uid","name"]'
	};

	let options=Object.assign({},initialOptions,aoptions);
	let timestamp = Math.floor((new Date().getTime())/1000);

	let requestURL=`${HOST_NAME}${ADVERTISER_INFO_URL}?access_token=${options.token}&timestamp=${timestamp}&uid=${options.uid}&appid=ios`;
	logger.debug('获取广告主详细信息url',requestURL);

	return (dispatch) => {

		let successBack=(data)=>{
			logger.debug('获取广告主详细信息',data);
			if (data.ret_code === 0) {
				let homeInfo = data.ret_msg;
				dispatch(fetchHomeInfo(homeInfo));
			} 
		};

		let failBack=(error)=>{
			logger.debug('获取广告主信息失败',error);
			dispatch(fetchHomeInfo(''));
		};

		return adxRequest({url:requestURL,noPrompt:true},successBack,failBack,home,aoptions);
	};
};

function fetchHourReportSuccess(hourReport,summary,h_chart){
	let hourReportNc=[];
	let hourReportNs=[];
	let hourReportCtr=[];
	let hourReportCost=[];
	let allDataArr=[summary.ns,summary.nc,(summary.ctr*100).toFixed(3),summary.cost];
	for(let i=0; i<hourReport.length; i++){
		hourReportNc.push(parseFloat(hourReport[i].nc));
		hourReportNs.push(parseFloat(hourReport[i].ns));
		hourReportCtr.push(parseFloat(hourReport[i].ctr.split('%')[0])*100);
		hourReportCost.push(parseFloat(hourReport[i].cost));
	}


	return {
		type:h_chart?types.HOUR_REPORT:types.GET_HOUR_REPORT,
		hourReportNc,
		hourReportNs,
		hourReportCtr,
		hourReportCost,
		allDataArr,
		hourReport,
	}
}
function fetchFail (){
	return {
		type:types.HOUR_REPORT_ERROR,
	}
}
export function hourReport (aoptions){
	let initialOptions={
		token:'',
		uid:'',
		fields:'', //'["uid","name"]' 
		cid:0,
		aid:0,
	};

	let options=Object.assign({},initialOptions,aoptions);
	let timestamp = Math.floor((new Date().getTime())/1000);

	let requestURL=`${HOST_NAME}${HOURE_REPORT}?access_token=${options.token}&timestamp=${timestamp}&uid=${options.uid}&cid=${options.cid}&aid=${options.aid}&appid=ios&time_range=${options.time_range}`;
	logger.debug('获取小时报表',requestURL);

	return (dispatch) => {

		let successBack=(data)=>{
			logger.debug('获取小时报表数据',data);
			if (data.ret_code === 0) {
				let hourReport = data.ret_msg.list;
				let summary = data.ret_msg.summary;
				dispatch(fetchHourReportSuccess(hourReport,summary,options.h_chart));
				if(options.h_chart){
					dispatch(hChartChange(0));
				}else{
					dispatch(chartDateChange(0));
				}
				
			} else if (data.ret_code === 1) {
				dispatch(fetchFail());
			}
		};
		let failBack=(error)=>{
			dispatch(fetchFail());
			logger.debug('获取小时报表失败',error);
		};

		return adxRequest({url:requestURL},successBack,failBack,hourReport,aoptions);
	};
};