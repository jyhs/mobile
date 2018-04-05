import BillService from '../services/BillService';

/**
 * 获取订货单列表
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getBillList({commit}, params) {
    const response = await BillService.getBillList(params);
    return response.data;
}

/**
 * 获取出货单明细根据id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getDetailsByBillId({commit}, params) {
    const response = await BillService.getDetailsByBillId(params);
    return response.data;
}

/**
 * 获取出货单通过id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getBillById({commit}, params) {
    const response = await BillService.getBillById(params);
    return response.data || {};
}
