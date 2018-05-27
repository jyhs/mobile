<template>
    <div class="user-carts-container">
        <div class="header">
            <div @click="handleActions({}, 'return')">
                <icon class="el-icon-coral-return f20"></icon>
            </div>
            <div class="name">
                <span class="f16">{{groupName}}的订单</span>
            </div>
            <span></span>
        </div>
        <scroller :on-refresh="handleDataRefresh">
            <div class="block">
                <div class="no-tips" v-if="cartList&&cartList.length===0">
                    空空如也~~~
                </div>
                <div class="block-content" v-else v-for="cart in cartList" :key="cart.id"
                     @click="handleActions(cart, 'cartItems')">
                    <div class="content-main cart-content-main">
                        <div class="avatar">
                            <img :src="cart.userAvatar" alt="用户头像">
                        </div>
                        <div class="info">
                            <div class="info-item">
                                <span class="f14 c666">{{cart.user_name}}</span>
                                <span class="f12 c999">购买于{{mapDate(cart.insert_date)}}</span>
                            </div>
                            <div class="info-item">
                                <span>
                                    <icon class="el-icon-coral-mobilephone_fill f12 c999"></icon>
                                    <span class="f12 c999">{{cart.phone}}</span>
                                </span>
                                <span>
                                    <icon class="el-icon-coral-caiwu-xianxing f12"></icon>
                                    <span class="f12 c999">{{cart.sum}}</span>
                                </span>
                                <span @click.stop="handleActions(cart, 'delete')">
                                    <icon class="el-icon-coral-delete_fill f12"></icon>
                                    <span class="f12 c999">删除</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
