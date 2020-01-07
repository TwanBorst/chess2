$('.btn[name="playNow"]').click(()=>{
    $('#mainMenu').css('top', '-100%');
    $('#game #navigationBar span.title').toggle();
    $('#game #navigationBar span.btn').toggle();
    window.server.send(JSON.stringify({type: 'lobby', lobby: 'public'}));
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