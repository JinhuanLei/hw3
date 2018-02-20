$(document).ready(function () {

    $.ajax({
        type: "GET",
        url :  "/wordgame/api/v1/sid",
        success: function (data) {
alert(data);
        }
    });

    $.ajax({
        type: "GET",
        url :  "/wordgame/api/v1/meta/fonts",
        success: function (data) {
            $.each(data,function(index,value){
                $("#font").append("<option value='"+value.category+"'>"+value.category+"</option>");
            });
        }
    });

    $.ajax({
        type: "GET",
        url :  "/wordgame/api/v1/meta",
        success: function (data) {
         //alert(data[0].defaults.font.category);
            $("#font").val(""+data[0].defaults.font.category+"").selected="selected";
            $.each(data[0].levels,function(index,value){
                $("#diff").append("<option value='"+value.name+"'>"+value.name+"</option>");
            });
            $("#diff").val(""+data[0].defaults.level.name+"").selected="selected";
            $("#wordcolor").val(""+data[0].defaults.colors.wordBackground+"");
            $("#guesscolor").val(""+data[0].defaults.colors.guessBackground+"");
            $("#forecolor").val(""+data[0].defaults.colors.textBackground+"");

        }
    });
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
        success:function (data) {
            
        }

    });
}

function closeGame(){
    div1.style.display='block';
    div2.style.display='none';
}


    function setSelect(meta) {
        
    }
