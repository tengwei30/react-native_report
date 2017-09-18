 'use strict';

import types from './type';

//设置报表中推广计划的值
export function searchInfoCurCid(curCid,curCidName){
	return{
		type:types.SEARCH_CUR_CID,
		curCid,
		curCidName,
	}
}
//设置报表中广告的值
export function searchInfoCurAid(curAid,curAidName){
	return{
		type:types.SEARCH_CUR_AID,
		curAid,
		curAidName,
	}
}
//设置报表中四个类型的日期，统一改变
export function searchSetRangeDate(rangeDate){
	return{
		type:types.SEARCH_SET_RANGE_DATE,
		startDate:rangeDate.startDate,
		endDate:rangeDate.endDate,
	}
}
//设置获取推广计划和广告列表数据的日期，统一改变
export function searchSetFilterRangeDate(rangeDate){
	return{
		type:types.SEARCH_SET_FILTER_RANGE_DATE,
		rangeDate,
	}
}

export function searchBasicInfoClear(){
	return{
		type:types.SEARCH_BASIC_INFO_CLEAR
	}
}

export function searchInfoClear(){
	return{
		type:types.SEARCH_INFO_CLEAR
	}
}