'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import AdsHeader from '../header';
import DayPicker from '../../common/dateRange';
import AdColor from '../../common/AdColor';
import commonStyles from '../../common/commonStyles';
import CampaignList from './campaign-list';
import {campaignActions} from '../../actions';
import StatusBox from '../../common/statusBox';
import {campaignChange} from '../../actions/campaign';
import {searchSetFilterRangeDate} from '../../actions/searchInfo';

class CampaignView extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
                   
        };
    }

    componentDidMount() {
        const {advertiser,campaignActions,campaignState} = this.props;
        const {filterRangeDate} = this.props.campaignState;
        //数据统计函数
        statistics('推广计划列表');
        campaignActions.getCampaign({
            token:userToken_G,
            uid:advertiser.uid,
            where:campaignState.where,
        });
    }

    componentWillUnmount() {
      const {campaignActions} = this.props;
      campaignActions.campaignChange();
    }
    //日期选择后以新的日期进行数据请求并存储日期到state中
    sureButtonClick(rangeDate){
        const {dispatch} = this.props;
        const {advertiser,campaignActions,campaignState} = this.props;

        //获取选择的日期段
        const startDate=rangeDate.min.format('YYYY-MM-DD').toString();
        const endDate=rangeDate.max.format('YYYY-MM-DD').toString();

        const rangeDateSet={
            startDate:startDate,
            endDate:endDate,
        };
         statistics('获取推广计划数据日期段');

        //存储选择时间段，推广计划和广告公用      
        dispatch(searchSetFilterRangeDate(rangeDateSet)); 
        let resultWhere=Object.assign(JSON.parse(campaignState.where),rangeDateSet);
       
        //重新选择日期,会重新获取推广计划，重置page为1，
        campaignActions.getCampaignStart();
        campaignActions.getCampaign({
            token:userToken_G,
            uid:advertiser.uid,
            where:JSON.stringify(resultWhere),
        });
    }

    handSearch(){

        const {navigator,advertiser,changeTabItem,searchInfoState,campaignState} = this.props;

        if(navigator){
            navigator.push({
                campaignSearch:true,
                params:{
                    uid:advertiser.uid,
                    changeTabItem,
                    searchInfoState,
                    campaignState,
                }
            });
        }
    }

    shouldComponentUpdate(nextProps){
        if(nextProps.changeTabItem==this.props.changeTabItem){
            return true;
        }
        return false;
    }

    render() {
        const {campaignState,advertiser,campaignActions,navigator,dispatch} = this.props;
        const {filterRangeDate} = this.props.campaignState;

        return (
            <View style={commonStyles.container} >
                <View style={commonStyles.header} >
                <AdsHeader  navigator={navigator} headerName={advertiser.name}/>
                <View style={commonStyles.rightBox} >
                    <TouchableOpacity onPress={this.handSearch.bind(this)} >
                    <Image style={{width:30,height:30}} source={require('../../common/img/icon-search-gray.png')} />
                    </TouchableOpacity>
                </View>
                
                </View>
                <View style={[commonStyles.typeBox,{justifyContent:'flex-end'}]} >

                <DayPicker 
                 border='none'
                 startDate={filterRangeDate.startDate} 
                 endDate={filterRangeDate.endDate} 
                 sureButtonClick={this.sureButtonClick.bind(this)} />

                <StatusBox 
                    dataState={campaignState} 
                    dispatch={dispatch} 
                    uid={advertiser.uid} 
                    filterType='campaign' />
                </View>
                <CampaignList
                 {...this.props} />
            </View>
        );
    }
};

function select(state){
    return{
        campaignState:state.campaignState,
        searchInfoState:state.searchInfoState
    };
}
function bindActionsToProps(dispatch){
    return{
      campaignActions:bindActionCreators(campaignActions,dispatch), 
    };
}
export default  connect(select,bindActionsToProps)(CampaignView);

