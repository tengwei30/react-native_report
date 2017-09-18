'use strict';

import React from 'react';
import ReactNative from 'react-native';

import {normalize} from '../utils';
import  AdColor from './AdColor';

export function Text({style,...props}){
	return <ReactNative.Text style={[styles.font,style]} {...props} />;
}

export function Text1({style,...props}){
	return <ReactNative.Text style={[styles.font,styles.t1,style]} {...props} />;
}

export function Text2({style,...props}){
	return <ReactNative.Text style={[styles.font,styles.t2,style]} {...props} />;
}

export function Text3({style,...props}){
	return <ReactNative.Text style={[styles.font,styles.t3,style]} {...props} />;
}

export function Heading1({style,...props}){
	return <ReactNative.Text style={[styles.font,styles.h1,style]} {...props} />;
}
export function Heading2({style,...props}){
	return <ReactNative.Text style={[styles.font,styles.h2,style]} {...props} />;
}

export function Heading3({style,...props}){
	return <ReactNative.Text style={[styles.font,styles.h3,style]} {...props} />;
}


export function Paragraph({style,...props}){
	return <Text style={[styles.font,styles.p,style]} {...props} />;
}


const styles=ReactNative.StyleSheet.create({
	font:{
		fontFamily:require('../env').fontFamily,
		fontSize:normalize(16),
	},
	t1:{
		fontSize:normalize(14),
	},
	t2:{
		fontSize:normalize(12),
	},
	t3:{
		fontSize:normalize(10),
	},
	h1:{
		fontSize:normalize(22),
		fontWeight: 'bold',
		color:AdColor.lightText,
	},
	h2:{
		fontSize:normalize(16),
		color:AdColor.lightText,
	},
	h3:{
		fontSize:normalize(14),
		color:AdColor.lightText,
	},
	p:{
		fontSize:normalize(12),
		lineHeight:normalize(24),
		color:AdColor.lightText,
	}
});