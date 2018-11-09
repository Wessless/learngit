import { Loading } from 'element-ui';
import htmlparser from 'htmlparser2';
import xml2js from 'xml2js';
/**
 * 存储localStorage
 */
export const _setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const _getStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const _removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

/**
 * 存储sessionStorage
 */
export const _setSession = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const _getSession = name => {
	if (!name) return;
	return window.sessionStorage.getItem(name);
}

/**
 * 删除sessionStorage
 */
export const _removeSession = name => {
	if (!name) return;
	window.sessionStorage.removeItem(name);
}

/**
 * 转成指定的时间格式yyyy-MM-dd HH:mm:ss
 */
export const _format = (dateObj, format) => {
    let t = dateObj;
    let tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}

/**
 * 转换图片base64(跨域图片无法实现)
 */
export const getBase64Image = (url,outputFormat,callback) => {
	// var canvas = document.createElement("canvas");
	// 	canvas.width = 100;
	// 	canvas.height = 100;
	// var context = canvas.getContext("2d");	
	// 	context.font = "20pt Arial";    			
	// 	context.fillStyle = "blue"; 
	// 	context.fillText("RongCloud.cn", 10, 20);
	// var content = canvas.toDataURL("image/jpeg");
	// 	content = content.replace("data:image/jpeg;base64,","");
    // return content;
    var img = new Image;
    img.crossOrigin = 'Anonymous';
    // var deferred=$.Deferred();
    if(url){
        // img.onload =function (){
        //     deferred.resolve(getBase64Image(img));//将base64传给done上传处理
        // }
        img.onload = function(){
            var canvas = document.createElement('canvas');
            canvas.height = img.height;
            canvas.width = img.width;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img,0,0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            callback.call(this, dataURL);
            canvas = null;
        };
    }
    // img.crossOrigin = 'Anonymous';
    // img.setAttribute('crossOrigin', 'anonymous');
    
    img.src = url;
}

/**
 * 图片压缩返回base64
 * @param file 上传文件对象
 * @param quality 压缩比例
 * @param callback 回调函数
 */
export const imageCompress = (file,quality,callback)=>{
    /*
        三个参数
        file：一个是文件(类型是图片格式)，
        w：一个是文件压缩的后宽度，宽度越小，字节越小 格式为{width:}
        callback：一个是容器或者回调函数
        photoCompress()
     */
    function photoCompress(file,w,callback){
        var ready=new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        ready.readAsDataURL(file);
        ready.onload=function(){
            // 原图的base64编码
            var re=this.result;
            canvasDataURL(re,w,callback)
        }
    }
    function canvasDataURL(path, obj, callback){
        var img = new Image();
        img.src = path;
        img.onload = function(){
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);
            var quality = 0.7;  // 默认图片质量为0.7
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/jpeg', quality);
            // 回调函数返回base64的值
            callback(base64);
        }
    }
    photoCompress(file,{ quality:quality },callback)
}

/**
 * 根据文件名返回文件的名称和后缀
 */
export const fileNameInfo = (fileName)=>{
    let fileNameObj = {};
    let fileNameArr = fileName.split(".")
    fileNameObj.ext = fileNameArr[fileNameArr.length-1];
    fileNameArr.splice(fileNameArr.length-1,1);
    fileNameObj.name = fileNameArr.join(".");
    return fileNameObj;
}

/**
 * 计算文件大小
 */
export const fileSizeInfo = (fileSize)=>{
    var type = "B";
    if(fileSize>1024){
        fileSize = fileSize/1024;
        type = "KB";
    }
    if(fileSize>1024){
        fileSize = fileSize/1024;
        type = "MB";
    }
    if(fileSize>1024){
        fileSize = fileSize/1024;
        type = "GB";
    }
    if(fileSize>1024){
        fileSize = fileSize/1024;
        type = "TB";
    }
    return fileSize.toFixed(1) + type;
}

/**
 * 金钱加逗号
 */
