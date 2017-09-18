import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Easing,
    Image,
    Alert,
    TouchableOpacity,
    InteractionManager,
    ActivityIndicator,
    LayoutAnimation,
} from 'react-native';

import {connect} from 'react-redux';
import Swipeout from 'react-native-swipeout';
import AdColor from '../../common/AdColor';
import {Heading3,Text,Text1,Text3} from '../../common/AdText';
import {normalize,AdCampaignStatus,deviceTypeChange,MoneyCheck,TimeCheck,SwfCheck,numFormat} from '../../utils';
import {hourReport,hChartStart} from '../../actions/home';
import {searchInfoCurAid,searchBasicInfoClear} from '../../actions/searchInfo';
import {initPageSet} from '../../actions/dataChart';
import {deleteAd,editeAd} from '../../actions/adgroup';
import env from '../../env';

export default class AdgroupRow extends Component{
    constructor(props) {
      super(props);
    
      this.state = {
        height: new Animated.Value(0),
        visible:false,
        fetchSource:false,
        imgLoadError:false,
      };
    }

    handlEdit(){
        const { navigator,data,index,searchAdEdite} = this.props;
        if(navigator) {
            navigator.push({
                adEdite: true,
                params: {
                    data: data,
                    index:index,
                    searchAdEdite
                },
            })
        }
    }
    handlDelete(){
        const {data,index,dispatch,searchAdEdite} = this.props;
        
        Alert.alert('确认删除广告'+data.name+'吗？',null,[
            {text:'确认',onPress:()=>{
                dispatch(deleteAd({
                 token:userToken_G,
                 uid:data.uid,
                 cid:data.cid,
                 aid:data.aid,
                 index:index,
                 searchAdEdite:searchAdEdite
                }));
            }},
            {text:'取消'}
        ]);
    }
    _imgLoadError(){
        this.setState({
            imgLoadError:true,
        });
    }
    targetToDesc(){
        const {navigator,data} = this.props;
        navigator.push({
            adDescPage:true,
            params:{
                data:data
            }
        });
    }
    operate(){
        const {data,index,dispatch,searchAdEdite} = this.props;
        let status=data.status=='STATUS_NORMAL'?'STATUS_PAUSE':'STATUS_NORMAL';
        let operateType=data.status=='STATUS_NORMAL'?'暂停':'启动';       
        Alert.alert('确认'+operateType+'广告'+data.name+'吗？',null,[
            {text:'确认',onPress:()=>{

                dispatch(editeAd({
                 token:userToken_G,
                 uid:data.uid,
                 cid:data.cid,
                 aid:data.aid,
                 index:index,
                 status:status,
                 searchAdEdite:searchAdEdite,
                 statuEdite:true,
                }));
            }},
            {text:'取消'}
        ]);
    }
    //点击图标跳转到数据报表页面
    jumpChart(){
        const {dispatch,changeTabItem,handCancel,data} = this.props;
        const {dataRangeDate} = this.props.searchInfoState;
        if(handCancel){
           handCancel(); 
        }
        statistics('点击广告数据图表跳转小时报表');
        dispatch(hChartStart());
        dispatch(searchBasicInfoClear());
        dispatch(initPageSet());
        dispatch(searchInfoCurAid(data.aid,data.name));
        dispatch(hourReport({
            token:userToken_G,
            uid:data.uid,
            h_chart:true,
            cid:0,
            aid:data.aid,
            time_range:'{"start_date":"'+dataRangeDate.startDate+'","end_date":"'+dataRangeDate.endDate+'"}',
        }));
        changeTabItem('data');

    }
    handlShow(){
    
        const {index,load_ad_source,data,set_active_item} = this.props;
        const {fetchSource,height,visible} = this.state;

        set_active_item(index);
        if(visible){
            Animated.timing(
            height,
                {
                    toValue:0,
                    duration:300,
                    easing: Easing.easing,
                },
            ).start();
            setTimeout(()=>{
            this.setState({visible:false});
           },250);
        }else{
            if(!fetchSource){
                this.setState({fetchSource:true});
            }
           this.setState({visible:true});  
           Animated.timing(
            height,
                {
                    toValue:330,
                    duration:300,
                    easing: Easing.easing,
                },
         ).start(); 

        }
        //动画完成后在进行素材数据异步请求
        InteractionManager.runAfterInteractions(()=>{
            if(!fetchSource){
                load_ad_source({index:index,token:userToken_G,uid:data.uid,aid:data.aid});
            }
        });
        
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
    componentWillUpdate(nextProps){
        const {data,index,load_ad_source,activeIndex} =this.props;
        //如果刷新后再次获取素材资源
        if(!nextProps.data.loaded&&this.state.height._value>100){
            load_ad_source({index:index,token:userToken_G,uid:data.uid,aid:data.aid});
        }

    }
    render(){
        const {data} =this.props;
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
            return <View style={{height:0}} ></View>
        }
        return(
           <View style={styles.container} ref="midde" >
                <Swipeout right={swipeoutBtns}
                             autoClose={true}
                             close={true}
                             onOpen={()=>{console.log('open')}}
                             sensitivity={300}
                              >
                   <View style={styles.title}>
                           <View style={styles.titleName} >
                           <Text style={{fontSize:12,fontWeight:'bold'}} numberOfLines={2} >{data.name}</Text>
                           </View>
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
                {this.state.visible&&<Animated.View  style={[styles.middle,{height:this.state.height}]} >
                    <View style={styles.middleInner} >
                    <View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3>广告出价:{MoneyCheck(data.bid)}</Text3>
                        </View>
                        {userOperator_G&&<View style={styles.infoCell}>
                        <Text3 style={styles.actualColor}  >实际出价:{MoneyCheck(data.price)}</Text3>
                        </View>}
                        <View style={styles.infoCell}>
                            <Text3>广告ID:{data.aid}</Text3>
                        </View>
                    </View>
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
                            <Text3>点击上限:{TimeCheck(data.daily_click)} /日</Text3>
                        </View>
                        <View style={styles.infoCell}>
                            <Text3>展示上限:{TimeCheck(data.daily_impression)} /日</Text3>
                        </View>
                    </View>
                    <View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3>推广计划:{data.campaign}</Text3>
                        </View>
                    </View>
                    <View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3>创意ID:{data.mid?data.mid:'-'}</Text3>
                        </View>
                        <View style={styles.infoCell}>
                            <Text3>投放媒体:{data.nsid?data.nsid:'-'}</Text3>
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
                   {userOperator_G&&<View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3 style={styles.actualColor} >实际消耗:{data.fcost}</Text3>
                        </View>
                        <View style={styles.infoCell}>
                            <Text3 style={styles.actualColor} >实际平均CPC:{data.spnc}</Text3>
                        </View>
                        <View style={styles.infoCell}>
                            <Text3 style={styles.actualColor} >实际平均CPM:{data.spns}</Text3>
                        </View>
                    </View>}
                    <View style={styles.infoRow} >
                        <View style={styles.infoCell}>
                            <Text3>投放日期:{(env.unlimitDate<=data.enddate)&&(env.currentDateTime>=data.startdate)?'不限':(data.startdate+'至'+data.enddate)}</Text3>
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
                            {createFreText(data.frequency)}
                            </Text3>
                        </View>
                    </View>
                    <View style={styles.imgRow} >
                        {!data.loaded&&<ActivityIndicator color="#666" />}                       

                        {data.loaded&&data.material_url&&SwfCheck(data.material_url)&&<TouchableOpacity onPress={this.targetToDesc.bind(this)} ><Image 
                        style={this.state.imgLoadError?{height:0}:{height:140}}
                        onError={this._imgLoadError.bind(this)}
                        resizeMode="contain" source={{uri:data.material_url}} /></TouchableOpacity>
                        }

                        {this.state.imgLoadError&&<Text3>图片加载失败！</Text3>}

                        {data.loaded&&data.hasSourceData&&!data.material_url&&<Text3>该广告暂无图片素材</Text3>}
                        {data.loaded&&data.material_url&&!SwfCheck(data.material_url)&&<Text3>flash动画,暂不支持播放</Text3>}
                        {!data.hasSourceData&&data.loaded&&<Text3>该广告无素材</Text3>}

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

//根据frequency 生成相应的text
function createFreText(data){
    const json=JSON.parse(data);
    if(json.type==null){
        return <Text3>不限</Text3>
    }else if(json.type=='day'){
        return (<Text3>每天 ( 点击 {TimeCheck(json.click)} , 展示 {TimeCheck(json.impression)} )</Text3>); 
    }else if(json.type=='whole'){
        return (<Text3>整个投放周期 ( 点击 {TimeCheck(json.click)}  , 展示 {TimeCheck(json.impression)})</Text3> ) ;
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
        height:40,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor:'#fff',
        justifyContent:'space-between',
        alignItems:'center',
    },
    titleName:{
        flex:1,
    },
    IconUpwrap:{
        width:50,
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
    opeBox:{
        width:150,
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
    },
    Iconwrap:{
        width:40,
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
    imgRow:{
        flex:1,
        height:140,
        justifyContent:'center',
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
    actualColor:{
        color:'#00b441'
    },
    editeBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#74D239',
    },
});

