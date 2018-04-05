import Vuex from 'vuex';
import * as TYPES from '../constants/types';
import * as CommonAction from '../actions/CommonAction';
import * as UserAction from '../actions/UserAction';
import * as EncyAction from '../actions/EncyAction';
import * as BillAction from '../actions/BillAction';
import * as GroupAction from '../actions/GroupAction';
import * as CartAction from '../actions/CartAction';

const state = {
    loadingShow: false
};

const getters = {
    loadingShow: state => state.loadingShow
};

const mutations = {
    [TYPES.LOADING](state, loadingShow) {
        state.loadingShow = loadingShow;
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
