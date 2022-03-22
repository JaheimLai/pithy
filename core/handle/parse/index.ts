import Render from '../../layer/render/render';
// import { Location } from '../../input/cursor/index';
import Session from '../session/index';
import parse from './parse';

function insert(text: string): void {
  // 文本插入操作
  // 首先编译
  Session.pieceTable.insert(Session.Cursor.location.line, text);
  const { line } = Session.Cursor.location;
  const lineText = Session.pieceTable.getLineRawContent(line);
  const tokens = parse(lineText);
  // 然后在处理其他逻辑
  // 这里先写一个简单逻辑走一下流程
  Render.fragment(tokens);
}

export default {
  insert,
};