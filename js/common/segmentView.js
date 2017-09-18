'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight,
	Animated,
	Dimensions,
} from 'react-native';

let deviceWidth = Dimensions.get('window').width;

export default class SlidableTabBar extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	selectedTopic: 0,
	  };
	}

	selectTopic(index){
		this.setState({selectedTopic: index});
	}
	renderCenterView(thisView, index){
		if(this.state.selectedTopic === index){
			return thisView;
		}
	}
	renderTabBarOption(title, color, index){
		let actBgColor=(this.state.selectedTopic === index)? '#5aaaea': '#fff';
		let actText=(this.state.selectedTopic === index)? '#fff': '#666';
		return(
			<TouchableOpacity key={index} style={[styles.tabBarOption, {backgroundColor:actBgColor}]}
			onPress={() => this.selectTopic(index)} >
				<Text style={[styles.barText,{color:actText}]}>{title}</Text>
			</TouchableOpacity>
		);
	}
	render() {
		return(
			<View style={{flex:1,marginTop:this.props.top}}>

				<View style={styles.tabBar}>
					{this.props.children.map((child, i) =>{
						return(
							this.renderTabBarOption(child.props.title, child.props.color, i)
						);
					})}
				</View>

				<View style={{flex:1}}>
					{this.props.children.map((child, i) => this.renderCenterView(child, i))}
				</View>

			</View>
		);
	}
};

const styles = StyleSheet.create({
	tabBarOption: {
		//justifyContent: 'center',
		flex:1,
		height:36,
		justifyContent:'center',
		alignItems:'center',
	},
	barText:{
		letterSpacing: 3,
		fontWeight: 'bold',
	},
	tabBar: {
		height:38,
		borderBottomWidth:2,
		flexDirection:'row',
		borderBottomColor:'#5aaaea',
	},
	tabBarSwipeIcon: {
		paddingLeft: 2,
		paddingRight: 2,
		position: 'absolute',
		right: 0,
		height: 43,
		width:28,
		justifyContent: 'center',
		backgroundColor: '#EEEDE7',
	},
});