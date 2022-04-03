// insertAdjacentHTML
// insertAdjacentText
import { FragmentInfo } from '../fragment/info';

export class Tag {

  public static getTagName(info: FragmentInfo): string {
    let tagName: string;
    switch (info.tag) {
      case TagName.String:
      case TagName.Identifier:
        tagName = 'span';
        break;
      case TagName.Space:
      case TagName.Tab:
      default:
        tagName = '';
        break;
    }
    if (!tagName) {
      return tagName;
    }
    return `<${tagName}>${ info.innerText }</${tagName}>`;
  }

}

export const enum TagName {
  Tab,
  Space,
  LineFeed,
  Identifier,
  String,
}