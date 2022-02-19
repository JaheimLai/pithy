import Cursor from '../../input/cursor/index';
import TextView from '../../layer/view/text';
import Mouse from '../../input/mouse/index';
import PieceTable from './pieceTable';
import config from '../../config/index';

class Session {

  lines: PieceTable;
  Cursor?: Cursor;
  Mouse?: Mouse;
  config: config;

  constructor() {
    this.lines = new PieceTable();
    this.config = config;
  }

}

export default Session; 