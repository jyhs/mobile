<template>
    <div class="main-container">
        <view-box>
            <tabbar slot="bottom">
                <tabbar-item :selected="activeIndex===0" @on-item-click="handleTabItemClick(0)">
                    <img src="../../assets/tabbar/menu1_off.svg" slot="icon">
                    <img src="../../assets/tabbar/menu1_on.svg" slot="icon-active">
                    <span slot="label">首页</span>
                </tabbar-item>
                <tabbar-item :selected="activeIndex===1" @on-item-click="handleTabItemClick(1)">
                    <img src="../../assets/tabbar/menu2_off.svg" slot="icon">
                    <img src="../../assets/tabbar/menu2_on.svg" slot="icon-active">
                    <span slot="label">百科</span>
                </tabbar-item>
                <tabbar-item :selected="activeIndex===2" @on-item-click="handleTabItemClick(2)">
                    <img src="../../assets/tabbar/menu3_off.svg" slot="icon">
                    <img src="../../assets/tabbar/menu3_on.svg" slot="icon-active">
                    <span slot="label">团购</span>
                </tabbar-item>
                <!--
                <tabbar-item :selected="activeIndex===3" @on-item-click="handleTabItemClick(3)">
                    <img src="../../assets/tabbar/menu4_off.svg" slot="icon">
                    <img src="../../assets/tabbar/menu4_on.svg" slot="icon-active">
                    <span slot="label">工具</span>
                </tabbar-item>
                -->
                <tabbar-item :selected="activeIndex===4" @on-item-click="handleTabItemClick(4)">
                    <img src="../../assets/tabbar/menu5_off.svg" slot="icon">
                    <img src="../../assets/tabbar/menu5_on.svg" slot="icon-active">
                    <span slot="label">我的</span>
                </tabbar-item>
            </tabbar>
            <div class="content">
                <keep-alive>
                    <home v-if="activeIndex===0" @on-to="handleActions"></home>
                    <ency v-else-if="activeIndex===1"></ency>
                    <group v-else-if="activeIndex===2"></group>
                    <tool v-else-if="activeIndex===3"></tool>
                    <mine v-else-if="activeIndex===4"></mine>
                </keep-alive>
            </div>
        </view-box>
    </div>
</template>
<script>
    import {ViewBox, Tabbar, TabbarItem} from 'vux';
    import Home from './home/index.vue';
    import Ency from './ency/index.vue';
    import Group from './group/index.vue';
    import Tool from './tool/index.vue';
    import Mine from './mine/index.vue';

    export default {
        data() {
            return {
                activeIndex: parseInt(window.sessionStorage.getItem('SeawaterTabActiveIndex')) || 0
            };
        },

        components: {
            ViewBox,
            Tabbar,
            TabbarItem,
            Home,
            Ency,
            Group,
            Tool,
            Mine
        },

        mounted() {
            const ele = document.getElementById('loading');
            ele.style.display = 'none';
        },

        methods: {
            handleTabItemClick (index) {
                if (index !== this.activeIndex) {
                    this.activeIndex = index;
                    window.sessionStorage.setItem('SeawaterTabActiveIndex', index);
                }
            },

            handleActions(tabName) {
                switch (tabName) {
                    case 'group':
                        this.activeIndex = 2;
                        break;
                }
            }
        }
    };
</script>
<style lang="less">
    .main-container {
        width: 100%;
        height: 100%;
        background-color: #fafafa;
        .weui-search-bar__cancel-btn {
            font-size: 14px;
            color: #3ec6ff;
        }
        .weui-bar__item_on {
            .weui-tabbar__label {
                span {
                    color: #3ec6ff;
                }
            }
        }
        .weui-tabbar__icon img {
            width: 24px;
            height: 24px;
        }
        .content {
            height: 100%;
        }
    }
</style>
