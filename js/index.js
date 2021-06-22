"use strict"

//import(OthelloBoard);//なんかうまくいかないので、べた書き
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
        this.historyOfnowTurn[this.nowIndex] = this.nowTurn;
        this.historyOfplayerBoard[this.nowIndex] = this.playerBoard;
        this.historyOfopponentBoard[this.nowIndex] = this.opponentBoard;

    }
    new(){
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
        this.historyOfnowTurn[this.nowIndex] = this.nowTurn;
        this.historyOfplayerBoard[this.nowIndex] = this.playerBoard;
        this.historyOfopponentBoard[this.nowIndex] = this.opponentBoard;
    }
    //座標をBitに変換
    coordinateToBit(x, y) {
        let mask= 0x8000000000000000n;
        // X方向へのシフト
        switch (x) {
        case "A":
            break;
        case "B":
            mask = mask >> 1n;
            break;
        case "C":
            mask = mask >> 2n;
            break;
        case "D":
            mask = mask >> 3n;
            break;
        case "E":
            mask = mask >> 4n;
            break;
        case "F":
            mask = mask >> 5n;
            break;
        case "G":
            mask = mask >> 6n;
            break;
        case "H":
            mask = mask >> 7n;
            break;
        default:
            break
        }
        
        // Y方向へのシフト
        let IntY = Number(y);
        mask = mask >> BigInt((IntY - 1) * 8);
        return mask
    }
    bitTOCoordinate(bit) {
        let mask= 0x8000000000000000n;
        let k;
        for(let i = 0; i < 64; ++i){
            if((mask&bit) == mask){
                k = i;
                break;
            }
            mask = mask >> 1n;
        }
        let row = (k-k%8)/8+1;
        let col;
        switch(k%8){
            case 0:
                col = "A";
                break;
            case 1:
                col = "B";
                break;
            case 2:
                col = "C";
                break;
            case 3:
                col = "D";
                break;
            case 4:
                col = "E";
                break;
            case 5:
                col = "F";
                break;
            case 6:
                col = "G";
                break;
            default:
                col = "H"
                break;
        }
        return col+String(row);
    }
    Kifu(){
        let ret = "";
        for(let i = 0; i < this.nowIndex; ++i){
            ret += this.bitTOCoordinate(this.historyOfPut[i+1]);
        }
        return ret;
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
        tmp = horizontalWatchBoard & (this.playerBoard << 1n);
        tmp |= horizontalWatchBoard & (tmp << 1n);
        tmp |= horizontalWatchBoard & (tmp << 1n);
        tmp |= horizontalWatchBoard & (tmp << 1n);
        tmp |= horizontalWatchBoard & (tmp << 1n);
        tmp |= horizontalWatchBoard & (tmp << 1n);
        legalBoard = blankBoard & (tmp << 1n);
    
        //右
        tmp = horizontalWatchBoard & (this.playerBoard >> 1n);
        tmp |= horizontalWatchBoard & (tmp >> 1n);
        tmp |= horizontalWatchBoard & (tmp >> 1n);
        tmp |= horizontalWatchBoard & (tmp >> 1n);
        tmp |= horizontalWatchBoard & (tmp >> 1n);
        tmp |= horizontalWatchBoard & (tmp >> 1n);
        legalBoard |= blankBoard & (tmp >> 1n);
    
        //上
        tmp = verticalWatchBoard & (this.playerBoard << 8n);
        tmp |= verticalWatchBoard & (tmp << 8n);
        tmp |= verticalWatchBoard & (tmp << 8n);
        tmp |= verticalWatchBoard & (tmp << 8n);
        tmp |= verticalWatchBoard & (tmp << 8n);
        tmp |= verticalWatchBoard & (tmp << 8n);
        legalBoard |= blankBoard & (tmp << 8n);
    
        //下
        tmp = verticalWatchBoard & (this.playerBoard >> 8n);
        tmp |= verticalWatchBoard & (tmp >> 8n);
        tmp |= verticalWatchBoard & (tmp >> 8n);
        tmp |= verticalWatchBoard & (tmp >> 8n);
        tmp |= verticalWatchBoard & (tmp >> 8n);
        tmp |= verticalWatchBoard & (tmp >> 8n);
        legalBoard |= blankBoard & (tmp >> 8n);
    
        //右斜め上
        tmp = allSideWatchBoard & (this.playerBoard << 7n);
        tmp |= allSideWatchBoard & (tmp << 7n);
        tmp |= allSideWatchBoard & (tmp << 7n);
        tmp |= allSideWatchBoard & (tmp << 7n);
        tmp |= allSideWatchBoard & (tmp << 7n);
        tmp |= allSideWatchBoard & (tmp << 7n);
        legalBoard |= blankBoard & (tmp << 7n);
    
        //左斜め上
        tmp = allSideWatchBoard & (this.playerBoard << 9n);
        tmp |= allSideWatchBoard & (tmp << 9n);
        tmp |= allSideWatchBoard & (tmp << 9n);
        tmp |= allSideWatchBoard & (tmp << 9n);
        tmp |= allSideWatchBoard & (tmp << 9n);
        tmp |= allSideWatchBoard & (tmp << 9n);
        legalBoard |= blankBoard & (tmp << 9n);
    
        //右斜め下
        tmp = allSideWatchBoard & (this.playerBoard >> 9n);
        tmp |= allSideWatchBoard & (tmp >> 9n);
        tmp |= allSideWatchBoard & (tmp >> 9n);
        tmp |= allSideWatchBoard & (tmp >> 9n);
        tmp |= allSideWatchBoard & (tmp >> 9n);
        tmp |= allSideWatchBoard & (tmp >> 9n);
        legalBoard |= blankBoard & (tmp >> 9n);
    
        //左斜め下
        tmp = allSideWatchBoard & (this.playerBoard >> 7n);
        tmp |= allSideWatchBoard & (tmp >> 7n);
        tmp |= allSideWatchBoard & (tmp >> 7n);
        tmp |= allSideWatchBoard & (tmp >> 7n);
        tmp |= allSideWatchBoard & (tmp >> 7n);
        tmp |= allSideWatchBoard & (tmp >> 7n);
        legalBoard |= blankBoard & (tmp >> 7n);
    
        return legalBoard;
    }
    canPut (put){
        // 着手可能なマスにフラグが立っている合法手ボードを生成
        let legalBoard = this.makeLegalBoard();
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
            return (put << 8n) & 0xffffffffffffff00n;
        case 1: //右上
            return (put << 7n) & 0x7f7f7f7f7f7f7f00n;
        case 2: //右
            return (put >> 1n) & 0x7f7f7f7f7f7f7f7fn;
        case 3: //右下
            return (put >> 9n) & 0x007f7f7f7f7f7f7fn;
        case 4: //下
            return (put >> 8n) & 0x00ffffffffffffffn;
        case 5: //左下
            return (put >> 7n) & 0x00fefefefefefefen;
        case 6: //左
            return (put << 1n) & 0xfefefefefefefefen;
        case 7: //左上
            return (put << 9n) & 0xfefefefefefefe00n;
        default:
            return 0n;
        }
    }
    /*@brief 着手し,反転処理を行う
     @param put: 着手した場所のみにフラグが立つ64ビット
 */
    reverse(put) {
        //着手した場合のボードを生成
        let rev = 0n;
        for(let k=0; k < 8; ++k) {
            let rev_ = 0n;
            var mask = this.transfer(put, k);
            while ((mask != 0n) & ((mask & this.opponentBoard) != 0n)) {
                rev_ |= mask;
                mask = this.transfer(mask, k);
            }
            if ((mask & this.playerBoard) != 0n) {
                rev |= rev_;
            }
        }
        //反転する
        this.playerBoard   ^= put | rev;
        this.opponentBoard ^= rev;
        //現在何手目かを更新
        this.nowIndex = this.nowIndex + 1;
    }

    /*
     * @brief パス判定  (= プレイヤーのみが置けない時)
     * @return パスならtrue
     */
    isPass(){
        // 手番側の合法手ボードを生成
        let playerLegalBoard = this.makeLegalBoard();
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
    bitCount(someboard){
        let mask= 0x8000000000000000n;
        let ret = 0
        for(let i = 0; i < 64; ++i){
            if((mask&someboard)==mask){
                ret += 1;
            }
            mask = mask >> 1n;
        }
        return ret;
    }
    getResult(){
        //石数を取得
        let blackScore = this.bitCount(playerBoard);
        let whiteScore = this.bitCount(opponentBoard)
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
                    this.historyOfopponentBoard[this.nowIndex] = this.opponentBoard;
                }
            } else {
                //パスがなければ普通に記録
                this.historyOfnowTurn[this.nowIndex] = this.nowTurn;
                this.historyOfplayerBoard[this.nowIndex] = this.playerBoard;
                this.historyOfopponentBoard[this.nowIndex] = this.opponentBoard;
            }
        }
    }
    playline(line){
        this.new();
        let l = line.length/2;
        for(let i = 0; i < l; ++i){
            this.Put(this.coordinateToBit(line.slice(2*i,2*i+1),line.slice(2*i+1,2*i+2)));
        }
    }
    /*実装したがid取得が面倒で使ってない*/
    edit(mask,color){
        /*color:Black = 100, White = -100, Green = 0*/
        if(this.nowTurn==color){
            this.playerBoard = mask|this.playerBoard;
        } else if(this.nowTurn==-color){
            this.opponentBoard = mask|this.opponentBoard;
        } else {
            this.playerBoard = (~mask)&this.playerBoard;
            this.opponentBoard = (~mask)&this.opponentBoard;
        }
    }
    blankcount(){
        return this.bitCount(~(this.playerBoard | this.opponentBoard));
    }
    undo(){
        if(this.nowIndex>=1){
            this.nowIndex -= 1;
            this.nowTurn = this.historyOfnowTurn[this.nowIndex];
            this.playerBoard = this.historyOfplayerBoard[this.nowIndex];
            this.opponentBoard = this.historyOfopponentBoard[this.nowIndex];
            this.isGameFinished = false;
        }
    }
    solve(){
        //ゲーム終了なら、黒の石数を返す。
        if(this.isGameFinished){
            if(this.nowTurn==this.BLACK_TURN){
                return this.bitCount(this.playerBoard);
            } else {
                return this.bitCount(this.opponentBoard);
            }
        }
        let legal = this.makeLegalBoard();
        let mask= 0x8000000000000000n;
        //黒番なら、返り値＝黒石を最大化する手を選べば良い
        if(this.nowTurn==this.BLACK_TURN){
            let maxvalue = -100;
            for(let i = 0; i < 64; ++i){
                //合法手の評価を確認
                if((mask & legal)==mask){
                    this.Put(mask);
                    if(this.nowTurn==this.BLACK_TURN){
                        maxvalue = Math.max(maxvalue,this.solve());//めんどくさくてサボってる。
                    } else {
                        //alphasearch:次の白番で、現状の最善進行より返り値が悪くなるような応手が見つかった瞬間に打ち切る
                        maxvalue = Math.max(maxvalue,this.alphasearch(maxvalue));
                    }
                    this.undo();
                }
                mask = mask >> 1n;
            }
            return maxvalue;
        } else {
            //今が白番の場合
            let minvalue = 100;
            for(let i = 0; i < 64; ++i){
                if((mask & legal)==mask){
                    this.Put(mask);
                    if(this.nowTurn==this.BLACK_TURN){
                        //betasearch:次の黒番で、現状の最善進行より返り値が良くなるような応手が見つかった瞬間に打ち切る
                        minvalue = Math.min(minvalue,this.betasearch(minvalue));
                    } else {
                        minvalue = Math.min(minvalue,this.solve());//同じくサボり
                    }
                    this.undo();
                }
                mask = mask >> 1n;
            }
            return minvalue;
        }
    }
    //alphasearchは常に白番。直前の黒番でmaxvelueが最低保証されているので、それ以下の応手が見つかると無意味になる。
    alphasearch(maxvalue){
        if(this.isGameFinished){
            if(this.nowTurn==this.BLACK_TURN){
                return this.bitCount(this.playerBoard);
            } else {
                return this.bitCount(this.opponentBoard);
            }
        }
        let legal = this.makeLegalBoard();
        let mask= 0x8000000000000000n;
        let minvalue = 100;
        for(let i = 0; i < 64; ++i){
            if((mask & legal)==mask){
                this.Put(mask);
                if(this.nowTurn==this.BLACK_TURN){
                    //betasearch:次の黒番で、現状の最善進行より返り値が良くなるような応手が見つかった瞬間に打ち切る
                    minvalue = Math.min(minvalue,this.betasearch(minvalue));
                } else {
                    minvalue = Math.min(minvalue,this.solve());//同じくサボり
                }
                this.undo();
                if(minvalue < maxvalue){
                    return minvalue;//これで実質棄却。
                }
            }
            mask = mask >> 1n;
        }
        return minvalue;
    }
    //betasearchは常に黒番。直前の白番でminvalueが最低保証されているので、それ以上の応手が見つかると無意味になる。
    betasearch(minvalue){
        if(this.isGameFinished){
            if(this.nowTurn==this.BLACK_TURN){
                return this.bitCount(this.playerBoard);
            } else {
                return this.bitCount(this.opponentBoard);
            }
        }
        let legal = this.makeLegalBoard();
        let mask= 0x8000000000000000n;
        let maxvalue = -100;
        for(let i = 0; i < 64; ++i){
            if((mask & legal)==mask){
                this.Put(mask);
                if(this.nowTurn==this.BLACK_TURN){
                    maxvalue = Math.max(maxvalue,this.solve());//めんどくさくてサボってる。
                } else {
                    //alphasearch:次の白番で、現状の最善進行より返り値が悪くなるような応手が見つかった瞬間に打ち切る
                    maxvalue = Math.max(maxvalue,this.alphasearch(maxvalue));
                }
                this.undo();
                if(maxvalue > minvalue){
                    return maxvalue;//これで実質棄却。
                }
            }
            mask = mask >> 1n;
        }
        return maxvalue;
    }
    eval(){
        let mask= 0x8000000000000000n;
        let ret = {};
        let legal = this.makeLegalBoard();
        for(let i = 0; i < 64; ++i){
            if((mask&legal) == mask){
                let coordinate = this.bitTOCoordinate(mask);
                this.Put(mask);
                ret[coordinate] = this.solve();
                this.undo()
            }
            mask = mask >> 1n;
        }
        return ret;
    }

}



