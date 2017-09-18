import {StyleSheet} from 'react-native';
import AdColor from './AdColor';
export default StyleSheet.create({
    container: {
        flex: 1,
    },
    typeBox:{
        flexDirection:'row',
        height:40,
        backgroundColor:'#fff',
        alignItems:'center',
        paddingRight:10,
        paddingLeft:10,
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderColor:AdColor.borderColor,
        // shadowColor:'#222',
        // shadowOffset:{
        //     width:0.5,
        //     height:1,
        // },
        // shadowOpacity:1,
        // shadowRadius:2,
    },
    header: {
        height: 60,
        paddingTop:16,
        backgroundColor: '#283a49',
        paddingRight: 10,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between',       
    },
    rightBox:{
        flexDirection:'row',
        alignItems:'center',
    },
});