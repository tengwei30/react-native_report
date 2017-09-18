'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';

export default class SearchButton extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	handClick(){
		this.props.handClick();
	}
	render(){
		const {searching,width,text} = this.props;
		const buttonWidth=width?width:60;
		if(searching||searching==undefined){
			return(
				<TouchableWithoutFeedback  >
				    <View style={[styles.button,styles.buttonFech,{width:buttonWidth}]} >
				    <ActivityIndicator color="#efefef" />
				    <Text style={styles.buttonText} >{text}</Text>
				    </View>
				</TouchableWithoutFeedback>
			);
			
		} else{
			return(
				<TouchableOpacity style={[styles.button,{width:buttonWidth}]} onPress={this.handClick.bind(this)} >
				    <Text style={[styles.buttonText]} >{text}</Text>
				</TouchableOpacity>
			);
		}
	}
}

const styles=StyleSheet.create({
    button:{
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
        fontSize:12,
    }
});