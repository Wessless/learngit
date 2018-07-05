<template>
    <div class="staffInfoDetail">
        <chat-header :showBack="true" :title="title" :showRightBtn="true" :rightBtnTitle="'确认'" :rightBtnName="'confirm'" :rightBtnType="'btn'" @confirm="confirm"></chat-header>
        <el-tabs type="border-card" id="staffInfoTabs" v-model="tabs.selectedTab" @tab-click="handleClick" class="tab">
            <el-tab-pane label="基本信息" name="first">
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">姓名：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.staffName" size="small" placeholder="请输入姓名"></el-input></el-col>
                    <el-col :span="4"><div class="redColor">*必填</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">性别：</div></el-col>
                    <el-col :span="12">
                        <el-radio v-model="staffInfo.sex" label="1">男</el-radio>
                        <el-radio v-model="staffInfo.sex" label="0">女</el-radio>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">出生日期：</div></el-col>
                    <el-col :span="12">
                        <el-date-picker
                            v-model="staffInfo.birthday"
                            type="date"
                            size="small"
                            placeholder="选择出生日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">民族：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.nation" size="small" placeholder="请输入民族"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">身份证号码：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.identityNumber" size="small" placeholder="请输入身份证号码"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">身份证有效期：</div></el-col>
                    <el-col :span="12">
                        <el-date-picker
                            v-model="staffInfo.identityValidity"
                            type="date"
                            size="small"
                            placeholder="选择身份证有效期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">身份证扫描件：</div></el-col>
                    <el-col :span="12">
                        <el-button size="small" type="primary" @click="clickUploadIDNumber">点击上传</el-button>
                        <input name="file" type="file" id="staffInfoDetailUploadFile" style="display:none" accept=".png,.jpg,.jpeg" @change="IDNumberFileChange"/>
                        <span>{{ IDNumberFileName }}</span>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">手机：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.mobile" size="small" placeholder="请输入手机号"></el-input></el-col>
                    <el-col :span="4"><div class="redColor">*必填</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">员工编号：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.staffNum" size="small" placeholder="请输入员工编号"></el-input></el-col>
                    <el-col :span="4"><div class="redColor">*必填</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">员工卡号：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.cardID" size="small" placeholder="请输入员工卡号"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">COS用户名：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.cosUserName" size="small" placeholder="请输入COS用户名"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">部门：</div></el-col>
                    <el-col :span="12">
                        <!-- <el-input v-model="staffInfo.departmentID" size="small" placeholder="请输入部门"></el-input> -->
                        <el-select v-model="staffInfo.departmentID" multiple size="small" style="width:100%;" placeholder="请选择部门">
                            <el-option
                                v-for="item in departmentList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4"><div class="redColor">*必填</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">角色：</div></el-col>
                    <el-col :span="12">
                        <el-select v-model="staffInfo.roleID" size="small" style="width:100%;" placeholder="请选择角色">
                            <el-option
                                v-for="item in roleList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4"><div class="redColor">*必填</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg bankBg">
                    <el-col :span="4"><div class="title">是否参与工资计算：</div></el-col>
                    <el-col :span="12" style="display:flex;align-items:center;min-height:32px;">
                        <el-checkbox v-model="staffInfo.isSalaryNotIncluded" style="margin-bottom:0;">不参与</el-checkbox>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg bankBg">
                    <el-col :span="4"><div class="title">工资开户行：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.salaryBank" size="small" placeholder="请输入工资开户行"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg bankBg">
                    <el-col :span="4"><div class="title">工资卡号：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.salaryCardNum" size="small" placeholder="请输入工资卡号"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg timeBg" style="margin-top:10px;padding-top:10px;">
                    <el-col :span="4"><div class="title">入职时间：</div></el-col>
                    <el-col :span="12">
                        <el-date-picker
                            v-model="staffInfo.beStaff"
                            type="date"
                            size="small"
                            placeholder="选择入职时间"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>    
                    </el-col>
                    <el-col :span="4"><div class="redColor">*必填</div></el-col>
                </el-row>
                <el-row type="flex" class="row-bg timeBg">
                    <el-col :span="4"><div class="title">转正时间：</div></el-col>
                    <el-col :span="12">
                        <el-date-picker
                            v-model="staffInfo.turnDate"
                            type="date"
                            size="small"
                            placeholder="选择转正时间"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg timeBg">
                    <el-col :span="4"><div class="title">本公司工龄：</div></el-col>
                    <el-col :span="12">
                        {{ companyYear }}
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg timeBg">
                    <el-col :span="4"><div class="title">离职时间：</div></el-col>
                    <el-col :span="9">
                        <el-date-picker
                            v-model="staffInfo.notBeStaff"
                            type="date"
                            size="small"
                            placeholder="选择离职时间"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="3" style="display:flex;align-items:center;flex-direction:row-reverse">
                        <el-checkbox v-model="staffInfo.hasLeaveCompany" style="padding-left:10px;margin-bottom:0;">已离职</el-checkbox>
                    </el-col>
                </el-row>
                <!-- <el-row type="flex" class="row-bg" style="padding-top:10px;">
                    <el-col :span="24"><el-button size="small" style="float:right;" type="primary" @click="nextTip('second')">下一步</el-button></el-col>
                </el-row> -->
            </el-tab-pane>
            <el-tab-pane label="一般信息" name="second">
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">简历编号：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.resumeNum" size="small" placeholder="请输入简历编号"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">住址：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.address" size="small" placeholder="请输入住址"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">距单位距离：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.distance" size="small" placeholder="请输入距单位距离"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">住所电话：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.tel" size="small" placeholder="请输入住所电话"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">公司分机号：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.telephoneExtension" size="small" placeholder="请输入公司分机号"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">公司电子邮箱：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.mailBox" size="small" placeholder="请输入公司电子邮箱"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">个人电子邮箱：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.personEmail" size="small" placeholder="个人电子邮箱"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">QQ：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.QQ" size="small" placeholder="请输入QQ"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">微信：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.wechat" size="small" placeholder="请输入微信"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">Skype/YY/其他：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.otherNo" size="small" placeholder="请输入其他联系方式"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">紧急联络方式：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.urgencyTelNo" size="small" placeholder="请输入紧急联络方式"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">政治面貌：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.political" size="small" placeholder="请输入政治面貌"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">婚姻状况：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.isMarry" size="small" placeholder="请输入婚姻状况"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">户口所在地：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.hometown" size="small" placeholder="请输入户口所在地"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">户口性质：</div></el-col>
                    <el-col :span="12">
                        <el-select v-model="staffInfo.homeNature" size="small" style="width:100%;" placeholder="请选择户口性质">
                            <el-option key="1" label="农业" value="1"></el-option>
                            <el-option key="0" label="非农业" value="0"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">档案调入时间：</div></el-col>
                    <el-col :span="12">
                        <el-date-picker
                            v-model="staffInfo.fileTurnInDate"
                            type="date"
                            size="small"
                            placeholder="选择入档案调入时间"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">存档户名：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.filePersonName" size="small" placeholder="请输入存档户名"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">保险转入时间：</div></el-col>
                    <el-col :span="12">
                        <el-date-picker
                            v-model="staffInfo.insuranceTurnInDate"
                            type="date"
                            size="small"
                            placeholder="选择保险转入时间"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">转入单位：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.turnInPlace" size="small" placeholder="请输入转入单位"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">身高：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.bodyHight" size="small" placeholder="请输入身高"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">体重：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.bodyWeight" size="small" placeholder="请输入体重"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">视力：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.sight" size="small" placeholder="请输入视力"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">血型：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.bloodType" size="small" placeholder="请输入血型"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">健康状况：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.isHealth" size="small" placeholder="请输入健康状况"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">学历：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.degree" size="small" placeholder="请输入学历"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">毕业学校：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.graduateSchool" size="small" placeholder="请输入毕业学校"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">技术职称：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.jobName" size="small" placeholder="请输入技术职称"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">参加工作时间：</div></el-col>
                    <el-col :span="12">
                        <el-date-picker
                            v-model="staffInfo.jobInTime"
                            type="date"
                            size="small"
                            placeholder="选择参加工作时间"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="资格信息" name="third">
                <div class="infoItem">
                    <div class="infoTitle">证书</div>
                    <el-table :data="certificationList" style="width: 100%;" @selection-change="changeCertificationList">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column label="证书名称" width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.Name" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="证书等级" width="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.Level" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="证书编号" width="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.Number" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="发证日期" width="150">
                            <template slot-scope="scope">
                                <!-- <el-input v-model="scope.row.CertificationDate" placeholder="" size="small"></el-input> -->
                                <el-date-picker
                                    v-model="scope.row.CertificationDate"
                                    type="date"
                                    size="small"
                                    placeholder="选择发证日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    style="width:100%;">
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column label="发证机关">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.Place" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="扫描件" width="200">
                            <template slot-scope="scope">
                                <el-button size="small" type="primary" @click="uploadFile(scope.row,$event)">上传文件</el-button>
                                <input type="file" style="display:none;" @change="fileChange(scope.row,$event)">
                                <span>{{ scope.row.filePath }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button size="small" type="primary" style="margin-top:10px;" @click="addCertificationList">添加</el-button>
                    <el-button size="small" type="primary" style="margin-top:10px;" @click="deleteCertificationList">删除</el-button>
                </div>
                <div class="infoItem">
                    <div class="infoTitle">论文</div>
                    <el-table :data="staffInfo.thesisList" @selection-change="changeThesisList" style="width: 100%;">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column label="论文题目">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.Title" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="发表时间" width="180">
                            <template slot-scope="scope">
                                <!-- <el-input v-model="scope.row.PublishDate" placeholder="" size="small"></el-input> -->
                                <el-date-picker
                                    v-model="scope.row.PublishDate"
                                    type="date"
                                    size="small"
                                    placeholder="选择发表时间"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    style="width:100%;">
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column label="发表刊物">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.Publication" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="发表刊物级别" width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.PublicationLevel" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button size="small" type="primary" style="margin-top:10px;" @click="addThesisList">添加</el-button>
                    <el-button size="small" type="primary" style="margin-top:10px;" @click="deleteThesisList">删除</el-button>
                </div>
                <div class="infoItem">
                    <div class="infoTitle">外语资格</div>
                    <el-table :data="staffInfo.languagesList" @selection-change="changeLanguagesList" style="width: 100%;">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column label="语种">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.LanguageClass" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="等级类型" width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.Mold" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="等级" width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.LanguageLevel" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="等级考试成绩" width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.Point" placeholder="" size="small"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button size="small" type="primary" style="margin-top:10px;" @click="addLanguagesList">添加</el-button>
                    <el-button size="small" type="primary" style="margin-top:10px;" @click="deleteLanguagesList">删除</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="家庭信息" name="forth">
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">配偶姓名：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.spouse" size="small" placeholder="请输入配偶姓名"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">配偶工作单位：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.spouseWorkSpace" size="small" placeholder="请输入配偶工作单位"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">配偶工作地址：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.spouseWorkAddress" size="small" placeholder="请输入配偶工作地址"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">配偶联系方式：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.spouseTel" size="small" placeholder="请输入配偶联系方式"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg topblock">
                    <el-col :span="4"><div class="title">子女姓名：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.childName1" size="small" placeholder="请输入子女姓名"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女性别：</div></el-col>
                    <el-col :span="12">
                        <el-radio v-model="staffInfo.sexManChild1" label="1">男</el-radio>
                        <el-radio v-model="staffInfo.sexManChild1" label="0">女</el-radio>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女出生日期：</div></el-col>
                    <el-col :span="12">
                        <el-date-picker
                            v-model="staffInfo.childBirthday1"
                            type="date"
                            size="small"
                            placeholder="选择子女出生日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女教育阶段：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.childGrade1" size="small" placeholder="请输入子女教育阶段"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女就读学校：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.childSchool1" size="small" placeholder="请输入子女就读学校"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg topblock">
                    <el-col :span="4"><div class="title">子女姓名：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.childName2" size="small" placeholder="请输入子女姓名"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女性别：</div></el-col>
                    <el-col :span="12">
                        <el-radio v-model="staffInfo.sexManChild2" label="1">男</el-radio>
                        <el-radio v-model="staffInfo.sexManChild2" label="0">女</el-radio>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女出生日期：</div></el-col>
                    <el-col :span="12">
                        <el-date-picker
                            v-model="staffInfo.childBirthday2"
                            type="date"
                            size="small"
                            placeholder="选择子女出生日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女教育阶段：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.childGrade2" size="small" placeholder="请输入子女教育阶段"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女就读学校：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.childSchool2" size="small" placeholder="请输入子女就读学校"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg topblock">
                    <el-col :span="4"><div class="title">子女姓名：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.childName3" size="small" placeholder="请输入子女姓名"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女性别：</div></el-col>
                    <el-col :span="12">
                        <el-radio v-model="staffInfo.sexManChild3" label="1">男</el-radio>
                        <el-radio v-model="staffInfo.sexManChild3" label="0">女</el-radio>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女出生日期：</div></el-col>
                    <el-col :span="12">
                        <el-date-picker
                            v-model="staffInfo.childBirthday3"
                            type="date"
                            size="small"
                            placeholder="选择子女出生日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            style="width:100%;">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女教育阶段：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.childGrade3" size="small" placeholder="请输入子女教育阶段"></el-input></el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">子女就读学校：</div></el-col>
                    <el-col :span="12"><el-input v-model="staffInfo.childSchool3" size="small" placeholder="请输入子女就读学校"></el-input></el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="备注信息" name="fifth">
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">备注：</div></el-col>
                    <el-col :span="12">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 4}"
                            placeholder="请输入备注"
                            v-model="staffInfo.note">
                        </el-input>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="审批设定" name="sixth">
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">财务负责人：</div></el-col>
                    <el-col :span="6">
                        <el-select v-model="staffInfo.financeSignManager1" filterable placeholder="请选择财务负责人">
                            <el-option
                            v-for="item in staffs"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="staffInfo.financeSignManager2" filterable placeholder="请选择财务负责人">
                            <el-option
                            v-for="item in staffs"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="staffInfo.financeSignManager3" filterable placeholder="请选择财务负责人">
                            <el-option
                            v-for="item in staffs"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">考勤负责人：</div></el-col>
                    <el-col :span="12">
                        <el-select v-model="staffInfo.timeScheduleManager" filterable placeholder="请选择考勤负责人">
                            <el-option
                            v-for="item in staffs"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                    <el-col :span="4"><div class="title">工作计划负责人：</div></el-col>
                    <el-col :span="12">
                        <el-select v-model="staffInfo.dailyManager" filterable placeholder="请选择工作计划负责人">
                            <el-option
                            v-for="item in staffs"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

