<template>
    <div class="group-add-container">
        <group>
            <cell is-link :border-intent="false" :arrow-direction="showDetails?'up':'down'"
                  @click.native="showDetails = !showDetails">
                <span slot="title">
                    <span class="dot"></span>
                    <span class="title">{{bill.name}}</span>
                </span>
            </cell>
            <div class="items slide" :class="showDetails ?'animate':''">
                <div class="item" :class="{active: index%2!==1}" v-for="(item, index) in details" :key="item.id">
                    <span class="name f13">{{item.name}}</span>
                    <span class="size f13">{{item.size}}</span>
                    <span class="price f13">￥{{item.price}}</span>
                </div>
            </div>
        </group>
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
            <div class="input-item m-t-10">
                <div class="title f14">
                    <span class="rect"></span>
                    <span class="title-text f14">其他信息</span>
                </div>
                <textarea placeholder="请输入" class="other-info" v-model="form.description"></textarea>
            </div>
            <button class="btn btn-full m-t-10 f16" @click="submit">确认开团</button>
        </div>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
