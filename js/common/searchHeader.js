'use strict';
import React,{Component} from 'react';
import{
	StyleSheet,
	View,
	Image,
	TextInput,
	StatusBar,
	TouchableOpacity,
} from 'react-native';

import {Text,Text1} from '../common/AdText';
import DismissKeyboard from 'dismissKeyboard';
let timeArr=[];
export default class SearchHeader extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	searchkey:'',
	  	enableSearch:true,
	  };
	}

	handCancel(){
		DismissKeyboard();
		this.setState({
			enableSearch:false,
		});
		this.props.handCancel();
	}

	searchSubmit(){
		this.props.searchSubmit(this.state.searchkey);
	}

	handSearch(value){
		
		const {handSearch,filter} = this.props;
		let timer=null;
		let keyWord=value.trim();
		this.setState({
			searchkey:keyWord,
		});
		if(!this.state.enableSearch) return;
		//如果是前端过滤直接执行
		if(filter){
			handSearch(keyWord);
			return;
		}

		for(let i=0; i<timeArr.length; i++){
			clearTimeout(timeArr[i]);
		}

		timeArr.length=0;

		if(keyWord.length==0){
			if(handSearch){
				handSearch(keyWord);
			}
			return;
		}

		timer=setTimeout(()=>{
			if(handSearch){
				handSearch(keyWord);
			}
		},1000);
		timeArr.push(timer);
	}

	componentWillReceiveProps(nextProps){
		const {count} = this.props;

		if(count<nextProps.count){
			this.setState({
				searchkey:'',
			});
		}
	}

	shouldComponentUpdate(){
		return true;
	}

	render(){
		const {placeholder,hidden,autoFocus} = this.props;
		
		const focus=(autoFocus==undefined)?true:autoFocus;

		return (
			<View>
				<View style={styles.header} >
					<View style={styles.lt} >
						<View style={styles.searchWrap} >
						<Image  
		                  source={require('./img/icon-search-gray.png')} 
		                   style={styles.searchIcon}/>
						<TextInput
						autoCapitalize='none' 
						autoCorrect={false}
						returnKeyType='search'
						enablesReturnKeyAutomatically={true}
						clearButtonMode='while-editing'
						onSubmitEditing={this.searchSubmit.bind(this)}
						placeholderTextColor='#ccc'
						style={styles.searchInput} 
						placeholder={placeholder} 
						underlineColorAndroid = "transparent"
						autoFocus={focus}
						defaultValue={this.state.searchkey}
						onChangeText={(value)=>{
							this.handSearch(value)
							}}
						/>
						</View>
					</View>
					<TouchableOpacity 
					style={styles.cancel}
					onPress={this.handCancel.bind(this)} >
						<Text style={{color:'#fff'}} >取消</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}


const styles=StyleSheet.create({
	header:{
		flexDirection:'row',
		height:60,
		paddingLeft:10,
		paddingRight:10,
		backgroundColor: '#283a49',
		paddingTop:10,
		alignItems:'center',
		justifyContent:'center',
	},
	searchIcon: {
        position:'absolute',
        left:8,
        top:4,
        width:20,
        height:20,
    },
    lt:{
    	flex:1,
    	height:26,
        justifyContent:'center',
    },
    searchWrap:{
    	flex:1,
        justifyContent:'center',
        backgroundColor:'#515e67',
        borderWidth:1,
        borderColor:'#364451',
        borderRadius:13,
    },
	searchInput: {
        fontSize: 12,
        height: 40,
        paddingLeft:6,
        marginLeft:28,
        color:'#fff',
    },
    resultwrap:{
    	padding:12,
    },
    row:{
    	height:28,
    	paddingLeft:6,
    	borderBottomWidth:1,
    	borderBottomColor:'#ccc',
    	justifyContent:'center',
    },
    cancel:{
    	width:60,
    	height:40,
    	justifyContent:'center',
    	alignItems:'center',
    }
});
