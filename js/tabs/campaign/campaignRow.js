import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Easing,
    Image,
    Alert,
    TouchableOpacity,  
} from 'react-native';

import {connect} from 'react-redux';
import Swipeout from 'react-native-swipeout';
import {tabItemActions} from '../../actions';
import AdColor from '../../common/AdColor';
import {Text,Text1,Text3} from '../../common/AdText';
import {normalize,AdCampaignStatus,deviceTypeChange,TimeCheck,MoneyCheck,createFrequency,createFreShowText,numFormat} from '../../utils';
import {deleteCampaign,editeCampaign} from '../../actions/campaign';
import {initPageSet} from '../../actions/dataChart';
import {hourReport,hChartStart} from '../../actions/home';
import {searchInfoCurCid,searchBasicInfoClear} from '../../actions/searchInfo';
import {getAdgroup,jumpToAd} from '../../actions/adgroup';
import env from '../../env';

export default class CampaignRow extends Component{
    constructor(props) {
      super(props);
    
      this.state = {
        height: new Animated.Value(0),
        visible:false,
      };
    }
    handlEdit(){
        const { navigator,data,index,searchCamEdite} = this.props;
        if(navigator) {
            navigator.push({
                campaignEdite: true,
                params: {
                    data: data,
                    index:index,
                    searchCamEdite
                },
            })
        }
    }
    handlDelete(){
        const {data,index,dispatch,searchCamEdite} = this.props;
    
        Alert.alert('确认删除推广计划'+data.name+'吗？',null,[
            {text:'确认',onPress:()=>{
                dispatch(deleteCampaign({
                 token:userToken_G,
                 uid:data.uid,
                 cid:data.cid,
                 index:index,
                 searchCamEdite:searchCamEdite
                }));
            }},
            {text:'取消'}
        ]);
    }
    operate(){
        const {data,index,dispatch,searchCamEdite} = this.props;
        let status=data.status=='STATUS_NORMAL'?'STATUS_PAUSE':'STATUS_NORMAL'; 
        let operateType=data.status=='STATUS_NORMAL'?'暂停':'启动';      
        Alert.alert('确认'+operateType+'推广计划'+data.name+'吗？',null,[
            {text:'确认',onPress:()=>{
                dispatch(editeCampaign({
                 token:userToken_G,
                 uid:data.uid,
                 cid:data.cid,
                 index:index,
                 status:status,
                 searchCamEdite:searchCamEdite,
                 statuEdite:true,
                }));
            }},
            {text:'取消'}
        ]);

    }
    jumpChart(){
        const {dispatch,changeTabItem,handCancel,data} = this.props;
        const {dataRangeDate} = this.props.searchInfoState;
        //点击图表，name时先退回tabs主页，再通过changeTabItem跳到相应的页面
        if(handCancel){
           handCancel(); 
        }
        dispatch(hChartStart());
        dispatch(searchBasicInfoClear());
        dispatch(initPageSet());
        dispatch(searchInfoCurCid(data.cid,data.name));
        dispatch(hourReport({
            token:userToken_G,
            uid:data.uid,
            h_chart:true,
            cid:data.cid,
            aid:0,
            time_range:'{"start_date":"'+dataRangeDate.startDate+'","end_date":"'+dataRangeDate.endDate+'"}',
        }));
        statistics('推广计划图标跳转小时报表');
        changeTabItem('data');
    }
    jumpAd(){
        const {dispatch,data,handCancel,changeTabItem} = this.props;
        const {filterRangeDate} = this.props.campaignState;
        if(handCancel){
           handCancel(); 
        }

        const filterWhere=Object.assign({"cid":data.cid},{"startdate":filterRangeDate.startDate,"enddate":filterRangeDate.endDate});
        statistics('点击推广计划跳转其下的广告');
        
        dispatch(jumpToAd(data.cid,data.name));
        dispatch(getAdgroup({
            token:userToken_G,
            uid:data.uid,
            where:JSON.stringify(filterWhere),
        }));
        setTimeout(()=>{
            changeTabItem('adgroup');
        })
    }
    handlShow(){
        const {index,activeIndex,set_active_item} = this.props;
        set_active_item(index);
        this.showAnimation();
    }

