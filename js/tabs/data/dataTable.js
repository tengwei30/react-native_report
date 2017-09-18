import React,{Component}from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
} from 'react-native';
import {Text,Text1,Text2,Text3} from '../../common/AdText';
import AdColor from '../../common/AdColor';
import {numFormat} from '../../utils';
export default class DataTable extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {

	  };
	}

	render(){
		const {dataList,summarryArr,dataType,handReportSort} = this.props;
		let titleText=[{type:'展示数(次)',key:'ns'},{type:'点击数(次)',key:'nc'},{type:'点击率(%)',key:'ctr'},{type:'消耗(元)',key:'cost'}];
		titleText.unshift(dataType);

		let titleRows=titleText.map((data,i)=>{
			return (
				<TabTitleRow handReportSort={handReportSort} key={i} data={data} />
			);
		});
		return(
			<View style={styles.wrap} >
				<View style={styles.headRow} >
					{titleRows}
				</View>
				{dataList.map((data,i)=>{
					return(
						<TableRow key={i} dataType={dataType} data={data} />
					);
				})}
				<View style={styles.rows} >
					<View style={styles.span} >
						<Text2>汇总统计</Text2>
					</View>
					<View style={styles.span} >
						<Text3>{summarryArr[0]?numFormat(summarryArr[0],0):0}</Text3>
					</View>
					<View style={styles.span} >
						<Text3>{summarryArr[1]?numFormat(summarryArr[1],0):0}</Text3>
					</View>
					<View style={styles.span} >
						<Text3>{summarryArr[2]?summarryArr[2]:0}</Text3>
					</View>
					<View style={styles.span} >
						<Text3>{summarryArr[3]?numFormat(summarryArr[3]):0}</Text3>
					</View>
				</View>
			</View>
		);
	}
} 
class TabTitleRow extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	ascending:false
	  };
	}
	_click(){
		const {data,handReportSort} = this.props;
		handReportSort(data.key,this.state.ascending);
		this.setState({
			ascending:!this.state.ascending,
		});
	}
	render(){
		const {data} = this.props;
		return(
			<TouchableOpacity onPress={this._click.bind(this)} style={styles.span} >
				<Text2>
					{data.type}
				</Text2>
			</TouchableOpacity>
		);
	}
}
class TableRow extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	render(){
		const {data,dataType} = this.props;
		const textArray = [data[dataType.key], numFormat(data.ns,0), numFormat(data.nc,0), Number(data.ctr * 100).toFixed(3), numFormat(data.cost)];
		return(
			<View style={styles.rows} >
			{
				textArray.map((text,i)=>{
					return(
						<View key={i} style={styles.span} >
							<Text3 numberOfLines={2} >
								{text}
							</Text3>
						</View>
					);
				})
			}
			</View>
		);
	}
}

const styles=StyleSheet.create({
	wrap:{
		marginTop:20,
		borderTopWidth:1,
		borderRightWidth:1,
		borderLeftWidth:1,
		borderColor:AdColor.borderColor,
		backgroundColor:'#fff',
		marginBottom:20,
	},
	headRow:{
		flexDirection:'row',
		height:36,
		paddingRight:8,
		borderBottomWidth:1,
		borderColor:AdColor.borderColor,
	},
	labelSpan:{
		flex:2,
	},
	span:{
		flex:1,
		alignItems:'flex-end',
		justifyContent:'center'
	},
	rows:{
		flexDirection:'row',
		height:30,
		paddingRight:8,
		borderBottomWidth:1,
		borderColor:AdColor.borderColor,
	},
	cols:{

	}
});

