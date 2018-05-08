import Vuex from 'vuex';
import * as TYPES from '../constants/types';
import * as CommonAction from '../actions/CommonAction';
import * as UserAction from '../actions/UserAction';
import * as EncyAction from '../actions/EncyAction';
import * as BillAction from '../actions/BillAction';
import * as GroupAction from '../actions/GroupAction';
import * as CartAction from '../actions/CartAction';

const state = {
    loadingShow: false,
    groupsInCurProvince: []
};

const getters = {
    loadingShow: state => state.loadingShow,
    groupsInCurProvince: state => state.groupsInCurProvince
};

const mutations = {
    [TYPES.LOADING](state, loadingShow) {
        state.loadingShow = loadingShow;
    },
    [TYPES.GROUPS_IN_CUR_PROVINCE](state, groupsInCurProvince) {
        state.groupsInCurProvince = groupsInCurProvince;
    }
};

const actions = {
    ...CommonAction,
    ...UserAction,
    ...EncyAction,
    ...BillAction,
    ...GroupAction,
    ...CartAction
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
