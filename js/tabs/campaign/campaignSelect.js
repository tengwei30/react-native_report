'use strict';
import React,{Component} from 'react';
import{
	StyleSheet,
	View,
	Image,
	TextInput,
	StatusBar,
	ScrollView,
	TouchableOpacity,
} from 'react-native';

import DismissKeyboard from 'dismissKeyboard';
import {connect} from 'react-redux';
import SearchHeader from '../../common/searchHeader';
import AdColor from '../../common/AdColor';
import {initFilterCampaign,filterCampaign} from '../../actions/campaign';
import {getSelectAllAd,campaignToAd,getAdgroup} from '../../actions/adgroup';

import {Text,Text1} from '../../common/AdText';

 class CampaignSelect extends Component{
 	constructor(props) {
 	  super(props);
 	
 	}

 	handCancel(){
 		const {navigator,dispatch} = this.props;
 		dispatch(initFilterCampaign());
 		navigator.jumpBack();
 	}

 	searchSubmit(value){
 		this.filterDate(value);
 	}

 	handSearch(value){
 		this.filterDate(value);
 	}

 	handSimpleBack(data){
 		const {dispatch,getAdSimpleList,navigator,adgroupState} = this.props;

 		if(getAdSimpleList){
 			//如果是报表页选中推广计划
 			dispatch(getSelectAllAd({
	 			token:userToken_G,
	 			uid:data.uid,
	 			campaignInfo:data,
	 			where:JSON.stringify({"cid":data.cid}),
 			}));
 		}else{
 			//如果是广告页选中推广计划
 			let  filterWhere;
 			let tmpWhere=JSON.parse(adgroupState.where);

 			if(data.cid){
 				 filterWhere=Object.assign(tmpWhere,{"cid":data.cid});
 			}else{
 				delete tmpWhere["cid"];
 				filterWhere=tmpWhere;
 			}
 			
 			dispatch(campaignToAd(data.cid,data.name));
 			dispatch(getAdgroup({
 			    token:userToken_G,
 			    uid:data.uid,
 			    where:JSON.stringify(filterWhere),
 			}));
 			dispatch(initFilterCampaign());
 			navigator.pop();
 		}
 	}

 	filterDate(value){
 		const {dispatch,selectCampaignState} = this.props;

 		let filterResult =selectCampaignState.allCampaignList.filter((data)=>{
 			return data.name.toLowerCase().indexOf(value)>=0 || data.cid.toString().indexOf(value)>=0;
 		});
 		dispatch(filterCampaign(filterResult));

 	}

 	componentDidMount(){
 		statistics('推广计划筛选');
 	}

	render(){
		const {selectCampaignState,getAdSimpleList,uid} = this.props;
		const simpleRows=selectCampaignState.filterList.map((data,i)=>{
			return (
				<TouchableOpacity style={styles.row} key={i} onPress={this.handSimpleBack.bind(this,data)} data={data} index={i} >
					<Text1 style={styles.resultText} >Id:{data.cid} >{data.name}</Text1>
				</TouchableOpacity>
			);
		});
		
		return (
			<View style={styles.wrap} >
			<SearchHeader 
				handCancel={this.handCancel.bind(this)}
				searchSubmit={this.searchSubmit.bind(this)}
				handSearch={this.handSearch.bind(this)}
				filter={true}
				placeholder='推广计划名称或Id'
			 />
			 <View style={styles.resultwrap}
				onStartShouldSetResponderCapture={(e) => {DismissKeyboard()}} >
			 <ScrollView 
			 keyboardDismissMode='on-drag' >
			 {(selectCampaignState.filterList.length>0&&!getAdSimpleList)&&<TouchableOpacity 
			 	style={styles.row} onPress={this.handSimpleBack.bind(this,{cid:0,name:'全部',uid:uid})} ><Text1>全部</Text1></TouchableOpacity>}
			 {selectCampaignState.filterList.length==0?<View style={styles.noData} ><Text1>没有匹配的结果</Text1></View>:simpleRows}
			 </ScrollView>
			 </View>
			</View>
		);
	}
}
function select (state){
	return {
		selectCampaignState:state.selectCampaignState,
	}
}

export default connect(select)(CampaignSelect);

const styles=StyleSheet.create({
	wrap:{
		flex:1,
		backgroundColor:'#fff',
	},
    resultwrap:{
    	flex:1,
    	paddingLeft:8,
    },
    row:{
    	height:40,
    	paddingLeft:12,
    	borderBottomWidth:1,
    	borderBottomColor:AdColor.borderColor,
    	justifyContent:'center',
    },
    resultText:{
		color:'#444',
		fontSize:14,
    },
    noData:{
    	height:50,
    	justifyContent:'center',
    	alignItems:'center',
    }
});
