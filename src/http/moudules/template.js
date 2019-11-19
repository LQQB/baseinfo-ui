import axios from '../axios'

/* 
 * 模板管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/template/save',
        method: 'post',
        data
    })
}
// 批量删除
export const batchDelete = (data) => {
    return axios({
        url: '/template/delete',
        method: 'post',
        data
    })
}

// 下载
export const download = (data) => {
    return axios({
        url: '/template/download',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/template/findPage',
        method: 'post',
        data
    })
}
// 查询全部
export const findAll = () => {
    return axios({
        url: '/template/findAll',
        method: 'get'
    })
}
// 查询角色菜单集合
export const findRoleMenus = (params) => {
    return axios({
        url: '/role/findRoleMenus',
        method: 'get',
        params
    })
}
// 保存角色菜单集合
export const saveRoleMenus = (data) => {
    return axios({
        url: '/role/saveRoleMenus',
        method: 'post',
        data
    })
}