var userid;
var sid;
$(document).ready(function () {

    validateUser();
    $.ajax({
        type: "GET",
        url :  "/wordgame/api/v3/meta/fonts",
        success: function (data) {
            $.each(data,function(index,value){
                $("#font").append("<option value='"+value.category+"'>"+value.category+"</option>");
            });
        }
    });


    // closeGame();
})
var div1=document.getElementById("page1");
var div2=document.getElementById("page2");
var admindiv=document.getElementById("page3");
var logindiv=document.getElementById("login");
var userAttrDiv=document.getElementById("page4");
div2.style.display='none';
// var Font=new Object();
// var Level=new Object();
// var Colors=new Object();
// var Metadata=new Object();
// var Defaults=new Object();
// var Game=new Object();

function initialDefaults() {
    $.ajax({
        type: "GET",
        url :  "/wordgame/api/v3/meta",
        success: function (data) {
            //alert(data[0].defaults.font.category);
            //alert(JSON.stringify(data[0].defaults));
            //console.log(data);
            //alert("change style")
            $("#font").val(""+data.defaults.font.category+"").selected="selected";
            $("#diff").empty();
            $.each(data.levels,function(index,value){
                $("#diff").append("<option value='"+value.name+"'>"+value.name+"</option>");
            });
            $("#diff").val(""+data.defaults.level.name+"").selected="selected";
            $("#wordcolor").val(""+data.defaults.colors.wordBackground+"");
            $("#guesscolor").val(""+data.defaults.colors.guessBackground+"");
            $("#forecolor").val(""+data.defaults.colors.textBackground+"");

        }
    });
}


function validateUser() {
    $.ajax({
        type: "GET",
        url :  "/wordgame/api/uid/v3",
        success : setUser,
        error : setPage()
    });
}

function setPage() {
    // $('body').css("background","url('../images/back1.jpg') repeat-x fixed center center;");

    $('body').css("background-image","url('../images/back1.jpg')");
    $('body').css("background-size","cover");
    div1.style.display="none";
    admindiv.style.display="none";
    userAttrDiv.style.display="none";
    logindiv.style.display="block";
}

function setUser(user) {
    userid=user._id;
    // console.log("setUser:"+user.role+"user.role==\"USER\":"+user.role=="USER");
    $('body').css('background','none')
    if(user.role=="ADMIN"){
        $('#adminEmail').text(user.email);
        $('#page4UserID').text(user.email);
    }else{
        $('#userEmail').text(user.email);
    }
    if(user.role=="USER"){
        console.log("I am user"+user.role);
        closeGame();
        div1.style.display="block";
        admindiv.style.display="none";
    }
    else {
        showAdminPage();

        admindiv.style.display="block";
        div1.style.display="none";
    }
    logindiv.style.display="none";



}
function updateDefault() {
    var font=$('#font').val();
    var diff=$('#diff').val();
    var wordcolor=$('#wordcolor').val();
    var guesscolor=$('#guesscolor').val();
    var forecolor=$('#forecolor').val();
    $.ajax({
        type: "PUT",
        data:{"font":font,"level": diff,"wordcolor":wordcolor,"guesscolor":guesscolor,"forecolor":forecolor},
        url: '/wordgame/api/v3/' + userid+'/defaults',
        success: function (data) {

        }
    })
}
function newGame() {

    var font=$('#font').val();
    var diff=$('#diff').val();
    var wordcolor=$('#wordcolor').val();
    var guesscolor=$('#guesscolor').val();
    var forecolor=$('#forecolor').val();

    $.ajax({
        url: '/wordgame/api/v3/'+userid,
        data:{"font":font,"level": diff,"wordcolor":wordcolor,"guesscolor":guesscolor,"forecolor":forecolor},
        method: "POST",
        success:function (data) {
            // console.log(data);
            //  updateDefault();
            if(data=="expired")
            {
                validateUser();

            }else {
                currentGameObj=data;
                //console.log(data);
                showGame(data);
            }

        }
    });
}


