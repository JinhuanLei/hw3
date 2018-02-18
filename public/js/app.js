var div1=document.getElementById("page1");
var div2=document.getElementById("page2");
div2.style.display='none';
function newGame() {
    div1.style.display='none';
    div2.style.display='block';
    var font=$('#font').val();
    var diff=$('#diff').val();
    var wordcolor=$('#wordcolor').val();
    var guesscolor=$('#guesscolor').val();
    var forecolor=$('#forecolor').val();

    // $.ajax({
    //     url: '/wordgame',
    //     data:{"font":font,"level": diff,"wordcolor":wordcolor,"guesscolor":guesscolor,"forecolor":forecolor},
    //     method: "GET",
    //     success:initial
    //
    // });
}

function closeGame(){
    div1.style.display='block';
    div2.style.display='none';
}


    function initial() {
        
    }
