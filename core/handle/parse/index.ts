import Session from '../session/index';
import Fragment from '../../layer/render/fragment';
import parse from './parse';

function insert(text: string): void {
  // 文本插入操作
  // 首先编译
  const tokens = parse(text);
  // 然后在处理其他逻辑
  // 这里先写一个简单逻辑走一下流程
}

export default {
  insert,
};