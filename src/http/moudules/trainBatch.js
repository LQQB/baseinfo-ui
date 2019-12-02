import axios from '../axios'

/* 
 * 培训批次管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/trainBatch/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/trainBatch/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/trainBatch/findPage',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/trainBatch/findPermissions',
        method: 'get',
        params
    })
}