import { getAllRoles,addOrUpdateStaffDetail,addCertifications,findStaffByStaffID,getDepartmentsByFact } from '@/js/api'
import { money,stamper,showLoading,closeLoading,xmlStr2json } from '@/config/utils'
import { mapState, mapMutations } from 'vuex'
import ChatHeader from '@/components/chat/ChatHeader'
// isSalaryNotIncluded
export default {
    name: 'StaffInfoDetail',
    data(){
        return {
            title:"",
            tabs:{
                selectedTab:"first",
            },
            roleList:[],
            departmentList:[],
            staffInfo:{
                staffName:"",
                staffNum:"",
                sex:"1",
                identityNumber:"",
                cardID:"",
                departmentID:[],
                roleID:"",
                beStaff:"",
                turnDate:"",
                notBeStaff:"",
                mobile:"",
                birthday:"",
                nation:"",
                identityValidity:"",
                cosUserName:"",// 无
                isSalaryNotIncluded:true,// 是否参与工资计算 1:不参加，0：参加
                salaryBank:"",
                salaryCardNum:"",
                hasLeaveCompany:false,
                resumeNum:"",
                address:"",
                distance:"",
                tel:"",
                telephoneExtension:"",
                mailBox:"",
                personEmail:"",
                QQ:"",
                wechat:"",
                otherNo:"",
                urgencyTelNo:"",
                political:"",
                isMarry:"",
                hometown:"",
                homeNature:"",
                fileTurnInDate:"",
                filePersonName:"",
                insuranceTurnInDate:"",
                turnInPlace:"",
                bodyHight:"",
                bodyWeight:"",
                sight:"",
                bloodType:"",
                isHealth:"",
                degree:"",
                graduateSchool:"",
                jobName:"",
                jobInTime:"",
                spouse:"",
                spouseWorkSpace:"",
                spouseWorkAddress:"",
                spouseTel:"",
                childName1:"",
                sexManChild1:"1",
                childBirthday1:"",
                childGrade1:"",
                childSchool1:"",
                childName2:"",
                sexManChild2:"1",
                childBirthday2:"",
                childGrade2:"",
                childSchool2:"",
                childName3:"",
                sexManChild3:"1",
                childBirthday3:"",
                childGrade3:"",
                childSchool3:"",
                note:"",
                thesisList:[],
                languagesList:[],
                financeSignManager1:"",
                financeSignManager2:"",
                financeSignManager3:"",
                timeScheduleManager:"",
                dailyManager:""
            },
            IDNumberFile:null,
            IDNumberFileName:"",
            certificationList:[],
            delCertificationList:[],
            requestDeleteCertification:[],
            delThesisList:[],
            delLanguagesList:[],
            staffs:[]
        }
    },
    components:{
        ChatHeader
    },
    mounted(){
        if(this.$route.meta.type=="add"){
            this.title = "添加员工信息";
        }else if(this.$route.meta.type=="update"){
            this.title = "修改员工信息";
            this.loadStaffInfo();
        }

        // 获取所有角色
        getAllRoles().then((result)=>{
            let array = result.data.data;
            console.log(result);
            this.roleList = [];
            for(let i=0;i<array.length;i++){
                let json = {
                    value:array[i].RoleID,
                    label:array[i].RoleName
                };
                this.roleList.push(json);
            }
        });

        // 获取所有部门
        getDepartmentsByFact("1").then((result)=>{
            let array = result.data.data;
            this.departmentList = [];
            for(let i=0;i<array.length;i++){
                let json = {
                    value:array[i].DepID,
                    label:array[i].DepName
                };
                this.departmentList.push(json);
            }
        });

        var staffs = [];
        for(var i=0;i<this.allStaffs.length;i++){
            var json = {
                value:this.allStaffs[i].StaffID,
                label:this.allStaffs[i].StaffName
            }
            staffs.push(json);
        }
        this.staffs = staffs;

    },
    computed:{
        ...mapState([
            'userInfo',
            'allStaffs'
        ]),
        companyYear(){
            let str = this.staffInfo.beStaff?this.staffInfo.beStaff:"";
            var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
            if (r == null) return "";
            var d = new Date(r[1], r[3] - 1, r[4]);
            if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
                var Y = new Date().getFullYear();
                var resY = Y - r[1];
                var m = new Date().getMonth();
                if ((m - d.getMonth()) >0 ) {
                    resY += 0.5;
                } else if ((m - d.getMonth()) < 0) {
                    resY -= 0.5;
                }
                return (resY + "年");
            }
        }
    },
    watch:{
    },
    methods:{
        // 切换顶部
        handleClick(tab, event) {
            console.log(tab, event);
        },
        changeCertificationList(val) {
            this.delCertificationList = val;
        },
        changeThesisList(val){
            this.delThesisList = val;
        },
        changeLanguagesList(val){
            this.delLanguagesList = val;
        },
        addCertificationList() {
            let length = this.certificationList.length;
            let num = 0;
            if(length>0){
                num = this.certificationList[length-1].ID + 1;
            }
            this.certificationList.push({
                ID:num,
                CertificationID:"",
                Name: "",
                Level: "",
                Number: "",
                Place: "",
                CertificationDate: "",
                filePath:"",
                file:null
            });
        },
        addThesisList(){
            let length = this.staffInfo.thesisList.length;
            let num = 0;
            if(length>0){
                num = this.staffInfo.thesisList[length-1].ID + 1;
            }
            this.staffInfo.thesisList.push({
                ID:num, 
                ThesisID:"",
                Title: "",
                PublishDate: "",
                Publication: "",
                PublicationLevel: ""
            });
        },
        addLanguagesList(){
            let length = this.staffInfo.languagesList.length;
            let num = 0;
            if(length>0){
                num = this.staffInfo.languagesList[length-1].ID + 1;
            }
            this.staffInfo.languagesList.push({
                ID:num, 
                LanguageID:"",
                LanguageClass: "",
                Mold: "",
                LanguageLevel: "",
                Point: ""
            });
        },
        deleteCertificationList(){
            for(let i=0;i<this.delCertificationList.length;i++){
                let delID = this.delCertificationList[i].ID;
                let certificationID = this.delCertificationList[i].CertificationID;
                if(certificationID!=""){
                    this.requestDeleteCertification.push(certificationID);
                }
                this.delArrayByID(this.certificationList,delID);
            }
        },
        deleteThesisList(){
            for(let i=0;i<this.delThesisList.length;i++){
                let delID = this.delThesisList[i].ID;
                this.delArrayByID(this.staffInfo.thesisList,delID);
            }
        },
        deleteLanguagesList(){
            for(let i=0;i<this.delLanguagesList.length;i++){
                let delID = this.delLanguagesList[i].ID;
                this.delArrayByID(this.staffInfo.languagesList,delID);
            }
        },
        delArrayByID(array,id){
            for(let i=0;i<array.length;i++){
                if(array[i].ID==id){
                    array.splice(i,1);
                }
            }
        },
        // 上传扫描件
        uploadFile(obj,e){
            e.target.parentNode.nextElementSibling.click();
        },
        // 选择文件后
        fileChange(obj,e){
            let file = e.target.files[0];
            let fileName = file.name;
            obj.filePath = fileName;
            obj.file = file;
        },
        clickUploadIDNumber(){
            document.getElementById("staffInfoDetailUploadFile").click();
        },
        IDNumberFileChange(e){
            let file = e.target.files[0];
            this.IDNumberFile = file;
            this.IDNumberFileName = file.name;
            // let fileSize = fileSizeInfo(file.size);
        },
        nextTip(tipName){
            this.tabs.selectedTab = tipName;
            document.getElementById('staffInfoTabs').scrollTop = 0;
        },
        // 加载员工信息
        loadStaffInfo(){
            let loading = showLoading();
            let staffID = this.$route.params.staffID;
            findStaffByStaffID(staffID).then((result)=>{
                closeLoading(loading);
                let staffInfo = result.data.data[0];
                let bestaff = staffInfo.BeStaff;
                if(bestaff){
                    bestaff = staffInfo.BeStaff.substring(0,4)+"-"+staffInfo.BeStaff.substring(4,6)+"-"+staffInfo.BeStaff.substring(6,8);
                }
                let notBeStaff = staffInfo.NotBeStaff;
                if(notBeStaff){
                    notBeStaff = staffInfo.NotBeStaff.substring(0,4)+"-"+staffInfo.NotBeStaff.substring(4,6)+"-"+staffInfo.NotBeStaff.substring(6,8);
                }
                let turnDate = staffInfo.TurnDate;
                if(turnDate){
                    turnDate = staffInfo.TurnDate.substring(0,4)+"-"+staffInfo.TurnDate.substring(4,6)+"-"+staffInfo.TurnDate.substring(6,8);
                }
                this.staffInfo.staffName = staffInfo.StaffName;
                this.staffInfo.staffNum = staffInfo.StaffNum;
                this.staffInfo.sex = staffInfo.Sex;
                this.staffInfo.identityNumber = staffInfo.IdentityNumber;
                this.staffInfo.cardID = staffInfo.CardID;
                this.staffInfo.departmentID = staffInfo.DepartmentID.split(",");
                this.staffInfo.roleID = staffInfo.RoleID;
                this.staffInfo.beStaff = bestaff;
                this.staffInfo.turnDate = turnDate;
                this.staffInfo.notBeStaff = notBeStaff;
                this.staffInfo.mobile = staffInfo.Mobile;
                this.staffInfo.birthday = staffInfo.Birthday.split(" ")[0];
                this.staffInfo.nation = staffInfo.Nation;
                this.staffInfo.identityValidity = staffInfo.IdentityValidity;
                // cosUserName:"ceshiyuangong",// 无
                this.staffInfo.cosUserName = staffInfo.cosUserName;
                this.staffInfo.isSalaryNotIncluded = staffInfo.IsSalaryNotIncluded=="1"?true:false;
                this.staffInfo.salaryBank = staffInfo.SalaryBank;
                this.staffInfo.salaryCardNum = staffInfo.SalaryCardNum;
                // hasLeaveCompany:false,
                this.staffInfo.hasLeaveCompany = false;
                this.staffInfo.resumeNum = staffInfo.ResumeNum;
                this.staffInfo.address = staffInfo.Address;
                this.staffInfo.distance = staffInfo.Distance;
                this.staffInfo.tel = staffInfo.HomeTEL;
                this.staffInfo.telephoneExtension = staffInfo.TelephoneExtension;
                this.staffInfo.mailBox = staffInfo.EmailAccount;
                this.staffInfo.personEmail = staffInfo.PersonEmail;
                this.staffInfo.QQ = staffInfo.QQ;
                this.staffInfo.wechat = staffInfo.WeChat;
                this.staffInfo.otherNo = staffInfo.OtherNo;
                this.staffInfo.urgencyTelNo = staffInfo.UrgencyTelNo;
                this.staffInfo.political = staffInfo.Political;
                this.staffInfo.isMarry = staffInfo.IsMarry;
                this.staffInfo.hometown = staffInfo.Hometown;
                this.staffInfo.homeNature = staffInfo.HomeNature;
                this.staffInfo.fileTurnInDate = staffInfo.FileTurnInDate;
                this.staffInfo.filePersonName = staffInfo.FilePersonName;
                this.staffInfo.insuranceTurnInDate = staffInfo.InsuranceTurnInDate;
                this.staffInfo.turnInPlace = staffInfo.TurnInPlace;
                this.staffInfo.bodyHight = staffInfo.BodyHight;
                this.staffInfo.bodyWeight = staffInfo.BodyWeight;
                this.staffInfo.sight = staffInfo.Sight;
                this.staffInfo.bloodType = staffInfo.BloodType;
                this.staffInfo.isHealth = staffInfo.IsHealth;
                this.staffInfo.degree = staffInfo.Degree;
                this.staffInfo.graduateSchool = staffInfo.GraduateSchool;
                this.staffInfo.jobName = staffInfo.JobName;
                this.staffInfo.jobInTime = staffInfo.JobInTime;
                this.staffInfo.spouse = staffInfo.Spouse;
                this.staffInfo.spouseWorkSpace  = staffInfo.SpouseWorkSpace;
                this.staffInfo.spouseWorkAddress = staffInfo.SpouseWorkAddress;
                this.staffInfo.spouseTel = staffInfo.SpouseTel;
                this.staffInfo.childName1 = staffInfo.ChildName1;
                this.staffInfo.sexManChild1 = staffInfo.SexManChild1;
                this.staffInfo.childBirthday1 = staffInfo.ChildBirthday1;
                this.staffInfo.childGrade1 = staffInfo.ChildGrade1;
                this.staffInfo.childSchool1 = staffInfo.ChildSchool1;
                this.staffInfo.childName2 = staffInfo.ChildName2;
                this.staffInfo.sexManChild2 = staffInfo.SexManChild2;
                this.staffInfo.childBirthday2 = staffInfo.ChildBirthday2;
                this.staffInfo.childGrade2 = staffInfo.ChildGrade2;
                this.staffInfo.childSchool2 = staffInfo.ChildSchool2;
                this.staffInfo.childName3 = staffInfo.ChildName3;
                this.staffInfo.sexManChild3 = staffInfo.SexManChild3;
                this.staffInfo.childBirthday3 = staffInfo.ChildBirthday3;
                this.staffInfo.childGrade3 = staffInfo.ChildGrade3;
                this.staffInfo.childSchool3 = staffInfo.ChildSchool3;
                this.staffInfo.note = staffInfo.Note;
                this.certificationList = [];
                for(let i=0;i<staffInfo.Certifications.length;i++){
                    let obj = staffInfo.Certifications[i];
                    let json = {
                        ID:i,
                        CertificationID:obj.CertificationID,
                        Name: obj.CertificationName,
                        Level: obj.CertificationLevel,
                        Number: obj.CertificationNumber,
                        Place: obj.CertificationOffice,
                        CertificationDate: obj.CertificationDate,
                        filePath: "",
                        file:null
                    }
                    this.certificationList.push(json);
                }
                this.staffInfo.thesisList = [];
                for(let i=0;i<staffInfo.Thesises.length;i++){
                    let obj = staffInfo.Thesises[i];
                    let json = {
                        ID:i, 
                        ThesisID:obj.ThesisID,
                        Title: obj.ThesisTitle,
                        PublishDate: obj.PublishDate,
                        Publication: obj.Publication,
                        PublicationLevel: obj.PublicationLevel
                    };
                    this.staffInfo.thesisList.push(json);
                }
                this.staffInfo.languagesList = [];
                for(let i=0;i<staffInfo.Languages.length;i++){
                    let obj = staffInfo.Languages[i];
                    let json = {
                        ID:i, 
                        LanguageID: obj.LanguageID,
                        LanguageClass: obj.LanguageClass,
                        Mold: obj.Mold,
                        LanguageLevel: obj.LanguageLevel,
                        Point: obj.Point
                    };
                    this.staffInfo.languagesList.push(json);
                }
                this.staffInfo.financeSignManager1 = staffInfo.FinanceSignManager=="-1"?"":staffInfo.FinanceSignManager;
                this.staffInfo.financeSignManager2 = staffInfo.FinanceSignManager2=="-1"?"":staffInfo.FinanceSignManager2;
                this.staffInfo.financeSignManager3 = staffInfo.FinanceSignManager3=="-1"?"":staffInfo.FinanceSignManager3;
                this.staffInfo.timeScheduleManager = staffInfo.TimeScheduleManager=="-1"?"":staffInfo.TimeScheduleManager;
                this.staffInfo.dailyManager = staffInfo.DailyManager=="-1"?"":staffInfo.DailyManager;
            });
        },
        // 添加证书
        addCertificationsRequest(staffID){
            let certificationList = [];
            let file = [];
            let delCertificationID = this.requestDeleteCertification.join(",");
            for(let i=0;i<this.certificationList.length;i++){
                let json = {
                    Name:this.certificationList[i].Name,
                    Level:this.certificationList[i].Level,
                    Number:this.certificationList[i].Number,
                    Place:this.certificationList[i].Place,
                    CertificationDate:this.certificationList[i].CertificationDate
                }
                let thisFile = this.certificationList[i].file;
                let certificationID = this.certificationList[i].CertificationID
                if(certificationID==""){
                    if(thisFile){
                        certificationList.push(json);
                        file.push(thisFile);
                    }else{
                        this.$message({
                            message:"未上传文件",
                            type:"error"
                        })
                        return;
                    }
                }
            }
            if(certificationList.length>0){
                let promiseArray = [];
                for(let i=0;i<certificationList.length;i++){
                    promiseArray.push(addCertifications(staffID,JSON.stringify([certificationList[i]]),"",file[i]))
                }
                promiseArray.push(addCertifications(staffID,"",delCertificationID,[]))
                Promise.all(promiseArray)
                .then((result)=>{
                    console.log(result);
                    let flag = true;
                    for(let i=0;i<result.length;i++){
                        if(result[i].data.Result=="1"){

                        }else{
                            flag = false;
                        }
                    }
                    if(flag){
                        // this.$message({
                        //     message:"修改证书成功",
                        //     type:"success"
                        // });
                        window.history.go(-1);
                    }else{
                        this.$message({
                            message:"修改证书失败",
                            type:"error"
                        })
                    }
                })
                .catch();
            }else{
                window.history.go(-1);
            }
        },
        // 点击确认保存模板
        confirm(){
            let staffID = "-1";
            if(this.$route.meta.type=="add"){
                staffID = "-1";
            }else if(this.$route.meta.type=="update"){
                staffID = this.$route.params.staffID;
            }
            let file = "";
            if(this.IDNumberFile){
                file = this.IDNumberFile;
            }
            let callback = () => {
                console.log("callback");
            }
            let languagesList = [];
            for(let i=0;i<this.staffInfo.languagesList.length;i++){
                let json = {
                    LanguageClass: this.staffInfo.languagesList[i].LanguageClass,
                    Mold: this.staffInfo.languagesList[i].Mold,
                    LanguageLevel: this.staffInfo.languagesList[i].LanguageLevel,
                    Point: this.staffInfo.languagesList[i].Point
                }
                languagesList.push(json);
            }
            let thesisList = [];
            for(let i=0;i<this.staffInfo.thesisList.length;i++){
                let json = {
                    Title: this.staffInfo.thesisList[i].Title,
                    PublishDate: this.staffInfo.thesisList[i].PublishDate,
                    Publication: this.staffInfo.thesisList[i].Publication,
                    PublicationLevel: this.staffInfo.thesisList[i].PublicationLevel
                };
                thesisList.push(json);
            }
            console.log(this.staffInfo.spouse)
            let requestJSON = {
                staffID,
                staffName : this.staffInfo.staffName,
                staffNum : this.staffInfo.staffNum,
                sex : this.staffInfo.sex,
                identityNumber : this.staffInfo.identityNumber,
                cardID : this.staffInfo.cardID,
                departmentID : this.staffInfo.departmentID.join(","),
                roleID : this.staffInfo.roleID,
                beStaff : this.staffInfo.beStaff,
                notBeStaff : this.staffInfo.notBeStaff,
                turnDate : this.staffInfo.turnDate,
                mobile : this.staffInfo.mobile,
                birthday : this.staffInfo.birthday,
                nation : this.staffInfo.nation,
                identityValidity : this.staffInfo.identityValidity,
                isSalaryNotIncluded : this.staffInfo.isSalaryNotIncluded?"1":"0",
                salaryBank : this.staffInfo.salaryBank,
                salaryCardNum : this.staffInfo.salaryCardNum,
                resumeNum : this.staffInfo.resumeNum,
                address : this.staffInfo.address,
                distance : this.staffInfo.distance,
                tel : this.staffInfo.tel,
                telephoneExtension : this.staffInfo.telephoneExtension,
                mailBox : this.staffInfo.mailBox,
                personEmail : this.staffInfo.personEmail,
                QQ : this.staffInfo.QQ,
                wechat : this.staffInfo.wechat,
                otherNo : this.staffInfo.otherNo,
                urgencyTelNo : this.staffInfo.urgencyTelNo,
                political : this.staffInfo.political,
                isMarry : this.staffInfo.isMarry,
                hometown : this.staffInfo.hometown,
                homeNature : this.staffInfo.homeNature,
                fileTurnInDate : this.staffInfo.fileTurnInDate,
                filePersonName : this.staffInfo.filePersonName,
                insuranceTurnInDate : this.staffInfo.insuranceTurnInDate,
                turnInPlace : this.staffInfo.turnInPlace,
                bodyHight : this.staffInfo.bodyHight,
                bodyWeight : this.staffInfo.bodyWeight,
                sight : this.staffInfo.sight,
                bloodType : this.staffInfo.bloodType,
                isHealth : this.staffInfo.isHealth,
                degree : this.staffInfo.degree,
                graduateSchool : this.staffInfo.graduateSchool,
                jobName : this.staffInfo.jobName,
                jobInTime : this.staffInfo.jobInTime,
                note : this.staffInfo.note,
                spouse : this.staffInfo.spouse,
                spouseWorkSpace : this.staffInfo.spouseWorkSpace,
                spouseWorkAddress : this.staffInfo.spouseWorkAddress,
                spouseTel : this.staffInfo.spouseTel,
                childName1 : this.staffInfo.childName1,
                sexManChild1 : this.staffInfo.sexManChild1,
                childBirthday1 : this.staffInfo.childBirthday1,
                childGrade1 : this.staffInfo.childGrade1,
                childSchool1 : this.staffInfo.childSchool1,
                childName2 : this.staffInfo.childName2,
                sexManChild2 : this.staffInfo.sexManChild2,
                childBirthday2 : this.staffInfo.childBirthday2,
                childGrade2 : this.staffInfo.childGrade2,
                childSchool2 : this.staffInfo.childSchool2,
                childName3 : this.staffInfo.childName3,
                sexManChild3 : this.staffInfo.sexManChild3,
                childBirthday3 : this.staffInfo.childBirthday3,
                childGrade3 : this.staffInfo.childGrade3,
                childSchool3 : this.staffInfo.childSchool3,
                thesisList : JSON.stringify(thesisList),
                languagesList : JSON.stringify(languagesList),
                financeSignManager1 : this.staffInfo.financeSignManager1,
                financeSignManager2 : this.staffInfo.financeSignManager2,
                financeSignManager3 : this.staffInfo.financeSignManager3,
                timeScheduleManager : this.staffInfo.timeScheduleManager,
                dailyManager : this.staffInfo.dailyManager,
                file,
                callback
            };
            console.log(requestJSON);
            let loading = showLoading();
            addOrUpdateStaffDetail(requestJSON).then((result)=>{
                closeLoading(loading);
                console.log(result)
                let staffID = result.data.staffID;
                let name = "";
                if(this.$route.meta.type=="add"){
                    name = "添加";
                }else if(this.$route.meta.type=="update"){
                    name = "修改";
                }
                if(!isNaN(Number(staffID))){
                    this.$message({
                        message: name+'成功',
                        type: 'success'
                    });
                    this.addCertificationsRequest(staffID);
                }else{
                    this.$message({
                        message: name+'失败',
                        type: 'error'
                    });
                }
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.staffInfoDetail{
    padding:20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; 
    max-height: 100%;
    overflow: scroll;
    background: #fafafa;
    padding-top:74px;
    position: relative;
}
.tab{
    width:100%;
    display: table;
}
.tab:after{
    display: block;
    content: "";
    clear: both;
}
.row-bg{
    padding-bottom: 10px;
}
.title{
    height: 100%;
    display: flex;
    align-items: center;
}
.redColor{
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: red;
}
.bankBg{
    background: #ffb6c1;
}
.timeBg{
    background-color: #90ee90;
}
.topblock{
    margin-top:20px;
}
.infoItem{
    position: relative;
    width: 100%;
    border: 1px solid #999;
    border-radius: 5px;
    padding:10px;
    margin-bottom:20px;
}
.infoTitle{
    position: absolute;
    display: inline-block;
    height:20px;
    left:30px;
    top:-10px;
    z-index:3;
    background: #fff;
    padding:0 5px;
}
</style>