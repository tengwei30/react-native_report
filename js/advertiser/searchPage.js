'use strict';
import React,{Component} from 'react';
import{
	StyleSheet,
	View,
	TouchableOpacity,
	ScrollView,
	TextInput,
	Image,
	AsyncStorage,
} from 'react-native';

import {
	ADVERTISER_SEARCH_HISTORY_LIST,
} from '../api';

import DismissKeyboard from 'dismissKeyboard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {shAdtiserActions} from '../actions';
import SearchHeader from '../common/searchHeader';
import AdColor from '../common/AdColor';

import {Text,Text1} from '../common/AdText';

class SearchPage extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	count:0,
	  };
	}
	handCancel(){
		const {navigator,shAdtiserDpActions} = this.props;
		shAdtiserDpActions.searchAdvertiserClear();
		this.props.navigator.jumpBack();
	}

	searchSubmit(value){
		const {shAdtiserDpActions} = this.props;
		shAdtiserDpActions.searchAdvertiser({
			token:userToken_G,
			where:'{"name":"'+value+'"}',
		});
	}

	componentDidMount(){
		statistics('广告主搜索');
	}

	handSearch(value){		

		const {shAdtiserDpActions} = this.props;
		let key=value.trim();
		if(key.length==0){
			shAdtiserDpActions.searchAdvertiserClear();
			return;
		}
		shAdtiserDpActions.searchAdvertiser({
			token:userToken_G,
			where:'{"name":"'+key+'"}',
		});
	}

	jumpInfo(data){

		const { navigator,shAdtiserDpActions,shAdvertiserState} = this.props;
		//添加搜索记录
		shAdtiserDpActions.addAdvertiserHistoryList(shAdvertiserState.historyList,data);
		//让SearchHeader组件每次接收到一个+1的值来清除搜索框里的值
		this.setState({
			count:this.state.count+1,
		});
        if(navigator) {
            navigator.push({
                adverDetail: true,
                params: {
                    advertiser: data,
                },
            })
        }
	}

	clearHistory(){
		const {shAdtiserDpActions} = this.props;
		shAdtiserDpActions.clearAdvertiserHistoryList();
		//从本地存储也删除历史记录
		AsyncStorage.removeItem(ADVERTISER_SEARCH_HISTORY_LIST);
	}

	render(){
		const {shAdvertiserState,shAdtiserDpActions} = this.props;
		//搜索结果rows
		const rows=shAdvertiserState.resultList.map((data,ii)=>{
		return (
			<TouchableOpacity style={styles.row} uid={data.uid} key={ii} onPress={this.jumpInfo.bind(this,data)} >
				<Text>{data.name}</Text>
			</TouchableOpacity>
			);
		});
		//历史记录rows
		const historyRows=shAdvertiserState.historyList.map((data,ii)=>{
		return (
			<TouchableOpacity style={styles.row} uid={data.uid} key={ii} onPress={this.jumpInfo.bind(this,data)} >
				<Image style={styles.historyIcon} source={require('../img/history.png')} />
				<Text>{data.name}</Text>
			</TouchableOpacity>
			);
		});

		const clearHistoryRow=
			<TouchableOpacity style={[styles.row,{alignItems:"center",justifyContent:'center'}]} onPress={this.clearHistory.bind(this)} >
					<Text>清除搜索记录</Text>
				</TouchableOpacity>;

		//判断是否显示搜索结果
		let showResult=shAdvertiserState.resultList.length==0&&shAdvertiserState.showSearchResult;
		//判断是够显示历史记录
		let showHistory=shAdvertiserState.resultList.length==0&&!shAdvertiserState.showSearchResult&&shAdvertiserState.historyList.length>=1;

		return (
			<View style={{flex:1}} >
			<SearchHeader 
				count={this.state.count}
				searching={shAdvertiserState.searching}
				handCancel={this.handCancel.bind(this)}
				searchSubmit={this.searchSubmit.bind(this)}
				handSearch={this.handSearch.bind(this)}
				placeholder='请输入广告主名称'
			 />
			<View style={{flex:1}}
			onStartShouldSetResponderCapture={(e) => {
						DismissKeyboard()}}
			 >
			 <ScrollView style={styles.resultwrap}
			 keyboardDismissMode='on-drag' 
			 keyboardShouldPersistTaps={true} >
			 {showResult?<View style={styles.noData} ><Text>没有匹配的广告主</Text></View>:rows}
			 {showHistory&&historyRows}
			 {showHistory&&clearHistoryRow}
			 </ScrollView>
			 </View>
			 </View>
		);
	}
}
function select (state){
	return {
		shAdvertiserState:state.shAdvertiserState
	}
}
function bindActionsToProps(dispatch){
	return { 
		shAdtiserDpActions:bindActionCreators(shAdtiserActions,dispatch)
	};
}
export default connect(select,bindActionsToProps)(SearchPage);
const styles=StyleSheet.create({
    resultwrap:{
    	flex:1,
    	paddingLeft:8,
    	backgroundColor:'#fff',
    },
    row:{
    	height:40,
    	paddingLeft:8,
    	borderBottomWidth:1,
    	borderBottomColor:AdColor.borderColor,
    	alignItems:'center',
    	flexDirection:'row',
    },
    historyIcon:{
    	width:22,
    	height:22,
    	marginRight:8,
    },
    noData:{
    	height:50,
    	justifyContent:'center',
    	alignItems:'center',
    }
});
