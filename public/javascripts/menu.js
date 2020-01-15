import { Game } from "./gameLogic.js";

$('.btn[name="playNow"]').click(()=>{
    $('#mainMenu').css('top', '-100%');
    $('#game #navigationBar span.title').toggle();
    $('#game #navigationBar span.btn').toggle();
    Game.startGame();
    // @ts-ignore
    window.server.send(JSON.stringify({type: 'lobby', data: 'public'}));
});

$('.btn[name="pause"]').click(()=>{
    $('#game #navigationBar span.title').toggle();
    $('#game #navigationBar span.btn').toggle();
    $('#pauseMenu').css('top', '0');
});

$('.btn[name="resume"]').click(()=>{
    $('#pauseMenu').css('top', '-100%');
    $('#game #navigationBar span.title').toggle();
    $('#game #navigationBar span.btn').toggle();
});