export const enum TOKEN {
  identifier,
  keywords,
  number,
  string,
  symbol,
  str,
  controlStr,
}

interface Token {
  // 对应的类型，比如
  // identifier: 标识符，变量标识符，方法标识符等
  // keywords: 相对于该语言来说的关键字，const let 
  // number: 字面量
  // string：被'' or ""引用里面的文本
  // symbol：(),''
  // str: 普通字符
  // controlStr: 控制字符，比如换行符之类的
  type: TOKEN;
  value: string; // 子串
}

function isControStr(text: string): boolean {
  return /\f|\n|\r|\t|\v|\s/.test(text);
}

function createToken(type: TOKEN, value: string) {
  return {
    type,
    value,
  }
}

function parse(text: string): Token[] {
  // 把text编译成一个个token集合
  // 先写一个简单的分割
  const tokens = [];
  let value = '';
  for(let i = 0; i < text.length; i += 1) {
    if (isControStr(text[i])) {
      if (value) {
        const strToken = createToken(TOKEN.str, value);
        tokens.push(strToken);
        value = '';
      }
      const controlStrToken = createToken(TOKEN.controlStr, text[i]);
      tokens.push(controlStrToken);
    } else {
      value += text[i];
    }
  }
  if (value) {
    const strToken = createToken(TOKEN.str, value);
    tokens.push(strToken);
    value = '';
  }
  return tokens;
}

export {
  Token,
};

export default parse;