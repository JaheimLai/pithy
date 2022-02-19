import identifier from './identifier';
import Token from '../../handle/parse/token';

interface info {
  identity: string; // 根据token转换成对应的标识 
  tag: string; // 根据token转换成对应的标签
  innerText: string; // 文本
}

// 文档碎片类，复杂根据token产生文档表述，并不直接生成Dom节点
class Fragment {

  list: info[];

  constructor(tokens: Token[]) {
    // 先写一个简单的实现
    this.list = tokens.map(t => ({ tag: 'span', innerText: t.value }));
  }

}

export default Fragment;