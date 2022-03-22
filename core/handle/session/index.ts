import Cursor from '../../input/cursor/index';
import TextView from '../../layer/view/text';
import Mouse from '../../input/mouse/index';
import PieceTable from './pieceTable';
import Config from '../../config/index';

class Session {

  pieceTable: PieceTable;
  Cursor?: Cursor;
  Mouse?: Mouse;
  config: Config;

  constructor() {
    this.pieceTable = new PieceTable('');
    this.config = new Config();
    this.config.fontSize = 22;
  }

}

export type SessionInstance = Session;

export default new Session(); 