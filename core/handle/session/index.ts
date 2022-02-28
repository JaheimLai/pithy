import Cursor from '../../input/cursor/index';
import TextView from '../../layer/view/text';
import Mouse from '../../input/mouse/index';
import PieceTable from './pieceTable';

class Session {

  lines: PieceTable;
  Cursor?: Cursor;
  Mouse?: Mouse;

  constructor() {
    this.lines = new PieceTable('');
  }

}

export type SessionInstance = Session;

export default new Session(); 