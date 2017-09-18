'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    View,
    TextInput,
    ScrollView,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import ConfirmButton from '../../common/confirmButton';
import EditeRow from '../../common/editeRow';
import {editeAd,editeStart,editeSearchAdStart} from '../../actions/adgroup';

let midFType;
let midFCP;
let midFIP;

export default class AdEditeHeight extends Component{
    constructor(props) {
      super(props);
      const {data} = this.props;
      const baseState={
        tmpBid:data.bid.toString(),
        tmpPrice:(data.price>=0?data.price:0).toString(),
        tmpClickLimit:data.daily_click.toString(),
        tmpImpLimit:data.daily_impression.toString(),
        visible:JSON.parse(data.frequency).type==null?false:true,
      }

      let changeState=createFre(data.frequency);
      this.state =Object.assign(baseState,changeState);
    }

    setValue(value,key){
      const statekeyValue={};
      statekeyValue[key]=value;
      this.setState(statekeyValue);
    }

    freTypeEdite(index){
      if(index==0) return;
      //选择不限时，清空click和impress的值，type传day 或 whole 都会清空数据
      if(index==3){
        this.setState({
          tmpFType:index,
          tmpFCP:0,
          tmpFIP:0,
          visible:false,
        });
      }else{
        this.setState({
          tmpFType:index,
          visible:true,
        });
      }
    }

    handBtnClick(){
        const {data,dispatch,index,searchAdEdite} = this.props;
        const {tmpBid,tmpPrice,tmpClickLimit,tmpImpLimit,tmpFType,tmpFCP,tmpFIP} = this.state;
        let count=0;
        let paramjson={
          uid:data.uid,
          cid:data.cid,
          aid:data.aid,
          token:userToken_G,
          index:index,
          searchAdEdite:searchAdEdite,
        };
          //判断数据是否修改，修改后会将该字段修改，否则不修改

          if(tmpBid!=data.bid){
            paramjson.bid=tmpBid; 
          }

          if(tmpPrice!=(data.price>=0?data.price:0)){
            paramjson.price=tmpPrice; 
          }

          if(tmpClickLimit!=data.daily_click){
            paramjson.daily_click=tmpClickLimit; 
          }

          if(tmpImpLimit!=data.daily_impression){
            paramjson.daily_impression=tmpImpLimit; 
          }

          if(midFType!=tmpFType||midFCP!=tmpFCP||midFIP!=tmpFIP){
            paramjson.frequency='{"type":"'+showFreText(tmpFType).name+'","click":'+tmpFCP+',"impression":'+tmpFIP+'}';
          } 

          for(let name in paramjson){
            count++;
          }
          
          if(count>6){
            if(searchAdEdite){
              dispatch(editeSearchAdStart());
            }else{
              dispatch(editeStart());
            }
            dispatch(editeAd(paramjson));
          }else{
            showToast({msg:'没有值得变化，请修改后再进行保存'});
          }
    }

    componentDidMount() {
      const {tmpFType,tmpFCP,tmpFIP} = this.state;
      midFType=tmpFType;
      midFCP=tmpFCP;
      midFIP=tmpFIP;
      statistics('广告高级信息修改');
    }

    render(){
        const {data,adgroupState,shAdState,searchAdEdite} = this.props;

        const {tmpBid,tmpPrice,tmpClickLimit,tmpImpLimit,tmpFType,tmpFCP,tmpFIP,visible} = this.state;

        const saveData=searchAdEdite?shAdState.searchAdEditing:adgroupState.adEditing;

        let  listData=[
            {showText:'广告出价',msgText:'修改广告出价',key:'tmpBid',value:tmpBid,unlimitBtn:false},
            {showText:'点击上限/日',msgText:'修改点击上限',key:'tmpClickLimit',value:tmpClickLimit,unlimitBtn:true},
            {showText:'展示上限/日',msgText:'修改展示上限',key:'tmpImpLimit',value:tmpImpLimit,unlimitBtn:true}
        ];

        if(userOperator_G){
          listData.unshift({showText:'实际出价',msgText:'修改实际出价',key:'tmpPrice',value:tmpPrice,unlimitBtn:false})
        }

        const freListData=[
          {showText:'点击上限/人',msgText:'修改每人点击上限',key:'tmpFCP',value:tmpFCP,unlimitBtn:true},
          {showText:'展示上限/人',msgText:'修改每人展示上限',key:'tmpFIP',value:tmpFIP,unlimitBtn:true}
        ];

        const rows=listData.map((data,index)=>{
            return(
                <EditeRow key={index} unlimitBtn={true} index={index} setValue={this.setValue.bind(this)} editeData={data} />
            );
        });

        const freRows=freListData.map((data,index)=>{
            return(
                <EditeRow key={index} index={index} setValue={this.setValue.bind(this)} editeData={data} />
            );
        });
        const freStyle=!visible?[styles.rows]:[styles.rows,{borderBottomWidth:0}];

        return(
            <View style={styles.wrap} >

                {rows}

                <TouchableOpacity style={freStyle} onPress={()=>{this.ActionSheet.show()}} >
                   <View style={styles.label} >
                        <Text>频次控制:</Text>
                   </View>
                   <View style={styles.moreInfo} >
                   <Text style={styles.infoText} >{showFreText(this.state.tmpFType).text}</Text>
                    </View>
                
                <ActionSheet 
                    ref={(o) => this.ActionSheet = o}
                    options={['取消', '每天','整个投放周期','不限']}
                    cancelButtonIndex={0}
                    onPress={this.freTypeEdite.bind(this)}
                />
                </TouchableOpacity>
                {this.state.visible&&<View>
                  {freRows}
                </View>}
                <ConfirmButton 
                text='保存' 
                disabled={this.state.disabled}
                fetching={saveData}
                handClick={this.handBtnClick.bind(this)} />
            </View>
        );
    }
}

export function createFre(strjson){
  const frejson=JSON.parse(strjson);
  let object;
  if(frejson.type==null){
    object={
      tmpFType:3,
      tmpFCP:0,
      tmpFIP:0,
    }
  }else if(frejson.type=='day'){
    object={
      tmpFType:1,
      tmpFCP:frejson.click.toString(),
      tmpFIP:frejson.impression.toString(),
    }
  }else if(frejson.type=='whole'){
    object={
      tmpFType:2,
      tmpFCP:frejson.click.toString(),
      tmpFIP:frejson.impression.toString(),
    }
  }
  return object;
}

export function showFreText(num){
  if(num==3){
    return {text:'不限',name:'day'};
  }else if(num==1){
    return  {text:'每天',name:'day'};
  }else if(num==2){
    return {text:'整个投放周期',name:'whole'};
  }
}

const styles=StyleSheet.create({
    wrap:{
        backgroundColor:'#fff',
        marginTop:6,
        flex:1,
    },
    rows:{
        height:40,
        paddingLeft:10,
        paddingRight:10,
        alignItems:'center',
        borderBottomWidth:1,
        borderColor:'#ccc',
        flexDirection:'row',
        justifyContent:'space-between',
    },
    label:{
        height:30,
        paddingRight:4,
        alignSelf:'center',
        justifyContent:'center',
    },
    input:{
        flex:1,
        height:30,
        fontSize:14,
        alignSelf:'center',
    },
    moreInfo:{
        flexDirection:'row',
        alignItems:'center',
    },
    infoText:{
        color:'#8e8e8e',
    },
    arrow_image:{
        width:16,
        height:16,
    }
});