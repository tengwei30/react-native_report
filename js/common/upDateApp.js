'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Platform,
} from 'react-native';

import codePush from "react-native-code-push";

export default class UpdDateApp extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  	syncMessage:'',
	  	progress:'',
	  };
	}

	async sync() {
	    try {
	      return await codePush.sync(
	        {
	          installMode: codePush.InstallMode.IMMEDIATE,
	        },
	        (syncStatus) => {
	          switch(syncStatus) {
	          	case codePush.SyncStatus.CHECKING_FOR_UPDATE:
  	              this.setState({
  	                syncMessage: "正在检查安装包…"
  	              });
  	              break;
	            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
	              this.setState({
	                syncMessage: "正在下载安装包…"
	              });
	              break;
	              case codePush.SyncStatus.AWAITING_USER_ACTION:
	              this.setState({
	                syncMessage: "Awaiting user action."
	              });
              break;
	            case codePush.SyncStatus.INSTALLING_UPDATE:
	              this.setState({
	                syncMessage: "更新包安装中…"
	              });
	              break;
	            case codePush.SyncStatus.UP_TO_DATE:
	              this.setState({
	                syncMessage: "应用已是最新版！",
	                progress: false
	              });
	              if(Platform.OS==='ios'){
		            StatusBar.setBarStyle(1);
		          }else{
		            StatusBar.setBackgroundColor('transparent');
		            StatusBar.setTranslucent(true);
		          }
	              this.props.navigator.pop();
	              break;
	            case codePush.SyncStatus.UPDATE_IGNORED:
	              this.setState({
	                syncMessage: "用户终止更新",
	                progress: false
	              });
	              break;
	            case codePush.SyncStatus.UPDATE_INSTALLED:
	              this.setState({
	                syncMessage: "更新安装成功",
	                progress: false
	              });
	              break;
	            case codePush.SyncStatus.UNKNOWN_ERROR:
	              this.setState({
	                syncMessage: "未知的错误！",
	                progress: false
	              });
	              if(Platform.OS==='ios'){
		            StatusBar.setBarStyle(1);
		          }else{
		            StatusBar.setBackgroundColor('transparent');
		            StatusBar.setTranslucent(true);
		          }
	              this.props.navigator.pop();
	              break;
	          }
	        },
	        (progress) => {
	          this.setState({
	            progress: progress
	          });
	        }
	      );
	    } catch (error) {
	      codePush.log(error);
	    }
	  }

	componentDidMount() {
      codePush.notifyApplicationReady();
  	}

    render() {
    	const {rangeDate} = this.state;
    	let syncView, syncButton, progressView;
    	//根据process值算出百分比，控制进度条width
    	let loadedWidth=this.state.progress?(this.state.progress.receivedBytes/this.state.progress.totalBytes)*260:0;

    	if(Platform.OS==='ios'){
            StatusBar.setBarStyle(0);
        }else{
            StatusBar.setBackgroundColor('transparent');
            StatusBar.setTranslucent(true);
        }

    	if (this.state.syncMessage) {
    	  syncView = (
    	    <Text style={styles.messages}>{this.state.syncMessage}</Text>
    	  );
    	} else {
    	  syncButton = (
    	    <TouchableOpacity style={styles.updateButton} onPress={this.sync.bind(this)}>
    	      <Text style={{ fontSize: 14,color:'#007aff'}}>点击更新</Text>
    	    </TouchableOpacity>
    	  );
    	}

        return (
			<View style={styles.wrap} >	
			    <View style={styles.box}>
			      <View style={styles.noticeText} >
				      {syncButton}
				      {syncView}
			      </View>
      		      <View style={styles.progressBox} >
      			      <View style={styles.allDate} >
          	  			<View style={[styles.loaded,{width:loadedWidth}]} ></View>
          	  		  </View>
      		      </View>
      		      <Text style={{fontSize:12}} >有可用的更新，请点击更新，耐心等待安装完成</Text>
			    </View>
	       </View>
        );
    }
}

const styles=StyleSheet.create({
	wrap:{
		flex:1,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'rgba(0,0,0,0.5)',
	},
	box:{
		width:280,
		backgroundColor:'#fff',
		alignItems:'center',
		paddingRight:16,
		paddingLeft:16,
		paddingBottom:16,
		borderRadius:10,
	},
	messages:{
		fontSize:14,
	},
	noticeText:{
		height:60,
		justifyContent:'center',
	},
	progressBox:{
		flexDirection:'row',
		marginBottom:14,
	},
	updateButton:{
		paddingTop:14,
		paddingBottom:14,
		alignItems:'center',
  		width:248,
	},	
	loaded:{
		height:6,
		borderRadius:4,
		backgroundColor:'#5171b1',
	},
	allDate:{
		width:260,
		height:8,
		borderRadius:4,
		borderWidth:1,
		backgroundColor:'#ececec',
		borderColor:'#ccc',
	}
});