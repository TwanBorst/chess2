import { Game } from "./gameLogic.js";

$('.btn[name="playNow"]').click(()=>{
    $('#mainMenu').css('top', '-100%');
    $('#game #navigationBar span.title').toggle();
    $('#game #navigationBar span.btn').toggle();
    $('#insertName').css('top', '0');
});

$('#insertName button').click(()=>{
    let name = $('#insertName input').first().val();
    // @ts-ignore
    if(name.length>0){
        Game.startGame();
        // @ts-ignore
        window.server.send(JSON.stringify({type: 'setName', data: name}));
        // @ts-ignore
        window.server.send(JSON.stringify({type: 'lobby', data: 'public'}));
        $('#insertName').css('top', '-100%');
    }
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

$('.btn[name="backtopause"]').click(()=>{
    $('#pauseMenu').css('top', '0');
    $('#statPage').css('top', '-100%');
    $('#game #navigationBar span.title').toggle();
    $('#game #navigationBar span.btn').toggle();
});

$('.btn[name="backtomain"]').click(()=>{
    $('#mainMenu').css('top', '0');
    $('#game #navigationBar span.title').toggle();
    $('#game #navigationBar span.btn').toggle();
});

$('.btn[name="statistics"]').click(()=>{
    $('#pauseMenu').css('top', '-100%');
    $('#statPage').css('top', '0');
    $('#game #statPage span.title').toggle();
    $('#game #statPage span.btn').toggle();
});


