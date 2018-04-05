<template>
    <div class="ency-tab-container">
        <div class="nav">
            <tab class="tab-container" bar-active-color="#28b1ea" active-color="#28b1ea">
                <tab-item selected @on-item-click="handleTabItemClick('tj')">
                    <div class="tab-item-container">
                        <span class="text f13">热门推荐</span>
                    </div>
                </tab-item>
                <tab-item @on-item-click="handleTabItemClick('hy')">
                    <div class="tab-item-container">
                        <span class="text f13">海水鱼</span>
                    </div>
                </tab-item>
                <tab-item @on-item-click="handleTabItemClick('rt')">
                    <div class="tab-item-container">
                        <span class="text f13">软体珊瑚</span>
                    </div>
                </tab-item>
                <tab-item @on-item-click="handleTabItemClick('yg')">
                    <div class="tab-item-container">
                        <span class="text f13">硬骨珊瑚</span>
                    </div>
                </tab-item>
                <tab-item @on-item-click="handleTabItemClick('qt')">
                    <div class="tab-item-container">
                        <span class="text f13">其他</span>
                    </div>
                </tab-item>
            </tab>
        </div>
        <div class="ency-list">
            <div class="types">
                <div class="type f12" :class="{'type-active': activeType==type.code}" v-for="type in types"
                     :key="type.code" @click="handleTypeChange(type)">
                    {{type.name}}
                </div>
            </div>
            <div class="block">
                <div class="block-content" v-for="item in encyList" :key="item.id"
                     @click="handleActions(item, 'encyDetail')">
                    <div class="content-main ency-content-main">
                        <div class="pic">
                            <img src="../../../assets/others/tuan_image.png" alt="生物图片">
                        </div>
                        <div class="info">
                            <div class="name-price">
                                <span class="ency-name f15">{{item.name}}</span>
                                <span class="ency-price">
                                    <span class="price-title f12">团购指导价:</span><span class="price-text f12">￥{{item.price}}</span>
                                </span>
                            </div>
                            <div class="tags">
                                <div class="tag" v-for="tag in item.tag.trim().split(',')" :key="item">
                                    <span class="f10">{{tag}}</span>
                                </div>
                            </div>
                            <div class="others">
                                <rater :value="mapLevel(item.level)" :font-size="10"></rater>
                                <div class="actions">
                                    <div class="action" @click.stop="handleActions(item, 'share')">
                                        <!--
                                        <icon class="el-icon-coral-share f12"></icon>
                                        -->
                                        <img src="../../../assets/others/share.svg" alt="生物分享">
                                        <span class="f12">分享</span>
                                    </div>
                                    <div class="action" @click.stop="handleActions(item, 'comment')">
                                        <!--
                                        <icon class="el-icon-coral-message f12"></icon>
                                        -->
                                        <img src="../../../assets/others/comm.svg" alt="生物评论">
                                        <span class="f12">评论(222)</span>
                                    </div>
                                    <div class="action" @click.stop="handleActions(item, 'up')">
                                        <!--
                                        <icon class="el-icon-coral-praise f12"></icon>
                                        -->
                                        <img src="../../../assets/others/dianzan.svg" alt="生物点赞">
                                        <span class="f12">点赞</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <group>
            <popup-picker
                    :show.sync="showSharePicker" :show-cell="false" confirm-text="确定" :data="shareTypes"
                    :columns="2" @on-change="handleShareTypeChange" @on-hide="handleCloseSharePicker">
            </popup-picker>
        </group>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
