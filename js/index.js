"use strict"

import(OthelloBoard);

window.onload = function(){
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
    }
}