    showAnimation(){
        if(this.state.visible){
            Animated.timing(
            this.state.height,
                {
                    toValue:0,
                    duration:200,
                    easing: Easing.easing,
                },
            ).start();
             setTimeout(()=>{
             this.setState({visible:false});
            },150);
        }else{
            this.setState({visible:true});  

            Animated.timing(
                this.state.height,
                    {
                        toValue:140,
                        duration:200,
                        easing: Easing.easing,
                    },
            ).start(); 
        }
    }

    componentWillReceiveProps(nextProps){
        const {index,activeIndex} = this.props;
        if(nextProps.activeIndex!=index){
            this.setState({
                visible:false,
            });
        }
    }
    shouldComponentUpdate(nextProps){
        return true;
    }

    render(){
        const {data} =this.props;

        const frequency=createFrequency(data.frequency);
        
        let arrowRotate=this.state.visible?styles.arrowToTop:styles.arrowToBottm;
        let swipeoutBtns = [
          {
            text: '编辑',
            backgroundColor:'#ccc',
            color:'#333',
            onPress:()=>{this.handlEdit()}
          },{
            text: '删除',
            backgroundColor:'#ff3b30',
            color:'#fff',
            onPress:()=>{this.handlDelete()}
          }
        ];

        if(data.status=='STATUS_NORMAL'){
            swipeoutBtns.unshift({
                component:<Pause operate={this.operate.bind(this)} />,
            });
        }

        if(data.status=='STATUS_PAUSE'){
            swipeoutBtns.unshift({
                component:<Start operate={this.operate.bind(this)} />,
            });
        }

        if(data.status=='STATUS_DELETED'){
            return <View style={{height:0}} ></View>;
        }
        return(
           <View style={styles.container} >
                <Swipeout right={swipeoutBtns}
                  autoClose={true}
                  close={true}
                  sensitivity={300}
                   >
                <View style={styles.title}>
                        <TouchableOpacity style={styles.titleName} onPress={this.jumpAd.bind(this)}  >
                            <Text style={{fontSize:12,fontWeight:'bold'}} 
                            numberOfLines={2}
                            >{data.name}</Text>
                        </TouchableOpacity>

                        <View style={styles.opeBox} >
                        {AdCampaignStatus(data.status)}
                        <TouchableOpacity onPress={this.jumpChart.bind(this)} style={styles.IconUpwrap} >
                        <Image style={styles.iconUp} source={require('../icons/icon-data-s.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.Iconwrap}  onPress={this.handlShow.bind(this)} >
                        <Image style={[styles.iconArrow,arrowRotate]} source={require('../icons/up-arrow.png')} />
                        </TouchableOpacity>
                        </View>
                </View>
                </Swipeout>
                {this.state.visible&&<Animated.View style={[styles.middle,{height:this.state.height}]} >
                    <View style={styles.middleInner} >
                    <View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3>每日限额:{MoneyCheck(data.budget_daily)}</Text3>
                        </View>
                        <View style={styles.infoCell}>
                            <Text3>整体限额:{MoneyCheck(data.budget)}</Text3>
                        </View>
                    </View>
                    <View style={styles.infoRow} >
                        
                        <View style={styles.infoCell}>
                            <Text3>点击上限:{TimeCheck(data.daily_click)}/日</Text3>
                        </View>
                        <View style={styles.infoCell}>
                            <Text3>展示上限:{TimeCheck(data.daily_impression)}/日</Text3>
                        </View>
                    </View>
                    <View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3>ID:{data.cid}</Text3>
                        </View>
                        <View style={styles.infoCell}>
                            <Text3>投放资源:{data.product}</Text3>
                        </View>
                    </View>
                    <View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3>更新时间:{data.last_modified}</Text3>
                        </View>
                        <View style={styles.infoCell}>
                            <Text3>投放设备:{deviceTypeChange(data.device_type)}</Text3>
                        </View>
                    </View>
                    <View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3>投放日期:{(env.unlimitDate<=data.enddate)&&(env.currentDateTime>=data.startdate||data.startdate==null)?'不限':(data.startdate+'至'+data.enddate)}</Text3>
                        </View>
                    </View>
                    <View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3>状态描述:{data.status_msg}</Text3>
                        </View>
                    </View>
                    <View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3>频控设置:
                            {createFreShowText(frequency)}
                            </Text3>
                        </View>
                    </View>
                    </View>
                </Animated.View>}
                <View style={styles.col} >
                    <View style={styles.row} >
                        <Text1>展示数(次):</Text1>
                        <Text1 style={styles.num}>
                        {numFormat(data.ns,0)}</Text1>
                    </View>
                    <View style={[styles.row,styles.borderLeft]} >
                        <Text1>点击数(次):</Text1>
                        <Text1 style={styles.num}>
                        {numFormat(data.nc,0)}</Text1>
                    </View>
                </View>
                <View style={styles.col} >
                    <View style={styles.row} >
                        <Text1>点击率:</Text1>
                        <Text1 style={styles.num}>
                        {data.ctr}</Text1>
                    </View>
                    <View style={[styles.row,styles.borderLeft]} >
                        <Text1>消耗(元):</Text1>
                        <Text1 style={styles.num}>
                        {numFormat(data.cost)}</Text1>
                    </View>
                </View>
                <View style={styles.col} >
                    <View style={styles.row} >
                        <Text1>平均CPC:</Text1>
                        <Text1 style={styles.num}>
                        {data.ecpc}</Text1>
                    </View>
                    <View style={[styles.row,styles.borderLeft]} >
                        <Text1>平均CPM:</Text1>
                        <Text1 style={styles.num}>
                        {data.ecpm}</Text1>
                    </View>
                </View>
            </View>
        );
    }
};

class Pause extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  _click(){
    this.props.operate();
  }

  render(){
      return (
        <View style={[styles.editeBox,{backgroundColor:'#ff9c00'}]} onTouchStart={this._click.bind(this)}>
            <Text style={{color:'#fff'}} >暂停</Text>
        </View>
      );
    }
}

class Start extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  _click(){
    this.props.operate();
  }