function closeGame() {


    initialDefaults();

    // $('body').css('background','none')

    $.ajax({
        type: "GET",
        url: '/wordgame/api/v3/' + userid,   //here
        success: function (data) {
            //console.log(data);
            if(data=="expired")
            {
                div2.style.display = 'none';
                validateUser();

            }else {
                showTable(data);
                div1.style.display = 'block';
                div2.style.display = 'none';
            }

        }
        // error: alert("error")

    })

}
var currentGameObj;
function makeGuess() {
    var guessLetter=$('#letter').val();
    //document.getElementById('letter').focus();
    $('#letter').val("");
    $.ajax({
        type: "POST",
        url: '/wordgame/api/v3/' + userid+'/'+currentGameObj._id,
        data:{"userid":userid,"gid":currentGameObj._id,"guess":guessLetter},
        success: function (data) {

            if(data=="repeat guess") alert(data)
            else {
                currentGameObj=data;
                showGame(data);
            }
        }
    })
}



function showTable(data) {
    // alert("I am here");
    $('#hi').html("");
    var count = Object.keys(data).length;
    for (var x = 0; x < count; x++) {
        var row = document.createElement("tr");
        row.style="cursor: pointer;"
        // row.setAttribute("onclick","showGame("+data[x]+")");
        var gid=data[x]._id;
        row.id=gid;
        row.onclick= function(){
            retrieveGame(this,gid);
        };
        var td1 = document.createElement("td");
        td1.height='40px';
        td1.appendChild(document.createTextNode(data[x].level.name));
        row.appendChild(td1);
        var td2 = document.createElement("td");
        for(var t=0;t<(data[x].view).length;t++)
        {
            var label = document.createElement("label");
            label.style.width="30px";
            label.style.height="40px";
            label.style.textAlign= "center";
            label.style.background=data[x].colors.wordBackground;
            label.style.fontSize="30px";
            label.style.fontFamily=data[x].font.rule;
            label.style.color=data[x].colors.textBackground;
            //var span = document.crea.teElement("span");
            var text=(data[x].view).charAt(t);
            // if(text=="_") {
            //     label.appendChild(document.createTextNode(" "));
            // }
            // else
            label.appendChild(document.createTextNode(text));
            //label.appendChild(span);
            td2.append(label);
            td2.append(" ");

        }
        // td2.appendChild(document.createTextNode(data[x].view));
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
        document.getElementById("hi").append(row);
    }

}

function showGame(data) {
    div1.style.display='none';
    currentGameObj=data;
    // console.log(data);
    var guessform=document.getElementById("guessform");
    $('#wordview').html("");
    $('#guesses').html("");
    $('#letter').val("");
    $('#remaining').html(data.remaining);
    var div=document.getElementById("gamepage");
    if(data.status=="victory")
    {
        div.style.backgroundImage="url(http://charity.cs.uwlax.edu/views/cs402/homeworks/hw2/images/winner.gif)";
        guessform.style.display ='none';
    }else if(data.status=="loss"){
        div.style.backgroundImage="url(http://charity.cs.uwlax.edu/views/cs402/homeworks/hw2/images/cry.gif)";
        guessform.style.display ='none';
    }else{
        div.style.backgroundImage="";
        guessform.style.display ='block';
    }
    for(var x=0;x<data.view.length;x++)
    {
        var label = document.createElement("label");
        label.style.width="30px";
        label.style.height="50px";
        label.style.textAlign= "center";
        label.style.background=data.colors.wordBackground;
        label.style.fontSize="30px";
        label.style.fontFamily=data.font.rule;
        label.style.color=data.colors.textBackground;
        //var span = document.createElement("span");
        label.appendChild(document.createTextNode(data.view[x]));
        //label.appendChild(span);
        $('#wordview').append(label);
        $('#wordview').append(" ");

    }

    for(var x=0;x<data.guesses.length;x++)
    {
        var label = document.createElement("label");
        label.style.width="20px";
        label.style.height="40px";
        label.style.textAlign= "center";
        label.style.background=data.colors.guessBackground;
        label.style.fontSize="30px";
        label.style.color=data.colors.textBackground;
        //var span = document.createElement("span");
        label.appendChild(document.createTextNode(data.guesses[x]));
        //label.appendChild(span);
        $('#guesses').append(label);
        $('#guesses').append(" ");

    }

    div2.style.display='block';
    document.getElementById('letter').focus();
}


