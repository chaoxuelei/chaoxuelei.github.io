---
title: NodeJs + Express 短信验证完全实践
date: 2019-06-08 18:13:16
tags: javascript
---
>最近在深入学习nodejs+express+mysql的全栈开发，我知道现在mysql、express是老旧的，但是个人感觉还是挺成熟的，而且比较熟悉，先学学看，后面再看看kao、MongoDB，下面就来说说我用nodejs和腾讯云的短信sdk开发的验证码服务，大神嘴下留情啊~。

## 需求
需要实现使用nodejs发送验证码的需求，同一手机号180s只能请求一次。

## 分析
按步骤走（分析需求的已经形成习惯了^ _ ^）

* 判断手机号码是否在180s内发过，如果发过告知180s内只能发一次，* 否则重新计算验证码。
* 如果手机号码从没发过，计算验证码。
* 存储验证码。
* 发送验证码。
* 验证注册数据中手机号和验证码是否都一致。
## 实现
#### 发送验证码
先看流程图：
![](https://i.loli.net/2018/08/24/5b7f6651887c6.png)

使用了express的session包，安装和使用在下面：
```bash
npm install express-session --save
```
配置：
```js
app = express();
app.use(session({
        secret: '610481', 
        resave: false, 
        saveUninitialized: true,
        cookie: {
            maxAge: 1000*60*30
        },
        rolling:true
    })
);
```
上代码：只是示例啊
```js
selectPhone:(req,res,next) => { //从路由跳到这
       let phone = req.body.phone, //获取post参数“话号码”
           romStr; //声明随机变量
       if(req.session[phone]){ //判断session里面是否存在phone(电话号码，为变量)这个key
           if((Date.parse(new Date()) - req.session[phone][1])/1000 > 180){
               romStr = RndNum(4);
               req.session[phone] = [romStr,Date.parse(new Date())];//存储session
           }else{
               res.json({msg:"180秒内只能发一条！"})
               return //res end以后记得return 否则就报错了
           }
       }else{
           romStr = RndNum(4);
           req.session[phone] = [romStr,Date.parse(new Date())]; 
       };
       pool.getConnection(function(err, connection) { 
           // 建立连接
           connection.query(userSQL.selectPhone, phone, function(err, result) {
               //查询手机号是否被注册，judageRes是一个自己写的方法，用于处理数据库查出来的数据的。处理完之后，返回到回调。
               common.judgeRes(result,'query',err,res,function(data){
                   if(data.data[0]){
                       data.data = '手机号已注册！'
                   }else{
                       //腾讯云的sdk封装，下面有具体写法
                       sms.ssender(phone,romStr,(req,res,resData)=>{
                           if (err) {
                               console.log("err: ", err);
                               data.data = "验证码发送失败！"
                           } else {
                               console.log("request data: ", res.req);
                               console.log("response data: ", resData);
                               data.data = "验证码发送成功！"
                           }
                       })
                   }
               });       
               // 释放连接  
               connection.release();
           });
       });
   }
```
腾讯云短信nodejs sdk的封装：
```js
var QcloudSms = require("qcloudsms_js");

// 短信应用SDK AppID
var appid = xxxxxxx;  // SDK AppID是1400开头

// 短信应用SDK AppKey
var appkey = "xxxxxxx";

// 短信模板ID，需要在短信应用中申请
var templateId = 7839;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请
//templateId 7839 对应的内容是"您的验证码是: {1}"
// 签名
var smsSign = "XX";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

// 实例化QcloudSms
var qcloudsms = QcloudSms(appid, appkey);
var ssender = qcloudsms.SmsSingleSender();

module.exports = {
    /*
     * @params phoneNumbers [Array or String]
     * @params params [Array]
     * @params callback(req res resData)
     */
    ssender:(phoneNumbers,params,callback) => {
        ssender.sendWithParam(86, phoneNumbers,templateId,params,smsSign, "", "", callback);
    }
}
```
### 坑
因为使用了postman做接口测试，总是走到了phone不存在这一步，纠结了很久最后发现response会set-Cookie，postman不是浏览器，不会在下次请求的时候携带上这个，所以测试的时候要自己手动设置一下Cookie。
这是response的connect.sid
![](https://i.loli.net/2018/08/24/5b7f6a8aafa27.png)
在request设置Cookie:
![](https://i.loli.net/2018/08/24/5b7f6b0969d0c.png)

如果各位大神还有别的办法，烦请指导。
