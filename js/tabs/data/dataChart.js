'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    StatusBar,
    InteractionManager,
} from 'react-native';

import TabRow from './TabRow';
import BarChart from '../../common/chart';
import {normalize} from '../../utils';
import {Heading3,Heading2,Text2,Text} from '../../common/AdText';
import AdColor from '../../common/AdColor';

import moment from 'moment';

export default class DataChart extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
          typearr:['展示数(次)','点击数(次)','点击率(%)','消耗(元)'],
          startDate:this.props.startDate,
          endDate:this.props.endDate,
      };
	}
	componentDidMount() {
		const {dispatch,uid,h_chart,fetchFn,jumpChartLoad} = this.props;
		const {curCid,curAid} = this.props.searchInfoState?this.props.searchInfoState:{curCid:0,curAid:0};
		if(jumpChartLoad==undefined||jumpChartLoad){
		dispatch(fetchFn({
	            token:userToken_G,
	            uid:uid,
	            cid:curCid,
	            aid:curAid,
	            h_chart:h_chart,
	            start_date:this.state.startDate,
	            end_date:this.state.endDate,
	            time_range:'{"start_date":"'+this.state.startDate+'","end_date":"'+this.state.endDate+'"}',
        	}));
		}	
	}
	_onClick(value){
		const {dispatch,switchFn} = this.props;
	    dispatch(switchFn(parseInt(value)));
	}
	render(){

		const {chartDataArr,defaultDataArr,xLabels,type,setStep,selectTab} = this.props;

		let chartType=type?type:'bar';
		const chartData = 
		    {	
		    	xLabelText:xLabels,
		        chartHeight:230,
		        data:chartDataArr,
		    };
		if(setStep){
			Object.assign(chartData,{setStep:setStep});
		}
		const Tabrows=this.state.typearr.map((data,ii)=>{
		    return (
		        <TabRow _onClick={this._onClick.bind(this)} key={ii} text={data}  id={ii} defaultDataArr={defaultDataArr}  selectTab={selectTab}  />
		    );
		});
		return(
			<View style={{flex:1}} >
				<View style={styles.dataBox} >
				{Tabrows}
				</View>
				
				<BarChart 
				chartData={chartData}
				style={styles.chartContainer} />
		
			</View>
		);
	}
}

const styles = StyleSheet.create({

    dataBox:{
        flexDirection:'row',
        marginTop:normalize(12),
        marginBottom:normalize(12),
        justifyContent:'space-around',
    },
    chartWrap:{
        flex:1,
        alignItems:'center',
        height:160,
        paddingTop:normalize(14),
    },
    chartContainer:{
        flex: 1,
        width:320,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'transparent'
    },
});