function retrieveGame(thisObj,gid) {
    console.log("gid:"+gid);
    console.log("ngid:"+thisObj.id);
    var ngid=thisObj.id;
    $.ajax({
        type: "GET",
        url: '/wordgame/api/v3/' + userid+'/'+ngid,
        success: function (data) {
            showGame(data);
        }
    })
}




function login()
{
    $('#invalid2').css("display","none");
    $('#invalid1').css("display","none");

    var email=$('#login_username').val();
    var password=$('#login_password').val();
    $.ajax({
        type: "POST",
        url: '/wordgame/api/login/v3',
        data:{"email":email,"password":password},
        success: function (data, textStatus, request) {
            console.log("csrf Token:"+request.getResponseHeader('CSRF-Token'));
            $('#invalid2').css("display","none");
            $('#invalid5').css("display","none");
            $('#invalid1').css("display","none");
            logindiv.style.display="none";
            console.log(data.role);
            if(data.role=="USER"){
                div1.style.display="block";
                admindiv.style.display="none";
                $('#userEmail').text(data.email);
            }else{
                div1.style.display="none";
                admindiv.style.display="block";
                $('#adminEmail').text(data.email);
                $('#page4UserID').text(data.email);
            }
            userid=data._id;
            //closeGame();   //show main interface
            validateUser();
            console.log("id"+userid);
            console.log(data);
        },
        error: function (data) {
            //console.log(data);
            if(data.responseText=="invalid2"){
                $('#invalid2').css("display","block");
            }else if(data.responseText=="Disabled"){
                $('#invalid5').css("display","block");
            }else{
                $('#invalid1').css("display","block");
            }

        }

    })
}


function logout() {

    $.ajax({
        type: "POST",
        url: '/wordgame/api/logout/v3',
        success: function () {
            // div1.style.display="none";
            // logindiv.style.display="block";
            validateUser();
        },
        error:function (){
            console.log("err");
        }
    })
}

function saveDefaults() {
    updateDefault();
}

function  showAdminPage() {         //endpoint@

    $.ajax({
        type:"GET",
        url:'/wordgame/api/admins/v3/users',
        success:function (data) {
            showUserTable(data);
        }

    })
}

function showUserTable(data) {
    $('#userTB').html("");
    var count = Object.keys(data).length;
    for (var x = 0; x < count; x++) {
        var row = document.createElement("tr");
        row.style="cursor: pointer;"
        // row.setAttribute("onclick","showGame("+data[x]+")");
        var uid=data[x]._id;
        row.id=uid;
        row.onclick= function(){
            viewUser(this);
        };
        var td1 = document.createElement("td");
        td1.height='40px';
        td1.appendChild(document.createTextNode(data[x].name.first));
        row.appendChild(td1);
        var td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(data[x].name.last));
        row.appendChild(td2);
        var td3 = document.createElement("td");
        td3.appendChild(document.createTextNode(data[x].email));
        row.appendChild(td3);
        var td4 = document.createElement("td");
        td4.appendChild(document.createTextNode(data[x].role));
        if(data[x].status!="unfinished")  row.appendChild(td4);
        else row.appendChild(document.createElement("td"));
        var td5 = document.createElement("td");
        td5.appendChild(document.createTextNode(data[x].enabled));
        row.appendChild(td5);
        document.getElementById("userTB").append(row);
    }

}
function initialCreateUserPage() {
    admindiv.style.display="none";
    userAttrDiv.style.display="block";
    $("#pswdiv").css('display','block');
    $("#create").css('display','block');
    $("#update").css('display','none');
    $('#fname').val("");
    $('#lname').val("");
    $('#email').val("");
    $('#password').val("");
    $('#invalid3').css('display','none');
    $('#invalid4').css('display','none');
    $('#enabled').prop('checked', false);
}

