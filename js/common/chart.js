import React,{Component} from 'react';
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	LayoutAnimation,
	Animated,
	Easing,
} from 'react-native';

const yWidth=30;
const ww=Dimensions.get('window').width-yWidth-20;

export default class BarChart extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render(){

		const {xLabelText,data,chartHeight,setStep} = this.props.chartData;
		let len=data.length;

		const barWidth=ww/len;
		let step,stepAlign;
		//根据数据个数，如果不指定step，则自动指定step值
		if(setStep){
			step=setStep;
		}else{
			stepAlign='flex-start';
			if(len>5&&len<=20){
				step=5;
			}else if(len>20){
				step=10;
			}else{
				step=1;
				stepAlign='center';
			}	
		}
		
		//获取最大数据并向上取整
		const maxDate=Math.ceil(Math.max.apply(null,data));
		//生成bar
		const barHeightScale=maxDate==0?0:(chartHeight-30)/maxDate;
		//let barHeightScale=20;
		const barView=data.map((data,i)=>{
			
			return (
				<BarView key={i} len={len} barWidth={barWidth} height={data*barHeightScale} />
			);
		});

		//生成x轴刻度
		const stepXLabelWidth=ww/(Math.floor((len/step)));

		const barXLabel=xLabelText.map((text,i)=>{
			if(i%step==0){
				const leftSpace=i*(ww/len);
				return(
					<View key={i} style={[styles.xLabel,{left:leftSpace,width:stepXLabelWidth,alignItems:stepAlign}]} >
						<Text numberOfLines={1} style={styles.xLabelText}>{text}</Text>
					</View>
				);
			}
			
		});
		
		//生成y轴刻度
		const stepYLabelHeight=(chartHeight-30)/5;
		const stepYLabel=[];

		for(let i=5; i>0;i--){

			let tmpDates=(maxDate/5)*i;


			let tmpDate=(stepYLabelHeight*i*maxDate)/(chartHeight-30);

			if(tmpDate<=1&&tmpDate>0){
				stepYLabel.push(numFormat(tmpDate));
			}else if(tmpDate>1&&tmpDate<30){
				stepYLabel.push(numFormat(tmpDate,1));
			}else if(tmpDate>=30){
				stepYLabel.push(numFormat(tmpDate,0));
			}else{
				stepYLabel.push(0);
			}
			
		}

		const barYLabel=stepYLabel.map((data,i)=>{
			return (
				<View key={i} style={[styles.yLabel,{height:stepYLabelHeight}]} >
					<Text style={styles.yTransform} >{data}</Text>
				</View>
			);
		});

		//生成y轴网格线
		const barGrid=stepYLabel.map((data,i)=>{
			return (
				<View key={i} style={[styles.grid,{height:stepYLabelHeight}]} >

				</View>
			);
		});
		return(

			<View style={[styles.container,{height:chartHeight}]} >

				<View style={styles.colTop} >
					<View style={styles.yLabelsBox} >
						{barYLabel}
					</View>
					
					<View style={styles.chart} >
						<View style={[styles.gridBox,{height:chartHeight-30}]} >
						{barGrid}
						</View>
						{barView}
					</View>
				</View>

				<View style={styles.xLabelsBox} >
					{barXLabel}
				</View>
				
			</View>
		);
	}
} 
//单个柱状视图
export  class BarView extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	initHeight:new Animated.Value(0),
	  };
	}

	render(){
		const {barWidth,height,len} = this.props;
		const resultHeight=height==0?1:height;
		let resultWidth;
		if(len==1){
			resultWidth={width:barWidth/6,marginLeft:5*barWidth/12,marginRight:5*barWidth/12};
		}else if(len>1&&len<=3){
			resultWidth={width:barWidth/3,marginLeft:barWidth/3,marginRight:barWidth/3};
		}else{
			resultWidth={width:2*(barWidth/3),marginLeft:barWidth/6,marginRight:barWidth/6};
		}
		Animated.timing(
            this.state.initHeight,
                {
                    toValue:resultHeight,
                    duration:300,
                    easing: Easing.easing,
                },
         ).start(); 
		return(
			<Animated.View style={[styles.colView,resultWidth,{height:this.state.initHeight}]} >
			</Animated.View>
		);
	}
}
//对Y轴数据进行整形
export const numFormat=(s, n)=>{  
    n = n >= 0 && n <= 20 ? n : 2;
    let l;
    let r;
    let t="";

    if(n==0){
    	s=s*1;
        s = s.toFixed(n);
        l=s.split("").reverse();
        r="";
    }else{
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        l = s.split(".")[0].split("").reverse(); 
        r = "."+s.split(".")[1];  
    }

    for (let i = 0; i < l.length; i++) {  
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
    }  
    return t.split("").reverse().join("") + r;  
}  

const styles=StyleSheet.create({
	container:{
		flex:1,
		//backgroundColor:'red',
	},
	colTop:{
		flex:1,
		flexDirection:'row',
	},
	colView:{
		backgroundColor:'#5AAAEA',
	},
	yLabelsBox:{
		width:yWidth,
		//backgroundColor:'red',
	},
	yLabel:{
		paddingRight:2,
		alignItems:'flex-end',
	},
	yTransform:{
		fontSize:8,
		transform:[
			{translateY:-4}
		],
	},
	chart:{
		flex:1,
		borderColor:'#888',
		borderLeftWidth:1,
		borderBottomWidth:1,
		flexDirection:'row',
		alignItems:'flex-end',
	},
	xLabelsBox:{
		marginLeft:yWidth,
		flexDirection:'row',
		height:30,
	},
	xLabel:{
		position:'absolute',
		top:10,
	},
	xLabelText:{
		fontSize:8,
	},
	gridBox:{
		width:ww,
		position:'absolute',
		left:0,
		top:0,
	},
	grid:{
		borderTopWidth:1,
		borderColor:'#ccc',
	},
});