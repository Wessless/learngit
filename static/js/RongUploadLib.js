var RongIMLib;
(function (RongIMLib) {
    var RongUploadLib = (function () {
        function RongUploadLib(imgOpts, fileOpts) {
            this.store = {};
            this.usingKey = '';
            this.options = {
                uptoken: '',
                get_new_uptoken: false,
                domain: '',
                max_file_size: '100mb',
                max_retries: 3,
                dragdrop: true,
                drop_element: '',
                chunk_size: '4mb',
                auto_start: true,
                container: '',
                browse_button: '',
                conversationType: 0,
                targetId: ""
            };
            var me = this;
            var head = document.getElementsByTagName('head')[0];
            var plScript = document.createElement('script');
            plScript.src = 'http://cdn.ronghub.com/plupload.min.js';
            plScript.onload = plScript.onreadystatechange = function () {
                if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                    var qiniuScript = document.createElement('script');
                    qiniuScript.src = "http://cdn.ronghub.com/qiniu.min.js";
                    qiniuScript.onload = plScript.onreadystatechange = function () {
                        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                            imgOpts && RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                                onSuccess: function (data) {
                                    me.store["imgOpts"] = imgOpts;
                                    imgOpts["uptoken"] = data.token;
                                    me.createOptions(imgOpts, 'IMAGE');
                                },
                                onError: function (error) { }
                            });
                            fileOpts && RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.FILE, {
                                onSuccess: function (data) {
                                    fileOpts["uptoken"] = data.token;
                                    me.store["fileOpts"] = fileOpts;
                                    me.createOptions(fileOpts, 'FILE');
                                },
                                onError: function (error) { }
                            });
                        }
                    };
                    head.appendChild(qiniuScript);
                }
            };
            head.appendChild(plScript);
        }
        RongUploadLib.init = function (imgOpts, fileOpts) {
            RongUploadLib._instance = new RongUploadLib(imgOpts, fileOpts);
        };
        //自定义压缩图片过程，方法最后一行必须调用 callback ，并把压缩好的 base64 传入 callback
        RongUploadLib.imageCompressToBase64 = function (file, callback) {
            RongUploadLib.getInstance().getThumbnail(file, 60000, function (obj, data) {
                var reg = new RegExp('^data:image/[^;]+;base64,');
                var dataFinal = data.replace(reg, '');
                callback(dataFinal);
            });
        };
        RongUploadLib.getInstance = function () {
            return RongUploadLib._instance;
        };
        RongUploadLib.prototype.setListeners = function (listener) {
            this.listener = listener;
        };
        RongUploadLib.prototype.start = function (conversationType, targetId) {
            var me = this;
            this.conversationType = conversationType;
            this.targetId = targetId;
            this.store[this.uploadType].start();
        };
        RongUploadLib.prototype.cancel = function (fileId) {
            this.store[this.uploadType].removeFile(fileId);
        };
        RongUploadLib.prototype.cancelAll = function (callback) {
            var up = this.store[this.uploadType], files = up.files;
            for (var i = 0, len = files.length; i < len; i++) {
                up.removeFile(files[i]);
            }
            callback();
        };
        RongUploadLib.prototype.reload = function (image, file) {
            var me = this;
            image && me.store["IMAGE"] && me.store['IMAGE'].destroy();
            me.store["imgOpts"] && image == 'IMAGE' && RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                onSuccess: function (data) {
                    me.store["imgOpts"]["uptoken"] = data.token;
                    me.createOptions(me.store["imgOpts"], 'IMAGE');
                },
                onError: function (error) { }
            });
            file && me.store['FILE'] && me.store['FILE'].destroy();
            me.store['fileOpts'] && file == 'FILE' && RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.FILE, {
                onSuccess: function (data) {
                    me.store['fileOpts']["uptoken"] = data.token;
                    me.createOptions(me.store['fileOpts'], 'FILE');
                },
                onError: function (error) { }
            });
        };
        RongUploadLib.prototype.destroy = function () {
            var me = this;
            for (var key in me.store) {
                me.store[key].destroy();
                delete me.store[key];
            }
        };
        RongUploadLib.prototype.postImage = function (base64, file, conversationType, targetId, callback) {
            var me = this;
            RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                onSuccess: function (data) {
                    new RongIMLib.RongAjax({ token: data.token, base64: base64 }).send(function (ret) {
                        var opt = { uploadType: 'IMAGE', fileName: ret.hash, isBase64Data: true };
                        me.createMessage(opt, file, function (msg) {
                            RongIMLib.RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                                onSuccess: function (message) {
                                    callback(ret, message);
                                },
                                onError: function (error, message) {
                                    callback(ret, message, error);
                                }
                            });
                        });
                    });
                },
                onError: function (error) { }
            });
        };
        RongUploadLib.prototype.createOptions = function (opts, type) {
            var me = this;
            if (!opts)
                return;
            for (var key in me.options) {
                opts[key] || (opts[key] = me.options[key]);
            }
            //TODO 文件类型目前没有限制类型，若限制类型必须修改当前使用 uploader 的逻辑
            switch (type) {
                case 'IMAGE':
                    !opts['filters'] && (opts['filters'] = {
                        mime_types: [{ title: "Image files", extensions: "jpg,gif,png" }],
                        prevent_duplicates: true
                    });
                    opts.domain || (opts.domain = "http://rongcloud-image.qiniudn.com/");
                    opts.uploadType = type;
                    me.store[type] = me.createUploadFactory(opts, 1);
                    break;
                case 'FILE':
                    opts['filters'] = {
                        mime_types: [],
                        prevent_duplicates: true
                    };
                    opts.domain || (opts.domain = "http://o83059m7d.bkt.clouddn.com/");
                    opts.uploadType = type;
                    me.store[type] = me.createUploadFactory(opts, 2);
                    break;
                case 'VIDEO':
                    !opts['filters'] && (opts['filters'] = {
                        mime_types: [{ title: "Video files", extensions: "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4" }],
                        prevent_duplicates: true
                    });
                    opts.uploadType = type;
                    me.store[type] = me.createUploadFactory(opts, 3);
                    break;
                case 'AUDIO':
                    !opts['filters'] && (opts['filters'] = {
                        mime_types: [{ title: "Audio files", extensions: "mp3,wav,amr,wma" }],
                        prevent_duplicates: true
                    });
                    opts.uploadType = type;
                    me.store[type] = me.createUploadFactory(opts, 4);
                    break;
            }
        };
        RongUploadLib.prototype.createUploadFactory = function (opts, type) {
            var me = this;
            var options = {
                runtimes: opts.runtimes,
                browse_button: opts.browse_button,
                get_new_uptoken: opts.get_new_uptoken,
                domain: opts.domain,
                container: opts.container,
                uptoken: opts.uptoken,
                max_file_size: opts.max_file_size,
                // flash_swf_url: 'path/of/plupload/Moxie.swf',
                max_retries: opts.max_retries,
                dragdrop: opts.dragdrop,
                unique_names: true,
                drop_element: opts.drop_element,
                chunk_size: opts.chunk_size,
                auto_start: false,
                uploadType: opts.uploadType,
                init: {
                    'FilesAdded': function (up, files) {
                        var opts = up.getOption(), name = "";
                        me.uploadType = opts.uploadType;
                        plupload.each(files, function (file) {
                            file.uploadType = me.uploadType;
                            me.listener.onFileAdded(file);
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        var name = "";
                        file.oldName = file.name;
                        if (file.name.lastIndexOf('.') > -1) {
                            name = (+new Date) + '-' + Math.floor(Math.random() * 1000) + '.' + file.name.substr(file.name.lastIndexOf('.') + 1);
                        }
                        else {
                            name = (+new Date) + '-' + Math.floor(Math.random() * 1000);
                        }
                        file.name = name;
                        file.uploadType = me.uploadType;
                        me.listener.onBeforeUpload(file);
                    },
                    'UploadProgress': function (up, file) {
                        file.uploadType = me.uploadType;
                        me.listener.onUploadProgress(file);
                    },
                    'FileUploaded': function (up, file, info) {
                        var option = up.getOption();
                        if (file.name.lastIndexOf('.') > -1) {
                            options.fileName = file.target_name;
                        }
                        else {
                            options.fileName = file.id;
                        }
                        file.uploadType = me.uploadType;
                        me.createMessage(options, file, function (msg) {
                            RongIMLib.RongIMClient.getInstance().sendMessage(me.conversationType, me.targetId, msg, {
                                onSuccess: function (ret) {
                                    me.listener.onFileUploaded(file, ret);
                                },
                                onError: function (error, ret) {
                                    me.listener.onFileUploaded(file, ret, error);
                                }
                            });
                        });
                    },
                    'Error': function (up, err, errTip) {
                        me.listener.onError(up, err, errTip);
                    },
                    'UploadComplete': function () {
                        me.listener.onUploadComplete();
                    },
                    'Key': function (up, file) {
                    }
                }
            };
            opts.filters && (options['filters'] = opts.filters);
            if (type == 1) {
                return Qiniu.uploader(options);
            }
            else {
                var rongQiniu = new QiniuJsSDK();
                return rongQiniu.uploader(options);
            }
        };
        RongUploadLib.prototype.createMessage = function (option, file, callback) {
            var msg = null;
            switch (option.uploadType) {
                case 'IMAGE':
                    RongIMLib.RongIMClient.getInstance().getFileUrl(RongIMLib.FileType.IMAGE, option.fileName, null, {
                        onSuccess: function (data) {
                            if (option.isBase64Data) {
                                RongUploadLib.imageCompressToBase64(file, function (content) {
                                    msg = new RongIMLib.ImageMessage({ content: content, imageUri: data.downloadUrl });
                                    callback(msg);
                                });
                            }
                            else {
                                RongUploadLib.imageCompressToBase64(file.getNative(), function (content) {
                                    msg = new RongIMLib.ImageMessage({ content: content, imageUri: data.downloadUrl });
                                    callback(msg);
                                });
                            }
                        },
                        onError: function (error) { }
                    });
                    break;
                case 'FILE':
                    RongIMLib.RongIMClient.getInstance().getFileUrl(RongIMLib.FileType.FILE, option.fileName, encodeURIComponent(file.oldName), {
                        onSuccess: function (data) {
                            var type = (option.fileName && option.fileName.split('.')[1]) || "";
                            msg = new RongIMLib.FileMessage({ name: file.oldName, size: file.size, type: type, fileUrl: data.downloadUrl });
                            callback(msg);
                        },
                        onError: function (error) { }
                    });
                    break;
                case 'VIDEO':
                    //TODO
                    break;
                case 'AUDIO':
                    //TODO
                    break;
            }
        };
        RongUploadLib.prototype.getThumbnail = function (obj, area, callback) {
            var canvas = document.createElement("canvas"), context = canvas.getContext('2d'), me = this;
            var img = new Image();
            img.onload = function () {
                var target_w;
                var target_h;
                var imgarea = img.width * img.height;
                var _y = 0, _x = 0, maxWidth = 240, maxHeight = 240;
                if (imgarea > area) {
                    var scale = Math.sqrt(imgarea / area);
                    scale = Math.ceil(scale * 100) / 100;
                    target_w = img.width / scale;
                    target_h = img.height / scale;
                }
                else {
                    target_w = img.width;
                    target_h = img.height;
                }
                canvas.width = target_w;
                canvas.height = target_h;
                context.drawImage(img, 0, 0, target_w, target_h);
                try {
                    if (canvas.width > maxWidth || canvas.height > maxHeight) {
                        if (target_w > maxWidth) {
                            _x = (target_w - maxWidth) / 2;
                            target_w = maxWidth;
                        }
                        if (target_h > maxHeight) {
                            _y = (target_h - maxHeight) / 2;
                            target_h = maxHeight;
                        }
                        var imgData = context.getImageData(_x, _y, target_w, target_h);
                        context.createImageData(target_w, target_h);
                        canvas.width = target_w;
                        canvas.height = target_h;
                        context.putImageData(imgData, 0, 0);
                    }
                    var _canvas = canvas.toDataURL("image/jpeg", 0.5);
                    callback(obj, _canvas);
                }
                catch (e) {
                    callback(obj, null);
                }
            };
            img.src = me.getFullPath(obj);
        };
        RongUploadLib.prototype.getFullPath = function (file) {
            window.URL = window.URL || window.webkitURL;
            if (window.URL && window.URL.createObjectURL) {
                return window.URL.createObjectURL(file);
            }
            else {
                return null;
            }
        };
        return RongUploadLib;
    })();
    RongIMLib.RongUploadLib = RongUploadLib;
})(RongIMLib || (RongIMLib = {}));
//# sourceMappingURL=RongUploadLib.js.map
