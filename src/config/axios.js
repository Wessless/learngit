import axios from 'axios';
import store from '@/store';
import {aesEncrypt, aesDecrypt} from '@/config/AES';// AES加密解密算法
import {_setSession, _getSession} from '@/config/utils';
// import store from './store'

export default (obj) => {
    // if(store.state.userInfo&&store.state.userInfo.cosNum){
    // }
    if(!obj.url){
        let user_info = _getSession('user_info');
        let userInfo;
        if(user_info){
            userInfo = JSON.parse(aesDecrypt(user_info));
        }
        if(obj.urlTo == 'CosCenter'){// CosCenter接口
            obj.url = '/COSCenter/CosCenter.aspx';
        }else if(obj.urlTo == 'CosApp'){// CosApp接口
            if(obj.currProxy&&obj.cosNum){
                obj.url = obj.currProxy+"/COS"+obj.cosNum+"/m_IntegratedMenu/CosApp.aspx";
            }else{
                if(userInfo){
                    obj.url = userInfo.currProxy+"/COS"+userInfo.cosNum+"/m_IntegratedMenu/CosApp.aspx"
                }
            }
        }
    }

    if(obj.method.toLowerCase()=='post'){
        var formData = new FormData();
        // 如果有文件上传
        if(obj.uploadFile){
            formData.append('pic', obj.uploadFile.file); 
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
        return axios(obj);
    }else{
        return new Promise((resolve, reject)=>{
            resolve()
        });
    }
    
}