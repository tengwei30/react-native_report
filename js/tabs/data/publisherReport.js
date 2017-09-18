'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    LayoutAnimation,
} from 'react-native';

import {connect} from 'react-redux';
import moment from 'moment';
import DayPicker from '../../common/dateRange';
import SearchButton from '../../common/searchButton';
import ToTopButton from '../../common/toTop';
import DataChart from './dataChart';
import DataTable from './dataTable';
import SelectBox from '../../common/selectBox';
import {publisherChartChange,publisherReport,publisherChartStart,publisherChartClear,publisherReportSort} from '../../actions/publisherReport';
import {searchSetRangeDate} from '../../actions/searchInfo';

class PublisherReaport extends Component{
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
        statistics('媒体报表');
        dispatch(publisherChartStart());
        dispatch(publisherReport({
            token:userToken_G,
            uid:advertiser.uid,
            cid:curCid,
            aid:curAid,
            time_range:'{"start_date":"'+dataRangeDate.startDate+'","end_date":"'+dataRangeDate.endDate+'"}',
        }));
    }
      //排序action
    handReportSort(key,ascending){
        const {dispatch} = this.props;
        dispatch(publisherReportSort(key,ascending));
    }

    componentWillUnmount(){
        const {dispatch} = this.props;
        dispatch(publisherChartClear());
    }
    componentDidMount(){
        statistics('媒体报表');
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
    render(){

        const {chartDataArr,defaultDataArr,searching,publisherReportList,xLabels,selectTab} = this.props.publisherReportState;
        const {dispatch,advertiser,searchInfoState}= this.props;
        const {dataRangeDate} = this.props.searchInfoState;
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
                searchInfoState={searchInfoState}
                xLabels={xLabels}
                selectTab={selectTab}
                fetchFn={publisherReport}
                switchFn={publisherChartChange}
                startDate={dataRangeDate.startDate}
                endDate={dataRangeDate.endDate}
                uid={advertiser.uid} />

                <DataTable 
                dataType={{type:'媒体',key:'pub_name'}}
                handReportSort={this.handReportSort.bind(this)}
                summarryArr={defaultDataArr} 
                dataList={publisherReportList}
                />              
            </ScrollView>
            <ToTopButton _onTopClick={this._onTopClick.bind(this)} bottom={this.state.bottom} />
            </View>
        );
    }
}

function select (state){
    return{
        searchInfoState:state.searchInfoState,
        publisherReportState:state.publisherReportState,
    }
}

export default connect(select)(PublisherReaport);

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