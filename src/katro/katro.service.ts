import { Injectable } from '@nestjs/common';

export interface CellPos { row: number; col: number; }
export interface LastMove {
  start: CellPos;
  end: CellPos;
  path: CellPos[];
  captured: CellPos[];
}
export interface GameState {
  board: number[][];
  scores: number[];
  currentPlayer: number;
  gameOver: boolean;
  lastMove: LastMove;
}

@Injectable()
export class KatroService {
  private initialBoard(): number[][] {
    return [
      Array(4).fill(2), // Rangée extérieure Haut (J1)
      Array(4).fill(2), // Rangée intérieure Haut (J1)
      Array(4).fill(2), // Rangée intérieure Bas (J2)
      Array(4).fill(2), // Rangée extérieure Bas (J2)
    ];
  }

  private state: GameState = {
    board: this.initialBoard(),
    scores: [0, 0],
    currentPlayer: 0,
    gameOver: false,
    lastMove: { start: { row: -1, col: -1 }, end: { row: -1, col: -1 }, path: [], captured: [] },
  };

  getState(): GameState {
    return this.state;
  }

  reset(): GameState {
    this.state = {
      board: this.initialBoard(),
      scores: [0, 0],
      currentPlayer: 0,
      gameOver: false,
      lastMove: { start: { row: -1, col: -1 }, end: { row: -1, col: -1 }, path: [], captured: [] },
    };
    return this.state;
  }

  play(row: number, col: number): GameState {
    if (this.state.gameOver) return this.state;

    //Vérifier que le joueur joue dans son camp (rangées 0-1 pour J1, 2-3 pour J2)
    if (this.state.currentPlayer === 0 && !(row === 0 || row === 1)) return this.state;
    if (this.state.currentPlayer === 1 && !(row === 2 || row === 3)) return this.state;

    let seeds = this.state.board[row][col];
    if (seeds === 0) return this.state;

    this.state.lastMove = { start: { row, col }, end: { row: -1, col: -1 }, path: [], captured: [] };
    this.state.board[row][col] = 0;
    let r = row, c = col;

    //Distribution confinée au camp du joueur
    while (seeds > 0) {
      if (this.state.currentPlayer === 0) {
        c--;
        if (c < 0) { r = r === 0 ? 1 : 0; c = 3; }
      } else {
        c++;
        if (c > 3) { r = r === 3 ? 2 : 3; c = 0; }
      }
      this.state.board[r][c]++;
      this.state.lastMove.path.push({ row: r, col: c });
      seeds--;
    }

    this.state.lastMove.end = { row: r, col: c };

    // Capture conditionnelle avec transfert
    if ((r === 0 && this.state.currentPlayer === 0) || (r === 3 && this.state.currentPlayer === 1)) {
      const captureRow = r;
      const oppositeRow = r === 0 ? 3 : 0;
      let captureCol = c;

      // D’abord prendre la case "devant"
      if (this.state.board[captureRow][captureCol] > 1 &&
          this.state.board[oppositeRow][captureCol] > 0) {
        const capturedSeeds = this.state.board[oppositeRow][captureCol];
        const targetRow = this.state.currentPlayer === 0 ? 1 : 2; // rangée intérieure du joueur
        this.state.board[targetRow][captureCol] += capturedSeeds;
        this.state.lastMove.captured.push({ row: oppositeRow, col: captureCol });
        this.state.board[oppositeRow][captureCol] = 0;

        // Ensuite avancer et prendre la case "derrière"
        captureCol += r === 0 ? -1 : 1;
        if (captureCol >= 0 && captureCol < 4 &&
            this.state.board[captureRow][captureCol] > 1 &&
            this.state.board[oppositeRow][captureCol] > 0) {
          const capturedSeeds2 = this.state.board[oppositeRow][captureCol];
          this.state.board[targetRow][captureCol] += capturedSeeds2;
          this.state.lastMove.captured.push({ row: oppositeRow, col: captureCol });
          this.state.board[oppositeRow][captureCol] = 0;
        }
      }
    }

    // Changer de joueur
    this.state.currentPlayer = this.state.currentPlayer === 0 ? 1 : 0;

    // Fin du jeu : si un joueur n’a plus qu’une seule graine au total
    const totalPlayer1 = this.state.board[0].reduce((a, b) => a + b, 0) +
                         this.state.board[1].reduce((a, b) => a + b, 0);
    const totalPlayer2 = this.state.board[2].reduce((a, b) => a + b, 0) +
                         this.state.board[3].reduce((a, b) => a + b, 0);

    if (totalPlayer1 === 1 || totalPlayer2 === 1) {
      this.state.gameOver = true;
    }

    return this.state;
  }
}
