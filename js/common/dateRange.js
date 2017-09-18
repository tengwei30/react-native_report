'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Modal,
} from 'react-native';
import moment from 'moment';
import Calendar from '../calendar/calendar';
import AdColor from './AdColor';

const ScreenWidth=Dimensions.get('window').width;
const ScreenHeight=Dimensions.get('window').height;

export default class DayPicker extends React.Component {
	constructor(props) {
	  super(props);
	  let rangeDateDefault={
		 min:new moment(this.props.startDate),
		 max:new moment(this.props.endDate),
	  };
	  this.state = {
	  	visible:false,
	  	transparent:true,
	  	rangeDate:rangeDateDefault,
	  	tmpRangeDate:rangeDateDefault,
	  };
	}
	_click(){
		this.setState({
			visible:!this.state.visible,
		});
	}

	_handleDateChange(range){
		if(range.min){
			this.setState({
				tmpRangeDate:range,
			});		
		}		
	}

	CalendarClose(){
		this.setState({
			visible:!this.state.visible,
		});
	}

	CalendarSure(){		
		this.setState({
			visible:!this.state.visible,
			rangeDate:this.state.tmpRangeDate,
		});
		
		this.props.sureButtonClick(this.state.tmpRangeDate);
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			rangeDate:{
				min:new moment(nextProps.startDate),
				max:new moment(nextProps.endDate),
			}
		});
	}

	shouldComponentUpdate(nextProps){
		return true;
	}


    render() {
    	const {rangeDate} = this.state;

    	const  dateBoxStyle=this.props.border=='none'?styles.dateBox:[styles.dateBox,{borderWidth:1}]
        return (
        	<View>
				<TouchableOpacity style={dateBoxStyle} onPress={this._click.bind(this)} >
				<Text style={styles.dateText} >{rangeDate.min.format('YYYY-MM-DD')} 至 {rangeDate.max.format('YYYY-MM-DD')}</Text>
				</TouchableOpacity>
        	<Modal
        		visible={this.state.visible}
			    animationType='none'
			    transparent={this.state.transparent}>
			    
	        	<TouchableOpacity style={styles.bg}
	        	onPress={this._click.bind(this)} >
	        	</TouchableOpacity>
				
				{this.state.visible&&<View >
					<Calendar closeText={this.props.closeText} 
					onClose={this.CalendarClose.bind(this)}
					onSure={this.CalendarSure.bind(this)}
					onDateChange={this._handleDateChange.bind(this)} selectionType="range" date={rangeDate}/>
				</View>}
	            
            </Modal>
           </View>
        );
    }
}

const styles=StyleSheet.create({
	dateBox:{
		width:168,
		height:28,
		justifyContent:'center',
		alignItems:'center',
		borderRadius:2,
		borderColor:AdColor.borderColor,
		backgroundColor:'#fff',
	},
	dateText:{
		fontSize:12,
	},
	bg:{
		width:ScreenWidth,
		height:ScreenHeight,
		backgroundColor:'rgba(0,0,0,0.5)',
		position:'absolute',
		left:0,
		top:0,
	},
});