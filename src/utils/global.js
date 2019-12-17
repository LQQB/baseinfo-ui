/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

// 后台管理系统服务器地址
//export const baseUrl = 'http://192.168.1.100:8001'
// 系统数据备份还原服务器地址
export const backupBaseUrl = 'http://192.168.1.100:8002'
let _baseUrl
switch (process.env.NODE_ENV) {
    case 'development':
        _baseUrl = 'http://192.168.1.102:8080'
        break
    case 'test':
        _baseUrl = 'http://192.168.1.35test:8080/sffj'
        break
    case 'production':
        _baseUrl = 'http://192.168.1.35prod:8080/sffj'
        break;
  };
export const baseUrl = _baseUrl  
export default {
    baseUrl,
    backupBaseUrl
}