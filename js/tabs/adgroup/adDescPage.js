'use strict';
import React,{Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    View,
    WebView,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';

import AdDetailHeader from './detailHeader';
import NoDatePage from '../../common/noDatePage';
const winHeight=Dimensions.get('window').height;

export default class AdDescPage extends Component {
    constructor(props) {
      super(props);
      const {data} = this.props;
      this.state={
        showMsg:!data.desc_url?true:false,
      }
    }

    _renderError(){
        return <Text style={styles.center} >页面加载失败</Text>
    }

    render() {
        const {navigator,data} = this.props;
        return (
            <View style={{flex:1}} >
            <AdDetailHeader headerName={data.name}   />
            {this.state.showMsg&&<NoDatePage />}
            {!this.state.showMsg&&<WebView
              automaticallyAdjustContentInsets={false}
              style={styles.body}
              source={{uri: data.desc_url}}
              javaScriptEnabled={true}
              renderError={this._renderError.bind(this)}
              domStorageEnabled={true}
              decelerationRate="normal"
              startInLoadingState={true}
              scalesPageToFit={true} />}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    body: {
        height:winHeight-60,  
    },
    center:{
        alignSelf:'center',
        paddingTop:100,
    }
});
