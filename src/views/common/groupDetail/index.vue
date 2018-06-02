<template>
    <div class="group-detail-container">
        <div style="height: 44px" v-if="isSearching">
            <search
                ref="encySearch"
                v-model="searchText"
                position="absolute"
                auto-scroll-to-top
                @on-change="handleSearchChange"
                @on-focus="handleActions({}, 'encySearch')"
                @on-cancel="handleActions({}, 'encySearchCancel')"
            >
            </search>
        </div>
        <div class="name-cart" v-else>
            <div @click="handleActions({}, 'return')">
                <icon class="el-icon-coral-return f20">
                    <span class="f16" style="position: relative; top: -2px;">回首页</span>
                </icon>
            </div>
            <div class="name">
                <span class="f16">{{group.name}}</span>
            </div>
            <div class="cart" @click="handleActions({}, 'search')">
                <icon class="el-icon-coral-search"></icon>
            </div>
        </div>
        <div class="bottom">
            <div class="total">
                <span class="f20">合计：￥{{totalPrice}}</span>
            </div>
            <div class="confirm" @click="handleActions({}, 'cartDetail')">
                <span class="f20">去确认({{cartDetailIds.length}})</span>
            </div>
        </div>
        <scroller :on-refresh="handleDataRefresh">
            <div class="detail" v-if="!isSearching">
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
            <div class="description" v-if="!isSearching">
                <span class="f12" v-html="group.description"></span>
            </div>
            <div class="nav" v-if="!isSearching">
                <tab class="tab-container" bar-active-color="#28b1ea" active-color="#28b1ea">
                    <tab-item :selected="activeTab==='hy'" @on-item-click="handleTabItemClick('hy')">
                        <div class="tab-item-container">
                            <span class="text f13">海水鱼</span>
                        </div>
                    </tab-item>
                    <tab-item :selected="activeTab==='sh'" @on-item-click="handleTabItemClick('sh')">
                        <div class="tab-item-container">
                            <span class="text f13">珊瑚</span>
                        </div>
                    </tab-item>
                    <tab-item :selected="activeTab==='qt'" @on-item-click="handleTabItemClick('qt')">
                        <div class="tab-item-container">
                            <span class="text f13">其它</span>
                        </div>
                    </tab-item>
                    <tab-item :selected="activeTab==='wfl'" @on-item-click="handleTabItemClick('wfl')">
                        <div class="tab-item-container">
                            <span class="text f13">未分类</span>
                        </div>
                    </tab-item>
                </tab>
            </div>
            <div class="items" :class="{pT05Rem: isSearching}" v-if="details.length!==0">
                <div class="block-content" v-for="item in details" :key="item.id">
                    <div class="content-main ency-content-main">
                        <div class="pic">
                            <img :src="item.encyImage" alt="生物图片">
                        </div>
                        <div class="info">
                            <div class="name-price">
                                <span class="ency-name f15">
                                    {{item.name}}
                                    <span class="ency-size f12">{{item.size}}</span>
                                </span>
                                <span class="ency-price">
                                    <span class="price-title f12">价格:</span><span class="price-text f12">
                                        ￥{{item.price}}
                                    </span>
                                </span>
                            </div>
                            <div class="others">
                                <div>
                                    <badge v-if="item.recommend==='tj'" text="推荐"></badge>
                                </div>
                                <div class="actions">
                                    <div v-if="cartDetailIds.includes(item.id)" class="item-in-cart">
                                        <icon 
                                            class="el-icon-coral-publishgoods_fill"
                                            @click="handleActions({}, 'cartDetail')">
                                        </icon>
                                        <badge :text="detailsInCartMap[item.id]"></badge>
                                    </div>
                                    <div v-else class="item-in-cart">
                                        <icon 
                                            class="el-icon-coral-addition_fill"
                                            @click="handleCartDetail(item)">
                                        </icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isSearching">
                <div v-if="!searchText&&details.length===0" style="font-size: 16px; text-align: center; margin-top: 100px;">
                    请输入你搜索条件~~~
                </div>
                <div v-if="searchText&&details.length===0" style="font-size: 16px; text-align: center; margin-top: 100px;">
                    暂无可购买的生物，请去别处逛逛~~~
                </div>
            </div>
            <div v-else>
                <div v-if="details.length===0" style="font-size: 16px; text-align: center; margin-top: 100px;">
                    暂无可购买的生物，请去别处逛逛~~~
                </div>
            </div>
        </scroller>
        <alert v-model="showTip" title="亲，" content="购物车空空如也，先挑点喜欢的吧~~~"></alert>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
