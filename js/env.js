'use strict';

import moment from 'moment';

export default {
	  version: 1.0,
	  fontFamily:'Heiti SC',
	  unlimitDate:'2038-01-01 23:59:59',
	  currentDateTime:moment().format('YYYY-MM-DD HH:MM:SS'),
	  currentDate:moment().format('YYYY-MM-DD'),
	  filterRangeDate:{
			startDate:moment(new Date()).add(-7,'day').format('YYYY-MM-DD'),
			endDate:moment(new Date()).format('YYYY-MM-DD'),
		},
	  pickerData:['00:00:00','01:00:00','02:00:00','03:00:00','04:00:00','05:00:00','06:00:00','07:00:00','08:00:00','09:00:00','10:00:00','11:00:00','12:00:00','13:00:00','14:00:00','15:00:00','16:00:00','17:00:00','18:00:00','19:00:00','20:00:00','21:00:00','22:00:00','23:00:00','23:59:59'],
};
