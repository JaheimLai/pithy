interface Trie {
  status: string; // 当前状态
  input: string; // 输入
  first: Trie; // 子节点的第一个
  next: Trie; // 下一个状态
}

const keyword = ['for', 'if'];

function create(keywords: string[]): Trie {
  let trie;
  for (let i = 0; i < keyword.length; i += 1) {
    const word = keywords[i];
    trie = insert(trie, word);
  }
  return trie;
}

function createTrie(key: string): Trie {
  return {
    status: key,
    input: key,
    next: null,
    first: null,
  };
}

function insert(trie: Trie, value: string): Trie {
  let root;
  if (!trie) {
    trie = createTrie(value.charAt(0));
    value = value.substring(1);
    root = trie;
  } else {
    root = trie;
  }
  trie = root;
  while(value) {
    let key = value.charAt(0);
    while(trie.next) {
      if (trie.status === key) {
        trie = trie.first;
      }
      trie = trie.next;
    }
    value = value.substring(1);
  }
  return trie;
}