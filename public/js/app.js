var sid;
$(document).ready(function () {

    $.ajax({
        type: "GET",
        url :  "/wordgame/api/v1/sid",
        success: function (data) {
      sid=data;
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
// var Font=new Object();
// var Level=new Object();
// var Colors=new Object();
// var Metadata=new Object();
// var Defaults=new Object();
// var Game=new Object();


function newGame() {
    div1.style.display='none';
    div2.style.display='block';
    var font=$('#font').val();
    var diff=$('#diff').val();
    var wordcolor=$('#wordcolor').val();
    var guesscolor=$('#guesscolor').val();
    var forecolor=$('#forecolor').val();

    $.ajax({
        url: '/wordgame/api/v1/'+sid,
        data:{"font":font,"level": diff,"wordcolor":wordcolor,"guesscolor":guesscolor,"forecolor":forecolor},
        method: "POST",
        success:function (data) {
            currentGameObj=data;
            $('#remaining').html(data.remaining);

                for(var x=0;x<data.target.length;x++)
                {
                   // var label=$('#wordview').append("<span>");
//  style= font-family:"+data.font.rule+" background-color:"+data.colors.wordBackground+"; color:"+data.colors.textBackground+"; font-size:30px;
//                     $('#wordview').append("</span>");
//                     $('#wordview').append(" ");

                    var label = document.createElement("label");
                    label.style.width="30px";
                    label.style.height="50px";
                    label.style.textAlign= "center";
                    label.style.background=data.colors.wordBackground;
                    label.style.fontSize="30px";
                    //var span = document.createElement("span");
                    label.appendChild(document.createTextNode("_"));
                    //label.appendChild(span);
                    $('#wordview').append(label);
                    $('#wordview').append(" ");

                }

        }
    });
}

function closeGame() {
    div1.style.display = 'block';
    div2.style.display = 'none';
    $.ajax({
        type: "GET",
        url: '/wordgame/api/v1/' + sid,
        success: function (data) {
           showTable(data);
            $('#wordview').html("");
            }

        })

}
var currentGameObj;
function makeGuess() {
    var guessLetter=$('#letter').val();
    $.ajax({
        type: "POST",
        url: '/wordgame/api/v1/' + sid+'/'+currentGameObj.id,
        data:{"sid":sid,"gid":currentGameObj.id,"guess":guessLetter},
        success: function (data) {
         console.log(data);
        }
    })
}

function showTable(data) {
    var count = Object.keys(data).length;
    for (var x = 0; x < count; x++) {
        var row = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.height='40px';
        td1.appendChild(document.createTextNode(data[x].level.name));
        row.appendChild(td1);
        var td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(data[x].view));
        row.appendChild(td2);
        var td3 = document.createElement("td");
        td3.appendChild(document.createTextNode(data[x].remaining));
        row.appendChild(td3);
        var td4 = document.createElement("td");
        td4.appendChild(document.createTextNode(data[x].target));
        if(data[x].status!="unfinished")  row.appendChild(td4);
        else row.appendChild(document.createElement("td"));
        var td5 = document.createElement("td");
        td5.appendChild(document.createTextNode(data[x].status));
        row.appendChild(td5);
    }
    document.getElementById("gameList").append(row); //将行添加到<tbody>中
}

