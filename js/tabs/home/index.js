'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    StatusBar,
    InteractionManager,
    Platform,
} from 'react-native';

import {connect} from 'react-redux';
import DayPicker from '../../common/dateRange'
import AdsHeader from '../header';
import commonStyles from '../../common/commonStyles';
import LoadPage from '../../common/loadPage';
import DataChart from '../data/dataChart';
import {normalize} from '../../utils';
import {home,hourReport,getHomeStart,chartDateChange,homeSetDateRange} from '../../actions/home';
import {getAllCampaign} from '../../actions/campaign';
import {Heading3,Heading2,Text2,Text} from '../../common/AdText';
import AdColor from '../../common/AdColor';

class HomeView extends Component {

    sureButtonClick(rangeDate){
        const {advertiser,dispatch} = this.props;
        //获取选择的日期段
        const startDate=rangeDate.min.format('YYYY-MM-DD');
        const endDate=rangeDate.max.format('YYYY-MM-DD');
        //数据统计函数
        statistics('home页小时报表');
        dispatch(homeSetDateRange({
            startDate:startDate,
            endDate:endDate,
        }));

        dispatch(hourReport({
            token:userToken_G,
            uid:advertiser.uid,
            time_range:JSON.stringify({"start_date":startDate,"end_date":endDate}),
        })); 
    }

    componentDidMount() {
        const {advertiser,dispatch} = this.props;
        InteractionManager.runAfterInteractions(()=>{
            //数据统计函数
            statistics('home');
            dispatch(getHomeStart());
            dispatch(home({
                token:userToken_G,
                uid:advertiser.uid,
            }));
            //获取该广告主下所有的推广计划
            dispatch(getAllCampaign({
                token:userToken_G,
                uid:advertiser.uid,
                fields:'["cid","name","uid"]'
            }));
        });      
    }

    render() {

    const {chartDataArr,defaultDataArr,envHourDate,xLabels,selectTab} = this.props.homeState;  
    const {navigator,advertiser,homeState,dispatch} = this.props;
    if(!homeState.clearInof&&Platform.OS==='ios'){
        StatusBar.setNetworkActivityIndicatorVisible(!homeState.loaded);
    }


    return (
        <View style={styles.wrap} >
            <View style={commonStyles.header} >
                <AdsHeader navigator={navigator} headerName={advertiser.name}/>
            </View>

            <ScrollView style={styles.scrollview}>
                <View style={[styles.header]} >
                    <View style={[styles.titleRow,{flex:4}]} >
                        <View style={[styles.titleLeft,styles.colCenter,styles.rowCenter]} >
                            <Image source={require('../icons/icon-cash.png')} />
                        </View>
                        <View style={styles.titleRight} >
                            <View style={[styles.row,styles.colCenter]} >
                              <Heading3>现金账户(元)</Heading3>
                            </View>
                            <View style={{flex:1,justifyContent:'center'}} >
                            <Heading2 style={styles.cashAccount} >{homeState.homeInfo.balance}</Heading2>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.titleRow,{flex:6}]} >
                        <View style={[styles.titleLeft,styles.colCenter,styles.rowCenter]} >
                            <Image source={require('../icons/icon-all-ad.png')} />
                        </View>
                        <View style={styles.titleRight} >
                            <View style={[styles.row,styles.colCenter]} >
                                <Heading3>广告统计</Heading3>
                            </View>

                            <View style={styles.row} >
                                <View  style={[styles.row,styles.colCenter]} >
                                    <Text2>待审核:</Text2>
                                    <Text2>{homeState.homeInfo.pending}</Text2>
                                </View>
                                <View style={[styles.row,styles.colCenter]}>
                                    <Text2>今日更新:</Text2>
                                    <Text2>{homeState.homeInfo.update}</Text2>
                                </View>
                            </View>

                            <View style={[styles.row,styles.colCenter]} >
                                <View style={styles.row}>
                                    <Text2>未通过:</Text2>
                                    <Text2>{homeState.homeInfo.unpassed}</Text2>
                                </View>
                                <View style={[styles.row,styles.colCenter]} >
                                    <Text2>有效广告:</Text2>
                                    <Text2>{homeState.homeInfo.valid}</Text2>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>

                <View style={[styles.dataTitle]} >
                    <View style={[{flex:1},styles.rowCenter]} >
                        <Heading2>整体情况</Heading2>
                    </View>
                    <View style={styles.dateWrap} >
                        <DayPicker
                        startDate={envHourDate.startDate}
                        endDate={envHourDate.endDate}
                        sureButtonClick={this.sureButtonClick.bind(this)}/>
                    </View>
                </View>

                <DataChart
                    chartDataArr={chartDataArr}
                    defaultDataArr={defaultDataArr}
                    dispatch={dispatch}
                    xLabels={xLabels}
                    setStep={3}
                    selectTab={selectTab}
                    uid={advertiser.uid} 
                    fetchFn={hourReport}
                    startDate={envHourDate.startDate}
                    endDate={envHourDate.endDate}
                    switchFn={chartDateChange}/>
            </ScrollView>
        </View>
    );
    }
};

function select(state){
    return{
        homeState:state.homeState,
    };
}
export default connect(select)(HomeView);

const styles = StyleSheet.create({
    wrap:{
        flex:1,
        backgroundColor:'#fff',
    },
    scrollview:{
        flex:1,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        paddingBottom:10,
    },
    row:{
        flex:1,
        flexDirection:'row',
    },
    header:{
      height:54,
      flexDirection:'row',
      marginTop:normalize(10),
      marginBottom:normalize(20),
    },
    titleRow:{
        flexDirection:'row',
    },
    titleLeft:{
        width:40,
    },
    titleRight:{
        flex:1,
        height:50,
        paddingLeft:6,
    },
    cashAccount:{
        color:AdColor.lightRed,
    },
    dateWrap:{
        alignItems:'flex-end',
        flex:2,
        justifyContent:'center',
    },
    dataContent: {
        paddingTop:normalize(12),
    },
    dataTitle:{
      flexDirection:'row',
      height:40,
      paddingBottom:normalize(12),
      justifyContent:'center',
      borderBottomColor:AdColor.borderColor,
      borderBottomWidth:1,
    },
    colCenter:{
      alignItems:'center',
    },
    rowCenter:{
      justifyContent:'center',
    },
});
