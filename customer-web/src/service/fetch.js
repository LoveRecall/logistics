import ajax from 'service/ajax';
import $apis from '../apis/index'
import {MessageBox} from 'element-ui';
import $i from '../language/index';
import router from './router'
import Vue from 'vue'

const $ajax = new ajax();

export default {
  export_task(templateCode, params = {}) {
    return $ajax.post($apis.EXPORTFILE_EXPORTTASKE, {templateCode, arguments: JSON.stringify(params)})
      .then(res => {
        MessageBox.confirm($i.logs.exportSuccess, $i.hintMessage.systemHints, {
          confirmButtonText: $i.button.confirm,
          cancelButtonText: $i.button.ccancel,
          type: 'success'
        }).then(() => {
          router.push({path: '/logs/task', query: {type: 'export'}})
        }).catch(e => e);
      });
  }
};
