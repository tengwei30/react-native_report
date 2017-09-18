'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    ScrollView,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import ConfirmButton from '../../common/confirmButton';
import {TimeCheck,modeCheck,createFrequency} from '../../utils';
import EditeRow from '../../common/editeRow';
import {editeCampaign,editeStart,editeSearchCamStart} from '../../actions/campaign';
let midFCPD;
let midFIPD;
let midFCPW;
let midFIPW;

export default class CampaignEditeHight extends Component{
    constructor(props) {
      super(props);
      const {data}= this.props;
      const baseState={
        tmpMode:data.mode,
        tmpClickLimit:data.daily_click.toString(),
        tmpImpLimit:data.daily_impression.toString(),
      };
      let changeState=createFrequency(this.props.data.frequency);

      this.state=Object.assign(baseState,changeState);
    }

    setValue(value,key){
      const statekeyValue={};
      statekeyValue[key]=value;
      this.setState(statekeyValue);
    }

    _modeEdite(index) {
        if(index==0) return;
        this.setState({
          tmpMode:index
        });
    }

    handBtnClick(){
        const {data,dispatch,index,searchCamEdite} = this.props;
        const {tmpMode,tmpClickLimit,tmpImpLimit,tmpFCPD,tmpFIPD,tmpFCPW,tmpFIPW} = this.state;
        let count=0;
        let paramjson={
          uid:data.uid,
          cid:data.cid,
          token:userToken_G,
          index:index,
          searchCamEdite:searchCamEdite,
        };
          //判断数据是否修改，修改后会将该字段修改，否则不修改
          if(tmpMode!=data.mode){
            paramjson.mode=tmpMode; 
          }

          if(tmpClickLimit!=data.daily_click){
            paramjson.daily_click=tmpClickLimit; 
          }

          if(tmpImpLimit!=data.daily_impression){
            paramjson.daily_impression=tmpImpLimit; 
          }

          if(tmpFCPD!=midFCPD||tmpFIPD!=midFIPD||tmpFCPW!=midFCPW||tmpFIPW!=midFIPW){
            paramjson.frequency='[{"type":"day","click":'+tmpFCPD+',"impression":'+tmpFIPD+'},{"type":"whole","click":'+tmpFCPW+',"impression":'+tmpFIPW+'}]';
          }

          for(let name in paramjson){
            count++;
          }
          
          if(count>5){
            if(searchCamEdite){
              dispatch(editeSearchCamStart());
            }else{
              dispatch(editeStart());
            }
            dispatch(editeCampaign(paramjson));
          }else{
            showToast({msg:'没有值得变化，请修改后再进行保存'});
          }
    }

    componentDidMount(){
      midFCPD=this.state.tmpFCPD;
      midFIPD=this.state.tmpFIPD;
      midFCPW=this.state.tmpFCPW;
      midFIPW=this.state.tmpFIPW;
      statistics('推广计划高级信息修改');
    }

    render(){
        const {data,campaignState,shCampaignState,searchCamEdite} = this.props;
        const {tmpClickLimit,tmpImpLimit,tmpFCPD,tmpFIPD,tmpFCPW,tmpFIPW} = this.state;
        const saveData=searchCamEdite?shCampaignState.searchCamEditing:campaignState.camEditing;
        const  listData=[
            {showText:'点击上限/日',msgText:'修改点击上限',key:'tmpClickLimit',value:tmpClickLimit,unlimitBtn:true},
            {showText:'展示上限/日',msgText:'修改展示上限',key:'tmpImpLimit',value:tmpImpLimit,unlimitBtn:true},
            {showText:'点击上限/人/日',msgText:'修改每人每天点击上限',key:'tmpFCPD',value:tmpFCPD,unlimitBtn:true},
            {showText:'展示上限/人/日',msgText:'修改每人每天展示上限',key:'tmpFIPD',value:tmpFIPD,unlimitBtn:true},
            {showText:'点击上限/人/整个投放周期',msgText:'修改每人整个投放周期的点击上限',key:'tmpFCPW',value:tmpFCPW,unlimitBtn:true},
            {showText:'展示上限/人/整个投放周期',msgText:'修改每人整个投放周期的展示 上限',key:'tmpFIPW',value:tmpFIPW,unlimitBtn:true},
        ];

        const rows=listData.map((data,index)=>{
            return(
                <EditeRow key={index} index={index} setValue={this.setValue.bind(this)} editeData={data} />
            );
        });
 
        return(
            <View  style={styles.wrap} >
                <TouchableOpacity style={styles.rows} onPress={()=>{this.ActionSheet.show()}} >
                   <View style={styles.label} >
                        <Text>消耗类型:</Text>
                   </View>
                   <View>
                        <Text style={styles.infoText} >{modeCheck(this.state.tmpMode)}</Text>
                   </View> 
                </TouchableOpacity>

                <ActionSheet 
                    ref={(o) => this.ActionSheet = o}
                    options={['取消', '尽快消耗','平滑消耗']}
                    cancelButtonIndex={0}
                    onPress={this._modeEdite.bind(this)}
                />
                
                {rows}

                <ConfirmButton 
                text='保存' 
                disabled={this.state.disabled}
                fetching={saveData}
                handClick={this.handBtnClick.bind(this)} />
            </View>
        );
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
    infoText:{
        color:'#8e8e8e',
    },
});