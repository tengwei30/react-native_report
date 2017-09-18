'use strick';
import React,{Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	Modal,
	TouchableOpacity,
	Dimensions,
	DatePickerIOS,
} from 'react-native';

import {DateFormat} from '../utils';

const modalWidth=280;
const modalHeight=246;

const modalLeft=(Dimensions.get('window').width-modalWidth)/2
const modalTop=(Dimensions.get('window').height-modalHeight)/2

const styles=StyleSheet.create({
	modalWrap:{
		flex:1,
		alignItems:'center',
		justifyContent:'center',
	},
	modal:{
		position:'absolute',
		left:modalLeft,
		top:modalTop,
		height:modalHeight,
		width:modalWidth,
		borderRadius:10,
		alignItems:'center',
		backgroundColor:'#fff',
	},
	modalbutton:{
		flex:1,
		height:200,
		alignSelf:'stretch',
		backgroundColor:'rgba(0,0,0,0.5)',
	},
	sureButton:{
		width:80,
		height:24,
		alignItems:'center',
		justifyContent:'center',
		borderColor:'#ccc',

	},
});

export default class DatePicer extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	date:this.props.date,
	  	tmpDate:this.props.date,
	  	timeZoneOffsetInHours:(-1) * (new Date()).getTimezoneOffset() / 60,
	  	animationType:'fade', //
	  	transparent:true,
	  };
	}

	static defaultProps={
		maxDate:new Date(),
	}
	
	hideDatePicer(){
		this.setState({
			tmpDate:this.state.date,
		});
		this.props.toggleDatePicker();
	}
	dateChange(date){
		this.setState({
			tmpDate:date
		});
	}
	handChange(){
		let realDate=this.state.date.getTime();
		let TmpDate=this.state.tmpDate.getTime();
		
		if(realDate != TmpDate){
			this.setState({
				date:this.state.tmpDate,
			});
			this.props.sureSelect(this.state.tmpDate)
		}
		this.props.toggleDatePicker();
	}
	render(){
		return (
				<Modal
					visible={this.props.visible}
					animated={this.state.animated}
					transparent={this.state.transparent}
					>
						<View style={styles.modalWrap} >
						<TouchableOpacity style={styles.modalbutton} 
							onPress={this.hideDatePicer.bind(this)} >
						</TouchableOpacity>
						<View style={styles.modal } >
							<DatePickerIOS 
								date={this.state.tmpDate}
								onDateChange={this.dateChange.bind(this)} 
								mode="date"
								maximumDate={this.props.maxDate}
								timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours*60} />
								
								<TouchableOpacity
								onPress={this.handChange.bind(this)} >
								<View style={styles.sureButton} >
									<Text>确定</Text>
								</View>
								</TouchableOpacity>

						</View>
						</View>
				</Modal>
		);
	}
}
