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
import CampaignRow from './campaignRow';
import SearchHeader from '../../common/searchHeader';
import AdColor from '../../common/AdColor';
import {getCampaign,searchCampaignClear} from '../../actions/campaign';

import {Text,Text1} from '../../common/AdText';

 class CampaignSearch extends Component{
 	constructor(props) {
 	  super(props);
 	
 	  this.state = {
 	  	searchKey:'',
 	  	activeIndex:'',
 	  };
 	}

 	handCancel(){
 		const {navigator,dispatch} = this.props;
 		dispatch(searchCampaignClear());
 		this.props.navigator.jumpBack()
 	}

 	//传递给子组件一个设置当前展开项的函数，子组件点击设置activeIndex
 	set_active_item(index){
 	    if(index==this.state.activeIndex) return;
 	    this.setState({
 	        activeIndex:index,
 	    });
 	}

 	searchSubmit(value){
 		this.searchData(value);
 	}

 	handSearch(value){
 		this.searchData(value);
 	}

 	handSimpleBack(data){
 		const {getCidData,navigator,dispatch} = this.props;
 		dispatch(searchCampaignClear());
 		navigator.pop();
 		getCidData(data);
 	}

 	searchData(value){
 		const {dispatch,uid} = this.props;
 		const {filterRangeDate} = this.props.campaignState;
 		const filterWhere=Object.assign({"name":value},{"startdate":filterRangeDate.startDate,"enddate":filterRangeDate.endDate});

 		this.setState({
 			searchKey:value
 		});
 		if(value.length==0){
 			dispatch(searchCampaignClear());
 			return;
 		}

 		dispatch(getCampaign({
 			token:userToken_G,
 			uid:uid,
 			where:JSON.stringify(filterWhere),
 			searchCam:true,
 		}));
 	}

 	componentDidMount(){
 		statistics('推广计划搜索');
 	}

	render(){
		const {shCampaignState,navigator,dispatch,changeTabItem,getCidData,searchInfoState} = this.props;
		const rows=shCampaignState.resultList.map((data,i)=>{
			return (
				<CampaignRow key={i} searchInfoState={searchInfoState} index={i} searchCamEdite={true} activeIndex={this.state.activeIndex} set_active_item={this.set_active_item.bind(this)} navigator={navigator} dispatch={dispatch} handCancel={this.handCancel.bind(this)} changeTabItem={changeTabItem} data={data} />
			);
		});
		
		return (
			<View style={styles.wrap} >
			<SearchHeader 
				handCancel={this.handCancel.bind(this)}
				searchSubmit={this.searchSubmit.bind(this)}
				handSearch={this.handSearch.bind(this)}
				placeholder='请输入推广计划名称'
			 />
			 <View style={styles.resultwrap}
				onStartShouldSetResponderCapture={(e) => {DismissKeyboard()}} >
			 <ScrollView 
			 keyboardDismissMode='on-drag' >
			 {shCampaignState.resultList.length==0&&shCampaignState.showSearchResult?<View style={styles.noData} ><Text>没有匹配的结果</Text></View>:rows}
			 </ScrollView>
			 </View>
			</View>
		);
	}
}
function select (state){
	return {
		shCampaignState:state.shCampaignState,
	}
}

export default connect(select)(CampaignSearch);
const styles=StyleSheet.create({
	wrap:{
		flex:1,
		backgroundColor:AdColor.viewBackground,
	},
    resultwrap:{
    	flex:1,
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
