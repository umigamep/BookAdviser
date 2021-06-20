
class OthelloBoard {
    constructor(){
        //MARK: Constant
        this.BLACK_TURN = 100;
        this.WHITE_TURN = -100;
        this.nowTurn       = this.BLACK_TURN;
        this.nowIndex      = 0;//何手打ち終えたか
        this.isGameFinished = false;

        // 一般的な初期配置を指定
        this.playerBoard   = 0x0000000810000000n;
        this.opponentBoard = 0x0000001008000000n;

        //履歴を保持
        this.historyOfnowTurn = {};
        this.historyOfplayerBoard = {};
        this.historyOfopponentBoard = {};
        this.historyOfPut = {};

    }
    //座標をBitに変換
    coordinateToBit(x, y) {
        let mask= 0x8000000000000000n;
        // X方向へのシフト
        switch (x) {
        case "A":
            break
        case "B":
            mask = mask >> 1
        case "C":
            mask = mask >> 2
        case "D":
            mask = mask >> 3
        case "E":
            mask = mask >> 4
        case "F":
            mask = mask >> 5
        case "G":
            mask = mask >> 6
        case "H":
            mask = mask >> 7
        default:
            break
        }
        // Y方向へのシフト
        let intY = Int(y)
        mask = mask >> ( (intY - 1) * 8)
    
        return mask
    }
    //合法手を作成
    makeLegalBoard(){
        //左右端の番人
        let horizontalWatchBoard = this.opponentBoard & 0x7e7e7e7e7e7e7e7en;
        //上下端の番人
        let verticalWatchBoard  = this.opponentBoard & 0x00FFFFFFFFFFFF00n;
        //全辺の番人
        let allSideWatchBoard  = this.opponentBoard & 0x007e7e7e7e7e7e00n;
        //空きマスのみにビットが立っているボード
        let blankBoard = ~(this.playerBoard | this.opponentBoard);
        //隣に相手の色があるかを一時保存する
        let tmp; 
        //返り値
        let legalBoard; 
    
        //8方向チェック
        // ・一度に返せる石は最大6つ ・高速化のためにforを展開(ほぼ意味ないけどw)
        //左
        tmp = horizontalWatchBoard & (this.playerBoard << 1);
        tmp |= horizontalWatchBoard & (tmp << 1);
        tmp |= horizontalWatchBoard & (tmp << 1);
        tmp |= horizontalWatchBoard & (tmp << 1);
        tmp |= horizontalWatchBoard & (tmp << 1);
        tmp |= horizontalWatchBoard & (tmp << 1);
        legalBoard = blankBoard & (tmp << 1);
    
        //右
        tmp = horizontalWatchBoard & (this.playerBoard >> 1);
        tmp |= horizontalWatchBoard & (tmp >> 1);
        tmp |= horizontalWatchBoard & (tmp >> 1);
        tmp |= horizontalWatchBoard & (tmp >> 1);
        tmp |= horizontalWatchBoard & (tmp >> 1);
        tmp |= horizontalWatchBoard & (tmp >> 1);
        legalBoard |= blankBoard & (tmp >> 1);
    
        //上
        tmp = verticalWatchBoard & (this.playerBoard << 8);
        tmp |= verticalWatchBoard & (tmp << 8);
        tmp |= verticalWatchBoard & (tmp << 8);
        tmp |= verticalWatchBoard & (tmp << 8);
        tmp |= verticalWatchBoard & (tmp << 8);
        tmp |= verticalWatchBoard & (tmp << 8);
        legalBoard |= blankBoard & (tmp << 8);
    
        //下
        tmp = verticalWatchBoard & (this.playerBoard >> 8);
        tmp |= verticalWatchBoard & (tmp >> 8);
        tmp |= verticalWatchBoard & (tmp >> 8);
        tmp |= verticalWatchBoard & (tmp >> 8);
        tmp |= verticalWatchBoard & (tmp >> 8);
        tmp |= verticalWatchBoard & (tmp >> 8);
        legalBoard |= blankBoard & (tmp >> 8);
    
        //右斜め上
        tmp = allSideWatchBoard & (board.playerBoard << 7);
        tmp |= allSideWatchBoard & (tmp << 7);
        tmp |= allSideWatchBoard & (tmp << 7);
        tmp |= allSideWatchBoard & (tmp << 7);
        tmp |= allSideWatchBoard & (tmp << 7);
        tmp |= allSideWatchBoard & (tmp << 7);
        legalBoard |= blankBoard & (tmp << 7);
    
        //左斜め上
        tmp = allSideWatchBoard & (this.playerBoard << 9);
        tmp |= allSideWatchBoard & (tmp << 9);
        tmp |= allSideWatchBoard & (tmp << 9);
        tmp |= allSideWatchBoard & (tmp << 9);
        tmp |= allSideWatchBoard & (tmp << 9);
        tmp |= allSideWatchBoard & (tmp << 9);
        legalBoard |= blankBoard & (tmp << 9);
    
        //右斜め下
        tmp = allSideWatchBoard & (this.playerBoard >> 9);
        tmp |= allSideWatchBoard & (tmp >> 9);
        tmp |= allSideWatchBoard & (tmp >> 9);
        tmp |= allSideWatchBoard & (tmp >> 9);
        tmp |= allSideWatchBoard & (tmp >> 9);
        tmp |= allSideWatchBoard & (tmp >> 9);
        legalBoard |= blankBoard & (tmp >> 9);
    
        //左斜め下
        tmp = allSideWatchBoard & (this.playerBoard >> 7);
        tmp |= allSideWatchBoard & (tmp >> 7);
        tmp |= allSideWatchBoard & (tmp >> 7);
        tmp |= allSideWatchBoard & (tmp >> 7);
        tmp |= allSideWatchBoard & (tmp >> 7);
        tmp |= allSideWatchBoard & (tmp >> 7);
        legalBoard |= blankBoard & (tmp >> 7);
    
        return legalBoard;
    }
    canPut (put){
        // 着手可能なマスにフラグが立っている合法手ボードを生成
        let legalBoard = makeLegalBoard();
        // 今回の着手が、その合法手ボードに含まれれば着手可能
        return (put & legalBoard) == put;
    }
    /*
     * @brief 反転箇所を求める
     * @param put 着手した場所のビット値
     * @param k   反転方向(8つ)
     * @return 反転箇所にフラグが立っている64ビット
     */
    transfer(put, k) {
        switch (k) {
        case 0: //上
            return (put << 8) & 0xffffffffffffff00n;
        case 1: //右上
            return (put << 7) & 0x7f7f7f7f7f7f7f00n;
        case 2: //右
            return (put >> 1) & 0x7f7f7f7f7f7f7f7fn;
        case 3: //右下
            return (put >> 9) & 0x007f7f7f7f7f7f7fn;
        case 4: //下
            return (put >> 8) & 0x00ffffffffffffffn;
        case 5: //左下
            return (put >> 7) & 0x00fefefefefefefen;
        case 6: //左
            return (put << 1) & 0xfefefefefefefefen;
        case 7: //左上
            return (put << 9) & 0xfefefefefefefe00n;
        default:
            return 0n;
        }
    }
    /*@brief 着手し,反転処理を行う
     @param put: 着手した場所のみにフラグが立つ64ビット
 */
    reverse(put) {
        //着手した場合のボードを生成
        let rev = 0;
        for(k=0; k < 8; ++k) {
            let rev_ = 0;
            var mask = transfer(put, k);
            while ((mask != 0) & ((mask & opponentBoard) != 0)) {
                rev_ |= mask;
                mask = transfer(put, k);
            }
            if ((mask & playerBoard) != 0) {
                rev |= rev_;
            }
        }
        //反転する
        this.playerBoard   ^= put | rev
        this.opponentBoard ^= rev
        //現在何手目かを更新
        this.nowIndex = this.nowIndex + 1
    }

