export default {
  email: {
    key: 'email',
    _rules: {
      type: 'Email',
      required: true
    }
  },
  userName: {
    key: 'userName',
  },
  lang: {
    key: 'lang',
  },
  tel: {
    key: 'tel',
  },
  gender: {
    key: 'gender',
  },
  department: {
    key: 'deptId',
    _rules: {
      required: true
    }
  },
  role: {
    key: 'roleId',
    _rules: {
      required: true
    }
  },
  birthday: {
    key: 'birthday',
  },
  remark: {
    key: 'remark',
  }
}
