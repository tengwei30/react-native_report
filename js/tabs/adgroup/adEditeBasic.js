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
    ActivityIndicator,
} from 'react-native';

import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';
import NumberModal from '../../common/numberModal';
import ConfirmButton from '../../common/confirmButton';
import {TimeCheck,MoneyCheck,formatHour,showLaunchDate} from '../../utils';
import env from '../../env';
import {editeAd,editeStart,editeSearchAdStart} from '../../actions/adgroup';

export default class AdEditeBasic extends Component{
    constructor(props) {
      super(props);
      const {data} = this.props;
      this.state = {
        tmpAdName:data.name,
        tmpBudgetDaily:data.budget_daily.toString(),
        tmpBudget:data.budget.toString(),

        minDate:env.currentDate,
        maxDate:env.unlimitDate,
        disabled:false,

        visible:data.enddate>=env.unlimitDate&&env.currentDateTime>=data.startdate?false:true,
        tmpDateType:data.enddate>=env.unlimitDate&&env.currentDateTime>=data.startdate?2:1,
        initDateType:data.enddate>=env.unlimitDate&&env.currentDateTime>=data.startdate?2:1,

        tmpStartDate:moment(data.startdate).format('YYYY-MM-DD'),
        tmpStartTime:formatHour(data.startdate),
        tmpEndDate:moment(data.enddate).format('YYYY-MM-DD'),
        tmpEndTime:formatHour(data.enddate),

        initStartDate:moment(data.startdate).format('YYYY-MM-DD'),
        initStartTime:formatHour(data.startdate),
        initEndDate:moment(data.enddate).format('YYYY-MM-DD'),
        initEndTime:formatHour(data.enddate),
      };
    }
    handNameChange(value){
        let len=value.trim().length;
        this.setState({
          tmpAdName:value,
          disabled:len>0?false:true,
        });
    }
    _dailyEdite(value){
        if(value*1>this.state.tmpBudget*1&&this.state.tmpBudget!=0){
          showToast({msg:'日限额不能大于整体限额，你可先修改整体限额额度'});
          return;
        }
        this.setState({
          tmpBudgetDaily:value
        });
    }

    budgetEdite(value){
      this.setState({
        tmpBudget:value
      });
    }
    handStartDate(date){
      this.setState({
        tmpStartDate:date<env.currentDate?env.currentDate:date,
      });
    }
    handStartTime(time){
      this.setState({
          tmpStartTime:time,
      });
    }
    handEndDate(date){
        this.setState({
          tmpEndDate:date<env.currentDate?env.currentDate:date,
        });
    }
    handEndTime(time){
      this.setState({
          tmpEndTime:time,
      });
    }

    launchDate(index){
      if(index==0) return;

      if(index==1){
        this.setState({
          tmpDateType:index,
          visible:true,
        });
      }else if(index==2){
        this.setState({
          tmpDateType:index,
          visible:false,
          tmpStartDate:env.currentDate,
          tmpStartTime:'00:00:00',
          tmpEndDate:'2038-01-01',
          tmpEndTime:'23:59:59',
        });
      }
    }

