import ajax from '@fdaciuk/ajax';
import {
	backstageLogin
} from './actions/login';

/*options={
	url:'xxxx',
	method:'get' || 'post', 默认为get
	timeout:默认为10000后timeout
	data:{id:xxx,date:xxxx} 当method为post时data必填
	noPrompt:  可不设置 默认显示loading图标，为true时不显示loadding
}
parentFn 为父级函数，aoptions为父级接收参数
父函数执行，返回token失效时，backstageLogin函数重新获取token，
并再次执行父函数，完成请求
*/
let  adxRequest=function(options,successBack,failBack,parentFn,aoptions){
		let type=options.method || 'get';
		let request=type=='get'?ajax().get(options.url):ajax().post(options.url,options.data);
		let deadTime=options.timeout || 20000;
		let timer = setTimeout(() => {
			request.abort();
		}, deadTime);

		logger.debug('请求参数',aoptions);

		if(!options.noPrompt){
			showLoadBox();
		}
		
		return request.then((responseData, xhr)=>{
			clearTimeout(timer);
			destroyLoadBox();

			if (responseData.ret_code === 1&&responseData.error_code === 400003) {
				store.dispatch(backstageLogin(parentFn, aoptions));
				return;
			}else{
				successBack(responseData);
			}
			
		}).catch((responseError, xhrObject)=>{
			destroyLoadBox();
			if(responseError==''&&!options.noPrompt){
				showToast({msg:'连接超时，请检查网络或稍后重试'});
			} else if(responseError.indexOf('offline')>0){
				showToast({msg:'没有网络连接，请检查网络'});
			} else if(responseError){
				showToast({msg:'网络连接有误，请稍后重试'});
			}
			clearTimeout(timer);
			failBack(responseError);
			
		});
};

export default  adxRequest;
