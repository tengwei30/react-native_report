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
    StatusBar,
    TextInput,
    Platform,
} from 'react-native';
import DismissKeyboard from 'dismissKeyboard';
const ScreenWidth=Dimensions.get('window').width;
const ScreenHeight=Dimensions.get('window').height;
const boxWidth=ScreenWidth-20;
const cidDefaultValue={cid:0,name:'全部'};
const aidDefaultValue={aid:0,name:'全部'};
export default class SelectModal extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	visible:false,
	  	transparent:true,
	  	text:'',
	  	startSearch:false,
	  	showText:this.props.showText?this.props.showText:'全部',
	  };
	}

	componentDidMount(){
		
	}

	_click(){
		const {dispatch,searchClear} = this.props;
		dispatch(searchClear());
		this.setState({
			visible:!this.state.visible,
			text:'',
		});

	}

	handChange(value){
		const {dispatch,uid,searchClear,searchStart,searchResult} = this.props;

		this.setState({
			text:value
		});

		if(!this.state.startSearch){
			this.setState({
				startSearch:true,
			});
			setTimeout(()=>{
				this.setState({
					startSearch:false,
				});
				let key=this.state.text.trim();
				if(key.length==0){
					dispatch(searchClear());
					return;
				}
				dispatch(searchStart());
				dispatch(searchResult({
					token:userToken_G,
					uid:uid,
					where:'{"name":"'+key+'"}',
					searchCam:true,
					searchAd:true,
				}));
			},1000)
			
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.showText){
			this.setState({
				showText:nextProps.showText
			});
		}
	}

	shouldComponentUpdate(){
		return true;
	}

	handSelect(data){
		const {dispatch,searchClear} = this.props;
		dispatch(searchClear());
		this.props.onSelect(data);
		this.setState({
			visible:!this.state.visible,
			showText:data.name
		});
	}

    render() {
    	const {placeholder,dataState,camSelect,adSelect} = this.props;
    	if(Platform.OS==='ios'){
    		StatusBar.setNetworkActivityIndicatorVisible(dataState.searching);
    	}
        return (
        	<View>       		
    			<TouchableOpacity style={styles.dateBox} onPress={this._click.bind(this)} >
    			<Text style={styles.dateText} numberOfLines={1} >{this.state.showText}</Text>
    			</TouchableOpacity>       		
        	<Modal
        		visible={this.state.visible}
			    animationType='none'
			    transparent={this.state.transparent}>

	        	<TouchableOpacity style={styles.bg}
	        	onPress={this._click.bind(this)} >
	        	</TouchableOpacity>
				
				<View style={styles.selectWrap} >
					<TextInput
					style={styles.input}
					autoCapitalize='none' 
					autoCorrect={false}
					ref='searchInput'
					returnKeyType='search'
					enablesReturnKeyAutomatically={true}
					clearButtonMode='while-editing'
					
					placeholderTextColor='#999'
					placeholder={placeholder} 
					autoFocus={true} 
					defaultValue={this.state.text}
					onChangeText={(value)=>{
						this.handChange(value)
						}}
					/>
					
					<ScrollView style={styles.listBox} 
					keyboardDismissMode='on-drag'
					keyboardShouldPersistTaps={true} >

					<View style={{flex:1}} onStartShouldSetResponderCapture={(e) => {
						DismissKeyboard()}} >
						
						<Rows  data={camSelect?cidDefaultValue:aidDefaultValue} handSelect={this.handSelect.bind(this)} />
						{	dataState.resultList.length==0&&dataState.showSearchResult?<Text>无</Text>:
							dataState.resultList.map((data,index)=>{
								return (
									<Rows key={index} data={data} handSelect={this.handSelect.bind(this)} />
								);
							})
						}
					</View>	
					</ScrollView>
					
				</View>		
				            
            </Modal>
           </View>
        );
    }
}

class Rows extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	_handSelect(){
		this.props.handSelect(this.props.data);
	}
	render(){
		const {data} = this.props;
		return(
			<TouchableOpacity onPress={this._handSelect.bind(this)} style={styles.row} >
				<Text>{data.name}</Text>
			</TouchableOpacity>
		);
	}
}

const styles=StyleSheet.create({
	dateBox:{
		width:150,
		height:28,
		justifyContent:'center',
		alignItems:'center',
		borderWidth:1,
		borderRadius:2,
		borderColor:'#ececec',
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
	selectWrap:{
		width:boxWidth,
		height:220,
		backgroundColor:'#fff',
		position:'absolute',
		left:10,
		top:70,
		padding:10,
	},
	input:{
		borderWidth:1,
		height:30,
		paddingLeft:4,
		fontSize:14,
		borderColor:'#ececec',
	},
	listBox:{
		flex:1,
		borderWidth:1,
		borderColor:'#ececec',
		paddingTop:8,
	},
	row:{
		height:34,
		paddingLeft:6,
		justifyContent:'center',
	}
});