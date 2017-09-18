import React, {
	Component
} from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';
import AdColor from './AdColor';

export default class ReloadPage extends Component {
	reload_click() {
		this.props.reload_click();
	}
	render() {
		return (
			<TouchableOpacity 
            style={styles.wrap} 
            onPress={this.reload_click.bind(this)} >
                <View style={styles.centerBox} >
                	<Image resizeMode='contain' style={styles.imgBox} source={require('./img/network_error.png')} />
                    <Text>网络异常</Text>
                    <View style={styles.button} >
                    	<Text style={{color:'#fff'}} >点击重试</Text>
                    </View>
                </View>
            </TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	wrap: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 100,
		backgroundColor:AdColor.viewBackground,
	},
	centerBox: {
		alignItems: 'center',
	},
	imgBox: {
		width: 80,
		height: 80,
	},
	button: {
		width: 80,
		height: 26,
		backgroundColor: '#40c5fc',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
		marginTop: 6,
	}
});