<template>
  <div class="login"
       v-loading="loading"
       element-loading-background="rgba(255, 255, 255, 1)"
       :element-loading-text="$i.common.goSignIn">
    <iframe ref="login" :src="loginUrl" class="iframe"></iframe>
  </div>
</template>

<script>
  import config from 'service/config';
  import {Base64} from 'js-base64';
  import Qs from 'qs';

  export default {
    name: 'login',
    data() {
      return {
        loginUrl: '',
        loading: true
      }
    },
    created() {
      let params = Qs.stringify({
        type: config.CLIENT_TYPE,
        language: config.LANGUAGE,
        redirect: Base64.encodeURI(`${window.location.origin}/static/authorize/index.html`)
      });
      let redirectUrl = `?${params}`;
      this.$message.closeAll();
      this.loginUrl = config.ENV.LOGIN_URL + redirectUrl;
      this.$localStore.clearAll();
      this.$sessionStore.clearAll();

      window.__authorize = this.getUserInfo;

      document.title = `UCN-${this.$i.common.signIn}`;
    },
    mounted() {
      let iframe = this.$refs.login;
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => this.loading = false);
      } else {
        iframe.onload = () => this.loading = false;
      }
    },
    methods: {
      getUserInfo(token) {
        if (!token) return false;
        token = Base64.decode(token);
        this.$localStore.set('token', token);
        this.$ajax.get(this.$apis.USER_PRIVILEGE).then(data => {
          this.$localStore.set('user', data);
          data.userType === 0
            ? this.checkCompanyInfo(data).then(res => {
              res ? this.$router.push('/') : this.$router.push(this.$localStore.get('router_intercept'));
            })
            : this.$router.push('/');
        });
      },
      checkCompanyInfo() {
        // todo 三端接口不一致 需各自修改
        return this.$ajax.get(this.$apis.get_purchase_customer_getCustomer)
          .then((res = {}) => {
            if (!res.shortName) {
              this.$localStore.set('router_intercept', {path: '/settings/companyInfo'});
              return false;
            }

            return true;
          });
      }
    }
  }
</script>
<style scoped>
  .login {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }

  .iframe {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