export const money = (moneyStr)=>{
    //和钱有关的字符串写成逗号的形式，例如：20,000,000
    function moneyInt(str){
        if(str.length>3){
            var elseStr = str.substring(0,str.length-3);
            var lastStr = str.substring(str.length-3,str.length);
            return moneyInt(elseStr)+","+lastStr;
        }else{
            return str;
        }
    }

    function moneyPoint(str){
        if(typeof str == "number"){
            str = str + "";
        }
        var intStr = str.split(".")[0];
        var isNegative = false;
        if(intStr.substring(0,1)=="-"){
            isNegative = true;
            intStr = intStr.substring(1,intStr.length);
        }
        if(str.split(".").length == 1){
            return isNegative?"-"+moneyInt(intStr):moneyInt(intStr);
        }else if(str.split(".").length == 2){
            return isNegative?"-"+moneyInt(intStr)+"."+str.split(".")[1]:moneyInt(intStr)+"."+str.split(".")[1];
        }
    }

    return moneyPoint(moneyStr);
}

/**
 * 加载中
 */
export const showLoading = ()=>{
    let loadingInstance = Loading.service({fullscreen:true});
    return loadingInstance;
};

/**
 * 取消加载中
 */
export const closeLoading = (loadingInstance)=>{
    loadingInstance.close();
};

export const alertError = (vueDom,errCode,elseObj) => {
    vueDom.$alert('错误码：'+errCode, '错误', {
        confirmButtonText: '确定',
        closeOnClickModal: true,
        type:"error",
        callback: action => {
        }
    });
}

/**
 * 印章
 */
export const stamper = (options)=>{

    var opts = options;
    opts.scale = opts.scale?opts.scale:2;
    opts.speed = opts.speed?opts.speed:800;// 图片初始大小，在原始图片大小上的倍数
    opts.width = opts.width?opts.width:150;// 动画持续时间，单位毫秒

    var canvas = document.createElement("canvas");
    //canvas.setAntiAlias(true);
    var context = canvas.getContext('2d');
    var text = opts.success ? "同意" : "拒绝";
    var text1 = opts.outsideInfo;

    canvas.className = "canvas";
    // 固定宽高
    canvas.width = opts.width;
    canvas.height = opts.width;
    context.translate(0.5, 0.5);

    // 绘制印章边框
    var width = canvas.width / 2;
    var height = canvas.height / 2;
    context.lineWidth = 2;
    var color = opts.color ? opts.color : opts.success ? "#2ecc71" : "rgba(256,0,0,1)";
    context.strokeStyle = color;

    // 深色外圈
    context.beginPath();
    context.arc(width, height, opts.width / 2.5, 0, Math.PI * 2);
    context.stroke();

    // 深色内圈
    context.beginPath();
    context.arc(width, height, (opts.width / 4.5), 0, Math.PI * 2);
    context.stroke();

    context.lineWidth = 1;

    // 浅色外圈
    context.beginPath();
    context.arc(width, height, (opts.width / 2.5) + 5, 0, Math.PI * 2);
    context.stroke();

    // 浅色内圈
    context.beginPath();
    context.arc(width, height, (opts.width / 4.5) - 5, 0, Math.PI * 2);
    context.stroke();

    // 绘制印章名称
    context.font = "lighter 18px sans-serif";
    context.textBaseline = 'middle';
    //设置文本的水平对对齐方式
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.fillStyle = color;
    var angle = Math.PI * 1.75;
    // 平移到此位置,此时字和x轴垂直
    context.rotate(angle);
    if(opts.status){
        //自定义状态
        var status = opts.status;
        if(status.length==3){
            var fontSize = 18;
            context.fillText(status.substring(0,2), 0 - fontSize, 97);
            context.fillText(status[2], 0 - (fontSize/2), 117);
        }else if(status.length==4){
            var fontSize = 18;
            context.fillText(status.substring(0,2), 0 - fontSize, 96);
            context.fillText(status.substring(2,4), 0 - fontSize, 116);
        }else if(status.length==5){
            var fontSize = 14;
            context.font = "lighter "+fontSize+"px sans-serif";
            context.fillText(status.substring(0,3), 0 - 1.5*fontSize, 97);
            context.fillText(status.substring(3,5), 0 - fontSize, 117);
        }else if(status.length==6){
            var fontSize = 14;
            context.font = "lighter "+fontSize+"px sans-serif";
            context.fillText(status.substring(0,3), 0 - 1.5*fontSize, 96);
            context.fillText(status.substring(3,6), 0 - 1.5*fontSize, 116);
        }
    }else{
        var fontSize = 18;
        context.fillText("审批", 0 - fontSize, 96);
        context.fillText(text, 0 - fontSize, 116);
    }
    
    // 平移到此位置,此时字和x轴垂直
    context.rotate(Math.PI * 2 - angle);

    // 绘制印章单位
    context.translate(width, height);
    // 平移到此位置,
    context.font = 'lighter 15px sans-serif'
    var count = text1.length;
    // 字数
    // var angle = 4 * Math.PI / (3 * (count - 1));
    var angle = Math.PI / 8;
    // 字间角度
    var chars = text1.split("");
    // 平移到此位置,
    context.font = '15px Helvetica'
    var c;
    for (var i = 0; i < count; i++) {
        c = chars[i];
        var tempAngle = 0;
        // 汉字
        if (/^([\u4e00-\u9fa5])$/.test(c)) {
            tempAngle = angle;
        }
        // 字母数字
        else if (/^([a-z]|[A-Z]|[0-9])$/.test(c)) {
            tempAngle = angle;
        }
        // 符号
        else {
            tempAngle = angle / 2;
        }
        // 需要绘制的字符
        if (i == 0) {
            context.rotate(5 * Math.PI / 6);
        } else {
            context.rotate(tempAngle);
        }
        //
        context.save();
        context.translate((opts.width / 3) - 5, 0);
        // 平移到此位置,此时字和x轴垂直
        context.rotate(Math.PI / 2);
        // 旋转90度,让字平行于x轴
        context.fillText(c, 0, 0);
        // 此点为字的中心点
        context.restore();
    }

    return canvas.toDataURL("image/png");

};

