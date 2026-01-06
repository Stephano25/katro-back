import { Injectable } from '@nestjs/common';

type Player = 0 | 1;

@Injectable()
export class KatroService {
  board = [
    [2, 2, 2, 2], // haut
    [2, 2, 2, 2], // bas
  ];

  currentPlayer: Player = 1;
  scores: number[] = [0, 0];
  gameOver = false;

  getState() {
    return {
      board: this.board,
      scores: this.scores,
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
    };
  }
  play(row: number, col: number) {
    if (this.gameOver) return this.getState();
    if (row !== this.currentPlayer) return this.getState();

    let seeds = this.board[row][col];
    if (seeds === 0) return this.getState();

    this.board[row][col] = 0;
    let r = row;
    let c = col;

    // sens trigonométrique
    while (seeds > 0) {
      if (r === 1) c++;
      else c--;

      if (c > 3) {
        r = 0;
        c = 3;
      }
      if (c < 0) {
        r = 1;
        c = 0;
      }
      this.board[r][c]++;
      seeds--;
    }

    // capture officielle katro
    const cr = r;
    let cc = c;
    while (
      cr !== this.currentPlayer &&
      (this.board[cr][cc] === 2 || this.board[cr][cc] === 3)
    ) {
      this.scores[this.currentPlayer] += this.board[cr][cc];
      this.board[cr][cc] = 0;
      cc--;
      if (cc < 0) break;
    }

    this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;

    const remaining = this.board.flat().reduce((a, b) => a + b, 0);
    if (remaining <= 1) this.gameOver = true;

    return this.getState();
  }
}
