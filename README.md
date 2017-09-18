# Adp React Native
## 移动版 Powered By React Native

### Tips:
1. 用`npm install`新增模块后需要重新编译，否则会无法找到模块

2. icon图标等图片文件可以加载到`Images.xcassets`中，用`{url: 'name-of-assets'}`读取

3. html supplied to Webview has been deprecated, use the source prop instead。`node_modules/react-native-ichart/index.js` 第20行
```
    html={this.createHTML(renderString)}
   
    修改为:
   
    source={{html: this.createHTML(renderString)}}
```
   参考 https://facebook.github.io/react-native/docs/webview.html
   