    /*
     * @brief パス判定  (= プレイヤーのみが置けない時)
     * @return パスならtrue
     */
    isPass(){
        // 手番側の合法手ボードを生成
        let playerLegalBoard = makeLegalBoard();
        // 手番側だけがパスの場合    
        return playerLegalBoard == 0x0000000000000000n;
    }
    swapBoard() {
        //ボードの入れ替え
        let tmp = this.playerBoard;
        this.playerBoard   = this.opponentBoard;
        this.opponentBoard = tmp;
    
        //色の入れ替え
        this.nowTurn *= -1;
    }
    getResult(){
        //石数を取得
        let blackScore = bitCount(playerBoard);
        let whiteScore = bitCount(opponentBoard)
        if (this.nowTurn == this.WHITE_TURN) {
            let tmp = blackScore;
            blackScore = whiteScore;
            whiteScore = tmp;
        }
        // 勝敗情報を取得
        /*
        let winner = "黒番";
        let isWhiteWin = (whiteScore >= blackScore);
        if isWhiteWin {
            winner = "白番"
        } 
        */
        return (blackScore, whiteScore);
    }
    Put(put) {
        if(this.canPut(put)){
            this.reverse(put);//この時点で手番が足されている。
            this.swapBoard();
            this.historyOfPut[this.nowIndex] = put;
            
            //パスが起きているかを判定
            if(this.isPass()){
                //パスが起きていたら手番を変更
                this.swapBoard();
                //試合終了の判定
                if(this.isPass()){
                    this.isGameFinished = true;
                } else {
                    //終了していなかったら記録
                    this.historyOfnowTurn[this.nowIndex] = this.nowTurn;
                    this.historyOfplayerBoard[this.nowIndex] = this.playerBoard;
                    this.historyOfopponentBoard[this.nowINdex] = this.opponentBoard;
                }
            } else {
                //パスがなければ普通に記録
                this.historyOfnowTurn[this.nowIndex] = this.nowTurn;
                this.historyOfplayerBoard[this.nowIndex] = this.playerBoard;
                this.historyOfopponentBoard[this.nowINdex] = this.opponentBoard;
            }
        }
    }
    undo(){
        this.nowIndex -= 1;
        this.nowTurn = this.historyOfnowTurn[this.nowIndex];
        this.playerBoard = this.historyOfplayerBoard[this.nowIndex];
        this.opponentBoard = this.historyOfopponentBoard[this.nowIndex];
        this.isGameFinished = false;
    }
}
