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
import {InitfilterSelectAd,filterSelectAd} from '../../actions/adgroup';

import {Text,Text1} from '../../common/AdText';


 class AdSelect extends Component{
 	constructor(props) {
 	  super(props);
 	}
 	handCancel(){
 		const {navigator,dispatch} = this.props;
 		dispatch(InitfilterSelectAd());
 		navigator.pop()
 	}

 	searchSubmit(value){
 		this.filterData(value);
 	}

 	handSearch(value){
 		this.filterData(value);
 	}

 	handSimpleBack(data){
 		const {getAidData,navigator,dispatch} = this.props;
 		dispatch(InitfilterSelectAd());
 		navigator.pop();
 		getAidData(data);
 	}

 	filterData(value){
 		const {dispatch,selectAdState} = this.props;

 		let filterResult=selectAdState.allAdList.filter((data)=>{
 			return data.name.toLowerCase().indexOf(value)>=0 || data.aid.toString().indexOf(value)>=0;
 		});
 		dispatch(filterSelectAd(filterResult));
 	}

 	componentDidMount(){
 		statistics('广告搜索');
 	}

	render(){
		const {selectAdState,navigator,dispatch} = this.props;

		const simpleRows=selectAdState.filterList.map((data,i)=>{
			return (
				<TouchableOpacity style={styles.row} key={i} onPress={this.handSimpleBack.bind(this,data)} data={data} index={i} >
					<Text1>Id:{data.aid} >{data.name}</Text1>
				</TouchableOpacity>
			);
		});

		return (
			<View style={{flex:1}} >
			<SearchHeader 
				handCancel={this.handCancel.bind(this)}
				searchSubmit={this.searchSubmit.bind(this)}
				handSearch={this.handSearch.bind(this)}
				filter={true}
				placeholder='广告名称或Id'
			 />
			 <View style={styles.resultwrap} 
				onStartShouldSetResponderCapture={(e) => {DismissKeyboard()}} >
			 <ScrollView 
			 style={styles.wrap}
			 keyboardDismissMode='on-drag'>
			 	{selectAdState.filterList.length==0?<View style={styles.noData} ><Text1>没有匹配的结果</Text1></View>:simpleRows}
			 </ScrollView>
			 </View>
			</View>
		);
	}
}

function select (state){
	return {
		selectAdState:state.selectAdState
	}
}

export default connect(select)(AdSelect);
const styles=StyleSheet.create({
	wrap:{
        marginBottom:0,
        backgroundColor:'#fff',
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
