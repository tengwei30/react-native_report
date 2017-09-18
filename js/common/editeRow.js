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

import {TimeCheck,MoneyCheck} from '../utils';
import NumberModal from './numberModal';

export default class EditeRow extends Component{
  constructor(props) {
    super(props);
  
    this.state = {};
  }

  render(){
    const {editeData,index,setValue} = this.props;
    const boxName='NumberBox'+''+index;
    const resultValue=(editeData.value+'').indexOf('.')<0? TimeCheck(editeData.value):MoneyCheck(editeData.value);
    return(
      <View>
      <TouchableOpacity style={styles.rows} onPress={()=>{this.boxName.show()}} >
         <View style={styles.label} >
              <Text>{editeData.showText}</Text>
         </View>
         <View style={styles.moreInfo} >
              <Text style={styles.infoText} >{resultValue}</Text>
              <Image style={styles.arrow_image} source={require('./img/arrow-right.png')} />
         </View> 
      </TouchableOpacity>
      <NumberModal
          titleText={editeData.msgText}
          unlimitBtn={editeData.unlimitBtn}
          rowKey={editeData.key}
          onEdite={setValue}
          defaultValue={editeData.value}
          ref={(n)=>this.boxName=n}
        />
      </View>
    );
  }
}

const styles=StyleSheet.create({

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
    btnBox:{
        flex:1,
        paddingTop:18,
        borderRadius:4,
        alignItems:'center',
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