import keyMirror from 'keymirror';

export default keyMirror({
    //login相关type
    LOGIN_START:null,
	LOGIN_IN:null,
    LOGIN_IN_FAIL:null,
    ALLOW_LOGIN:null,
	LOGIN_OUT: null,
    //用户自身信息
    GET_USER_INFO:null,
    EDITE_USER_INFO:null,

    //广告主获取检索相关type
    GET_ADVERTISER_LIST: null,
    REFRESH_ADVERTISER: null,
    SEARCH_ADVERTISER:null,
    SEARCH_ADVERTISER_START:null,
    SEARCH_ADVERTISER_CLEAR:null,
    LOAD_ADVERTISER_LIST_START:null,
    ADDING_ADVERTISER_LIST:null,
    INIT_ADVERTISER_HISTORY_LIST:null,
    ADD_ADVERTISER_HISTORY_LIST:null,
    CLEAR_ADVERTISER_HISTORY_LIST:null,
    //广告主详情 产品
    GET_HOME_INFO: null,
    GET_HOME_START:null,
    HOME_INFO_CLEAR: null,
    GET_HOUR_REPORT: null,
    CHART_DATE_CHANGE:null,
    SET_HOME_DATE_RANGE:null,
    //推广计划相关
    GET_CAMPAIGN: null,
    GET_CAMPAIGN_START: null,
    GET_ALL_CAMPAIGN:null,
    SELECT_CAMPAIGN:null,
    CAMPAIGN_FILTER_INIT:null,
    DELETE_CAMPAIGN:null,
    ADDING_CAMPAIGN: null,
    REFRESH_CAMPAIGN:null,
    CAM_JUMPTO_AD:null,
    CHANGE_CAMPAIGN_STATUS:null,
    SEARCH_CAMPAIGN:null,
    SEARCH_CAMPAIGN_CLEAR:null,
    SEARCH_SET_FILTER_RANGE_DATE:null,
    //推广计划搜索结果操作
    SEARCH_CAMPAIGN_EDITE_START:null,
    SEARCH_CAMPAIGN_EDITE_SUCCESS:null,
    SEARCH_CAMPAIGN_DELETE:null,
    SEARCH_CAMPAIGN_EDITE_INIT:null,

    //编辑推广计划
    EDITE_CAMPAIGN:null,
    EDITE_CAMPAIGN_START:null,
    EDITE_CAMPAIGN_INIT:null,
    CAMPAIGN_CHANGE:null,
    GET_CAMPAIGN_INFO: null,

    //广告相关
    GET_AD: null,
    GET_ALL_AD:null,
    GET_AD_START:null,
    SELECT_AD:null,
    SELECT_CAMPAIGN_TO_AD:null,
    CLEAR_AD_SELECT:null,
    AD_FILTER_INIT:null,
    DELETE_AD:null,
    ADDING_AD: null,
    CHANGE_AD_STATUS:null,
    REFRESH_AD: null,
    AD_INFO_CLEAR: null,
    GET_AD_INFO: null,
    LOAD_AD_SOURCE:null,
    SEARCH_AD:null,
    SEARCH_AD_CLEAR:null,
    LOADED_AD_AGIN:null,

    SEARCH_AD_EDITE_START:null,
    SEARCH_AD_EDITE_SUCCESS:null,
    SEARCH_AD_DELETE:null,
    SEARCH_AD_EDITE_INIT:null,

    //编辑广告
    EDITE_AD:null,
    DELETE_AD_START:null,
    DELETE_AD_INIT:null,

    //报表相关
    INIT_DATA_PAGE:null,
    SEARCH_CUR_CID:null,
    SEARCH_CUR_AID:null,
    SEARCH_BASIC_INFO_CLEAR:null,
    SEARCH_INFO_CLEAR:null,
    SEARCH_SET_RANGE_DATE:null,
    //小时报表
    HOUR_REPORT_START:null,
    HOUR_REPORT:null,
    HOUR_REPORT_ERROR:null,
    HOUR_REPORT_TYPE_CHANGE:null,
    HOUR_REPORT_CLEAR:null,
    HOUR_REPORT_CUR_CID:null,
    HOUR_REPORT_CUR_AID:null,
    HOUR_REPORT_ID_CLEAR:null,
    HOUR_REPORT_SORT:null,
    
    //日报表
    DAILY_REPORT_START:null,
    DAILY_REPORT:null,
    DAILY_REPORT_ERROR:null,
    DAILY_REPORT_TYPE_CHANGE:null,
    DAILY_REPORT_CLEAR:null,
    DAILY_REPORT_XLABELS:null,
    DAILY_REPORT_SORT:null,
    //媒体报表
    PUBLISHER_REPORT_START:null,
    PUBLISHER_REPORT:null,
    PUBLISHER_REPORT_ERROR:null,
    PUBLISHER_REPORT_TYPE_CHANGE:null,
    PUBLISHER_REPORT_CLEAR:null,
    PUBLISHER_REPORT_XLABELS:null,
    PUBLISHER_REPORT_SORT:null,

    //地域报表
    AREA_REPORT_START:null,
    AREA_REPORT:null,
    AREA_REPORT_ERROR:null,
    AREA_REPORT_TYPE_CHANGE:null,
    AREA_REPORT_CLEAR:null,
    AREA_REPORT_XLABELS:null,
    AREA_REPORT_SORT:null,
});
