"use strict"
let playername = prompt("What's your name?", "Aris");

class Player{
    constructor(name){
        this.name = name;
    }
    sayHi(){
        alert("You are "+this.name+".\nGood luck!");
    };
}
let Aris = new Player(playername);

Aris.sayHi();

// 背景色を赤に変える
let board = document.getElementById('myBoard');
board.style.background = 'red';
// それを1秒後に戻す
setTimeout(() => board.style.background = '', 1000);
