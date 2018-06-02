<template>
    <div class="my-setting-container">
        <div class="header">
            <div @click="handleActions({}, 'return')">
                <icon class="el-icon-coral-return f20"></icon>
            </div>
            <div class="name">
                <span class="f16">我的信息</span>
            </div>
            <span></span>
        </div>
        <div class="user-name">
            <div class="name-title f14">昵称</div>
            <div>{{user.name}}</div>        
        </div>
        <div>
            <group title="头像">
                <div class="img-uploader">
                    <label class="uploader-wrap">
                        <input type="file" @change="upload($event, 'avatar')"/>
                        <icon class="el-icon-coral-add"></icon>
                        <img :src="avatarImgPath" v-if="avatarImgPath">
                    </label>
                </div>
            </group>
            <group>
                <group-title slot="title" class="group-title">
                    <span>支付二维码</span>
                    <checker 
                        v-model="user.pay_type" 
                        default-item-class="default-checker" 
                        selected-item-class="selected-checker"
                    >
                        <checker-item value="zfb">支付宝</checker-item>
                        <checker-item value="wx">微信</checker-item>
                </checker>
                </group-title>
                <div class="img-uploader">
                    <label class="uploader-wrap" v-if="user.pay_type==='zfb'">
                        <input type="file" @change="upload($event, 'taobao')"/>
                        <icon class="el-icon-coral-add"></icon>
                        <img :src="avatarImgPath" v-if="avatarImgPath">
                    </label>
                    <label class="uploader-wrap" v-else>
                        <input type="file" @change="upload($event, 'wechat')"/>
                        <icon class="el-icon-coral-add"></icon>
                        <img :src="avatarImgPath" v-if="avatarImgPath">
                    </label>
                </div>
            </group>
            <group>
                <group-title slot="title" class="group-title">
                    <span>基本信息</span>
                    <x-button type="primary" mini plain>提交</x-button>
                </group-title>
                <x-input placeholder="请填写手机号" is-type="china-mobile" v-model="user.phone"></x-input>
                <x-input placeholder="请选择所在地址"></x-input>
            </group>
            <group>
                <group-title slot="title" class="group-title">
                    <span>商家信息</span>
                    <x-button type="primary" mini plain>提交</x-button>
                </group-title>
                <x-input placeholder="请填写联系人" v-model="user.contacts"></x-input>
                <x-textarea placeholder="请填写详细地址" :rows="2" v-model="user.address"></x-textarea>
                <x-textarea placeholder="请填写自我介绍" :rows="3" v-model="user.description"></x-textarea>
            </group>
        </div>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
