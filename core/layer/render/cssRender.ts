export default class CssRender {
  static renderCursor() {
    const css = ' \
      .cursor { \
        width: 1px; resize: none; border: none; outline: none; position: absolute; \
        font-weight: normal; letter-spacing: 0px; min-width: 0; min-height: 0; \
        margin: 0; padding: 0; overflow: hidden; color: transparent; \
        background-color: black; \
        animation-duration: 0.8s; \
        animation-name: cursorpacity; \
        animation-iteration-count: infinite; \
      } \
      @keyframes cursorpacity { \
        from { \
          opacity: 0; \
        } \
        to { \
          opacity: 1; \
        } \
      } \
    ';
    const head = document.head || document.getElementsByTagName('head')[0];
    const style: HTMLStyleElement = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    // if (style.styleSheet){
    //   // This is required for IE8 and below.
    //   style.styleSheet.cssText = css;
    // } else {
    //   style.appendChild(document.createTextNode(css));
    // }
    style.appendChild(document.createTextNode(css));
  }

  static renderNorm() {
    const css = ' \
      * { \
        margin: 0; padding: 0; \
      } \
    ';
    const head = document.head || document.getElementsByTagName('head')[0];
    const style: HTMLStyleElement = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    // if (style.styleSheet){
    //   // This is required for IE8 and below.
    //   style.styleSheet.cssText = css;
    // } else {
    //   style.appendChild(document.createTextNode(css));
    // }
    style.appendChild(document.createTextNode(css));
  }
}