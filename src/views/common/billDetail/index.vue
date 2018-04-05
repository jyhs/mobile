<template>
    <div class="bill-detail-container">
        <scroller :on-refresh="handleDataRefresh">
            <div class="detail">
                <div class="bill-name">
                    <span class="f16">{{bill.name}}</span>
                </div>
                <div>
                    <span class="column f12">
                        <span class="title">组织者：</span>
                        <span>{{bill.contacts}}</span>
                    </span>
                </div>
                <div>
                    <span class="column f12">
                        <span class="title">电话：</span>
                        <span>{{bill.phone}}</span>
                    </span>
                </div>
                <div>
                    <span class="column f12">
                        <span class="title">截止时间：</span>
                        <span>{{bill.effort_date}}</span>
                    </span>
                </div>
            </div>
            <div class="description">
                <span class="f12" v-html="bill.description"></span>
            </div>
            <div class="items">
                <div class="item" :class="{active: index%2!==1}" v-for="(item, index) in details" :key="item.id">
                    <span class="name f15">{{item.name}}</span>
                    <span class="size f15">{{item.size}}</span>
                    <span class="price f15">￥{{item.price}}</span>
                </div>
            </div>
        </scroller>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
