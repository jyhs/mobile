<template>
    <div class="ency-detail-container">
        <scroller :on-refresh="handleDataRefresh">
            <swiper loop auto :list="encyImages"></swiper>
            <!--
            <div class="button-tab">
                <button-tab :height="35">
                    <button-tab-item selected @on-item-click="handleTabItemChange('description')">
                        <icon class="el-icon-coral-order f15"></icon>
                        <span>生物简介</span>
                    </button-tab-item>
                    <button-tab-item @on-item-click="handleTabItemChange('message')">
                        <icon class="el-icon-coral-message f15"></icon>
                        <span>评论</span><span class="message-count">（27）</span>
                    </button-tab-item>
                    <button-tab-item @on-item-click="handleTabItemChange('share')">
                        <icon class="el-icon-coral-share f15"></icon>
                        <span>分享</span>
                    </button-tab-item>
                </button-tab>
            </div>
            -->
            <div class="block" v-if="activeTab==='description'">
                <div class="name f18">{{ency.name}}</div>
                <div class="tags m-t-10">
                    <div class="tag" v-for="item in (ency.tag || '').trim().split(',')" :key="item">
                        <span class="f10">{{item}}</span>
                    </div>
                </div>
                <div class="more m-t-10">
                    <div class="item">
                        <span class="title f10">学名：</span><span class="f10">{{ency.sname}}</span>
                    </div>
                    <div class="item">
                        <span class="title f10">饲养难度：</span>
                        <rater :value="mapLevel(ency.level)" :font-size="10"></rater>
                    </div>
                    <div class="item">
                        <span class="title f10">英文名：</span><span class="f10">{{ency.ename}}</span>
                    </div>
                    <div class="item">
                        <span class="title f10">团购指导价：</span><span class="price f10">￥{{ency.price}}</span>
                    </div>
                </div>
                <div class="desc m-t-10 f12">
                    <span v-html="ency.description"></span>
                </div>
            </div>
        </scroller>
        <group>
            <popup-picker
                    :show.sync="showSharePicker" :show-cell="false" confirm-text="确定" :data="shareTypes"
                    :columns="2" @on-change="handleShareTypeChange" @on-hide="handleCloseSharePicker">
            </popup-picker>
        </group>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    import {Swiper, ButtonTab, ButtonTabItem, Rater, Group, PopupPicker} from 'vux';
    import {ImageBasePath} from '../../../constants/index';

    const shareTypes = [{
        name: '微信',
        value: 'wechat'
    }, {
        name: 'QQ',
        value: 'qq'
    }, {
        name: '微博',
        value: 'weibo'
    }];

    export default {
        data() {
            return {
                activeTab: 'description',
                showSharePicker: false,
                shareTypes: shareTypes,
                shareType: [],
                ency: {},
                encyImages: []
            };
        },

        components: {
            Swiper,
            ButtonTab,
            ButtonTabItem,
            Rater,
            Group,
            PopupPicker
        },

        async created() {
            const {id} = this.$route.params;

            this.ency = await this.getEncyById({id});
            const encyImages = (await this.getEncyImagesById({id}))['imageList'] || [];
            encyImages.map(image => {
                this.encyImages.push({
                    url: `javascript: void(0);`,
                    img: `${ImageBasePath}${image}`,
                    fallbackImg: '',
                    title: ''
                });
            });
        },

        methods: {
            ...mapActions([
                'getEncyById',
                'getEncyImagesById'
            ]),

            handleDataRefresh(done) {
                done();
            },

            handleTabItemChange(tabName) {
                if (tabName === 'share') {
                    this.showSharePicker = true;
                } else {
                    this.activeTab = tabName;
                }
            },

            handleShareTypeChange(shareType) {
                this.shareType = shareType;
            },

            handleCloseSharePicker(closeType) {
                if (closeType) {
                    console.log('shareType', this.shareType);
                }
            },

            mapLevel(levelCode) {
                switch (levelCode) {
                    case 'ry':
                        return 1;
                    case 'yb':
                        return 3;
                    case 'kn':
                        return 5;
                }
            }
        }
    };
</script>
<style lang="less">
    .ency-detail-container {
        .vux-slider > .vux-swiper > .vux-swiper-item > a > .vux-img {
            background-size: contain;
        }
        .button-tab {
            padding: 0.1rem 0.1rem 0;
            .vux-button-group > a {
                color: #9b9b9b;
                box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
                border-radius: 4px;
            }
            .vux-button-group > a {
                background-color: #fafafa;
            }
            .vux-button-group > a.vux-button-group-current {
                background-color: #fff;
                color: #28b1ea;
                font-size: 14px;
            }
            .vux-button-group > a.vux-button-tab-item:after {
                border: none;
            }
            .message-count {
                color: #c83d04;
            }
        }
        .block {
            padding: 0.1rem 0.1rem 0;
            .name {
                color: #000;
                height: 24px;
                line-height: 24px;
            }
            .tags {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                .tag {
                    background-color: #e7e7e7;
                    border-radius: 2px;
                    padding: 2px 6px;
                    margin-right: 0.1rem;
                    span {
                        color: #9b9b9b;
                    }
                }
            }
            .more {
                height: 1.08rem;
                background-color: #eee;
                border-radius: 2px;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                .item {
                    width: 100%;
                    box-sizing: border-box;
                    padding-left: 0.1rem;
                    line-height: 0.27rem;
                    .title {
                        color: #9b9b9b;
                    }
                    .price {
                        color: #f5a623;
                    }
                }
            }
            .desc {
                color: #4a4a4a;
                line-height: 16px;
            }
        }
    }
</style>
