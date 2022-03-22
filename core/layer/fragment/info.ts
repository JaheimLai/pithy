import { Token } from '../../handle/parse/parse';

export class FragmentInfo {

  identifier: string; // 根据token转换成对应的标识 
  innerText: string; // 文本
  tag: string;
  token: Token;

  constructor(token: Token) {
    this.token = token;
    this.innerText = token.value;
    if (token.type === 'controlStr') {
      this.tag = 'control';
      this.identifier = 'control';
    } else {
      this.identifier = 'string';
      this.tag = 'span';
    }
  }

}

export const enum IDENTIFIER {
  CONTROL = 'control',
  STRING = 'string',
};