/**
 * xml字符串转json
 */
export const xmlStr2json = (str)=>{
    return new Promise(function(resolve,reject){
        let parseString = xml2js.parseString;
        parseString(str, function (err, result) {
            resolve(result)
        });
    });
};

/**
 * 正则表达式验证手机号
 */
export const PhoneNumValid = (phoneNum) => {
    return /^((1[3,5,8][0-9])|(14[5,7])|(17[0-9])|(166))\d{8}$/.test(phoneNum);
}

/**
 * 正则表达式验证身份证号码
 */
export const IdentityCodeValid = (code)=>{
    var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;
    
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }
    
    else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17].toUpperCase()){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    return pass;
};

/**
 * 时间格式转换
 */
export function dateTimeFormatter (date ,format) {
    // 时间格式化辅助函数 date:毫秒数 format:'yyyy-MM-dd hh:mm:ss'
    if (!date || date == "") {
        return ""
    }
  
    if (typeof date === "string") {
        var mts = date.match(/(\/Date\((\d+)\)\/)/)
        if (mts && mts.length >= 3) {
            date = parseInt(mts[2])
        }
    }else if (typeof date === "number") {
        date = new Date(date);
    }

    
    if (!date || date.toUTCString() == "Invalid Date") {
        return ""
    }
  
    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    }
  
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t]
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v
                v = v.substr(v.length-2)
            }
            return v
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length)
        }
        return all
    })
  
    return format
}

/**
 * 获取后缀名图片
 */
export const getExtImagePath = (ext) => {
    if(ext=="doc" || ext=="docx"){
        return "static/images/doc.png";
    }else if(ext=="xlsx" || ext=="xls"){
        return "static/images/xlsx.png";
    }else if(ext=="txt"){
        return "static/images/txt.png";
    }else if(ext=="mp3"){
        return "static/images/mp3.png";
    }else if(ext=="mp4"){
        return "static/images/mp4.png";
    }else if(ext=="jpg" || ext=="jpeg" || ext=="png" || ext=="bmp"){
        return "static/images/pic.png";
    }else if(ext=="pdf"){
        return "static/images/pdf.png";
    }else if(ext=="imageText"){
        return "static/images/imageText.png";
    }else{
        return "static/images/undefined.png";
    }
}