function viewUser(thisObj) {
    $('#admin').attr('disabled',false);
    $('#user').attr('disabled',false);
    if(thisObj=='create'){
        initialCreateUserPage();
    }else{
        $("#pswdiv").css('display','none');
        var uid=thisObj.id;
        $.ajax({
            type:"GET",
            url:'/wordgame/api/admins/v3/'+uid,
            success:function (data) {
                console.log(data);
                $('#fname').val(data.name.first);
                $('#userID').val(data._id);
                $('#lname').val(data.name.last);
                $('#email').val(data.email);
                if(data.enabled=="Enabled"){
                    $('#enabled').prop('checked', true);
                }
                if(data.role=="ADMIN"){
                    $('#admin').prop('checked', true);
                }else{
                    $('#user').prop('checked', true);
                }
                admindiv.style.display="none";
                userAttrDiv.style.display="block";
                $("#update").css('display','block');
                $("#create").css('display','none');
                // var user="<%=session.getAttribute("user")%>";

                if(data._id==userid){
                    $('#admin').attr('disabled',true);
                    $('#user').attr('disabled',true);
                }
            }
        })
    }

}

function backToAdminPage() {
    admindiv.style.display="block";
    userAttrDiv.style.display="none";
}


function createUser() {
    $('#invalid3').css("display","none");
    $('#invalid4').css("display","none");
    var fname=$('#fname').val();
    var lname=$('#lname').val();
    var email=$('#email').val();
    var password=$('#password').val();
    if(($("input[type='radio'][name='radio']:checked").length == 0 ? true : false)||fname==""||lname==""||email==""||password=="") {
        $('#invalid3').css("display","block");
        return;
    }

    if(!validateEmail(email)){
        $('#invalid4').css("display","block");
        return;
    }

    var role=$('#admin').prop("checked")?"ADMIN":"USER";
    var enabled=$('#enabled').prop("checked")?"Enabled":"Disabled";

    $.ajax({
        type:"POST",
        url:"/wordgame/api/admins/v3/users",
        data:{"first":fname,"last":lname,"email":email,"role":role,"enabled":enabled,"password":password},
        success:function () {
                $('#page4').css("display","none");
                $('#page3').css("display","block");
                showAdminPage();
        }
    })
}

function validateEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function updateUser() {
    $('#invalid3').css("display","none");
    $('#invalid4').css("display","none");
    var fname=$('#fname').val();
    var lname=$('#lname').val();
    var email=$('#email').val();
    var _id=$('#userID').val();
    if(($("input[type='radio'][name='radio']:checked").length == 0 ? true : false)||fname==""||lname==""||email==""||password=="") {
        $('#invalid3').css("display","block");
        return;
    }

    if(!validateEmail(email)){
        $('#invalid4').css("display","block");
        return;
    }

    var role=$('#admin').prop("checked")?"ADMIN":"USER";
    var enabled=$('#enabled').prop("checked")?"Enabled":"Disabled";

    $.ajax({
        type:"PUT",
        url:"/wordgame/api/admins/v3/users",
        data:{"first":fname,"last":lname,"email":email,"role":role,"enabled":enabled,"uid":_id},
        success:function () {
            $('#page4').css("display","none");
            $('#page3').css("display","block");
            showAdminPage();
        }
    })
}


function searchUser() {
    var searchValue=$('#search').val();
    $.ajax({
        type:"POST",
        url:"/wordgame/api/admins/v3/search",
        data:{"search":searchValue},
        success:function (data) {
      showUserTable(data);


        }
    })
}

function refreshTable() {
    showAdminPage();
}