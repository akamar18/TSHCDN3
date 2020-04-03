//Pop up information box II (Mike McGrath (mike_mcgrath@lineone.net,  http://website.lineone.net/~mike_mcgrath))
//Permission granted to Dynamicdrive.com to include script in archive
//visit http://dynamicdrive.com

//Xoffset=-112;    // modify these values to ...
Xoffset=40;    // modify these values to ...
Yoffset=-40;    // change the popup position.

var old,skn,iex=(document.all),yyy=-1000;

var ns4=document.layers
var ns6=document.getElementById&&!document.all
var ie4=document.all
var ie6=document.all

if (ns4)
skn=document.tsh
else if (ns6)
skn=document.getElementById("tsh").style
else if (ie4||ie6)
skn=document.all.tsh.style
if(ns4)document.captureEvents(Event.MOUSEMOVE);
else{
skn.visibility="visible"
skn.display="none"
}
document.onmousemove=get_mouse;

function popup(msg,fgclr,bgclr,wid) {
var content="<TABLE BORDER=1 BORDERCOLOR=black CELLPADDING=2 CELLSPACING=0 "+
"BGCOLOR="+bgclr+"><TD WIDTH="+wid+" ALIGN=center><FONT FACE='Arial' COLOR="+fgclr+" SIZE=2>"+msg+"</FONT></TD></TABLE>";
yyy=Yoffset;
 if(ns4){skn.document.write(content);skn.document.close();skn.visibility="visible"}
 if(ns6){document.getElementById("tsh").innerHTML=content;skn.display=''}
 if(ie4||ie6){document.all("tsh").innerHTML=content;skn.display=''}
}

function get_mouse(e){
var x=(ns4||ns6)?e.pageX:event.x+document.body.scrollLeft;
skn.left=x+Xoffset;
var y=(ns4||ns6)?e.pageY:event.y+document.body.scrollTop;
skn.top=y+yyy;
}

function kill(){
yyy=-1000;
if(ns4){skn.visibility="hidden";}
else if (ns6||ie4||ie6)
skn.display="none"
}
