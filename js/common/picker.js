'use strick';
import React,{Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	Modal,
	TouchableOpacity,
	Dimensions,
	PickerIOS,
} from 'react-native';

const screenWidth=Dimensions.get('window').width;

export default class SelectPicker extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	visible:false,
	  	select:this.props.selectedValue
	  };
	}

	togglePicker(){
		this.setState({
			visible:!this.state.visible,
		});
	}

	sureSelect(value){
		this.setState({
			select:value,
		});
		this.props.onValueConfirm(this.state.select);
	}

	render(){
		return (
			<View style={{height:30,flex:1}} >
			<TouchableOpacity onPress={this.togglePicker.bind(this)} >
			<Text>{this.state.select}</Text>
			</TouchableOpacity>
			<ItemPicker
			 visible={this.state.visible}
			 sureSelect={this.sureSelect.bind(this)}
			 togglePicker={this.togglePicker.bind(this)}
			{...this.props} />
			</View>
		);
	}
}

 class ItemPicker extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	select:this.props.selectedValue,
	  	tmpSelect:this.props.selectedValue,
	  	itemsArray:this.props.pickerData,
	  	animationType:'fade', 
	  	transparent:true,
	  };
	}	
	hidePicer(){
		this.setState({
			tmpSelect:this.state.select
		});
		this.props.togglePicker();
	}
	valueChange(date){
		this.setState({
			tmpSelect:date
		});
	}
	handChange(){
		const {select,tmpSelect} = this.state;
		
		if(select != tmpSelect){
			this.setState({
				select:this.state.tmpSelect,
			});
			this.props.sureSelect(this.state.tmpSelect)
		}
		this.props.togglePicker();

	}
	render(){
		return (
				<Modal
					visible={this.props.visible}
					animated={this.state.animated}
					transparent={this.state.transparent}
					>						
						<TouchableOpacity style={styles.modalbutton} 
							onPress={this.hidePicer.bind(this)} >
						</TouchableOpacity>

						<View style={styles.title} >
						<TouchableOpacity
							onPress={this.hidePicer.bind(this)} >
							<View style={[styles.button,styles.buttonCancel]} >
								<Text>取消</Text>
							</View>
							</TouchableOpacity>
							<TouchableOpacity
							onPress={this.handChange.bind(this)} >
							<View style={[styles.button,styles.buttonSure]} >
								<Text>确定</Text>
							</View>
							</TouchableOpacity>
						</View>
							<PickerIOS 
								style={styles.pickerArea}
								selectedValue={this.state.tmpSelect}
								onValueChange={this.valueChange.bind(this)}
							>

							{this.state.itemsArray.map((item,ii)=>{
							return	 <PickerIOS.Item key={ii} value={ii} label={item} />
							})}
			
							</PickerIOS>

				</Modal>
		);
	}
}

const styles=StyleSheet.create({
	title:{
		height:26,
		backgroundColor:'#fff',
		flexDirection:'row',
	},
	pickerArea:{
		width:screenWidth,
		height:220,
		backgroundColor:'#fff',
	},
	modalbutton:{
		flex:1,
		alignSelf:'stretch',
		backgroundColor:'rgba(0,0,0,0.5)',
	},
	button:{
		width:screenWidth/2,
		height:26,
		alignItems:'center',
		justifyContent:'center',
		borderColor:'#ccc',

	},
	buttonCancel:{
		alignItems:'flex-start',
		paddingLeft:16,
	},
	buttonSure:{
		alignItems:'flex-end',
		paddingRight:16,
	}
});

