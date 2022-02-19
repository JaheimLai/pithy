import Token from './token';

function parse(text: string): Token[] {
  // 把text编译成一个个token集合
  // 先写一个简单的分割
  const list = text.split(' ');
  return list.map(t => new Token('str', t));
}

export default parse;