  render(){
      return (
        <View style={[styles.editeBox]} onTouchStart={this._click.bind(this)} >
            <Text style={{color:'#fff'}} >开始</Text>
        </View>
      );
    }
}
const styles=StyleSheet.create({
    container: {
        marginBottom:8,
        backgroundColor:'#fff',
        overflow:'hidden',
    },
    title:{
        flex:1,
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10,
        backgroundColor:'#fff',
        justifyContent:'space-between',
        alignItems:'center',
    },
    titleName:{
        flex:1,
    },
    titlePadding:{
        paddingTop:3,
        paddingBottom:3,
        paddingLeft:4,
        paddingRight:4,
    },
    opeBox:{
        width:150,
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
    },
    IconUpwrap:{
        width:40,
        height:40,
        alignItems:'center',
        justifyContent:'center',
    },
    iconUp:{
        width:22,
        height:22,
    },
    iconArrow:{
        width:16,
        height:16,
        paddingBottom:6,
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
    Iconwrap:{
        width:50,
        height:40,
        justifyContent:'center',
        alignItems:'center',
    },
    status:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end',
    },
    middle:{
        backgroundColor:'#efefef',
        overflow:'hidden',
    },
    middleInner:{
        paddingLeft:10,
        paddingRight:10,
        paddingTop:5,
        paddingBottom:5,
    },
    infoRow:{
        flexDirection:'row',
        height:18,
    },
    infoCell:{
        flex:1,
        justifyContent:'center',
    },
    borderLeft:{
        borderLeftWidth:1,
        borderLeftColor:AdColor.borderColor,
    },
    col:{
        flexDirection:'row',
        height:30,
        borderTopColor:AdColor.borderColor,
        borderTopWidth:1,
    },
    row:{
        flex:1,
        paddingLeft:10,
        flexDirection:'row',
        alignItems:'center',
    },
    red:{
        color:AdColor.lightRed,
    },
    num:{
        color:'#5aaaea',
    },
    editeBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#74D239',
    },
});
