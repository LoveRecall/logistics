export default {
    email: {
      key: 'email',
      _rules:{
        required:true,
      }
    },
    userName:{
      key: 'userName',
      _rules:{
        required:true,
      }
    },
    password: {
        key: '',
    },
    tel:{
      key: 'tel',
      _rules:{
        required:true,
        type:'Number',
      }
    },
    gender: {
      key: 'gender',
      _rules:{
        required:true,
      }
    },
    language:{
      key: 'lang',
      _rules:{
        required:true,
      }
    },
    department: {
        key: 'deptName',
    },
    role:{
        key: 'roleName',
    },
    birthday: {
        key: 'birthday',
    },
  oldPassword:{
       _rules:{
         required:true,
         // minLength:6,
         // length:20
       }
     },
    newPassword:{
      _rules:{
        required:true,
        minLength:6
      }
    },
    comfirmNewPassword:{
      _rules:{
        required:true,
      }
  },

}
