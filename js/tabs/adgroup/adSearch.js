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
import AdgroupRow from './adgroupRow';
import AdColor from '../../common/AdColor';
import SearchHeader from '../../common/searchHeader';
import {getAdgroup,searchAdClear} from '../../actions/adgroup';

import {Text,Text1} from '../../common/AdText';


 class AdSearch extends Component{
 	constructor(props) {
 	  super(props);
 	
 	  this.state = {
 	  	searchKey:'',
 	  	activeIndex:'',
 	  };
 	}
 	handCancel(){
 		const {navigator,dispatch} = this.props;
 		dispatch(searchAdClear());
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
 		const {getAidData,navigator,dispatch} = this.props;
 		dispatch(searchAdClear());
 		navigator.pop();
 		getAidData(data);
 	}

 	searchData(value){
 		const {dispatch,uid} = this.props;
 		const {filterRangeDate} = this.props.adgroupState;
 		const filterWhere=Object.assign({"name":value},{"startdate":filterRangeDate.startDate,"enddate":filterRangeDate.endDate});
 		this.setState({
 			searchKey:value
 		});
 		if(value.length==0){
 			dispatch(searchAdClear());
 			return;
 		}
 		dispatch(getAdgroup({
 			token:userToken_G,
 			uid:uid,
 			where:JSON.stringify(filterWhere),
 			searchAd:true,
 		}));
 	}

 	componentDidMount(){
 		statistics('广告搜索');
 	}

	render(){
		const {shAdState,navigator,dispatch,load_ad_source,changeTabItem,searchInfoState} = this.props;
		const rows=shAdState.resultList.map((data,i)=>{
			return (
				<AdgroupRow key={i} index={i} activeIndex={this.state.activeIndex} set_active_item={this.set_active_item.bind(this)} navigator={navigator} searchAdEdite={true} dispatch={dispatch} searchInfoState={searchInfoState} handCancel={this.handCancel.bind(this)} changeTabItem={changeTabItem} load_ad_source={load_ad_source} data={data} />
			);
		});

		return (
			<View style={{flex:1}} >
			<SearchHeader 
				handCancel={this.handCancel.bind(this)}
				searchSubmit={this.searchSubmit.bind(this)}
				handSearch={this.handSearch.bind(this)}
				placeholder='请输入广告名称'
			 />
			 <View style={{flex:1}} 
				onStartShouldSetResponderCapture={(e) => {DismissKeyboard()}} >
			 <ScrollView 
			 style={styles.wrap}
			 keyboardDismissMode='on-drag'>
			 	{shAdState.resultList.length==0&&shAdState.showSearchResult?<View style={styles.noData} ><Text>没有匹配的结果</Text></View>:rows}
			 </ScrollView>
			 </View>
			</View>
		);
	}
}

function select (state){
	return {
		shAdState:state.shAdState
	}
}

export default connect(select)(AdSearch);
const styles=StyleSheet.create({
	wrap:{
        backgroundColor:AdColor.viewBackground,
        marginBottom:0,
    },
    resultwrap:{
    	flex:1,
    	paddingLeft:8,
    },
    row:{
    	height:40,
    	paddingLeft:8,
    	borderBottomWidth:1,
    	borderBottomColor:AdColor.borderColor,
    	justifyContent:'center',
    },
    noData:{
    	height:50,
    	justifyContent:'center',
    	alignItems:'center',
    }
});
