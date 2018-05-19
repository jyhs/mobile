/**
 * 整个app的路由设置
 */

const loginRegister = r => require.ensure([], () => r(require('@/views/user/loginRegister/index.vue')), 'loginRegister');
const main = r => require.ensure([], () => r(require('@/views/main/index.vue')), 'main');
const encySearch = r => require.ensure([], () => r(require('@/views/common/encySearch/index.vue')), 'encySearch');
const encyDetail = r => require.ensure([], () => r(require('@/views/common/encyDetail/index.vue')), 'encyDetail');
const billDetail = r => require.ensure([], () => r(require('@/views/common/billDetail/index.vue')), 'billDetail');
const groupAdd = r => require.ensure([], () => r(require('@/views/common/groupAdd/index.vue')), 'groupAdd');
const groupDetail = r => require.ensure([], () => r(require('@/views/common/groupDetail/index.vue')), 'groupDetail');
const cartDetail = r => require.ensure([], () => r(require('@/views/common/cartDetail/index.vue')), 'cartDetail');
const myGroups = r => require.ensure([], () => r(require('@/views/common/myGroups/index.vue')), 'myGroups');
const myCarts = r => require.ensure([], () => r(require('@/views/common/myCarts/index.vue')), 'myCarts');
const mySetting = r => require.ensure([], () => r(require('@/views/common/mySetting/index.vue')), 'mySetting');

const routes = [{
        path: '/user/login/register',
        component: loginRegister
    }, {
        path: '/',
        component: main,
    }, {
        path: '/ency/search',
        component: encySearch,
        name: 'encySearch',
        meta: {
            requireAuth: true
        }
    }, {
        path: '/ency/:id/detail',
        component: encyDetail,
        name: 'encyDetail',
        meta: {
            requireAuth: true
        }
    }, {
        path: '/bill/:id/detail',
        component: billDetail,
        name: 'billDetail',
        meta: {
            requireAuth: true
        }
    }, {
        path: '/bill/:id/group/add',
        component: groupAdd,
        name: 'groupAdd',
        meta: {
            requireAuth: true
        }
    }, {
        path: '/buy/:id/page',
        component: groupDetail,
        name: 'groupDetail',
        meta: {
            requireAuth: true
        }
    }, {
        path: '/group/:groupId/cart/:cartId',
        component: cartDetail,
        name: 'cartDetail',
        meta: {
            requireAuth: true
        }
    }, {
        path: '/myGroups',
        component: myGroups,
        name: 'myGroups',
        meta: {
            requireAuth: true
        }
    }, {
        path: '/myCarts',
        component: myCarts,
        name: 'myCarts',
        meta: {
            requireAuth: true
        }
    }, {
        path: '/mySetting',
        component: mySetting,
        name: 'mySetting',
        meta: {
            requireAuth: true
        }
    }
];

export default routes;
