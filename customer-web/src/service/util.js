import dateFormat from 'dateformat';
import {localStore, sessionStore} from 'service/store';
import database from '../database/index';
import $i from '../language/index';
import router from 'service/router'
import $fetch from 'service/fetch'
import _config from "./config";
import store from '@/store';
import Qs from 'qs'
import Downloadjs from 'downloadjs';
import {Message, MessageBox} from 'element-ui';


/**
 * 删除带有前缀下划线数据
 */
const deleteArr = (list, fieldRemark) => {
  _.map(list, item => {
    item && deleteObject(item);
    item[fieldRemark] && deleteObject(item[fieldRemark]);
  });
};

const deleteObject = (list, fieldRemark, details) => {
  _.mapObject(list, (val, key) => {
    if (key.substring(0, 1) === '_') delete list[key];

    if (list[fieldRemark]) deleteObject(list[fieldRemark]);
    if (key === details) deleteArr(list[details], fieldRemark)
  });
};

// 需要直接下载的文件格式
const NEED_DOWNLOAD_FILE = ['jpg', 'gif', 'png', 'pdf', 'txt', 'bmp', 'jpeg', 'webp'];

const Util = {
  /**
   * 本地永久缓存
   */
  $localStore: localStore,

  /**
   * 本地会话缓存
   */
  $sessionStore: sessionStore,

  /**
   * 格式化日期
   */
  $dateFormat() {
    return arguments[0] ? dateFormat(...arguments) : '';
  },


  /**
   * 国际化语言配置
   */
  $i,


  $ic(str, params) {
    return _.template(str)(params);
  },

  /**
   * 公共请求
   */
  $fetch,
  /**
   * 字段配置
   */
  $db: database,

  /**
   * 字段配置
   * @param db
   * @param data
   * @param cb
   * @returns {Array}
   */
  $getDB(db, data, cb) {

    let list = [];
    db = _.values(db);
    _.map(data, (value, index) => {
      let obj = {};
      _.map(db, val => {
        let dv = value[val.key]
          , cd = _.clone(val);
        if (!_.isUndefined(dv) || val._important) {
          cd.value = _.isUndefined(dv) ? '' : dv;
          obj[val.key] = cd;
        }
      });
      if (cb) obj = _.extend(obj, cb(obj, index));
      list.push(obj);
    });
    return list;
  },

  /**
   * 生成唯一标识
   * @returns {string}
   */
  $getUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = (d + Math.random() + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },

  /**
   * 字节转换
   * @returns {string}
   */
  $bytesConvert(val) {
    if (val === 0) {
      return '0 B'
    }

    let k = 1024
      , sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      , i = Math.floor(Math.log(val) / Math.log(k));

    return (val / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  },

  /**
   * 小数长度截取
   * @param value    值
   * @param length   限制长度
   * @param label    需提示字段名
   * @returns {*}
   */
  $toFixed(value, length, label) {
    let n = '', b;

    value = _.isString(value) ? Number(value) : value;

    if (!_.isNumber(value) || _.isNaN(value)) {
      return '';
    }

    b = value.toString().split('.');

    if (label && b[1] && b[1].length > length) {
      Message.warning(`${label} ${Util.$ic($i.common.decimalLimit, {length})}`);
    }

    _.map(_.range(length), () => n += 0);

    n = Number('1' + n);

    return Math.floor(value * n) / n;
  },

  /**
   * 权限验证
   * @param value
   * @returns {boolean}
   */
  $auth(value) {
    let user = localStore.get('user') || {}
      , auths = (user.userResourceCodes || []).concat(user.userType)
      , pass = false;

    if (user.userType === 0 || !value) {
      return true;
    }

    value = _.isArray(value) ? value : [value];

    _.map(value, val => pass = _.indexOf(auths, val) > -1);

    return pass;
  },

  /**
   * 下载
   * @param url
   * @returns {boolean}
   */
  $download(url) {
    let str, flag;

    if (!url || !_.isString(url)) {
      return false;
    }

    str = url.split('?')[0];
    flag = false;
    if (str && _.find(NEED_DOWNLOAD_FILE, val => str.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) > -1)) {
      Downloadjs(url);
    } else {
      window.open(url);
    }
  },

  /**
   * 表单验证
   * @param data
   * @param db
   * _rules:{
     *   type:'Number', // 数据类型：Number、Regexp、Email
     *   required:true, // 必填项
     *   max:10, // 最大值
     *   min:0, // 最小值
     *   length:20, // 最大长度
     *   minLength:20, // 最小长度
     * }
   * @returns {boolean}
   */
  $validateForm(data, db) {

    for (let k in data) {
      let val = (data[k])
        , item = _.findWhere(db, {key: k}) || {}
        , key = item.key || true
        , validate;

      if (_.isEmpty(item) || !_.isObject(item._rules)) continue;

      validate = item._rules;

      if (validate.required && (_.isNull(val) || _.isNaN(val) || _.isUndefined(val) || val === '')) {
        Message.warning(`${$i.util.validateRequired} ${item.label}`);
        return key;
      }

      if (!/\S/.test(val)) continue;

      switch (validate.type) {
        case 'Number':
          if (_.isRegExp(validate.reg) && !validate.reg.test(val)) {
            Message.warning(`${$i.util.validateCorrect} ${item.label}`);
            return key;
          }
          if (!/^[0-9]+\.?[0-9]{0,9}$/.test(val)) {
            Message.warning(`${$i.util.validateCorrect} ${item.label}`);
            return key;
          }
          if (validate.max && validate.max < Number(val)) {
            Message.warning(`${item.label} ${$i.util.validateValueGreater} ${validate.max}`);
            return key;
          }
          if (validate.min && validate.min > Number(val)) {
            Message.warning(`${item.label} ${$i.util.validateValueLess} ${validate.max}`);
            return key;
          }
          break;
        case 'Email':
          if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(val)) {
            Message.warning(`${$i.util.validateCorrect} ${item.label}`);
            return key;
          }
          break;
        case 'Regexp':
          if (_.isRegExp(validate.reg) && !validate.reg.test(val)) {
            Message.warning(item.label || `${$i.util.validateCorrect} ${item.label}`);
            return key;
          }
          break;
      }

      if (validate.length && validate.length < val.length) {
        Message.warning(`${item.label} ${$i.util.validateLengthGreater} ${validate.length} ${$i.util.validateDigits}`);
        return key;
      }

      if (validate.minLength && validate.minLength > val.length) {
        Message.warning(`${item.label} ${$i.util.validateLengthLess} ${validate.minLength} ${$i.util.validateDigits}`);
        return key;
      }

    }

    return false;

  },


  /**
   * 获取oss地址key
   * @param url
   * @param type
   * @returns {Uint8Array | any[] | Int32Array | Uint16Array | Uint32Array | Float64Array | any}
   */
  $getOssKey(url, type) {
    url = _.isArray(url) ? url : [url];

    return _.map(url, val => {
      let rs, ns, param = {}, u = val.split('?'), bucket;

      val = `${decodeURIComponent(u[0])}${u[1] ? ('?' + u[1]) : ''}`;
      rs = val.split('?')[0].split('/')
      ns = rs.pop().split('.');
      param.url = val;
      param.id = rs[rs.length - 1];

      if (ns.length > 1) {
        let k = val.split('?')[0].match(/.com\/(\S*)/);
        param.fileName = ns.join('.');
        param.showType = ns.pop().toLocaleUpperCase();
        param.showName = ns.shift();
        param.fileKey = k ? k[1] : '';
      } else {
        param.showName = ns[0];
        param.showType = 'File';
        param.fileName = ns[0];
      }
      bucket = val.match(/\/\/(\S*)ucn-oss./);
      return type ? `${bucket[1]}ucn-oss:${param.fileKey}` : param;
    });
  },

  /**
   * table 数据过滤
   * @type {{contrast(*=, *=): *, setHighlight(*=): *, setHideSame(*=): *}}
   */
  $table: {
    contrast(data, type, ignore) {
      if (_.isEmpty(data)) return [];

      let first = data[0], keyData = {};

      _.map(data, value => {
        if (!ignore || _.isEmpty(value[ignore])) {
          _.mapObject(value, (val, key) => {
            if (type === 'same' && first[key] && (_.isUndefined(keyData[key]) || !keyData[key] === false)) {
              keyData[key] = first[key].value === val.value;
            } else if (type === 'def' && first[key] && first[key].value !== val.value) {
              keyData[key] = true;
            }
          });
        }
      });
      return keyData;
    },
    setHighlight(data, ignore) {
      let keyData = this.contrast(data, 'def', ignore)
        , len = _.values(keyData).length
        , i = 0;
      keyData = _.mapObject(keyData, (val) => val = `#ec743b`);

      return _.map(data, value => {
        return _.mapObject(value, (val, key) => {
          if (_.isObject(val) && keyData[key]) {
            val._style = val._style || {};
            val._style.backgroundColor = keyData[key];
            val._style.color = '#ffffff';
          }
          return val;
        });
      });
    },
    setHideSame(data, ignore) {
      let keyData = this.contrast(data, 'same', ignore);
      console.log(keyData, data)
      return _.map(data, value => {
        return _.mapObject(value, (val, key) => {
          if (keyData[key] && _.isObject(val)) {
            val._hide = keyData[key];
            val._hideSame = true;
          }
          return val;
        });
      });
    },
    revertHideSame(data) {
      return _.map(data, value => {
        return _.mapObject(value, (val, key) => {
          if (_.isObject(val) && val._hideSame) {
            val._hide = false;
          }
          return val;
        });
      });
    }
  },

  $filterModify(list, remark, children) {
    let fieldRemark = remark || 'fieldRemark',
      details = children || 'details';
    if (_.isObject(list, details)) deleteObject(list, fieldRemark, details);
    if (_.isArray(list)) _.map(list, fieldRemark, details);
    return list;
  },

  /**
   * 时区转换 传入时区 如 0 8 -1
   */
  $getLocalTime(i) {
    if (typeof i !== 'number') return;
    const d = new Date(),
      len = d.getTime(),
      offset = d.getTimezoneOffset() * 60000,
      utcTime = len + offset;
    return new Date(utcTime + 3600000 * i);
  },

  /**
   *
   * @param arr
   * @returns {Uint8Array | any[] | Int32Array | Uint16Array | Uint32Array | Float64Array | any}
   */
  $copyArr(arr) {
    return arr.map((e) => {
      return typeof e === 'object' ? Object.assign({}, e) : e;
    })
  },


  /**
   * 用户行为缓存
   * @type {{set(*, *): void, get(*): *}}
   */
  $userAction: {
    set(key, value) {
      let ua = sessionStore.get('user_action') || {};
      ua[key] = value;
      sessionStore.set('user_action', ua);
    },
    get(key) {
      let ua = sessionStore.get('user_action') || {};
      return ua[key];
    }
  },


  /**
   * 转换表格中需要由字典表数据来转换的数据
   * */
  $change(obj, code, e, isString) {
    let data, value;

    value = e[code].value;

    data = _.findWhere(obj, {code: isString ? String(value) : value});

    return data || '';
  },
  /**
   * 深拷贝
   * @param data
   * @returns {*}
   */
  $depthClone(data) {
    return data ? JSON.parse(_.clone(JSON.stringify(data))) : data;
  },

  $filterDic(data, transForm = 'transForm') {
    _.mapObject(data, (val, k) => {
      if (val.value === true || val.value === false) {
        val.value = val.value ? 1 : 0;
      }
      val.originValue = val.value;
      if (val[transForm] && !data._remark && ['fieldDisplay', 'fieldRemark', 'fieldRemarkDisplay'].indexOf(k) < 0) {
        switch (val[transForm]) {
          case 'time':
            val._value = val.value ? dateFormat(val.value, val.time || 'yyyy-mm-dd HH:MM') : null;
            break;
          default:
            if (!store.state.dic.length) return;
            let dic = _.findWhere(store.state.dic, {'code': val[transForm]});
            if (!dic || !dic.codes) return;
            val._option = dic.codes;
            let code = _.findWhere(dic.codes, {'value': val.originValue});
            if (code) {
              val._value = code.name || code[val.name] || '';
            }
        }
      }
    });
    return data;
  },

  /**
   * $window.open
   */

  $windowOpen(config) {
    let {url, params} = config, str;
    str = _.isEmpty(params) ? '' : '?';
    return window.open(`${window.location.origin}${config.url}${str}${Qs.stringify(params)}`, '_blank');
  },

  /**
   * 精度计算
   */
  $calc: {
    /**
     * 加法
     * @param num1
     * @param num2
     * @returns {number}
     */
    add(num1, num2) {
      let baseNum,
        baseNum1,
        baseNum2;

      try {
        baseNum1 = num1.toString().split('.')[1].length;
      }
      catch (e) {
        baseNum1 = 0;
      }

      try {
        baseNum2 = num2.toString().split('.')[1].length;
      }
      catch (e) {
        baseNum2 = 0;
      }

      baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));

      return (num1 * baseNum + num2 * baseNum) / baseNum;
    },

    /**
     * 减法
     * @param num1
     * @param num2
     * @returns {string}
     */
    subtract(num1, num2) {
      let baseNum,
        baseNum1,
        baseNum2,
        precision // 精度

      try {
        baseNum1 = num1.toString().split('.')[1].length;
      }
      catch (e) {
        baseNum1 = 0;
      }

      try {
        baseNum2 = num2.toString().split('.')[1].length;
      }
      catch (e) {
        baseNum2 = 0;
      }

      baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
      precision :(baseNum1 >= baseNum2) ? baseNum1 : baseNum2;

      return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);

    },

    /**
     * 乘法
     * @returns {number}
     */
    multiply() {
      let m = 0,
        s2 = '',
        strArr = 1

      for (let i = 0; i < arguments.length; i++) {
        if (arguments[i].toString().indexOf('.') > 0) {
          m += arguments[i].toString().split(".")[1].length;
          arguments[i] = Number(arguments[i].toString().replace(".", ""));
        }

        strArr *= Number(arguments[i]);
      }

      return strArr / Math.pow(10, m);
    },

    /**
     * 除法
     * @param num1
     * @param num2
     * @returns {number}
     */
    divide(num1, num2) {
      let baseNum1 = 0, baseNum2 = 0;
      let baseNum3, baseNum4;
      try {
        baseNum1 = num1.toString().split(".")[1].length;
      } catch (e) {
        baseNum1 = 0;
      }
      try {
        baseNum2 = num2.toString().split(".")[1].length;
      } catch (e) {
        baseNum2 = 0;
      }
      baseNum3 = Number(num1.toString().replace(".", ""));
      baseNum4 = Number(num2.toString().replace(".", ""));
      return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);

    },
  }
}

export default Util;