window.onload = function(){
    //ここもimportがうまく動かん…
    //ファイル入力処理
    var file = document.getElementById('file');
    var result = document.getElementById('result');

    var csv_data = [];
    // File APIに対応しているか確認
    if(window.File && window.FileReader && window.FileList && window.Blob) {
        function loadLocalCsv(e) {
            // ファイル情報を取得
            var fileData = e.target.files[0];
            console.log(fileData); // 取得した内容の確認用
    
            // CSVファイル以外は処理を止める
            if(!fileData.name.match('.csv$')) {
                alert('CSVファイルを選択してください');
                return;
            }
            //ここ全部消してもなぜか動くんだけどどういうこと…
            
            // FileReaderオブジェクトを使ってファイル読み込み
            var reader = new FileReader();
        
            // ファイル読み込みに成功したときの処理
            reader.onload = function() {
                var cols = reader.result.split('\n');
                csv_data = [];
                for (var i = 1; i < cols.length; i++) {
                    csv_data[i-1] = cols[i].split(',');
                }
            }
            // ファイル読み込みを実行
            reader.readAsText(fileData);
            
           /*
           var req = new XMLHttpRequest();
           req.open("get","./csv/Snake_30.csv", true);
           req.send();

           req.onload = function(){
                csv_data = convertCSVtoArray(req.responseText);            
           }
           */
        }
        file.addEventListener('change', loadLocalCsv, false);
    
    } else {
        file.style.display = 'none';
        result.innerHTML = 'File APIに対応したブラウザでご確認ください';
    }

    //csvフォルダ内の一覧を取得
    folderRef = new Folder ("./csv/"); //←一覧を取得するフォルダを指定します
    fileList = folderRef.getFiles();
    alert(fileList);

    //オセロ処理
    let othelloboard = new OthelloBoard();
    
    //tableの要素をとってくる
    var $tableElements = document.getElementsByTagName('td');
    
    //石を配置する
    displayBoard();
    //tableの全てにclickイベントを付与する
    for (let $i=0; $i < $tableElements.length; $i++) {
      $tableElements[$i].addEventListener('click', function(){
        //配列に変換する
        let tableElements = [].slice.call($tableElements);
        //クリックした位置の取得
        let index = tableElements.indexOf(this);
        putOthello(index);
        displayBoard();
      });
    }
    function putOthello(index) {
        let mask = 0x8000000000000000n;
        othelloboard.Put(mask >> BigInt(index));
    }
    var undobutton = document.getElementById("undobutton");
    undobutton.addEventListener('click',function(){
        othelloboard.undo();
        displayBoard();
    });

    var newbutton = document.getElementById("newbutton");
    newbutton.addEventListener('click',function(){
        othelloboard.new();
        displayBoard();
    })

    var solvebutton = document.getElementById("solvebutton");
    solvebutton.addEventListener('click',function(){
        if(othelloboard.blankcount()<=10){
            let dict = othelloboard.eval();
            for(let key in dict){
                document.getElementById(key).className="evalmode";
                document.getElementById(key).innerHTML=(2*dict[key]-64)*othelloboard.nowTurn/othelloboard.BLACK_TURN;    
            }
        } else {
            alert("完全読みは50手目以降で利用可能です");
        }
    });

    var playlinebutton = document.getElementById("playlinebutton");
    playlinebutton.addEventListener('click',function(){
        let line = prompt("棋譜を入力してください","F5");
        othelloboard.playline(line);
        displayBoard();
    })
    function displayBoard(){
        let mask = 0x8000000000000000n;
        let playercolor;
        let opponentcolor;
        if(othelloboard.nowTurn==othelloboard.BLACK_TURN){
            playercolor = "kuro";
            opponentcolor = "shiro"
        } else {
            playercolor = "shiro";
            opponentcolor = "kuro"
        }
        for(let i = 0; i < 64; ++i){
            if((othelloboard.playerBoard & (mask >> BigInt(i))) == (mask >> BigInt(i))){
                $tableElements[i].className = playercolor;
            } else if((othelloboard.opponentBoard & (mask >> BigInt(i))) == (mask >> BigInt(i))){
                $tableElements[i].className = opponentcolor;
            } else{
                $tableElements[i].className = "";
            }
            $tableElements[i].innerHTML = "";
        }
        if(csv_data.length > 0){
            let nowKifu = othelloboard.Kifu();
            let data;
            for(let i = 0; i < csv_data.length; ++i){
                if(csv_data[i][0] == nowKifu){
                    data = csv_data[i];
                }
            }
            for(let i = 3; i < 10; ++i){
                if(data[i] != ""){
                    let di = Number(data[i]);
                    let next = csv_data[di][0].slice(-2);
                    document.getElementById(next).className="evalmode";
                    document.getElementById(next).innerHTML = +String(Number(csv_data[di][1]))+":"+String(Number(csv_data[di][2]));
                } else {
                    break;
                }
            }
        }
    }

}
    



