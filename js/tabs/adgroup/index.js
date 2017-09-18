'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import AdsHeader from '../header';
import AdColor from '../../common/AdColor';
import commonStyles from '../../common/commonStyles';
import AdgroupList from './adgroup-list';
import {adgroupActions} from '../../actions';
import DayPicker from '../../common/dateRange';
import StatusBox from '../../common/statusBox';
import {adChange} from '../../actions/adgroup';
import {Text,Text1,Text2} from '../../common/AdText';
import {searchSetFilterRangeDate} from '../../actions/searchInfo';

class AdgroupView extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
    }
    //日期选择后以新的日期进行数据请求并存储日期到state中
    sureButtonClick(rangeDate){
        const {dispatch} = this.props;
        const {advertiser,adgroupActions,adgroupState} = this.props;

        //获取选择的日期段
        const startDate=rangeDate.min.format('YYYY-MM-DD').toString();
        const endDate=rangeDate.max.format('YYYY-MM-DD').toString();

        const rangeDateSet={
            startDate:startDate,
            endDate:endDate,
        };
        statistics('获取广告数据时间段选择');
        
        //存储选择时间段，推广计划和广告公用      
        dispatch(searchSetFilterRangeDate(rangeDateSet)); 
        
        let resultWhere=Object.assign(JSON.parse(adgroupState.where),rangeDateSet);
        //重新选择日期,会重新获取推广计划，重置page为1，
        adgroupActions.getAdgroupStart();
        adgroupActions.getAdgroup({
            token:userToken_G,
            uid:advertiser.uid,
            where:JSON.stringify(resultWhere),
        });
    }

    componentDidMount() {
        const {advertiser,adgroupActions,adgroupState} = this.props;
        statistics('广告列表');
        if(!adgroupState.cid){
            adgroupActions.getAdgroup({
                token:userToken_G,
                uid:advertiser.uid,
                where:adgroupState.where,
            });
        }      
    }

    componentWillUnmount() {
      const {adgroupActions} = this.props;
      adgroupActions.adChange()
    }


    handSearch(){
        const {navigator,advertiser,adgroupActions,changeTabItem,searchInfoState,adgroupState} = this.props;
        
        if(navigator){
            navigator.push({
                adSearch:true,
                params:{
                    uid:advertiser.uid,
                    load_ad_source:adgroupActions.load_ad_source,
                    changeTabItem,
                    searchInfoState,
                    adgroupState,
                }
            });
        }
    }
    handFilterCam(){
        const {navigator,advertiser,adgroupState} = this.props;
        navigator.push({
            campaignSelect:true,
            params:{
                uid:advertiser.uid,
                adgroupState
            }
        });
    }

    shouldComponentUpdate(nextProps){
        if(nextProps.changeTabItem==this.props.changeTabItem){
            return true;
        }
        return false;
    }

    render() {
        const {advertiser,navigator,adgroupState,dispatch} = this.props;
        const {filterRangeDate} = this.props.adgroupState;
   
        return (
            <View style={styles.container} >
            <View style={commonStyles.header} >
                <AdsHeader 
                headerName={advertiser.name}
                navigator={navigator} />
                <View style={commonStyles.rightBox} >
                    <TouchableOpacity onPress={this.handSearch.bind(this)} >
                    <Image style={{width:30,height:30}} source={require('../../common/img/icon-search-gray.png')} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[commonStyles.typeBox,{justifyContent:'space-between'}]} >
                <TouchableOpacity onPress={this.handFilterCam.bind(this)} style={styles.camBox} >
                    <Text1 numberOfLines={2} >{adgroupState.cidName}</Text1>
                </TouchableOpacity>
                <DayPicker 
                 border='none'
                 startDate={filterRangeDate.startDate} 
                 endDate={filterRangeDate.endDate} 
                 sureButtonClick={this.sureButtonClick.bind(this)} />
                <StatusBox 
                    dataState={adgroupState} 
                    dispatch={dispatch} 
                    uid={advertiser.uid} 
                    filterType='ad' />
            </View>

            <AdgroupList  
            {...this.props}/>
            </View>
        );
    }
};

function select(state){
    return{
        adgroupState:state.adgroupState,
        searchInfoState:state.searchInfoState,
    };
}
function bindActionsToProps(dispatch){
    return{
      adgroupActions:bindActionCreators(adgroupActions,dispatch)
    };
}
export default  connect(select,bindActionsToProps)(AdgroupView);
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camBox:{
        flex:1,
        height:30,
        justifyContent:'center',
    },
});