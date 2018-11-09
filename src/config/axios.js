import axios from 'axios';
import store from '@/store';
import {aesEncrypt, aesDecrypt} from '@/config/AES';// AES加密解密算法
import {_setSession, _getSession, ajaxStr2JSON} from '@/config/utils';
// import store from './store'

export default (obj) => {
    // 未加共同
    // if(!obj.url){
    //     let user_info = _getSession('user_info');
    //     let userInfo;
    //     if(user_info){
    //         userInfo = JSON.parse(aesDecrypt(user_info));
    //     }
    //     if(obj.urlTo == 'CosCenter'){// CosCenter接口
    //         obj.url = '/COSCenter/CosCenter.aspx';
    //     }else if(obj.urlTo == 'CosApp'){// CosApp接口
    //         if(obj.currProxy&&obj.cosNum){
    //             obj.url = obj.currProxy+"/COS"+obj.cosNum+"/m_IntegratedMenu/CosApp.aspx";
    //         }else{
    //             if(userInfo){
    //                 obj.url = userInfo.currProxy+"/COS"+userInfo.cosNum+"/m_IntegratedMenu/CosApp.aspx"
    //             }
    //         }
    //     }
    // }
    // 共同
    if(!obj.url){
        let user_info = _getSession('user_info');
        let userInfo;
        if(user_info){
            userInfo = JSON.parse(aesDecrypt(user_info));
        }
        if(obj.urlTo == 'CosCenter'){// CosCenter接口
            obj.url = '/COSCenter/CosCenter.aspx';
        }else if(obj.urlTo == 'https'){
            obj.url = '/IotDevice/webin/servlet/webapi';//'/TaobaoMobil/cc/json/mobile_tel_segment.htm';//''
        }else if(obj.urlTo == 'CosApp'){// CosApp接口
            if(obj.currProxy&&obj.cosNum){
                obj.url = obj.currProxy+"/m_IntegratedMenu/CosApp.aspx";
                if(obj.currProxy=='/COS1OLD'){
                    obj.url = obj.currProxy+"/COS"+obj.cosNum+"/m_IntegratedMenu/CosApp.aspx";
                }else if(obj.currProxy!='/COS0IN'&&obj.currProxy!='/COS0OUT'){
                    obj.params.cosNum = obj.cosNum;
                }else{
                    obj.url = obj.currProxy+"/COS"+obj.cosNum+"/m_IntegratedMenu/CosApp.aspx";
                }
            }else{
                if(userInfo){
                    obj.url = userInfo.currProxy+"/m_IntegratedMenu/CosApp.aspx";
                    if(userInfo.currProxy=='/COS1OLD'){
                        obj.url = userInfo.currProxy+"/COS"+userInfo.cosNum+"/m_IntegratedMenu/CosApp.aspx";
                    }else if(userInfo.currProxy!='/COS0IN'&&userInfo.currProxy!='/COS0OUT'){
                        obj.params.cosNum = userInfo.cosNum;
                    }else{
                        obj.url = userInfo.currProxy+"/COS"+userInfo.cosNum+"/m_IntegratedMenu/CosApp.aspx"
                    }
                }
            }
        }else if(obj.urlTo == 'CosStatistic'){// CosApp接口
            obj.url = "/COS1OLD/COS888/m_IntegratedMenu/CosStatistic.aspx";
        }
    }

    if(obj.method.toLowerCase()=='post'){
        var formData = new FormData();
        // 如果有文件上传
        if(obj.uploadFile){
            if(obj.uploadFile.file.length){
                // formData.append('files', obj.uploadFile.file); 
                for (let i = 0; i < obj.uploadFile.file.length; i++) {
                    formData.append('files', obj.uploadFile.file[i])
                }
            }else{
                formData.append('pic', obj.uploadFile.file); 
            }
        }
        if(obj.data){
            for (let it in obj.data) {
                formData.append(it, obj.data[it]);
            }
        }
        obj.data = formData;
        obj.headers = {
            'Content-Type':'multipart/form-data'
        };
    }

    if(obj.url){
        // return ;
        return new Promise((resolve, reject)=>{
            axios(obj).then((result)=>{
                if((typeof result.data)=='string'){
                    console.log(result);
                    let reg = /\n|\t|\r/g;
                    let data = result.data;
                    let elseStr = data.replace(reg,'<br/>');
                    resolve({data:JSON.parse(elseStr)});
                    // return ;
                }else{
                    resolve(result);
                }
            }).catch((err)=>{
                reject(err);
            });
        });
    }else{
        return new Promise((resolve, reject)=>{
            resolve()
        });
    }
    
}