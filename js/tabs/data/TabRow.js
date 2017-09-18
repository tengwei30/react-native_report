'use strick';
import React,{Component} from 'react';
import {
	View,
	StyleSheet,
} from 'react-native';

import {Text2} from '../../common/AdText';
import AdColor from '../../common/AdColor';
import {normalize,numFormat} from '../../utils';

export default class TabRow extends Component{
	_onClick(){
		this.props._onClick(this.props.id);
	}
	render(){
		const {selectTab,id,defaultDataArr} = this.props;
		let bg=selectTab==id?styles.act:'';
		let resultArray=[numFormat(defaultDataArr[0],0),numFormat(defaultDataArr[1],0),defaultDataArr[2],numFormat(defaultDataArr[3])];
		let textStyle=selectTab==id?styles.actText:{};
		return(
			<View ref={(wrap)=>this.wrap=wrap}
			style={[styles.dataCell,bg]} >
				<View
				style={{flex:1,padding:normalize(6)}}
				key={this.props.id}
				onTouchStart={ this._onClick.bind(this)} >
				    <View style={styles.dataCellAlign} ><Text2 style={textStyle} >{this.props.text}</Text2></View>
				    <View style={styles.dataCellAlign} ><Text2 style={textStyle} >{resultArray[this.props.id]}</Text2></View>
				</View>
			</View>
		);
	}
}
const styles=StyleSheet.create({
	    dataCell:{
	        flex:1,
	        flexDirection:'row',
	        borderWidth:1,
	        marginRight:normalize(4),
	        backgroundColor:'#efefef',
	        borderColor:AdColor.borderColor,
	        justifyContent:'space-between'
	    },
	    dataCellAlign:{
	        flex:1,
	        paddingBottom:normalize(6),
	        justifyContent:'center',
	    },
	    actText:{
	    	color:'#fff',
	    },
		act:{
			backgroundColor:'#5aaaea',
		},
});
