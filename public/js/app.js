function newGame() {
    var font=$('#font').val();
    var diff=$('#diff').val();
    var wordcolor=$('#wordcolor').val();
    var guesscolor=$('#guesscolor').val();
    var forecolor=$('#forecolor').val();

    $.ajax({
        url: '/wordgame',
        data:{"font":font,"level": diff,"wordcolor":wordcolor,"guesscolor":guesscolor,"forecolor":forecolor},
        method: "GET",
        success:initial

    })
    
    
    function initial() {
        
    }
}