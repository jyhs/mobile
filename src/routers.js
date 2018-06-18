/**
 * 整个app的路由设置
 */

const loginRegister = r => require.ensure([], () => r(require('@/views/user/loginRegister/index.vue')), 'loginRegister');
const main = r => require.ensure([], () => r(require('@/views/main/index.vue')), 'main');
const cityComm = r => require.ensure([], () => r(require('@/views/common/cityComm/index.vue')), 'cityComm');
const fishStores = r => require.ensure([], () => r(require('@/views/common/fishStores/index.vue')), 'fishStores');
const coopStores = r => require.ensure([], () => r(require('@/views/common/coopStores/index.vue')), 'coopStores');
const encyDetail = r => require.ensure([], () => r(require('@/views/common/encyDetail/index.vue')), 'encyDetail');
const encyFocus = r => require.ensure([], () => r(require('@/views/common/encyFocus/index.vue')), 'encyFocus');
const billDetail = r => require.ensure([], () => r(require('@/views/common/billDetail/index.vue')), 'billDetail');
const groupAdd = r => require.ensure([], () => r(require('@/views/common/groupAdd/index.vue')), 'groupAdd');
const groupDetail = r => require.ensure([], () => r(require('@/views/common/groupDetail/index.vue')), 'groupDetail');
const cartDetail = r => require.ensure([], () => r(require('@/views/common/cartDetail/index.vue')), 'cartDetail');
const cartItems = r => require.ensure([], () => r(require('@/views/common/cartItems/index.vue')), 'cartItems');
const userCarts = r => require.ensure([], () => r(require('@/views/common/userCarts/index.vue')), 'userCarts');
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
        path: '/cityComm',
        component: cityComm,
        name: 'cityComm',
    }, {
        path: '/fishStores',
        component: fishStores,
        name: 'fishStores',
    }, {
        path: '/coopStores',
        component: coopStores,
        name: 'coopStores',
    }, {
        path: '/ency/:id/detail',
        component: encyDetail,
        name: 'encyDetail',
        meta: {
            requireAuth: true
        }
    }, {
        path: '/ency/focus',
        component: encyFocus,
        name: 'encyFocus',
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
        path: '/cart/:id/edit',
        component: cartItems,
        name: 'cartItems',
        meta: {
            requireAuth: true
        }
    }, {
        path: '/group/:groupId/user/:userId/cart',
        component: userCarts,
        name: 'userCarts',
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
