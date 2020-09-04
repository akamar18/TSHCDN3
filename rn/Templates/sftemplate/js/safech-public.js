// JavaScript Document
// override changepath to ask for a login
// added for public site 
// updated df 1/3/2020
var MDSTemplateURL = 'https://safech.tshinc.com/safechtemplates/'
var MDSRnUrl = 'https://safech.tshinc.com/MDSWEB/login898'
var templatename = '' ; 
function regme() { 
    document.location.href = "https://www.safechain.com/website/newcust.html"
}
function makediv(dividname) {
  var divblock = document.createElement("div")
  divblock.setAttribute("id", dividname)
  document.body.appendChild(divblock)
}
function changepath(pstr) {
   var image_url = "" ; 
     $('#SpecLoader').hide();
     $('#mask').fadeOut(1000)
  // Check Existence of Mask and Dialog 
  if ($("#mask").length < 1) {
    // need to create div 
    makediv("mask");
  }
  if ($("#SessLoader").length < 1) {
    // need to create div 
    makediv("SessLoader");
  }
  //Get the screen height and width  
  var maskHeight = $(document).height();
  var maskWidth = $(window).width();
  //Set heigth and width to mask to fill up the whole screen  
  $('#mask').css({
    'width': maskWidth,
    'height': maskHeight,
    'position': 'absolute',
    'left': '0',
    'top': '0',
    'z-index': '9000',
    'background-color': '#000',
    'display': 'none'
  });
  //transition effect   
  $('#mask').fadeIn(1000);
  $('#mask').fadeTo("slow", 0.8);
  //Get the window height and width  
  var winH = $(document).height();
  var winW = $(window).width();
  //Set the popup window to center  
  $('#SessLoader').css({
    'min-width': '300px',
    'min-height': '500px',
    'padding': '20px',
    'background': 'white'
  });
  // $('#SessLoader').css({'width':'530px','height':'300px','padding':'0px','background': 'white'});
  // Added Rounded corders - djf 6-28-13
  $('#SessLoader').css({
    '-webkit-border-radius': '50px',
    '-moz-border-radius': '50px',
    'border-radius': '50px',
    'border': '2px solid #363600',
    'background-color': '#FFFFFF',
    '-webkit-box-shadow': '#CCCCCC 10px 10px 10px',
    '-moz-box-shadow': '#CCCCCC 10px 10px 10px',
    'box-shadow': '#CCCCCC 10px 10px 10px'
  });
  $('#SessLoader').css({
    'display': 'none',
    'z-index': '9999',
    'position': 'absolute',
    'color': 'black'
  });
  $('#SessLoader').html('<div style="font-family:arial;font-size:20px;"> <div style=float:right> <a href=# id="SessClose" style="padding-right: 33px;" >X</a> </div> </div> <div id="SessContent"> </div> ');
  $('#SessLoader').css({
    'position': 'fixed',
    'top': '50%',
    'left': '50%',
    'margin-top': '-250px',
    'margin-left': '-130px'
  });
    var fhtml = '' ; 
    fhtml += '<form class="CLLoginForm" action=" ' + MDSRnUrl + '" id="LoginForm" method=post>  ' ;
    fhtml += '<input type=hidden name=pageid value="31">   ' ;
    fhtml += '<input type=hidden name=customlist value="'+ templatename + '">  ' ;
    fhtml += '<input type=hidden name=loginpath value="'+ pstr + '">       <img alt="RemoteNet" title="RemoteNet" width="363" src="http://safech.tshinc.com/safech/assets/img/logo-full.svg" /></a> <br> Please Login Below <br>       ' ;
    fhtml += '<br><INPUT class=inputText id=username type=text maxLength=50 size=15 name=CustomerId Placeholder="Enter Username"> ' ;
    fhtml += '<br><INPUT class=inputText id=password type=password maxLength=50 size=15 name=Password Placeholder="Enter Password"> ' ; 
// var PSTR = |PNO|QTY|UM^
    fhtml += '   <br> <br>  <input type=submit class="button1" type="button" value="Login"  >  ' ;
    fhtml += '   <br> <br>  <a onclick="javascript:regme()" href="#" >No Account? Contact Us Here </a>  ' ;
    fhtml += '</form>   ' ;
   //  fhtml += '   <br> Status: <div id="StatusMsg"> </div> ' ; 
    $('#SessContent').html(fhtml) ; 
  //transition effect  
  $('#SessLoader').fadeIn(2000);
  //if clicked hide
  $('#SessClose').click(function() {
    $('#SessLoader').hide();
    $('#mask').fadeOut(1000)
  });
}
function changelist(pstr,sflag,templatename) { changepath("PH");  }
function TopCart() { changepath("CO");  }
function TopSearch() { changepath("SR"); }
// $(document).keypress(function(e) { if(e.which == 13) { document.login.submit();}}) ;
$(document).ready(function() {
});      