    //保存修改后的数据
    handBtnClick(){

      const {data,dispatch,index,searchAdEdite} = this.props;
      const {tmpAdName,tmpBudgetDaily,tmpBudget,tmpStartDate,tmpStartTime,tmpEndDate,tmpDateType,initDateType,tmpEndTime,initStartDate,initStartTime,initEndDate,initEndTime} = this.state;

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
      if(tmpAdName!=data.name){
        paramjson.name=tmpAdName; 
      }

      if(tmpBudgetDaily!=data.budget_daily){
        paramjson.budget_daily=tmpBudgetDaily; 
      }

      if(tmpBudget!=data.budget){
        paramjson.budget=tmpBudget; 
      }

      if(tmpDateType!=initDateType||tmpStartDate!=initStartDate||tmpStartTime!=initStartTime||tmpEndDate!=initEndDate||tmpEndTime!=initEndTime){

        let startdate=tmpStartDate+' '+tmpStartTime;
        let enddate=tmpEndDate+' '+tmpEndTime;
        paramjson.startdate=startdate;
        paramjson.enddate=enddate;

        if(startdate>=enddate){
          showToast({msg:'开始日期不能大于结束日期，请重新选择'});
          return;
        }
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

    componentDidMount(){
      statistics('广告基本信息修改');
    }

    render(){
        const {data,adgroupState,shAdState,searchAdEdite} = this.props;
        const saveData=searchAdEdite?shAdState.searchAdEditing:adgroupState.adEditing;
        const freStyle=!this.state.visible?[styles.rows]:[styles.rows,{borderBottomWidth:0}];
        return(
          <View style={{flex:1}} >
            <ScrollView  
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps={true}
            style={styles.wrap} >
            
                <View style={styles.rows} >
                    <View style={styles.label} >
                    <Text>广告名称:</Text>
                    </View>
                    <TextInput
                    autoCapitalize='none' 
                    autoCorrect={false}
                    returnKeyType='default'
                    underlineColorAndroid = "transparent"
                    enablesReturnKeyAutomatically={true}
            
                    placeholderTextColor='#999'
                    style={styles.input} 
                    defaultValue={this.state.tmpAdName}
                    maxLength={30}
                    
                    onChangeText={(value)=>{
                        this.handNameChange(value)
                        }}
                    />
                </View>
                <TouchableOpacity onPress={()=>{this.NumberModalDay.show()}} style={styles.rows} >
                   <View style={styles.label} >
                        <Text>每日限额:</Text>
                   </View>
                   <View style={styles.moreInfo} >
                        <Text style={styles.infoText} >{MoneyCheck(this.state.tmpBudgetDaily)}</Text>
                        <Image style={styles.arrow_image} source={require('../icons/arrow-right.png')} />
                   </View> 
                </TouchableOpacity>

                <NumberModal
                    titleText='修改日限额'
                    unlimitBtn={true}
                    onEdite={this._dailyEdite.bind(this)}
                    defaultValue={this.state.tmpBudgetDaily}
                    ref={(n)=>this.NumberModalDay=n}
                  />

                <TouchableOpacity onPress={()=>{this.NumberModalall.show()}} style={styles.rows} >
                   <View style={styles.label} >
                        <Text>整体限额:</Text>
                   </View>
                   <View style={styles.moreInfo} >
                        <Text style={styles.infoText} >{MoneyCheck(this.state.tmpBudget)}</Text>
                        <Image style={styles.arrow_image} source={require('../icons/arrow-right.png')} />
                   </View> 
                </TouchableOpacity>
                <NumberModal
                    titleText='修改整体限额'
                    unlimitBtn={true}
                    onEdite={this.budgetEdite.bind(this)}
                    defaultValue={this.state.tmpBudget}
                    ref={(n)=>this.NumberModalall=n}
                  />
                <TouchableOpacity style={freStyle} onPress={()=>{this.ActionSheet.show()}} >
                   <View style={styles.label} >
                        <Text>投放日期:</Text>
                   </View>
                   <View style={styles.moreInfo} >
                   <Text style={styles.infoText} >{showLaunchDate(this.state.tmpDateType)}</Text>
                    </View>
                
                <ActionSheet 
                    ref={(o) => this.ActionSheet = o}
                    options={['取消','自定义','不限']}
                    cancelButtonIndex={0}
                    onPress={this.launchDate.bind(this)}
                />
                </TouchableOpacity>

                {this.state.visible&&<View><TouchableOpacity style={styles.rows} >
                   <View style={styles.label} >
                        <Text>开始日期:</Text>
                   </View>
                   <View style={styles.moreInfo} >
                        <DatePicker
                          style={{width:90}}
                          date={this.state.tmpStartDate}
                          mode="date"
                          format="YYYY-MM-DD"
                          minDate={this.state.minDate}
                          maxDate={this.state.maxDate}
                          confirmBtnText="确认"
                          cancelBtnText="取消"
                          showIcon={false}
                          customStyles={{
                            dateInput: {
                              borderWidth:0,
                            },
                          }}
                          onDateChange={(date) => {this.handStartDate(date)}}
                        />
                        <TouchableOpacity style={styles.timeSelect} onPress={()=>{this.startpicker.toggle()}} >
                          <Text style={styles.timeSelectText} >{this.state.tmpStartTime}</Text>
                        </TouchableOpacity>
                        <Image style={styles.arrow_image} source={require('../icons/arrow-right.png')} />
                   </View> 
                </TouchableOpacity>
                <TouchableOpacity  style={styles.rows} >
                   <View style={styles.label} >
                        <Text>结束日期:</Text>
                   </View>
                   <View style={styles.moreInfo} >
                        <DatePicker
                          style={{width:90}}
                          date={this.state.tmpEndDate}
                          mode="date"
                          format="YYYY-MM-DD"
                          minDate={this.state.minDate}
                          maxDate={this.state.maxDate}
                          confirmBtnText="确认"
                          cancelBtnText="取消"
                          showIcon={false}
                          customStyles={{
                            dateInput: {
                              borderWidth:0,
                            },
                          }}
                          onDateChange={(date) => {this.handEndDate( date)}}
                        />
                        <TouchableOpacity style={styles.timeSelect} onPress={()=>{this.endpicker.toggle()}} >
                          <Text style={styles.timeSelectText} >{this.state.tmpEndTime}</Text>
                        </TouchableOpacity>
                        <Image style={styles.arrow_image} source={require('../icons/arrow-right.png')} />
                   </View> 
                </TouchableOpacity></View>}

                <ConfirmButton 
                text='保存' 
                disabled={this.state.disabled}
                fetching={saveData}
                handClick={this.handBtnClick.bind(this)} />
                
            </ScrollView>
            <Picker
              style={{
                  height: 260,
                  backgroundColor:'#fff',
              }}
              pickerToolBarStyle={{
                backgroundColor:'#fff',
                borderColor:'#ccc',
                height:42,
              }}
              pickerBtnText='确定'
              pickerCancelBtnText='取消'
              ref={(picker) => this.startpicker = picker}
              showDuration={300}
              showMask={true}
              pickerData={env.pickerData}
              selectedValue={this.state.tmpStartTime}
              onPickerDone={this.handStartTime.bind(this)} />

            <Picker
              style={{
                  height: 260,
                  backgroundColor:'#fff',
              }}
              pickerToolBarStyle={{
                backgroundColor:'#fff',
                borderColor:'#ccc',
                height:42,
              }}
              pickerBtnText='确定'
              pickerCancelBtnText='取消'
              ref={(picker) => this.endpicker = picker}
              showDuration={300}
              showMask={true}
              pickerData={env.pickerData}
              selectedValue={this.state.tmpEndTime}
              onPickerDone={this.handEndTime.bind(this)} />
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
    input:{
        flex:1,
        height:40,
        fontSize:14,
        color:'#8e8e8e',
        alignSelf:'center',
    },
    moreInfo:{
        flexDirection:'row',
        alignItems:'center',
    },
    infoText:{
        color:'#8e8e8e',
    },
    timeSelect:{
      height:40,
      justifyContent:'center',
    },
    timeSelectText:{
      color:'#333',
    },
    arrow_image:{
        width:16,
        height:16,
    },
    confirmButton:{
      height:30,
      width:200,
      borderRadius:10,
      backgroundColor:'#ccc',
    }
});