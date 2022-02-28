import Token from '../../handle/parse/token';

class FragmentInfo {

  identifier: string; // 根据token转换成对应的标识 
  innerText: string; // 文本
  tag: string;
  token: Token;

  constructor(token: Token) {
    this.token = token;
    this.innerText = token.value;
    this.identifier = 'string';
    this.tag = 'span';
  }

}

export default FragmentInfo;
