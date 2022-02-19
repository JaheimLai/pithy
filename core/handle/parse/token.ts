// 词法分析里最小串
class Token {

  // 对应的类型，比如
  // identifier: 标识符，变量标识符，方法标识符等
  // keywords: 相对于该语言来说的关键字，const let 
  // number: 字面量
  // string：被'' or ""引用里面的文本
  // symbol：(),''
  // str: 普通字符
  type: string;
  value: string; // 子串

  constructor(type: string, value: string) {
    this.type = type;
    this.value = value;
  }

}

export default Token;