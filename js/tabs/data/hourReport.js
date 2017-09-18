'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    LayoutAnimation,
} from 'react-native';

import {connect} from 'react-redux';
import moment from 'moment';
import DayPicker from '../../common/dateRange';
import SelectBox from '../../common/selectBox';
import SearchButton from '../../common/searchButton';
import ToTopButton from '../../common/toTop';
import DataChart from './dataChart';
import DataTable from './dataTable';
import {hChartChange,hourReport,hChartStart,hChartClear,hChartSort} from '../../actions/home';

import {searchSetRangeDate} from '../../actions/searchInfo';

class HourReaport extends Component{
    constructor(props) {
      super(props);
    
      this.state = {
        bottom:-60,
      };
    }
    sureButtonClick(rangeDate){  
        const {dispatch} = this.props; 

        dispatch(searchSetRangeDate({
            startDate:rangeDate.min.format('YYYY-MM-DD'),
            endDate:rangeDate.max.format('YYYY-MM-DD'),
        }));    

    }
    handQuery(){
        const {dispatch,advertiser} = this.props;

        const {curCid,curAid,dataRangeDate} = this.props.searchInfoState;
        statistics('小时报表');
        dispatch(hChartStart());
        dispatch(hourReport({
            token:userToken_G,
            uid:advertiser.uid,
            h_chart:true,
            cid:curCid,
            aid:curAid,
            time_range:'{"start_date":"'+dataRangeDate.startDate+'","end_date":"'+dataRangeDate.endDate+'"}',
        }));
    }
    //排序action
    handReportSort(key,ascending){
        const {dispatch} = this.props;
        dispatch(hChartSort(key,ascending));
    }
    componentWillUnmount(){
        const {dispatch} = this.props;
        dispatch(hChartClear());
    }
    componentDidMount(){
        statistics('小时报表');
    }
    _onTopClick(){
        this.refs.dataScroll.scrollTo({y:0,animated:true})
    }
    handlScroll(e){
        let ev=e.nativeEvent;
        let scrollTop=ev.contentOffset.y;
        LayoutAnimation.spring();

        if(scrollTop>120){
            if(this.state.bottom==20) return;
            this.setState({
                bottom:20,
            });
        }else{
            if(this.state.bottom==-60) return;
            this.setState({
                bottom:-60
            });
        }
    }
    shouldComponentUpdate(nextProps){
        if(nextProps.dataChartState.enterTimes!=this.props.dataChartState.enterTimes){
            this._onTopClick();
        }
        return true;
    }

    render(){

        const {chartDataArr,defaultDataArr,searching,hourReportList,xLabels,selectTab,} = this.props.hourReportState;
        
        const {dispatch,advertiser,searchInfoState,dataChartState}= this.props;

        const {curCid,curAid,dataRangeDate} = this.props.searchInfoState; 

        return(
            <View style={{flex:1}} >
            <ScrollView ref='dataScroll' scrollEventThrottle={100} onScroll={this.handlScroll.bind(this)} style={styles.pageWrap} >

                <SelectBox {...this.props}  />

                <View style={styles.conditionBox} >           
                    <DayPicker 
                    startDate={dataRangeDate.startDate}
                    endDate={dataRangeDate.endDate}
                    sureButtonClick={this.sureButtonClick.bind(this)} />
                    <SearchButton text='查询' handClick={this.handQuery.bind(this)} searching={searching} 
                     />
                </View>

                <DataChart
                chartDataArr={chartDataArr}
                defaultDataArr={defaultDataArr}
                dispatch={dispatch}
                jumpChartLoad={curCid==0&&curAid==0}
                h_chart={true}
                xLabels={xLabels}
                setStep={3}
                selectTab={selectTab}
                fetchFn={hourReport}
                searchInfoState={searchInfoState}
                switchFn={hChartChange}
                startDate={dataRangeDate.startDate}
                endDate={dataRangeDate.endDate}
                uid={advertiser.uid} />
                
                <DataTable 
                dataType={{type:'时间',key:'hour'}}
                handReportSort={this.handReportSort.bind(this)}
                summarryArr={defaultDataArr} 
                dataList={hourReportList}
                /> 
                            
            </ScrollView>
            <ToTopButton _onTopClick={this._onTopClick.bind(this)} bottom={this.state.bottom} />
            </View> 
        );
    }
}

function select (state){
    return{
        hourReportState:state.hourReportState,
        searchInfoState:state.searchInfoState,
    }
}

export default connect(select)(HourReaport);

const styles=StyleSheet.create({
	pageWrap:{
	    padding:10,
	    shadowColor:'#666',
	    shadowOffset:{
	        width:1,
	        height:1,
	    },
	    shadowOpacity:1,
	    shadowRadius:3,
	},
	conditionBox:{
	    height:30,
        marginBottom:6,
	    flexDirection:'row',
	    alignItems:'center',
	    justifyContent:'space-between',
	},
    button:{
        width:60,
        height:26,
        borderRadius:4,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#40c5fc',
    },
    buttonFech:{
        flexDirection:'row',
        backgroundColor:'#ccc'
    },
    buttonText:{
        color:'#fff',
    },
});