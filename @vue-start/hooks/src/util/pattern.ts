//手机号
export const mobilePhoneReg = new RegExp(/^1[3456789]\d{9}$/);
//电话
export const telephoneReg = new RegExp("[0-9-()（）]{7,18}");
//身份证
export const idCardReg = new RegExp(
  /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
);
//统一社会信用码
export const creditCodeReg = new RegExp(/^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g);

/*其他*/
// 小数点后两位的数字
export const floatNumberReg = new RegExp(/^(([1-9]{1}\d*)|(0{1}))((\.\d{1,2})?)$/);

//邮箱
export const emailPhoneReg = new RegExp(
  /\b(^['_A-Za-z0-9-]+(\.['_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))$)\b/,
);
