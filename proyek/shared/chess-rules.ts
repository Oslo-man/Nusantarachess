(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.NusantaraChess = root.NusantaraChess || {};
    var exported: any = factory();
    for (var k in exported) { root.NusantaraChess[k] = exported[k]; }
  }
}(typeof self !== "undefined" ? self : this, function () {
"use strict";

function sqIndex(file: any, rank: any) {
  return rank * 8 + file;
}
function fileOf(idx: any) { return idx % 8; }
function rankOf(idx: any) { return Math.floor(idx / 8); }
function algebraic(idx: any) {
  const f = "abcdefgh"[fileOf(idx)];
  const r = 8 - rankOf(idx);
  return f + r;
}
function fromAlgebraic(str: any) {
  const f = str.charCodeAt(0) - 97;
  const r = 8 - parseInt(str[1], 10);
  return sqIndex(f, r);
}

function createInitialBoard() {
  const back = ["r","n","b","q","k","b","n","r"];
  const board = new Array(64).fill(null);
  for (let f = 0; f < 8; f++) {
    board[sqIndex(f,0)] = { type: back[f], color: "b" };
    board[sqIndex(f,1)] = { type: "p", color: "b" };
    board[sqIndex(f,6)] = { type: "p", color: "w" };
    board[sqIndex(f,7)] = { type: back[f], color: "w" };
  }
  return board;
}

class ChessGame {
  declare board: any;
  declare turn: any;
  declare castling: any;
  declare epTarget: any;
  declare halfmoveClock: any;
  declare fullmoveNumber: any;
  declare history: any;
  constructor() {
    this.board = createInitialBoard();
    this.turn = "w";
    this.castling = { wK: true, wQ: true, bK: true, bQ: true };
    this.epTarget = null;
    this.halfmoveClock = 0;
    this.fullmoveNumber = 1;
    this.history = [];
  }

  clone() {
    const g = new ChessGame();
    g.board = this.board.slice();
    g.turn = this.turn;
    g.castling = { ...this.castling };
    g.epTarget = this.epTarget;
    g.halfmoveClock = this.halfmoveClock;
    g.fullmoveNumber = this.fullmoveNumber;
    g.history = this.history.slice();
    return g;
  }

  pieceAt(idx: any) { return this.board[idx]; }

  findKing(color: any) {
    for (let i = 0; i < 64; i++) {
      const p = this.board[i];
      if (p && p.type === "k" && p.color === color) return i;
    }
    return -1;
  }

  isSquareAttacked(idx: any, byColor: any) {
    const f0 = fileOf(idx), r0 = rankOf(idx);
    const pawnDir = byColor === "w" ? 1 : -1;
    for (const df of [-1, 1]) {
      const f = f0 + df, r = r0 + pawnDir;
      if (f >= 0 && f < 8 && r >= 0 && r < 8) {
        const p = this.board[sqIndex(f, r)];
        if (p && p.type === "p" && p.color === byColor) return true;
      }
    }
    const knightDeltas = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
    for (const [df, dr] of knightDeltas) {
      const f = f0 + df, r = r0 + dr;
      if (f >= 0 && f < 8 && r >= 0 && r < 8) {
        const p = this.board[sqIndex(f, r)];
        if (p && p.type === "n" && p.color === byColor) return true;
      }
    }
    for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) {
      if (df === 0 && dr === 0) continue;
      const f = f0 + df, r = r0 + dr;
      if (f >= 0 && f < 8 && r >= 0 && r < 8) {
        const p = this.board[sqIndex(f, r)];
        if (p && p.type === "k" && p.color === byColor) return true;
      }
    }
    const straightDirs = [[1,0],[-1,0],[0,1],[0,-1]];
    for (const [df, dr] of straightDirs) {
      let f = f0 + df, r = r0 + dr;
      while (f >= 0 && f < 8 && r >= 0 && r < 8) {
        const p = this.board[sqIndex(f, r)];
        if (p) {
          if (p.color === byColor && (p.type === "r" || p.type === "q")) return true;
          break;
        }
        f += df; r += dr;
      }
    }
    const diagDirs = [[1,1],[1,-1],[-1,1],[-1,-1]];
    for (const [df, dr] of diagDirs) {
      let f = f0 + df, r = r0 + dr;
      while (f >= 0 && f < 8 && r >= 0 && r < 8) {
        const p = this.board[sqIndex(f, r)];
        if (p) {
          if (p.color === byColor && (p.type === "b" || p.type === "q")) return true;
          break;
        }
        f += df; r += dr;
      }
    }
    return false;
  }

  inCheck(color: any) {
    const kingIdx = this.findKing(color);
    if (kingIdx === -1) return false;
    return this.isSquareAttacked(kingIdx, color === "w" ? "b" : "w");
  }

  pseudoMovesFor(idx: any) {
    const piece = this.board[idx];
    if (!piece) return [];
    const moves = [];
    const f0 = fileOf(idx), r0 = rankOf(idx);
    const color = piece.color;
    const enemy = color === "w" ? "b" : "w";

    const pushIfValid = (f: any, r: any, captureOnly: any, noCaptue: any) => {
      if (f < 0 || f > 7 || r < 0 || r > 7) return false;
      const target = sqIndex(f, r);
      const p = this.board[target];
      if (!p) {
        if (!captureOnly) moves.push({ from: idx, to: target });
        return true;
      } else {
        if (p.color === enemy && !noCaptue) moves.push({ from: idx, to: target, capture: true });
        return false;
      }
    };

    if (piece.type === "p") {
      const dir = color === "w" ? -1 : 1;
      const startRank = color === "w" ? 6 : 1;
      const promoRank = color === "w" ? 0 : 7;
      let r = r0 + dir;
      if (r >= 0 && r < 8 && !this.board[sqIndex(f0, r)]) {
        if (r === promoRank) {
          ["q","r","b","n"].forEach(pr => moves.push({ from: idx, to: sqIndex(f0, r), promotion: pr }));
        } else {
          moves.push({ from: idx, to: sqIndex(f0, r) });
        }
        if (r0 === startRank) {
          const r2 = r0 + dir * 2;
          if (!this.board[sqIndex(f0, r2)]) {
            moves.push({ from: idx, to: sqIndex(f0, r2), doublePush: true });
          }
        }
      }
      for (const df of [-1, 1]) {
        const f = f0 + df, rr = r0 + dir;
        if (f < 0 || f > 7 || rr < 0 || rr > 7) continue;
        const target = sqIndex(f, rr);
        const p = this.board[target];
        if (p && p.color === enemy) {
          if (rr === promoRank) {
            ["q","r","b","n"].forEach(pr => moves.push({ from: idx, to: target, capture: true, promotion: pr }));
          } else {
            moves.push({ from: idx, to: target, capture: true });
          }
        } else if (this.epTarget === target) {
          moves.push({ from: idx, to: target, capture: true, enPassant: true });
        }
      }
    } else if (piece.type === "n") {
      const deltas = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
      for (const [df, dr] of deltas) pushIfValid(f0+df, r0+dr, false, false);
    } else if (piece.type === "k") {
      for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) {
        if (df === 0 && dr === 0) continue;
        pushIfValid(f0+df, r0+dr, false, false);
      }
      const rank = color === "w" ? 7 : 0;
      if (r0 === rank && f0 === 4 && !this.inCheck(color)) {
        const kFlag = color === "w" ? "wK" : "bK";
        const qFlag = color === "w" ? "wQ" : "bQ";
        if (this.castling[kFlag] &&
            !this.board[sqIndex(5, rank)] && !this.board[sqIndex(6, rank)] &&
            !this.isSquareAttacked(sqIndex(5, rank), enemy) &&
            !this.isSquareAttacked(sqIndex(6, rank), enemy)) {
          moves.push({ from: idx, to: sqIndex(6, rank), castle: "K" });
        }
        if (this.castling[qFlag] &&
            !this.board[sqIndex(3, rank)] && !this.board[sqIndex(2, rank)] && !this.board[sqIndex(1, rank)] &&
            !this.isSquareAttacked(sqIndex(3, rank), enemy) &&
            !this.isSquareAttacked(sqIndex(2, rank), enemy)) {
          moves.push({ from: idx, to: sqIndex(2, rank), castle: "Q" });
        }
      }
    } else {
      const dirs = piece.type === "r" ? [[1,0],[-1,0],[0,1],[0,-1]]
                  : piece.type === "b" ? [[1,1],[1,-1],[-1,1],[-1,-1]]
                  : [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
      for (const [df, dr] of dirs) {
        let f = f0 + df, r = r0 + dr;
        while (f >= 0 && f < 8 && r >= 0 && r < 8) {
          const cont = pushIfValid(f, r, false, false);
          if (!cont) break;
          f += df; r += dr;
        }
      }
    }
    return moves;
  }

  legalMovesFor(idx: any) {
    const piece = this.board[idx];
    if (!piece || piece.color !== this.turn) return [];
    const pseudo = this.pseudoMovesFor(idx);
    const legal = [];
    for (const m of pseudo) {
      const clone = this.clone();
      clone.applyMove(m);
      if (!clone.inCheck(piece.color)) legal.push(m);
    }
    return legal;
  }

  allLegalMoves(color: any) {
    const all = [];
    for (let i = 0; i < 64; i++) {
      const p = this.board[i];
      if (p && p.color === color) all.push(...this.legalMovesFor(i));
    }
    return all;
  }

  isCheckmate() {
    return this.inCheck(this.turn) && this.allLegalMoves(this.turn).length === 0;
  }
  isStalemate() {
    return !this.inCheck(this.turn) && this.allLegalMoves(this.turn).length === 0;
  }
  isDeadPosition() {
    const pieces = this.board.filter((p: any) => p);
    if (pieces.length > 4) return false;
    const nonKing = pieces.filter((p: any) => p.type !== "k");
    if (nonKing.length === 0) return true;
    if (nonKing.length === 1 && (nonKing[0].type === "n" || nonKing[0].type === "b")) return true;
    return false;
  }
  isFiftyMoveRule() { return this.halfmoveClock >= 100; }

  gameOverReason() {
    if (this.isCheckmate()) return { over: true, reason: "checkmate", winner: this.turn === "w" ? "b" : "w" };
    if (this.isStalemate()) return { over: true, reason: "stalemate", winner: null };
    if (this.isFiftyMoveRule()) return { over: true, reason: "fifty-move", winner: null };
    if (this.isDeadPosition()) return { over: true, reason: "dead-position", winner: null };
    return { over: false };
  }

  toFEN() {
    let rows = [];
    for (let r = 0; r < 8; r++) {
      let row = "", empty = 0;
      for (let f = 0; f < 8; f++) {
        const p = this.board[sqIndex(f, r)];
        if (!p) { empty++; continue; }
        if (empty > 0) { row += empty; empty = 0; }
        let ch = p.type;
        row += p.color === "w" ? ch.toUpperCase() : ch;
      }
      if (empty > 0) row += empty;
      rows.push(row);
    }
    const boardStr = rows.join("/");
    const turnStr = this.turn;
    let castleStr = "";
    if (this.castling.wK) castleStr += "K";
    if (this.castling.wQ) castleStr += "Q";
    if (this.castling.bK) castleStr += "k";
    if (this.castling.bQ) castleStr += "q";
    if (!castleStr) castleStr = "-";
    const epStr = this.epTarget !== null ? algebraic(this.epTarget) : "-";
    return `${boardStr} ${turnStr} ${castleStr} ${epStr} ${this.halfmoveClock} ${this.fullmoveNumber}`;
  }

  applyMove(move: any) {
    const piece = this.board[move.from];
    const captured = this.board[move.to];
    const color = piece.color;

    let epCaptureSquare = null;
    if (move.enPassant) {
      epCaptureSquare = sqIndex(fileOf(move.to), rankOf(move.from));
      this.board[epCaptureSquare] = null;
    }

    this.board[move.to] = move.promotion
      ? { type: move.promotion, color }
      : piece;
    this.board[move.from] = null;

    if (move.castle === "K") {
      const rank = color === "w" ? 7 : 0;
      this.board[sqIndex(5, rank)] = this.board[sqIndex(7, rank)];
      this.board[sqIndex(7, rank)] = null;
    } else if (move.castle === "Q") {
      const rank = color === "w" ? 7 : 0;
      this.board[sqIndex(3, rank)] = this.board[sqIndex(0, rank)];
      this.board[sqIndex(0, rank)] = null;
    }

    if (piece.type === "k") {
      if (color === "w") { this.castling.wK = false; this.castling.wQ = false; }
      else { this.castling.bK = false; this.castling.bQ = false; }
    }
    if (piece.type === "r") {
      if (move.from === sqIndex(0,7)) this.castling.wQ = false;
      if (move.from === sqIndex(7,7)) this.castling.wK = false;
      if (move.from === sqIndex(0,0)) this.castling.bQ = false;
      if (move.from === sqIndex(7,0)) this.castling.bK = false;
    }
    if (move.to === sqIndex(0,7)) this.castling.wQ = false;
    if (move.to === sqIndex(7,7)) this.castling.wK = false;
    if (move.to === sqIndex(0,0)) this.castling.bQ = false;
    if (move.to === sqIndex(7,0)) this.castling.bK = false;

    this.epTarget = move.doublePush
      ? sqIndex(fileOf(move.to), (rankOf(move.from) + rankOf(move.to)) / 2)
      : null;

    if (piece.type === "p" || captured || move.enPassant) this.halfmoveClock = 0;
    else this.halfmoveClock++;

    if (color === "b") this.fullmoveNumber++;
    this.turn = color === "w" ? "b" : "w";

    return { captured: move.enPassant ? { type: "p", color: color === "w" ? "b" : "w" } : captured };
  }

  moveToSANFull(move: any, boardAfter: any) {
    if (move.castle === "K") {
      let s = "O-O";
      if (boardAfter.isCheckmate()) s += "#";
      else if (boardAfter.inCheck(boardAfter.turn)) s += "+";
      return s;
    }
    if (move.castle === "Q") {
      let s = "O-O-O";
      if (boardAfter.isCheckmate()) s += "#";
      else if (boardAfter.inCheck(boardAfter.turn)) s += "+";
      return s;
    }

    const piece = this.board[move.from];
    const destStr = algebraic(move.to);
    const isCapture = !!(move.capture);
    let s = "";

    if (piece.type === "p") {
      if (isCapture) s += "abcdefgh"[fileOf(move.from)] + "x";
      s += destStr;
      if (move.promotion) s += "=" + move.promotion.toUpperCase();
    } else {
      s += piece.type.toUpperCase();

      const others = [];
      for (let i = 0; i < 64; i++) {
        if (i === move.from) continue;
        const p = this.board[i];
        if (p && p.type === piece.type && p.color === piece.color) {
          const legal = this.legalMovesFor(i);
          if (legal.some(m => m.to === move.to)) others.push(i);
        }
      }
      if (others.length > 0) {
        const sameFile = others.some(i => fileOf(i) === fileOf(move.from));
        const sameRank = others.some(i => rankOf(i) === rankOf(move.from));
        if (!sameFile) {
          s += "abcdefgh"[fileOf(move.from)];
        } else if (!sameRank) {
          s += (8 - rankOf(move.from));
        } else {
          s += algebraic(move.from);
        }
      }

      if (isCapture) s += "x";
      s += destStr;
    }

    if (boardAfter.isCheckmate()) s += "#";
    else if (boardAfter.inCheck(boardAfter.turn)) s += "+";

    return s;
  }

  static fromFEN(fen: any) {
    const g = new ChessGame();
    const parts = fen.trim().split(/\s+/);
    const boardStr = parts[0], turnStr = parts[1], castleStr = parts[2],
          epStr = parts[3], halfmoveStr = parts[4], fullmoveStr = parts[5];

    const board = new Array(64).fill(null);
    const rows = boardStr.split("/");
    for (let r = 0; r < 8; r++) {
      let f = 0;
      for (const ch of rows[r]) {
        if (/[1-8]/.test(ch)) { f += parseInt(ch, 10); continue; }
        const color = ch === ch.toUpperCase() ? "w" : "b";
        board[sqIndex(f, r)] = { type: ch.toLowerCase(), color };
        f++;
      }
    }
    g.board = board;
    g.turn = turnStr === "b" ? "b" : "w";
    g.castling = {
      wK: castleStr.indexOf("K") !== -1,
      wQ: castleStr.indexOf("Q") !== -1,
      bK: castleStr.indexOf("k") !== -1,
      bQ: castleStr.indexOf("q") !== -1
    };
    g.epTarget = epStr === "-" ? null : fromAlgebraic(epStr);
    g.halfmoveClock = parseInt(halfmoveStr, 10) || 0;
    g.fullmoveNumber = parseInt(fullmoveStr, 10) || 1;
    return g;
  }
}

return {
  ChessGame: ChessGame,
  sqIndex: sqIndex,
  fileOf: fileOf,
  rankOf: rankOf,
  algebraic: algebraic,
  fromAlgebraic: fromAlgebraic,
  createInitialBoard: createInitialBoard
};

}));
