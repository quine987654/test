// 判断谁大,返回较大的值
function amountMax(amL, amR) {
    // 首先判断位数 哪个位数长就哪个大
    if (amL.length > amR.length) {
      return amL;
    }
    if (amR.length > amL.length) {
      return amR;
    }
    for (let i = 0; i < amL.length; i++) {
      if (Number(amL[i]) > Number(amR[i])) {
        return amL;
      }
      if (Number(amR[i]) > Number(amL[i])) {
        return amR;
      }
    }
    return amL;
  }
  // 添加decimals
  function amountMul(amount, decimals) {
    amount = String(amount);
    let lf = "";
    let ri = "";
    let lin = "";

    let ret = '0'
    if (amount.indexOf(".") > 0) {
      lf = amount.substring(0, amount.indexOf("."));
      ri = amount.substring(amount.indexOf(".") + 1, amount.length);
      for (let i = 0; i < decimals - ri.length; i++) {
        lin += "0";
      }
      ret= `${lf==0?'':lf}${ri}${lin}`;
    } else {
      
      for (let i = 0; i < decimals; i++) {
        lin += "0";
      }
    //   console.log(amount);
    //   console.log(lin);
      ret = `${amount}${lin}`;
    }
    ret = Number(ret.substr(0,10))+ ret .substr(10,ret.length)
    ret = Number(ret.substr(0,10))+ ret .substr(10,ret.length)
    return ret
  }

  // 字符串数值减法
 function  reduce(a, b) {
    // 判断小数位数
    let ari = 0;
    let bri = 0;
    let ale = a.length;
    let ble = b.length;
    if (a.indexOf(".") > 0) {
      ale = a.indexOf(".");
      ari = a.length - a.indexOf(".") - 1;
    }
    if (b.indexOf(".") > 0) {
      ble = b.indexOf(".");
      bri = b.length - b.indexOf(".") - 1;
    }
    // 小数 补0 如果b的后面位数长于a则给a补零 否则给b补0
    if (bri > ari) {
      if (ari == 0) {
        a = a + ".";
      }
      for (let i = 0; i < bri - ari; i++) {
        a = a + "0";
      }
    }
    if (ari > bri) {
      if (bri == 0) {
        b = b + ".";
      }
      for (let i = 0; i < ari - bri; i++) {
        b = b + "0";
      }
    }
    // 整数补0
    if (ale > ble) {
      for (let i = 0; i < ale - ble; i++) {
        b = "0" + b;
      }
    }
    if (ble > ale) {
      for (let i = 0; i < ble - ale; i++) {
        a = "0" + a;
      }
    }
    // 相减
    let arr = [];
    for (let i = 0; i < a.length; i++) {
      if (typeof b[b.length - 1 - i] == undefined) {
        arr.push(a[a.length - 1 - i]);
      } else {
        arr.push(a[a.length - 1 - i] - b[b.length - 1 - i]);
      }
    }
    // 处理借位
    for (let i = 0; i < arr.length; i++) {
      if (isNaN(arr[i])) {
        arr[i] = ".";
      }
      if (arr[i] < 0) {
        if (isNaN(arr[i + 1])) {
          arr[i + 2]--;
        } else {
          arr[i + 1]--;
        }
        arr[i] += 10;
      }
    }
    // 最终结果
    let jg = "";
    for (let i = arr.length - 1; i >= 0; i--) {
      jg += arr[i];
    }
    // 如果第一个数为0 则去掉
    if (jg.indexOf(".") > 1 && jg[0] == "0") {
      jg = jg.substring(1);
    }
    return jg;
  }

// 判斷大小？
// amountMax
// 添加decimals
// amountMul
// console.log(amountMul('0.1',18));
// console.log(amountMul('123456789',18));
// console.log(amountMax(amountMul("0.000000000000000010",18),amountMul("0",18)));
// console.log(amountMul('0123.11',5));
// console.log(amountMul('0.11',5));
// console.log(amountMul('123.11',5));
// console.log(amountMul('0123.11',5));
// console.log(amountMul('0.11',5));
// console.log('0123456'.substr(1,6));


console.log(reduce('1','0.0001'));
