/* 
 * 接口统一集成模块
 */
import * as login from './moudules/login'
import * as user from './moudules/user'
import * as dept from './moudules/dept'
import * as role from './moudules/role'
import * as menu from './moudules/menu'
import * as dict from './moudules/dict'
import * as log from './moudules/log'
import * as template from './moudules/template'
import * as sysPlan from './moudules/sysPlan'
import * as sysSchedule from './moudules/sysSchedule'
import * as trainBatch from './moudules/trainBatch'
import * as testBatch from './moudules/testBatch'
import * as testSubject from './moudules/testSubject'
import * as trainResource from './moudules/trainResource'

// 默认全部导出
export default {
    login,
    user,
    dept,
    role,
    menu,
    dict,
    log,
    template,
    sysPlan,
    sysSchedule,
    trainBatch,
    testBatch,
    testSubject,
    trainResource
}