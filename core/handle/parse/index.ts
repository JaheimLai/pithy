import Render from '../../layer/render/render';
// import { Location } from '../../input/cursor/index';
import Session from '../session/index';
import parse from './parse';
import { CursorColumns } from '../column';

function insert(text: string): void {
  // 文本插入操作
  // 首先编译
  const { line, column } = Session.Cursor.location;
  let lineText = Session.pieceTable.getLineRawContent(line);
  // console.log('getLineWidth --', CursorColumns.getMaxColumn(lineText), column);
  // // 判断是否插入了换行符
  Session.pieceTable.insert(line, column, text);    
  if (Render.textlayer.isNewLine(text.substr(-1,1))) {
    lineText = text.substr(-1,1) + Session.pieceTable.getLineRawContent(line + 1);
  } else {
    lineText = Session.pieceTable.getLineRawContent(line);
  }
  const tokens = parse(lineText);
  // 然后在处理其他逻辑
  // 这里先写一个简单逻辑走一下流程
  Render.fragment(tokens);
}

export default {
  insert,
};