// let box;

// function initEditor() {
//   if (box) {
//     box.remove();
//   }
//   box = document.createElement("div");
//   box.className = 'ide';
//   box.id = 'ide';
//   document.body.append(box);
// }

// function initCursor() {
//   if (!box) {
//     return;
//   }
//   const cur = document.createElement('textarea');
//   box.append(cur);
//   return cur;
// }

// const element = {
//   value(tagName) {
//     return document.createElement(tagName);
//   },
//   setText(element, text) {
//     element.innerText = text;
//   },
//   newLine() {
//     return document.createElement('p');
//   },
// };

// function fragment(fragmentList) {
//   render(
//     fragmentList.map((fragment) => {
//       const dom = element.value('span');
//       element.setText(dom, fragment.text);
//       return {
//         ...fragment,
//         dom,
//       }
//     })
//   );
// }

// function render(domFragmentList) {
//   domFragmentList.forEach((fragment) => {
//     if (fragment.line > box.children.length - 1) {
//       const line = element.newLine();
//       box.append(line);
//       line.append(fragment.dom);
//     } else {
//       const line = box.children[fragment.line];
//       const { start } = fragment;
//       let num = 0;
//       let i = -1;
//       let item;
//       do {
//         i += 1;
//         item = line.children[i];
//         num += item.innerText.length;
//       } while(num < start);
//       if ((num - start) !== 0) {
//         line.children[i].insertAdjacentHTML('beforeend', `<span>${item.innerText.substring(0, num - start)}</span>`);
//         line.children[i].insertAdjacentHTML('afterend', fragment.dom.outerHTML);
//         line.children[i + 1].insertAdjacentHTML('afterend', `<span>${item.innerText.substring(num - start)}</span>`);
//       } else {
//         line.children[i].insertAdjacentHTML('afterend', fragment.dom.outerHTML);
//       }
//     }
//   });
// }

// export default {
//   initEditor,
//   initCursor,
//   fragment,
// };