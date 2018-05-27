<template>
    <div class="group-detail-container">
        <div class="name-cart">
            <div @click="handleActions({}, 'return')">
                <icon class="el-icon-coral-return f20">
                    <span class="f16" style="position: relative; top: -2px;">回首页</span>
                </icon>
            </div>
            <div class="name">
                <span class="f16">{{group.name}}</span>
            </div>
            <div class="cart" v-if="cartDetailIds.length===0" @click="handleActions({}, 'tip')">
                <icon class="el-icon-coral-publishgoods_fill"></icon>
                <badge :text="cartDetailIds.length"></badge>
            </div>
            <div class="cart" @click="handleActions({}, 'cartDetail')" v-else>
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
            <div class="nav">
                <tab class="tab-container" bar-active-color="#28b1ea" active-color="#28b1ea">
                    <tab-item :selected="activeTab==='hy'" @on-item-click="handleTabItemClick('hy')">
                        <div class="tab-item-container">
                            <span class="text f13">海水鱼</span>
                        </div>
                    </tab-item>
                    <tab-item :selected="activeTab==='rt'" @on-item-click="handleTabItemClick('rt')">
                        <div class="tab-item-container">
                            <span class="text f13">软体珊瑚</span>
                        </div>
                    </tab-item>
                    <tab-item :selected="activeTab==='yg'" @on-item-click="handleTabItemClick('yg')">
                        <div class="tab-item-container">
                            <span class="text f13">硬骨珊瑚</span>
                        </div>
                    </tab-item>
                    <tab-item :selected="activeTab==='qt'" @on-item-click="handleTabItemClick('qt')">
                        <div class="tab-item-container">
                            <span class="text f13">其他</span>
                        </div>
                    </tab-item>
                </tab>
            </div>
            <div class="items" v-if="details.length!==0">
                <div class="block-content" v-for="item in details" :key="item.id">
                    <div class="content-main ency-content-main">
                        <div class="pic">
                            <img :src="item.encyImage" alt="生物图片">
                        </div>
                        <div class="info">
                            <div class="name-price">
                                <span class="ency-name f15">{{item.name}}</span>
                                <div>
                                    <span class="ency-size f12">{{item.size}}</span>
                                    <span class="ency-price">
                                    <span class="price-title f12">价格:</span><span class="price-text f12">
                                        ￥{{item.price}}
                                    </span>
                                </span>
                                </div>
                            </div>
                            <div class="others">
                                <div>
                                    <badge v-if="item.recommend==='tj'" text="推荐"></badge>
                                </div>
                                <div class="actions">
                                    <icon class="el-icon-coral-publishgoods_fill" v-if="cartDetailIds.includes(item.id)"
                                          @click="handleActions({}, 'cartDetail')">
                                    </icon>
                                    <icon class="el-icon-coral-addition_fill" v-else
                                          @click="handleCartDetail(item)">
                                    </icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="details.length===0" style="font-size: 16px; text-align: center; margin-top: 100px;">
                暂无可购买的生物，请去别处逛逛~~~
            </div>
        </scroller>
        <alert v-model="showTip" title="亲，" content="购物车空空如也，先挑点喜欢的吧~~~"></alert>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
