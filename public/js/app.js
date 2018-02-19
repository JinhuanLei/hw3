$(document).ready(function () {
    $.ajax({
        type: "GET",
        url :  "/wordgame/api/v1/meta/fonts",
        success: function (data) {
            $.each(data,function(index,value){
                $("#font").append("<option value='"+value.category+"'>"+value.category+"</option>");
            });
        }
    })

    $.ajax({
        type: "GET",
        url :  "/wordgame/api/v1/meta",
        success: function (data) {
        alert(data[0].guessBackground);
        }
    })
})
var div1=document.getElementById("page1");
var div2=document.getElementById("page2");
div2.style.display='none';
var Font=new Object();
var Level=new Object();
var Colors=new Object();
var Metadata=new Object();
var Defaults=new Object();
var Game=new Object();
function newGame() {
    div1.style.display='none';
    div2.style.display='block';
    var font=$('#font').val();
    var diff=$('#diff').val();
    var wordcolor=$('#wordcolor').val();
    var guesscolor=$('#guesscolor').val();
    var forecolor=$('#forecolor').val();

    $.ajax({
        url: '/wordgame/api/v1/:sid',
        data:{"font":font,"level": diff,"wordcolor":wordcolor,"guesscolor":guesscolor,"forecolor":forecolor},
        method: "POST",
        success:initial

    });
}

function closeGame(){
    div1.style.display='block';
    div2.style.display='none';
}


    function setSelect(meta) {
        
    }
