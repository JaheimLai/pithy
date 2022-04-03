import { Token, TOKEN } from '../../handle/parse/parse';
import { CharCode } from '../../handle/charCode';
import { TagName } from '../render/tag';

export class FragmentInfo {

  innerText: string; // 文本
  tag: TagName;
  token: Token;

  constructor(token: Token) {
    this.token = token;
    if (token.type === TOKEN.controlStr) {
      this.transformControlStrAtDom(token);
    } else {
      this.innerText = token.value;
      this.tag = TagName.String;
    }
  }

  transformControlStrAtDom(token: Token): void {
    switch (token.value.charCodeAt(0)) {
      case CharCode.Tab:
        this.tag = TagName.Tab;
        this.innerText = String.fromCharCode(CharCode.Tab);
        break;
      case CharCode.Space:
        this.tag = TagName.Space;
        this.innerText = String.fromCharCode(CharCode.Space);
        break;
      case CharCode.LineFeed:
        this.tag = TagName.LineFeed;
        this.innerText = '';
        break;
    }
  }

}
