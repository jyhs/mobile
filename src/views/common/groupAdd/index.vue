<template>
    <div class="group-add-container">
        <div class="header">
            <span @click="handleActions({}, 'return')">
                <icon class="el-icon-coral-return f20"></icon>
            </span>
            <span class="f16 name">{{bill.name}}</span>
            <span></span>
        </div>
        <div class="input-container m-t-10">
            <div class="input-item">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">团单名</span>
                </div>
                <input placeholder="请输入" v-model="form.name"/>
            </div>
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">联系人姓名</span>
                </div>
                <input placeholder="请输入" v-model="form.contacts"/>
            </div>
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">联系人手机</span>
                </div>
                <input placeholder="请输入" v-model="form.phone"/>
            </div>
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">截止时间</span>
                </div>
                <group>
                    <datetime
                        placeholder="请选择"
                        :start-date="startDate"
                        format="YYYY-MM-DD HH:mm"
                        v-model="form.end_date"
                    >
                    </datetime>
                </group>
            </div>
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">开团城市</span>
                </div>
                <selector placeholder="请选择" :options="cities" v-model="form.city"></selector>
            </div>
            <div class="m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">运费(%)</span>
                </div>
                <x-number v-model="form.freight" :min="0" :max="50" :fillable="true" align="left" width="100px"></x-number>
            </div>
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">其他信息</span>
                </div>
                <quill-editor :options="eidtorOption" v-model="form.description"></quill-editor>
            </div>
            <button class="btn btn-full m-t-10 f16" @click="submit">确认开团</button>
        </div>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
