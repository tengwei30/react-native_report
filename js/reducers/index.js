import {
    combineReducers
} from 'redux';
import userInfo from './user';
import login from './login';
import advertiser from './Advertiser';
import home from './home';
import campaign from './campaign';
import selectCampaign from './selectCampaign';
import searchAdvertiser from './searchAdvertiser';
import adgroup from './adgroup'
import selectAd from './selectAd'
import searchCampaign from './searchCampaign'
import searchAd from './searchAd'
import searchInfo from './searchInfo';
import dataChart from './data'
import hourReport from './hourReport'
import dailyReport from './dailyReport'
import publisherReport from './publisherReport'
import areaReport from './areaReport'

const appReducer = combineReducers({
    userInfoState:userInfo,
    loginInfo: login,
    advertiser:advertiser,
    homeState:home,
    campaignState:campaign,
    selectCampaignState:selectCampaign,
    shAdvertiserState:searchAdvertiser,
    adgroupState:adgroup,
    selectAdState:selectAd,
    shCampaignState:searchCampaign,
    shAdState:searchAd,
    dataChartState:dataChart,
    searchInfoState:searchInfo,
    hourReportState:hourReport,
    dailyReportState:dailyReport,
    publisherReportState:publisherReport,
    areaReportState:areaReport,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGIN_OUT') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer;