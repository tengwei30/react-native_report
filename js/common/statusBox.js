'use strick';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Modal,
    Dimensions,
    TouchableOpacity,
    LayoutAnimation, 
    Platform, 
} from 'react-native';
import AdColor from './AdColor';
import {Text,Text1,Text2} from './AdText';
import {CamStatusTextArray,CamStatusArray,AdStatusTextArray,AdStatusArray} from '../utils';
import {getCampaign,changeCampaignStatus} from '../actions/campaign';
import {changeAdStatus,getAdgroup} from '../actions/adgroup';

const screenWidth=Dimensions.get('window').width;
const screenHeight=Dimensions.get('window').height;

export default class StatusBox extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	visible:false,
	  	transparent:true,
	  };
	}
	_click(){
		this.setState({
			visible:!this.state.visible,
		});
	}
	handlFilter(status){
		const {dispatch,uid,filterType,dataState} = this.props;
		this.setState({
			visible:!this.state.visible,
		});
		
		let resultWhere;
		let tmpWhere = JSON.parse(dataState.where);

		if(status=='{}'){
			delete tmpWhere["status"];
			resultWhere=JSON.stringify(tmpWhere);
		}else{
			resultWhere=JSON.stringify(Object.assign(tmpWhere,{"status":status}));
		}
		
		if(filterType=='campaign'){
			dispatch(changeCampaignStatus(status));
			dispatch(getCampaign({
				token:userToken_G,
				uid:uid,
				where:resultWhere,
			}));
		}else if(filterType=='ad'){

			dispatch(changeAdStatus(status));
			dispatch(getAdgroup({
				token:userToken_G,
				uid:uid,
				where:resultWhere,
			}));
		}
	}
	componentDidMount(){
		LayoutAnimation.easeInEaseOut();
	}
	render(){
		const {visible} = this.state;
		const {filterType,dataState} = this.props;
		let arrowRotate=visible?styles.arrowToTop:styles.arrowToBottm;
		
		const curTypeArray=filterType=='ad'?AdStatusArray:CamStatusArray;

		const curTypeTextArray=filterType=='ad'?AdStatusTextArray:CamStatusTextArray;
		const curStatusIndex=curTypeArray.indexOf(dataState.status);

		return(
			<View style={styles.wraper} >
			    <TouchableOpacity style={styles.statusWrap} onPress={this._click.bind(this)} >		    
			        <Text1 style={styles.typeText} >{curTypeTextArray[curStatusIndex]}</Text1>
			        <Image style={[styles.iconArrow,arrowRotate]} source={require('../tabs/icons/up-arrow.png')} />
			    </TouchableOpacity>

			    <Modal			    
			    visible={this.state.visible}
			    animationType='fade'
			    transparent={this.state.transparent} >
			    	<TouchableOpacity style={styles.bg} onPress={this._click.bind(this)} ></TouchableOpacity>
			    	<View style={styles.wrap} >	
			    		<View style={styles.arrowTop} ></View>	    		
						{
						curTypeTextArray.map((text,i)=>{
							return (
								<ListRow  handlFilter={this.handlFilter.bind(this)} text={text} key={i} filterType={filterType} index={i} />
							);
						})
						}						
			    	</View>
				</Modal>

			</View>
		);
	}
}

class ListRow extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	_onPress(){
		const {handlFilter,index,filterType} = this.props;
		const curTypeArray=filterType=='ad'?AdStatusArray:CamStatusArray;
		handlFilter(curTypeArray[index]);
	}
	render(){
		const {text,index} = this.props;
		return(
			<TouchableOpacity onPress={this._onPress.bind(this)}  style={styles.statusItem} ><Text1 style={{color:'#fff'}} >{this.props.text}</Text1></TouchableOpacity>
		);
	}
}

const styles=StyleSheet.create({
    statusWrap:{
    	flexDirection:'row',
    	paddingLeft:8,
    	paddingRight:8,
    	height:30,
    	alignItems:'center',
    },
    typeText:{
		paddingRight:4,
    },
    iconArrow:{
        width:16,
        height:16,
    },
    arrowToBottm:{
        transform:[
            {rotate:'0deg'},
        ]
    },
    arrowToTop:{
        transform:[
            {rotate:'180deg'},
        ]
    },
    bg:{
		width:screenWidth,
		height:screenHeight,
    },
    arrowTop:{
    	position:'absolute',
    	right:20,
    	top:-16,
    	height:16,
    	borderWidth:8,
    	borderColor:'transparent',
    	borderBottomColor:'#33485D',
    },
    wrap:{
    	width:130,
    	paddingRight:10,
    	paddingLeft:10,
    	backgroundColor:'#33485D',
    	position:'absolute',
    	right:8,
    	top:Platform.OS==='android'?74:96,
    	borderRadius:2,
    },
    statusItem:{
    	height:34,
    	justifyContent:'center',
    	paddingLeft:8,
    	borderBottomWidth:0.5,
    	marginBottom:-0.2,
    	borderBottomColor:'#555',
    }
});