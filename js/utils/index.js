'use strict';
import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {Text2,Text3} from '../common/AdText';
import env from '../env';
import moment from 'moment';
export const NumberFormatter = (num) => {
    num += '';
    const re = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
    num = num.replace(re, "$1,");
    return num;
};

export const DateSplit=(date)=>{
    return  date.split(" ")[0];
};

//日期对象整形
export const DateFormat=(date)=>{
    let year=date.getFullYear();
    let month=date.getMonth()+1;
    let day=date.getDate();

    let mm=month>9?''+month:'0'+month;
    let dd=day>9?''+day:'0'+day;

    return year+'-'+mm+'-'+dd;
}
//推广计划和广告的投放日期的小时部分处理
//除了'23:59:59'不处理，其他的时间段只取小时部分
export function formatHour(date){

  if(date==env.unlimitDate){
    return '23:59:59';
  }
  let hour=moment(date).hour();
  let plasticDate=(hour>9?hour:'0'+hour);
  plasticDate=plasticDate+':00:00';
  return plasticDate;
}
//推广计划和广告编辑部分投放日期的类型
export function showLaunchDate(index){
  if(index==2){
    return '不限'
  }else if(index==1){
    return '自定义';
  }
}

//编辑推广计划根据不同频次数据生成相应的json对象
export function createFrequency(strjson){
  const freArray=JSON.parse(strjson);
  let freObject;
  if(freArray.length==0){
    freObject={
      tmpFCPD:0,
      tmpFIPD:0,
      tmpFCPW:0,
      tmpFIPW:0,
      len:0,
    }
  }else if(freArray.length==1){
    if(freArray[0].type=='day'){
      freObject={
        tmpFCPD:freArray[0].click.toString(),
        tmpFIPD:freArray[0].impression.toString(),
        tmpFCPW:0,
        tmpFIPW:0,
        len:1,
      }
    }else if(freArray[0].type=='whole'){
      freObject={
        tmpFCPD:0,
        tmpFIPD:0,
        tmpFCPW:freArray[0].click.toString(),
        tmpFIPW:freArray[0].impression.toString(),
        len:1,
      }
    }
    
  }else if(freArray.length==2){
    freObject={
      tmpFCPD:freArray[0].click.toString(),
      tmpFIPD:freArray[0].impression.toString(),
      tmpFCPW:freArray[1].click.toString(),
      tmpFIPW:freArray[1].impression.toString(),
      len:2,
    }
  }
  return freObject;
}
//频次控制显示内容控制函数
export function createFreShowText(object){
    if(object.len==0){
        return <Text3>不限</Text3>;
    }else if(object.len==1){
        if(object.tmpFCPD==0&&object.tmpFIPD==0){
        return (<Text3>整个投放周期 ( 点击 {TimeCheck(object.tmpFCPW)} , 展示 {TimeCheck(object.tmpFIPW)}
            )</Text3>); 
        }else if(object.tmpFCPW==0&&object.tmpFIPW==0){
           return(
            <Text3>每天 ( 点击 {TimeCheck(object.tmpFCPD)} , 展示 {TimeCheck(object.tmpFIPD)} )</Text3>
           ); 
        }
    }else if(object.len==2){
        return(
            <Text3>每天 ( 点击 {TimeCheck(object.tmpFCPD)} , 展示 {TimeCheck(object.tmpFIPD)} ),整个投放周期 ( 点击 {TimeCheck(object.tmpFCPW)} , 展示{TimeCheck(object.tmpFIPW)} )
            </Text3>
        );
    }
}
//数字整形成含指定小数位，整数部分3位一分隔
export const numFormat=(s, n)=>{  
    n = n >= 0 && n <= 20 ? n : 2;
    let l;
    let r;
    let t="";

    if(n==0){
        s=s*1;
        s=s.toFixed(n);
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

export const MoneyCheck=(data)=>{
    if(data==0){
        return '不限'
    }
    let result = numFormat(data,2);
    return result+'元';
}

export const modeCheck=(data)=>{
    switch(data){
        case 1:
        return '尽快消耗';
        case 2:
        return '平滑消耗';
        default:
        return '异常';
    }
}

export const TimeCheck=(data)=>{
    if(data==0){
        return '不限'
    }
    let result = numFormat(data,0);
    return result;
}
//广告主状态转换
export const AdvertiserStatus=(status)=>{
    switch(status){
        case 'CUSTOMERSTATUS_NORMAL' :
        return <View style={[styles.Aderstatus]} ><Text2 style={styles.normal} >有效</Text2></View>
        case 'CUSTOMERSTATUS_PAUSE':
        return <View style={[styles.Aderstatus]} ><Text2 style={styles.stop} >暂停</Text2></View>
        case 'CUSTOMERSTATUS_ARCHIVE':
        return <View style={[styles.Aderstatus]} ><Text2 style={styles.stop} >归档</Text2></View>
        default:
        return <View style={[styles.Aderstatus]} ><Text2 style={styles.stop}>异常</Text2></View>
    }
}
//投放设备状态转换
export const deviceTypeChange=(type)=>{
    switch(type){
        case 0 :
        return 'PC';
        case 1 :
        return '移动端';
        case 2 :
        return 'PC+移动端';
        default:
        return '异常';
    }
}

export const CamStatusTextArray=['所有','投放中','待投放','暂停','结束'];
export const CamStatusArray=['{}','STATUS_NORMAL','STATUS_PENDING','STATUS_PAUSE','STATUS_END'];

export const AdStatusTextArray=['所有','投放中','待审核','审核不通过','待投放','暂停','结束'];
export const AdStatusArray=['{}','STATUS_NORMAL','STATUS_AUDIT_PENDING','STATUS_AUDIT_REFUSE','STATUS_PENDING','STATUS_PAUSE','STATUS_END'];
//推广计划、广告状态转换
export const AdCampaignStatus=(status)=>{
    switch(status){
        case 'STATUS_NORMAL' :
        return (
           <View style={[styles.status]} ><Text2 style={styles.normal} >投放中</Text2></View> 
        );
        case 'STATUS_AUDIT_PENDING':
        return (
           <View style={[styles.status]} ><Text2 style={styles.other} >待审核</Text2></View> 
        );
        case 'STATUS_AUDIT_REFUSE':
        return (
           <View style={[styles.status]} ><Text2 style={styles.other}>审核不通过</Text2></View> 
        );
        case 'STATUS_DELETED':
        return (
           <View style={[styles.status]} ><Text2 style={styles.other} >已删除</Text2></View> 
        );
        case 'STATUS_PENDING':
        return (
           <View style={[styles.status]} ><Text2 style={styles.other}>待投放</Text2></View> 
        );
        case 'STATUS_PAUSE':
        return (
           <View style={[styles.status]} ><Text2 style={styles.stop} >暂停</Text2></View> 
        );
        case 'STATUS_END':
        return (
            <View style={[styles.status]} ><Text2 style={styles.stop} >结束</Text2></View>
        );
        default:
        return (
            <View style={[styles.status]} ><Text2 style={styles.stop} >异常</Text2></View>
        );
    }
}
//广告素材类型检验
export const SwfCheck=(src)=>{
    let lastIndex=src.lastIndexOf('.');
    let typeStr='jpg|jpeg|png|bmp|tif';
    let type=src.substring(lastIndex+1).toLowerCase();
    
    if(typeStr.indexOf(type)>=0){
        return true;
    }
    return false;
}

export const ToQueryString = (obj) => {
    return obj ? Object.keys(obj).sort().map((key) => {
        var val = obj[key];
        if (Array.isArray(val)) {
            return val.sort().map((val2) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
            }).join('&');
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
};

let scale=Dimensions.get('window').width/375;

export const normalize=(number)=>{
    return Math.round(number*scale);
}

const styles=StyleSheet.create({
    Aderstatus:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end',
        paddingTop:3,
        paddingBottom:3,
        borderRadius:4,
    },
    status:{      
        alignItems:'center',
        justifyContent:'flex-end',
        padding:3,
        borderRadius:4,
    },
    normal:{
        color:'#74D239'
    },
    other:{
        color:'#ed5565',
    },
    stop:{
        color:'gray'
    },
    end:{
        backgroundColor:'#ed5565'
    },
    pause:{
        backgroundColor:'orange'
    },
    bgColor:{
        color:'#fff',
    }
});