<template>
    <div class="group-detail-container">
        <div class="name-cart">
            <div class="name">
                <span class="f16">{{group.name}}</span>
            </div>
            <div class="cart" v-if="cartDetailIds.length===0" @click="handleActions({}, 'tip')">
                <icon class="el-icon-coral-publishgoods_fill"></icon>
                <badge :text="cartDetailIds.length"></badge>
            </div>
            <div class="cart" @click="handleActions({}, 'buyCart')" v-else>
                <icon class="el-icon-coral-publishgoods_fill"></icon>
                <badge :text="cartDetailIds.length"></badge>
            </div>
        </div>
        <scroller :on-refresh="handleDataRefresh">
            <div class="detail">
                <div>
                    <span class="column f12">
                        <span class="title">组织者：</span>
                        <span>{{group.contacts}}</span>
                    </span>
                </div>
                <div>
                    <span class="column f12">
                        <span class="title">电话：</span>
                        <span>{{group.phone}}</span>
                    </span>
                </div>
                <div>
                    <span class="column f12">
                        <span class="title">截止时间：</span>
                        <span>{{group.end_date}}</span>
                    </span>
                </div>
                <div>
                    <span class="column f12">
                        <span class="title">团购金额：</span>
                        <span class="count">￥{{groupCount}}</span>
                    </span>
                </div>
            </div>
            <div class="description">
                <span class="f12" v-html="group.description"></span>
            </div>
            <div class="items">
                <div class="item" :class="{active: cartDetailIds.includes(item.id)}" v-for="item in details" :key="item.id">
                    <popover placement="right" class="name" @on-show="handleDetailImageShow(item)">
                        <div slot="content" class="popover-content">
                            <span class="f10">{{item.name}}</span>
                            <img :src="imagePath" alt="生物图片加载中..." @click="handleActions(item, 'encyDetail')">
                        </div>
                        <button class="f14">{{item.name}}</button>
                    </popover>
                    <span class="size f15">{{item.size}}</span>
                    <span class="price f15">￥{{item.price}}</span>
                    <span v-if="group.status===1" class="checker" @click="handleCartDetail(item)">
                        <icon class="el-icon-coral-offline_fill" v-if="cartDetailIds.includes(item.id)"></icon>
                        <icon class="el-icon-coral-addition_fill" v-else></icon>
                    </span>
                </div>
            </div>
        </scroller>
        <alert v-model="showTip" title="亲，" content="购物车空空如也，先挑点喜欢的吧~~~"></alert>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
