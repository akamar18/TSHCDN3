//** Ajax Tabs Content script v2.0- © Dynamic Drive DHTML code library (http://www.dynamicdrive.com)
//** Updated Oct 21st, 07 to version 2.0. Contains numerous improvements
//** Updated Feb 18th, 08 to version 2.1: Adds a public "tabinstance.cycleit(dir)" method to cycle forward or backward between tabs dynamically. Only .js file changed from v2.0.
//** Updated April 8th, 08 to version 2.2:
//   -Adds support for expanding a tab using a URL parameter (ie: http://mysite.com/tabcontent.htm?tabinterfaceid=0) 
//   -fiModified Ajax routine so testing the script out locally in IE7 now works 

var ddajaxtabssettings={}
ddajaxtabssettings.bustcachevar=1  //bust potential caching of external pages after initial request? (1=yes, 0=no)
ddajaxtabssettings.loadstatustext="<img src='../../rn_beta/images/loading.gif' /> Loading..." 


////NO NEED TO EDIT BELOW////////////////////////

function ddajaxtabs(tabinterfaceid, contentdivid){
	this.tabinterfaceid=tabinterfaceid //ID of Tab Menu main container
	this.tabs=document.getElementById(tabinterfaceid).getElementsByTagName("a") //Get all tab links within container
	this.enabletabpersistence=true
	this.hottabspositions=[] //Array to store position of tabs that have a "rel" attr defined, relative to all tab links, within container
	this.currentTabIndex=0 //Index of currently selected hot tab (tab with sub content) within hottabspositions[] array
	this.contentdivid=contentdivid
	this.defaultHTML=""
	this.defaultIframe='<iframe src="about:blank" marginwidth="0" marginheight="0" frameborder="0" vspace="0" hspace="0" class="tabcontentiframe" style="width:100%; height:auto; min-height: 100px"></iframe>'
	this.defaultIframe=this.defaultIframe.replace(/<iframe/i, '<iframe name="'+"_ddajaxtabsiframe-"+contentdivid+'" ')
this.revcontentids=[] //Array to store ids of arbitrary contents to expand/contact as well ("rev" attr values)
	this.selectedClassTarget="link" //keyword to indicate which target element to assign "selected" CSS class ("linkparent" or "link")
}

ddajaxtabs.connect=function(pageurl, tabinstance){
	var page_request = false
	var bustcacheparameter=""
	if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
		try {
		page_request = new ActiveXObject("Msxml2.XMLHTTP")
		} 
		catch (e){
			try{
			page_request = new ActiveXObject("Microsoft.XMLHTTP")
			}
			catch (e){}
		}
	}
	else if (window.XMLHttpRequest) // if Mozilla, Safari etc
		page_request = new XMLHttpRequest()
	else
		return false
        var params = "" ;
// BEGIN GET QUERY STRING CODE ;
queryVar = pageurl ;
var inq = pageurl.indexOf('?');
queryVar = queryVar.substring(inq + 1);
queryVar = unescape(queryVar); 
var params = queryVar ;
	var ajaxfriendlyurl=pageurl.replace(/^http:\/\/[^\/]+\//i, "http://"+window.location.hostname+"/") 
	page_request.onreadystatechange=function(){ddajaxtabs.loadpage(page_request, pageurl, tabinstance)}
	if (ddajaxtabssettings.bustcachevar) //if bust caching of external page
		bustcacheparameter=(ajaxfriendlyurl.indexOf("?")!=-1)? "&"+new Date().getTime() : "?"+new Date().getTime()//
	// page_request.open('GET', ajaxfriendlyurl+bustcacheparameter, true)
	// page_request.send(null)
	page_request.open('POST', ajaxfriendlyurl, true) ;
	page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        page_request.setRequestHeader("Content-length", params.length);
        page_request.setRequestHeader("Connection", "close");
        page_request.send(params) ;
}

ddajaxtabs.loadpage=function(page_request, pageurl, tabinstance){
	var divId=tabinstance.contentdivid
	document.getElementById(divId).innerHTML=ddajaxtabssettings.loadstatustext //Display "fetching page message"
	if (page_request.readyState == 4 && (page_request.status==200 || window.location.href.indexOf("http")==-1)){
		document.getElementById(divId).innerHTML=page_request.responseText
		ddajaxtabs.ajaxpageloadaction(pageurl, tabinstance)
	}
}

ddajaxtabs.ajaxpageloadaction=function(pageurl, tabinstance){
	tabinstance.onajaxpageload(pageurl) //call user customized onajaxpageload() function when an ajax page is fetched/ loaded
}

ddajaxtabs.getCookie=function(Name){ 
	var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
	if (document.cookie.match(re)) //if cookie found
		return document.cookie.match(re)[0].split("=")[1] //return its value
	return ""
}

ddajaxtabs.setCookie=function(name, value){
	document.cookie = name+"="+value+";path=/" //cookie value is domain wide (path=/)
}

ddajaxtabs.prototype={

	expandit:function(tabid_or_position){ //PUBLIC function to select a tab either by its ID or position(int) within its peers
		this.cancelautorun() //stop auto cycling of tabs (if running)
		var tabref=""
		try{
			if (typeof tabid_or_position=="string" && document.getElementById(tabid_or_position).getAttribute("rel")) //if specified tab contains "rel" attr
				tabref=document.getElementById(tabid_or_position)
			else if (parseInt(tabid_or_position)!=NaN && this.tabs[tabid_or_position].getAttribute("rel")) //if specified tab contains "rel" attr
				tabref=this.tabs[tabid_or_position]
		}
		catch(err){alert("Invalid Tab ID or position entered!")}
		if (tabref!="") //if a valid tab is found based on function parameter
			this.expandtab(tabref) //expand this tab
	},

	cycleit:function(dir, autorun){ //PUBLIC function to move foward or backwards through each hot tab (tabinstance.cycleit('foward/back') )
		if (dir=="next"){
			var currentTabIndex=(this.currentTabIndex<this.hottabspositions.length-1)? this.currentTabIndex+1 : 0
		}
		else if (dir=="prev"){
			var currentTabIndex=(this.currentTabIndex>0)? this.currentTabIndex-1 : this.hottabspositions.length-1
		}
		if (typeof autorun=="undefined") //if cycleit() is being called by user, versus autorun() function
			this.cancelautorun() //stop auto cycling of tabs (if running)
		this.expandtab(this.tabs[this.hottabspositions[currentTabIndex]])
	},

	setpersist:function(bool){ //PUBLIC function to toggle persistence feature
			this.enabletabpersistence=bool
	},

	loadajaxpage:function(pageurl){ //PUBLIC function to fetch a page via Ajax and display it within the Tab Content instance's container
		ddajaxtabs.connect(pageurl, this)
	},

	loadiframepage:function(pageurl){ //PUBLIC function to fetch a page and load it into the IFRAME of the Tab Content instance's container
		this.iframedisplay(pageurl, this.contentdivid)
	},

	setselectedClassTarget:function(objstr){ //PUBLIC function to set which target element to assign "selected" CSS class ("linkparent" or "link")
		this.selectedClassTarget=objstr || "link"
	},

	getselectedClassTarget:function(tabref){ //Returns target element to assign "selected" CSS class to
		return (this.selectedClassTarget==("linkparent".toLowerCase()))? tabref.parentNode : tabref
	},

	urlparamselect:function(tabinterfaceid){
		var result=window.location.search.match(new RegExp(tabinterfaceid+"=(\\d+)", "i")) //check for "?tabinterfaceid=2" in URL
		return (result==null)? null : parseInt(RegExp.$1) //returns null or index, where index (int) is the selected tab's index
	},

	onajaxpageload:function(pageurl){ //PUBLIC Event handler that can invoke custom code whenever an Ajax page has been fetched and displayed
		//do nothing by default
	},

	expandtab:function(tabref){
		var relattrvalue=tabref.getAttribute("rel")
		//Get "rev" attr as a string of IDs in the format ",john,george,trey,etc," to easy searching through
		var associatedrevids=(tabref.getAttribute("rev"))? ","+tabref.getAttribute("rev").replace(/\s+/, "")+"," : ""
		if (relattrvalue=="#default")
			document.getElementById(this.contentdivid).innerHTML=this.defaultHTML
		else if (relattrvalue=="#iframe")
			this.iframedisplay(tabref.getAttribute("href"), this.contentdivid)
		else
			ddajaxtabs.connect(tabref.getAttribute("href"), this)
		this.expandrevcontent(associatedrevids)
		for (var i=0; i<this.tabs.length; i++){ //Loop through all tabs, and assign only the selected tab the CSS class "selected"
			this.getselectedClassTarget(this.tabs[i]).className=(this.tabs[i].getAttribute("href")==tabref.getAttribute("href"))? "selected" : ""
		}
		if (this.enabletabpersistence) //if persistence enabled, save selected tab position(int) relative to its peers
			ddajaxtabs.setCookie(this.tabinterfaceid, tabref.tabposition)
		this.setcurrenttabindex(tabref.tabposition) //remember position of selected tab within hottabspositions[] array
	},

	iframedisplay:function(pageurl, contentdivid){
		if (typeof window.frames["_ddajaxtabsiframe-"+contentdivid]!="undefined"){
			try{delete window.frames["_ddajaxtabsiframe-"+contentdivid]} //delete iframe within Tab content container if it exists (due to bug in Firefox)
			catch(err){}
		}
		document.getElementById(contentdivid).innerHTML=this.defaultIframe
		window.frames["_ddajaxtabsiframe-"+contentdivid].location.replace(pageurl) //load desired page into iframe
	},


	expandrevcontent:function(associatedrevids){
		var allrevids=this.revcontentids
		for (var i=0; i<allrevids.length; i++){ //Loop through rev attributes for all tabs in this tab interface
			//if any values stored within associatedrevids matches one within allrevids, expand that DIV, otherwise, contract it
			document.getElementById(allrevids[i]).style.display=(associatedrevids.indexOf(","+allrevids[i]+",")!=-1)? "block" : "none"
		}
	},

	setcurrenttabindex:function(tabposition){ //store current position of tab (within hottabspositions[] array)
		for (var i=0; i<this.hottabspositions.length; i++){
			if (tabposition==this.hottabspositions[i]){
				this.currentTabIndex=i
				break
			}
		}
	},

	autorun:function(){ //function to auto cycle through and select tabs based on a set interval
		this.cycleit('next', true)
	},

	cancelautorun:function(){
		if (typeof this.autoruntimer!="undefined")
			clearInterval(this.autoruntimer)
	},

	init:function(automodeperiod){
		var persistedtab=ddajaxtabs.getCookie(this.tabinterfaceid) //get position of persisted tab (applicable if persistence is enabled)
		var selectedtab=-1 //Currently selected tab index (-1 meaning none)
		var selectedtabfromurl=this.urlparamselect(this.tabinterfaceid) //returns null or index from: tabcontent.htm?tabinterfaceid=index
		this.automodeperiod=automodeperiod || 0
		this.defaultHTML=document.getElementById(this.contentdivid).innerHTML
		for (var i=0; i<this.tabs.length; i++){
			this.tabs[i].tabposition=i //remember position of tab relative to its peers
			if (this.tabs[i].getAttribute("rel")){
				var tabinstance=this
				this.hottabspositions[this.hottabspositions.length]=i //store position of "hot" tab ("rel" attr defined) relative to its peers
				this.tabs[i].onclick=function(){
					tabinstance.expandtab(this)
					tabinstance.cancelautorun() //stop auto cycling of tabs (if running)
					return false
				}
				if (this.tabs[i].getAttribute("rev")){ //if "rev" attr defined, store each value within "rev" as an array element
					this.revcontentids=this.revcontentids.concat(this.tabs[i].getAttribute("rev").split(/\s*,\s*/))
				}
				if (selectedtabfromurl==i || this.enabletabpersistence && selectedtab==-1 && parseInt(persistedtab)==i || !this.enabletabpersistence && selectedtab==-1 && this.getselectedClassTarget(this.tabs[i]).className=="selected"){
					selectedtab=i //Selected tab index, if found
				}
			}
		} //END for loop
		if (selectedtab!=-1) //if a valid default selected tab index is found
			this.expandtab(this.tabs[selectedtab]) //expand selected tab (either from URL parameter, persistent feature, or class="selected" class)
		else //if no valid default selected index found
			this.expandtab(this.tabs[this.hottabspositions[0]]) //Just select first tab that contains a "rel" attr
		if (parseInt(this.automodeperiod)>500 && this.hottabspositions.length>1){
			this.autoruntimer=setInterval(function(){tabinstance.autorun()}, this.automodeperiod)
		}
	} //END int() function

} //END Prototype assignment

/***********************************************
* Show Hint script- © Dynamic Drive (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit http://www.dynamicdrive.com/ for this script and 100s more.
***********************************************/
		
var horizontal_offset="9px" //horizontal offset of hint box from anchor link

/////No further editting needed

var vertical_offset="0" //horizontal offset of hint box from anchor link. No need to change.
var ie=document.all
var ns6=document.getElementById&&!document.all

function getposOffset(what, offsettype){
var totaloffset=(offsettype=="left")? what.offsetLeft : what.offsetTop;
var parentEl=what.offsetParent;
while (parentEl!=null){
totaloffset=(offsettype=="left")? totaloffset+parentEl.offsetLeft : totaloffset+parentEl.offsetTop;
parentEl=parentEl.offsetParent;
}
return totaloffset;
}

function iecompattest(){
return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}

function clearbrowseredge(obj, whichedge){
var edgeoffset=(whichedge=="rightedge")? parseInt(horizontal_offset)*-1 : parseInt(vertical_offset)*-1
if (whichedge=="rightedge"){
var windowedge=ie && !window.opera? iecompattest().scrollLeft+iecompattest().clientWidth-30 : window.pageXOffset+window.innerWidth-40
dropmenuobj.contentmeasure=dropmenuobj.offsetWidth
if (windowedge-dropmenuobj.x < dropmenuobj.contentmeasure)
edgeoffset=dropmenuobj.contentmeasure+obj.offsetWidth+parseInt(horizontal_offset)
}
else{
var windowedge=ie && !window.opera? iecompattest().scrollTop+iecompattest().clientHeight-15 : window.pageYOffset+window.innerHeight-18
dropmenuobj.contentmeasure=dropmenuobj.offsetHeight
if (windowedge-dropmenuobj.y < dropmenuobj.contentmeasure)
edgeoffset=dropmenuobj.contentmeasure-obj.offsetHeight
}
return edgeoffset
}

function showhint(menucontents, obj, e, tipwidth){
if ((ie||ns6) && document.getElementById("hintbox")){
dropmenuobj=document.getElementById("hintbox")
dropmenuobj.innerHTML=menucontents
dropmenuobj.style.left=dropmenuobj.style.top=-500
if (tipwidth!=""){
dropmenuobj.widthobj=dropmenuobj.style
dropmenuobj.widthobj.width=tipwidth
}
dropmenuobj.x=getposOffset(obj, "left")
dropmenuobj.y=getposOffset(obj, "top")
dropmenuobj.style.left=dropmenuobj.x-clearbrowseredge(obj, "rightedge")+obj.offsetWidth+"px"
dropmenuobj.style.top=dropmenuobj.y-clearbrowseredge(obj, "bottomedge")+"px"
dropmenuobj.style.visibility="visible"
obj.onmouseout=hidetip
}
}

function hidetip(e){
dropmenuobj.style.visibility="hidden"
dropmenuobj.style.left="-500px"
}

function createhintbox(){
var divblock=document.createElement("div")
divblock.setAttribute("id", "hintbox")
document.body.appendChild(divblock)
}

//added showhint ajax to load a page via ajax


function showhintajax(url, obj, e, tipwidth){
var ie=document.all
var ns6=document.getElementById&&!document.all
createhintbox();
if ((ie||ns6) && document.getElementById("hintbox")){
dropmenuobj=document.getElementById("hintbox")
ajaxpage(url,"hintbox") ;
dropmenuobj.style.left=dropmenuobj.style.top=-500
if (tipwidth!=""){
dropmenuobj.widthobj=dropmenuobj.style
dropmenuobj.widthobj.width=tipwidth
}
dropmenuobj.x=getposOffset(obj, "left")
dropmenuobj.y=getposOffset(obj, "top")
dropmenuobj.style.left=dropmenuobj.x-clearbrowseredge(obj, "rightedge")+obj.offsetWidth+"px"
dropmenuobj.style.top=dropmenuobj.y-clearbrowseredge(obj, "bottomedge")+"px"
dropmenuobj.style.visibility="visible"
obj.onmouseout=hidetip
}
}

var bustcachevar=1 //bust potential caching of external pages after initial request? (1=yes, 0=no)
var loadedobjects=""
var rootdomain="http://"+window.location.hostname
var bustcacheparameter=""

function ajaxpage(pageurl, containerid){
var page_request = false
if (window.XMLHttpRequest) // if Mozilla, Safari etc
page_request = new XMLHttpRequest()
else if (window.ActiveXObject){ // if IE
try {
page_request = new ActiveXObject("Msxml2.XMLHTTP")
} 
catch (e){
try{
page_request = new ActiveXObject("Microsoft.XMLHTTP")
}
catch (e){}
}
}
else
return false
page_request.onreadystatechange=function(){
loadpage(page_request, containerid)
}
var params = "" ;
// BEGIN GET QUERY STRING CODE ;
queryVar = pageurl ;
var inq = pageurl.indexOf('?');
queryVar = queryVar.substring(inq + 1);
queryVar = unescape(queryVar); 
var params = queryVar ;
	var ajaxfriendlyurl=pageurl.replace(/^http:\/\/[^\/]+\//i, "http://"+window.location.hostname+"/") 
	page_request.onreadystatechange=function(){loadpage(page_request, containerid)}
	if (bustcachevar) //if bust caching of external page
		bustcacheparameter=(ajaxfriendlyurl.indexOf("?")!=-1)? "&"+new Date().getTime() : "?"+new Date().getTime()//
	// page_request.open('GET', ajaxfriendlyurl+bustcacheparameter, true)
	// page_request.send(null)
	page_request.open('POST', ajaxfriendlyurl, true) ;
	page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        page_request.setRequestHeader("Content-length", params.length);
        page_request.setRequestHeader("Connection", "close");
        page_request.send(params) ;
}

function loadpage(page_request, containerid){
if (page_request.readyState == 4 && (page_request.status==200 || window.location.href.indexOf("http")==-1))
document.getElementById(containerid).innerHTML=page_request.responseText
}
// -------------------------------------------------------------------
// DHTML Window Widget- By Dynamic Drive, available at: http://www.dynamicdrive.com
// v1.0: Script created Feb 15th, 07'
// v1.01: Feb 21th, 07' (see changelog.txt)
// v1.02: March 26th, 07' (see changelog.txt)
// v1.03: May 5th, 07' (see changelog.txt)
// v1.1:  Oct 29th, 07' (see changelog.txt)
// -------------------------------------------------------------------

var dhtmlwindow={
imagefiles:['windowfiles/min.gif', 'windowfiles/close.gif', 'windowfiles/restore.gif', 'windowfiles/resize.gif'], //Path to 4 images used by script, in that order
ajaxbustcache: true, //Bust caching when fetching a file via Ajax?
ajaxloadinghtml: '<b>Loading Page. Please wait...</b>', //HTML to show while window fetches Ajax Content?

minimizeorder: 0,
zIndexvalue:100,
tobjects: [], //object to contain references to dhtml window divs, for cleanup purposes
lastactivet: {}, //reference to last active DHTML window

init:function(t){
	var domwindow=document.createElement("div") //create dhtml window div
	domwindow.id=t
	domwindow.className="dhtmlwindow"
	var domwindowdata=''
	domwindowdata='<div class="drag-handle">'
	domwindowdata+='DHTML Window <div class="drag-controls"><img src="'+this.imagefiles[0]+'" title="Minimize" /><img src="'+this.imagefiles[1]+'" title="Close" /></div>'
	domwindowdata+='</div>'
	domwindowdata+='<div class="drag-contentarea"></div>'
	domwindowdata+='<div class="drag-statusarea"><div class="drag-resizearea" style="background: transparent url('+this.imagefiles[3]+') top right no-repeat;">&nbsp;</div></div>'
	domwindowdata+='</div>'
	domwindow.innerHTML=domwindowdata
	document.getElementById("dhtmlwindowholder").appendChild(domwindow)
	//this.zIndexvalue=(this.zIndexvalue)? this.zIndexvalue+1 : 100 //z-index value for DHTML window: starts at 0, increments whenever a window has focus
	var t=document.getElementById(t)
	var divs=t.getElementsByTagName("div")
	for (var i=0; i<divs.length; i++){ //go through divs inside dhtml window and extract all those with class="drag-" prefix
		if (/drag-/.test(divs[i].className))
			t[divs[i].className.replace(/drag-/, "")]=divs[i] //take out the "drag-" prefix for shorter access by name
	}
	//t.style.zIndex=this.zIndexvalue //set z-index of this dhtml window
	t.handle._parent=t //store back reference to dhtml window
	t.resizearea._parent=t //same
	t.controls._parent=t //same
	t.onclose=function(){return true} //custom event handler "onclose"
	t.onmousedown=function(){dhtmlwindow.setfocus(this)} //Increase z-index of window when focus is on it
	t.handle.onmousedown=dhtmlwindow.setupdrag //set up drag behavior when mouse down on handle div
	t.resizearea.onmousedown=dhtmlwindow.setupdrag //set up drag behavior when mouse down on resize div
	t.controls.onclick=dhtmlwindow.enablecontrols
	t.show=function(){dhtmlwindow.show(this)} //public function for showing dhtml window
	t.hide=function(){dhtmlwindow.hide(this)} //public function for hiding dhtml window
	t.close=function(){dhtmlwindow.close(this)} //public function for closing dhtml window (also empties DHTML window content)
	t.setSize=function(w, h){dhtmlwindow.setSize(this, w, h)} //public function for setting window dimensions
	t.moveTo=function(x, y){dhtmlwindow.moveTo(this, x, y)} //public function for moving dhtml window (relative to viewpoint)
	t.isResize=function(bol){dhtmlwindow.isResize(this, bol)} //public function for specifying if window is resizable
	t.isScrolling=function(bol){dhtmlwindow.isScrolling(this, bol)} //public function for specifying if window content contains scrollbars
	t.load=function(contenttype, contentsource, title){dhtmlwindow.load(this, contenttype, contentsource, title)} //public function for loading content into window
	this.tobjects[this.tobjects.length]=t
	return t //return reference to dhtml window div
},

open:function(t, contenttype, contentsource, title, attr, recalonload){
	var d=dhtmlwindow //reference dhtml window object
	function getValue(Name){
		var config=new RegExp(Name+"=([^,]+)", "i") //get name/value config pair (ie: width=400px,)
		return (config.test(attr))? parseInt(RegExp.$1) : 0 //return value portion (int), or 0 (false) if none found
	}
	if (document.getElementById(t)==null) //if window doesn't exist yet, create it
		t=this.init(t) //return reference to dhtml window div
	else
		t=document.getElementById(t)
	this.setfocus(t)
	t.setSize(getValue(("width")), (getValue("height"))) //Set dimensions of window
	var xpos=getValue("center")? "middle" : getValue("left") //Get x coord of window
	var ypos=getValue("center")? "middle" : getValue("top") //Get y coord of window
	//t.moveTo(xpos, ypos) //Position window
	if (typeof recalonload!="undefined" && recalonload=="recal" && this.scroll_top==0){ //reposition window when page fully loads with updated window viewpoints?
		if (window.attachEvent && !window.opera) //In IE, add another 400 milisecs on page load (viewpoint properties may return 0 b4 then)
			this.addEvent(window, function(){setTimeout(function(){t.moveTo(xpos, ypos)}, 400)}, "load")
		else
			this.addEvent(window, function(){t.moveTo(xpos, ypos)}, "load")
	}
	t.isResize(getValue("resize")) //Set whether window is resizable
	t.isScrolling(getValue("scrolling")) //Set whether window should contain scrollbars
	t.style.visibility="visible"
	t.style.display="block"
	t.contentarea.style.display="block"
	t.moveTo(xpos, ypos) //Position window
	t.load(contenttype, contentsource, title)
	if (t.state=="minimized" && t.controls.firstChild.title=="Restore"){ //If window exists and is currently minimized?
		t.controls.firstChild.setAttribute("src", dhtmlwindow.imagefiles[0]) //Change "restore" icon within window interface to "minimize" icon
		t.controls.firstChild.setAttribute("title", "Minimize")
		t.state="fullview" //indicate the state of the window as being "fullview"
	}
	return t
},

setSize:function(t, w, h){ //set window size (min is 150px wide by 100px tall)
	t.style.width=Math.max(parseInt(w), 150)+"px"
	t.contentarea.style.height=Math.max(parseInt(h), 100)+"px"
},

moveTo:function(t, x, y){ //move window. Position includes current viewpoint of document
	this.getviewpoint() //Get current viewpoint numbers
	t.style.left=(x=="middle")? this.scroll_left+(this.docwidth-t.offsetWidth)/2+"px" : this.scroll_left+parseInt(x)+"px"
	t.style.top=(y=="middle")? this.scroll_top+(this.docheight-t.offsetHeight)/2+"px" : this.scroll_top+parseInt(y)+"px"
},

isResize:function(t, bol){ //show or hide resize inteface (part of the status bar)
	t.statusarea.style.display=(bol)? "block" : "none"
	t.resizeBool=(bol)? 1 : 0
},

isScrolling:function(t, bol){ //set whether loaded content contains scrollbars
	t.contentarea.style.overflow=(bol)? "auto" : "hidden"
},

load:function(t, contenttype, contentsource, title){ //loads content into window plus set its title (3 content types: "inline", "iframe", or "ajax")
	if (t.isClosed){
		alert("DHTML Window has been closed, so no window to load contents into. Open/Create the window again.")
		return
	}
	var contenttype=contenttype.toLowerCase() //convert string to lower case
	if (typeof title!="undefined")
		t.handle.firstChild.nodeValue=title
	if (contenttype=="inline")
		t.contentarea.innerHTML=contentsource
	else if (contenttype=="div"){
		var inlinedivref=document.getElementById(contentsource)
		t.contentarea.innerHTML=(inlinedivref.defaultHTML || inlinedivref.innerHTML) //Populate window with contents of inline div on page
		if (!inlinedivref.defaultHTML)
			inlinedivref.defaultHTML=inlinedivref.innerHTML //save HTML within inline DIV
		inlinedivref.innerHTML="" //then, remove HTML within inline DIV (to prevent duplicate IDs, NAME attributes etc in contents of DHTML window
		inlinedivref.style.display="none" //hide that div
	}
	else if (contenttype=="iframe"){
		t.contentarea.style.overflow="hidden" //disable window scrollbars, as iframe already contains scrollbars
		if (!t.contentarea.firstChild || t.contentarea.firstChild.tagName!="IFRAME") //If iframe tag doesn't exist already, create it first
			t.contentarea.innerHTML='<iframe src="" style="margin:0; padding:0; width:100%; height: 100%" name="_iframe-'+t.id+'"></iframe>'
		window.frames["_iframe-"+t.id].location.replace(contentsource) //set location of iframe window to specified URL
		}
	else if (contenttype=="ajax"){
		this.ajax_connect(contentsource, t) //populate window with external contents fetched via Ajax
	}
	t.contentarea.datatype=contenttype //store contenttype of current window for future reference
},

setupdrag:function(e){
	var d=dhtmlwindow //reference dhtml window object
	var t=this._parent //reference dhtml window div
	d.etarget=this //remember div mouse is currently held down on ("handle" or "resize" div)
	var e=window.event || e
	d.initmousex=e.clientX //store x position of mouse onmousedown
	d.initmousey=e.clientY
	d.initx=parseInt(t.offsetLeft) //store offset x of window div onmousedown
	d.inity=parseInt(t.offsetTop)
	d.width=parseInt(t.offsetWidth) //store width of window div
	d.contentheight=parseInt(t.contentarea.offsetHeight) //store height of window div's content div
	if (t.contentarea.datatype=="iframe"){ //if content of this window div is "iframe"
		t.style.backgroundColor="#F8F8F8" //colorize and hide content div (while window is being dragged)
		t.contentarea.style.visibility="hidden"
	}
	document.onmousemove=d.getdistance //get distance travelled by mouse as it moves
	document.onmouseup=function(){
		if (t.contentarea.datatype=="iframe"){ //restore color and visibility of content div onmouseup
			t.contentarea.style.backgroundColor="white"
			t.contentarea.style.visibility="visible"
		}
		d.stop()
	}
	return false
},

getdistance:function(e){
	var d=dhtmlwindow
	var etarget=d.etarget
	var e=window.event || e
	d.distancex=e.clientX-d.initmousex //horizontal distance travelled relative to starting point
	d.distancey=e.clientY-d.initmousey
	if (etarget.className=="drag-handle") //if target element is "handle" div
		d.move(etarget._parent, e)
	else if (etarget.className=="drag-resizearea") //if target element is "resize" div
		d.resize(etarget._parent, e)
	return false //cancel default dragging behavior
},

getviewpoint:function(){ //get window viewpoint numbers
	var ie=document.all && !window.opera
	var domclientWidth=document.documentElement && parseInt(document.documentElement.clientWidth) || 100000 //Preliminary doc width in non IE browsers
	this.standardbody=(document.compatMode=="CSS1Compat")? document.documentElement : document.body //create reference to common "body" across doctypes
	this.scroll_top=(ie)? this.standardbody.scrollTop : window.pageYOffset
	this.scroll_left=(ie)? this.standardbody.scrollLeft : window.pageXOffset
	this.docwidth=(ie)? this.standardbody.clientWidth : (/Safari/i.test(navigator.userAgent))? window.innerWidth : Math.min(domclientWidth, window.innerWidth-16)
	this.docheight=(ie)? this.standardbody.clientHeight: window.innerHeight
},

rememberattrs:function(t){ //remember certain attributes of the window when it's minimized or closed, such as dimensions, position on page
	this.getviewpoint() //Get current window viewpoint numbers
	t.lastx=parseInt((t.style.left || t.offsetLeft))-dhtmlwindow.scroll_left //store last known x coord of window just before minimizing
	t.lasty=parseInt((t.style.top || t.offsetTop))-dhtmlwindow.scroll_top
	t.lastwidth=parseInt(t.style.width) //store last known width of window just before minimizing/ closing
},

move:function(t, e){
	t.style.left=dhtmlwindow.distancex+dhtmlwindow.initx+"px"
	t.style.top=dhtmlwindow.distancey+dhtmlwindow.inity+"px"
},

resize:function(t, e){
	t.style.width=Math.max(dhtmlwindow.width+dhtmlwindow.distancex, 150)+"px"
	t.contentarea.style.height=Math.max(dhtmlwindow.contentheight+dhtmlwindow.distancey, 100)+"px"
},

enablecontrols:function(e){
	var d=dhtmlwindow
	var sourceobj=window.event? window.event.srcElement : e.target //Get element within "handle" div mouse is currently on (the controls)
	if (/Minimize/i.test(sourceobj.getAttribute("title"))) //if this is the "minimize" control
		d.minimize(sourceobj, this._parent)
	else if (/Restore/i.test(sourceobj.getAttribute("title"))) //if this is the "restore" control
		d.restore(sourceobj, this._parent)
	else if (/Close/i.test(sourceobj.getAttribute("title"))) //if this is the "close" control
		d.close(this._parent)
	return false
},

minimize:function(button, t){
	dhtmlwindow.rememberattrs(t)
	button.setAttribute("src", dhtmlwindow.imagefiles[2])
	button.setAttribute("title", "Restore")
	t.state="minimized" //indicate the state of the window as being "minimized"
	t.contentarea.style.display="none"
	t.statusarea.style.display="none"
	if (typeof t.minimizeorder=="undefined"){ //stack order of minmized window on screen relative to any other minimized windows
		dhtmlwindow.minimizeorder++ //increment order
		t.minimizeorder=dhtmlwindow.minimizeorder
	}
	t.style.left="10px" //left coord of minmized window
	t.style.width="200px"
	var windowspacing=t.minimizeorder*10 //spacing (gap) between each minmized window(s)
	t.style.top=dhtmlwindow.scroll_top+dhtmlwindow.docheight-(t.handle.offsetHeight*t.minimizeorder)-windowspacing+"px"
},

restore:function(button, t){
	dhtmlwindow.getviewpoint()
	button.setAttribute("src", dhtmlwindow.imagefiles[0])
	button.setAttribute("title", "Minimize")
	t.state="fullview" //indicate the state of the window as being "fullview"
	t.style.display="block"
	t.contentarea.style.display="block"
	if (t.resizeBool) //if this window is resizable, enable the resize icon
		t.statusarea.style.display="block"
	t.style.left=parseInt(t.lastx)+dhtmlwindow.scroll_left+"px" //position window to last known x coord just before minimizing
	t.style.top=parseInt(t.lasty)+dhtmlwindow.scroll_top+"px"
	t.style.width=parseInt(t.lastwidth)+"px"
},


close:function(t){
	try{
		var closewinbol=t.onclose()
	}
	catch(err){ //In non IE browsers, all errors are caught, so just run the below
		var closewinbol=true
 }
	finally{ //In IE, not all errors are caught, so check if variable isn't defined in IE in those cases
		if (typeof closewinbol=="undefined"){
			alert("An error has occured somwhere inside your \"onclose\" event handler")
			var closewinbol=true
		}
	}
	if (closewinbol){ //if custom event handler function returns true
		if (t.state!="minimized") //if this window isn't currently minimized
			dhtmlwindow.rememberattrs(t) //remember window's dimensions/position on the page before closing
		if (window.frames["_iframe-"+t.id]) //if this is an IFRAME DHTML window
			window.frames["_iframe-"+t.id].location.replace("about:blank")
		else
			t.contentarea.innerHTML=""
		t.style.display="none"
		t.isClosed=true //tell script this window is closed (for detection in t.show())
	}
	return closewinbol
},


setopacity:function(targetobject, value){ //Sets the opacity of targetobject based on the passed in value setting (0 to 1 and in between)
	if (!targetobject)
		return
	if (targetobject.filters && targetobject.filters[0]){ //IE syntax
		if (typeof targetobject.filters[0].opacity=="number") //IE6
			targetobject.filters[0].opacity=value*100
		else //IE 5.5
			targetobject.style.filter="alpha(opacity="+value*100+")"
		}
	else if (typeof targetobject.style.MozOpacity!="undefined") //Old Mozilla syntax
		targetobject.style.MozOpacity=value
	else if (typeof targetobject.style.opacity!="undefined") //Standard opacity syntax
		targetobject.style.opacity=value
},

setfocus:function(t){ //Sets focus to the currently active window
	this.zIndexvalue++
	t.style.zIndex=this.zIndexvalue
	t.isClosed=false //tell script this window isn't closed (for detection in t.show())
	this.setopacity(this.lastactivet.handle, 0.5) //unfocus last active window
	this.setopacity(t.handle, 1) //focus currently active window
	this.lastactivet=t //remember last active window
},


show:function(t){
	if (t.isClosed){
		alert("DHTML Window has been closed, so nothing to show. Open/Create the window again.")
		return
	}
	if (t.lastx) //If there exists previously stored information such as last x position on window attributes (meaning it's been minimized or closed)
		dhtmlwindow.restore(t.controls.firstChild, t) //restore the window using that info
	else
		t.style.display="block"
	this.setfocus(t)
	t.state="fullview" //indicate the state of the window as being "fullview"
},

hide:function(t){
	t.style.display="none"
},

ajax_connect:function(url, t){
	var page_request = false
	var bustcacheparameter=""
	if (window.XMLHttpRequest) // if Mozilla, IE7, Safari etc
		page_request = new XMLHttpRequest()
	else if (window.ActiveXObject){ // if IE6 or below
		try {
		page_request = new ActiveXObject("Msxml2.XMLHTTP")
		} 
		catch (e){
			try{
			page_request = new ActiveXObject("Microsoft.XMLHTTP")
			}
			catch (e){}
		}
	}
	else
		return false
	t.contentarea.innerHTML=this.ajaxloadinghtml
	page_request.onreadystatechange=function(){dhtmlwindow.ajax_loadpage(page_request, t)}
	if (this.ajaxbustcache) //if bust caching of external page
		bustcacheparameter=(url.indexOf("?")!=-1)? "&"+new Date().getTime() : "?"+new Date().getTime()
	page_request.open('GET', url+bustcacheparameter, true)
	page_request.send(null)
},

ajax_loadpage:function(page_request, t){
	if (page_request.readyState == 4 && (page_request.status==200 || window.location.href.indexOf("http")==-1)){
	t.contentarea.innerHTML=page_request.responseText
	}
},


stop:function(){
	dhtmlwindow.etarget=null //clean up
	document.onmousemove=null
	document.onmouseup=null
},

addEvent:function(target, functionref, tasktype){ //assign a function to execute to an event handler (ie: onunload)
	var tasktype=(window.addEventListener)? tasktype : "on"+tasktype
	if (target.addEventListener)
		target.addEventListener(tasktype, functionref, false)
	else if (target.attachEvent)
		target.attachEvent(tasktype, functionref)
},

cleanup:function(){
	for (var i=0; i<dhtmlwindow.tobjects.length; i++){
		dhtmlwindow.tobjects[i].handle._parent=dhtmlwindow.tobjects[i].resizearea._parent=dhtmlwindow.tobjects[i].controls._parent=null
	}
	window.onload=null
}

} //End dhtmlwindow object

document.write('<div id="dhtmlwindowholder"><span style="display:none">.</span></div>') //container that holds all dhtml window divs on page
window.onunload=dhtmlwindow.cleanup


// tsh date picker code

// Title: Timestamp picker
// Description: See the demo at url
// URL: http://www.geocities.com/tspicker/
// Version: 1.0.a (Date selector only) reworked by Richard Perry
// Date: 12-12-2001 (mm-dd-yyyy)
// Author: Denis Gritcyuk <denis@softcomplex.com>; <tspicker@yahoo.com>
// Notes: Permission given to use this script in any kind of applications if
//    header lines are left unchanged. Feel free to contact the author
//    for feature requests and/or donations
// Version 2.0 (Date selector only with mouseover on dates, added image-path) 
// Date: 03-31-2002 (mm-dd-yyyy)
// reworked by The Systems House, Inc. (www.tshinc.com)

function show_calendar4x(str_target, str_datetime, image_path) {
        var arr_months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
        var week_days = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];
        var n_weekstart = 0; // day week starts from (normally 0 or 1)
		
	var dt_datetime = (str_datetime == null || str_datetime =="" ?  new Date() : str2dt4x(str_datetime));
		
	var dt_prev_month = new Date(dt_datetime);
	dt_prev_month.setMonth(dt_datetime.getMonth()-1);
	if (dt_datetime.getMonth()%12 != (dt_prev_month.getMonth()+1)%12) {
		dt_prev_month.setMonth(dt_datetime.getMonth());
		dt_prev_month.setDate(0);
	}
	var dt_next_month = new Date(dt_datetime);
	dt_next_month.setMonth(dt_datetime.getMonth()+1);
	if ((dt_datetime.getMonth() + 1)%12 != dt_next_month.getMonth()%12)
		dt_next_month.setDate(0);
	
        var dt_prev_year = new Date(dt_datetime);
        //dt_prev_year.setYear(dt_datetime.getYear()-1);
		dt_prev_year.setYear(dt_datetime.getFullYear()-1);
       
        var dt_next_year = new Date(dt_datetime);
        //dt_next_year.setYear(dt_datetime.getYear()+1);
		dt_next_year.setYear(dt_datetime.getFullYear()+1);
        
        var dt_firstday = new Date(dt_datetime);
        dt_firstday.setDate(1);
        dt_firstday.setDate(1-(7+dt_firstday.getDay()-n_weekstart)%7);
        var dt_lastday = new Date(dt_next_month);
        dt_lastday.setDate(0);

        // html generation (feel free to tune it for your particular application)
        // print calendar header
        var str_buffer = new String (
                "<html>\n"+
                "<head>\n"+
                "<title>Calendar</title>\n"+
                "</head>\n"+
                "<body bgcolor=\"White\">\n"+
                "<table class=\"clsOTable\" cellspacing=\"0\" border=\"0\" width=\"100%\">\n"+
                "<tr><td bgcolor=\"#4682B4\">\n"+
                "<table cellspacing=\"1\" cellpadding=\"3\" border=\"0\" width=\"100%\">\n"+
                "<tr>\n"+
                "  <td bgcolor=\"#4682B4\"><a href=\"javascript:window.opener.show_calendar4x('"+
                str_target+"', '"+dt2dtstr4x(dt_prev_year)+"', '"+image_path+"');\">"+
                "<img src=\""+image_path+"prev_year.gif\" width=\"16\" height=\"16\" border=\"0\""+
                " alt=\"Previous Year\"></a></td>\n"+

                "  <td bgcolor=\"#4682B4\"><a href=\"javascript:window.opener.show_calendar4x('"+
                str_target+"', '"+ dt2dtstr4x(dt_prev_month)+"', '"+image_path+"');\">"+
                "<img src=\""+image_path+"prev.gif\" width=\"16\" height=\"16\" border=\"0\""+
                " alt=\"Previous Month\"></a></td>\n"+

                "  <td bgcolor=\"#4682B4\" colspan=\"3\">"+
                "<font color=\"white\" face=\"arial, verdana\" size=\"1\">"
                +arr_months[dt_datetime.getMonth()]+" "+dt_datetime.getFullYear()+"</font></td>\n"+

                "  <td bgcolor=\"#4682B4\" align=\"right\"><a href=\"javascript:window.opener.show_calendar4x('"
                +str_target+"', '"+dt2dtstr4x(dt_next_month)+"', '"+image_path+"');\">"+
                "<img src=\""+image_path+"next.gif\" width=\"16\" height=\"16\" border=\"0\""+
                " alt=\"Next Month\"></a></td>\n"+

                "  <td bgcolor=\"#4682B4\" align=\"right\"><a href=\"javascript:window.opener.show_calendar4x('"
                +str_target+"', '"+dt2dtstr4x(dt_next_year)+"', '"+image_path+"');\">"+
                "<img src=\""+image_path+"next_year.gif\" width=\"16\" height=\"16\" border=\"0\""+
                " alt=\"Next Year\"></a></td>\n"+
                "</tr>\n");
        var dt_current_day = new Date(dt_firstday);
        // print weekdays titles
        str_buffer += "<tr>\n";
        for (var n=0; n<7; n++)
                str_buffer += "  <td bgcolor=\"#87CEFA\"><b>"+
                "<font color=\"white\" face=\"arial, verdana\" size=\"2\">"+
                week_days[(n_weekstart+n)%7]+"</font></b></td>\n";
        // print calendar table
        str_buffer += "</tr>\n";
        while (dt_current_day.getMonth() == dt_datetime.getMonth() ||
                dt_current_day.getMonth() == dt_firstday.getMonth()) {
                // print row header
                str_buffer += "<tr>\n";
                for (var n_current_wday=0; n_current_wday<7; n_current_wday++) {
		    if (dt_current_day.getDate() == dt_datetime.getDate() &&
                          dt_current_day.getMonth() == dt_datetime.getMonth())
                          // print current date
                          str_buffer += "  <td bgcolor=\"#FFB6C1\" align=\"right\""+
			      " onMouseOver=\"this.style.backgroundColor='#FFB6C1'\""+
			      " onMouseOut=\"this.style.backgroundColor='#FFB6C1'\" >";
                    else if (dt_current_day.getDay() == 0 || dt_current_day.getDay() == 6)
                          // weekend days
                          str_buffer += "  <td bgcolor=\"#DBEAF5\" align=\"right\""+
			      " onMouseOver=\"this.style.backgroundColor='#FFB6C1'\""+
			      " onMouseOut=\"this.style.backgroundColor='#DBEAF5'\" >";
                    else
                          // print working days of current month
                          str_buffer += "  <td bgcolor=\"white\" align=\"right\""+
 			      " onMouseOver=\"this.style.backgroundColor='#FFB6C1'\""+ 
 			      " onMouseOut=\"this.style.backgroundColor='white'\" >";

                    if (dt_current_day.getMonth() == dt_datetime.getMonth())
                          // print days of current month
                          str_buffer += "<a href=\"javascript:window.opener."+str_target+
                          ".value='"+dt2dtstr4x(dt_current_day)+"'; window.close();\">"+
                          "<font color=\"black\" face=\"arial, verdana\" size=\"2\">";
                    else
                          // print days of other months
                          str_buffer += "<a href=\"javascript:window.opener."+str_target+
                          ".value='"+dt2dtstr4x(dt_current_day)+"'; window.close();\">"+
                          "<font color=\"gray\" face=\"arial, verdana\" size=\"2\">";

                    str_buffer += dt_current_day.getDate()+"</font></a></td>\n";
                    dt_current_day.setDate(dt_current_day.getDate()+1);
                }
                // print row footer
                str_buffer += "</tr>\n";
        }
        // print calendar footer
        str_buffer += "</table>\n" +
                  "</tr>\n</td>\n</table>\n" +
                  "</body>\n" +
                  "</html>\n";

        var vWinCal = window.open("", "Calendar",
                "width=250,height=210,status=no,resizable=yes,top=220,left=575");
        vWinCal.opener = self;
        vWinCal.focus();
        var calc_doc = vWinCal.document;
        calc_doc.write (str_buffer);
        calc_doc.close();
		
}
// datetime parsing and formatting routines. modify them if you wish other datetime format
function str2dt4x(str_datetime) {
   var re_date = /^(\d+)\/(\d+)\/(\d+)$/;
	if (!re_date.exec(str_datetime))
		return alert("Invalid Datetime format: "+ str_datetime);
       var cyear = RegExp.$3 ;
        if (cyear.length == "2") { cyear = "20" + cyear } ;
       return (new Date (cyear, RegExp.$1-1, RegExp.$2));
      // temp hardcode for 2000 - djf 3-3-11 ;
      //  return (new Date (RegExp.$3, RegExp.$1-1, RegExp.$2));
}

function dt2dtstr4x(dt_datetime) {
	return (new String (
			(dt_datetime.getMonth()+1)+"/"+dt_datetime.getDate()+"/"+dt_datetime.getFullYear()));
}

//tsh veilblock code 

function CreateBlock1() {
   this.Container=document.getElementById("Container") //reference stitial container
   this.Veil=document.getElementById("Veil") //reference veil
   this.standardbody=(document.compatMode=="CSS1Compat")? document.documentElement : document.body
//   document.getElementById("Container").innerHTML=msg
   var ie=document.all && !window.opera
   var dom=document.getElementById
   var scroll_top=(ie)? this.standardbody.scrollTop : window.pageYOffset
   var scroll_left=(ie)? this.standardbody.scrollLeft : window.pageXOffset
   var docwidth=(ie)? this.standardbody.clientWidth : window.innerWidth-this.scrollbarwidth
   var docheight=(ie)? this.standardbody.clientHeight: window.innerHeight
   var docheightcomplete=(this.standardbody.offsetHeight>this.standardbody.scrollHeight)? this.standardbody.offsetHeight : this.standardbody.scrollHeight
   var objwidth=this.Container.offsetWidth
   var objheight=this.Container.offsetHeight
   this.Veil.style.width=docwidth+"px"             //set up veil over page
   this.Veil.style.height=docheightcomplete+"px"   //set up veil over page
   this.Veil.style.left=0                          //Position veil over page
   this.Veil.style.top=0                           //Position veil over page
   this.Veil.style.visibility="visible"            //Show veil over page
   this.Container.style.left=docwidth/2-objwidth/2+"px" //Position stitial box
   var topposition=(docheight>objheight)? scroll_top+docheight/2-objheight/2+"px" : scroll_top+5+"px" //Position stitial box
   this.Container.style.top=Math.floor(parseInt(topposition))+"px"
   this.Container.style.visibility="visible"       //Show stitial box
   //bar1.showBar();
}

// xp_progressbar
// Copyright 2004 Brian Gosselin of ScriptAsylum.com
//
// v1.0 - Initial release
// v1.1 - Added ability to pause the scrolling action (requires you to assign
//        the bar to a unique arbitrary variable).
//      - Added ability to specify an action to perform after a x amount of
//      - bar scrolls. This requires two added arguments.
// v1.2 - Added ability to hide/show each bar (requires you to assign the bar
//        to a unique arbitrary variable).

// var xyz = createBar(
// total_width,
// total_height,
// background_color,
// border_width,
// border_color,
// block_color,
// scroll_speed,
// block_count,
// scroll_count,
// action_to_perform_after_scrolled_n_times
// )

var w3c=(document.getElementById)?true:false;
var ie=(document.all)?true:false;
var N=-1;

function createBar(w,h,bgc,brdW,brdC,blkC,speed,blocks,count,action) {
if(ie||w3c){
var t='<div id="_xpbar'+(++N)+'" style="visibility:visible; position:relative; overflow:hidden; width:'+w+'px; height:'+h+'px; background-color:'+bgc+'; border-color:'+brdC+'; border-width:'+brdW+'px; border-style:solid; font-size:1px;">';
t+='<span id="blocks'+N+'" style="left:-'+(h*2+1)+'px; position:absolute; font-size:1px">';
for(i=0;i<blocks;i++){
t+='<span style="background-color:'+blkC+'; left:-'+((h*i)+i)+'px; font-size:1px; position:absolute; width:'+h+'px; height:'+h+'px; '
t+=(ie)?'filter:alpha(opacity='+(100-i*(100/blocks))+')':'-Moz-opacity:'+((100-i*(100/blocks))/100);
t+='"></span>';
}
t+='</span></div>';
document.write(t);
var bA=(ie)?document.all['blocks'+N]:document.getElementById('blocks'+N);
bA.bar=(ie)?document.all['_xpbar'+N]:document.getElementById('_xpbar'+N);
bA.blocks=blocks;
bA.N=N;
bA.w=w;
bA.h=h;
bA.speed=speed;
bA.ctr=0;
bA.count=count;
bA.action=action;
bA.togglePause=togglePause;
bA.showBar=function(){
this.bar.style.visibility="visible";
}
bA.hideBar=function(){
this.bar.style.visibility="hidden";
}
bA.tid=setInterval('startBar('+N+')',speed);
return bA;
}}

function startBar(bn) {
   var t=(ie)?document.all['blocks'+bn]:document.getElementById('blocks'+bn);
   if (parseInt(t.style.left)+t.h+1-(t.blocks*t.h+t.blocks)>t.w) {
      t.style.left=-(t.h*2+1)+'px';
      t.ctr++;
      if (t.ctr>=t.count){
         eval(t.action);
         t.ctr=0;
      }
   } else t.style.left=(parseInt(t.style.left)+t.h+1)+'px';
}

function togglePause() {
   if (this.tid==0){
      this.tid=setInterval('startBar('+this.N+')',this.speed);
   } else {
      clearInterval(this.tid);
      this.tid=0;
   }
}

function CreateBlock2() {
   this.Veil=document.getElementById("Veil") //reference Block
   this.standardbody=(document.compatMode=="CSS1Compat")? document.documentElement : document.body
   var ie=document.all && !window.opera
   var dom=document.getElementById
   var docwidth=(ie)? this.standardbody.clientWidth : window.innerWidth-this.scrollbarwidth
   var docheight=(ie)? this.standardbody.clientHeight: window.innerHeight
   var docheightcomplete=(this.standardbody.offsetHeight>this.standardbody.scrollHeight)? this.standardbody.offsetHeight : this.standardbody.scrollHeight
   this.Veil.style.width=docwidth+"px"             //set up Block over page
   this.Veil.style.height=docheightcomplete+"px"   //set up Block over page
   this.Veil.style.left=0                          //Position Block over page
   this.Veil.style.top=0                           //Position Block over page
   this.Veil.style.visibility="visible"            //Show Block over page
   document.body.style.cursor='wait';
//   alert("See how the background is grayd out...")
}


//tsh menubar code 

//**********************************************
// Do not remove this notice.
//
// Copyright 2000-2004 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//**********************************************

//-------------------------------------------
// Code to determine the browser and version.
//-------------------------------------------

function Browser() {
  var ua, s, i;
  this.isIE    = false;  // Internet Explorer
  this.isOP    = false;  // Opera
  this.isNS    = false;  // Netscape
  this.version = null;
  ua = navigator.userAgent;

  s = "Opera";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isOP = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  s = "Netscape6/";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  // Treat any other "Gecko" browser as Netscape 6.1.

  s = "Gecko";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = 6.1;
    return;
  }

  s = "MSIE";
  if ((i = ua.indexOf(s))) {
    this.isIE = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }
}

var browser = new Browser();

//--------------------------------------------------
// Code for handling the menu bar and active button.
//--------------------------------------------------

var activeButton = null;

/* [MODIFIED] This code commented out, not needed for activate/deactivate
   on mouseover.

// Capture mouse clicks on the page so any active button can be
// deactivated.

if (browser.isIE)
  document.onmousedown = pageMousedown;
else
  document.addEventListener("mousedown", pageMousedown, true);

function pageMousedown(event) {
  var el;
  // If there is no active button, exit.
  if (activeButton == null)
    return;
  // Find the element that was clicked on.
  if (browser.isIE)
    el = window.event.srcElement;
  else
    el = (event.target.tagName ? event.target : event.target.parentNode);
  // If the active button was clicked on, exit.
  if (el == activeButton)
    return;
  // If the element is not part of a menu, reset and clear the active
  // button.
  if (getContainerWith(el, "DIV", "menu") == null) {
    resetButton(activeButton);
    activeButton = null;
  }
}

[END MODIFIED] */

function buttonClick(event, menuId) {
  var button;
  // Get the target button element.
  if (browser.isIE)
    button = window.event.srcElement;
  else
    button = event.currentTarget;
  // Blur focus from the link to remove that annoying outline.
  button.blur();
  // Associate the named menu to this button if not already done.
  // Additionally, initialize menu display.
  if (button.menu == null) {
    button.menu = document.getElementById(menuId);
    if (button.menu.isInitialized == null)
      menuInit(button.menu);
  }
  // [MODIFIED] Added for activate/deactivate on mouseover.
  // Set mouseout event handler for the button, if not already done.
  if (button.onmouseout == null)
    button.onmouseout = buttonOrMenuMouseout;
  // Exit if this button is the currently active one.
  if (button == activeButton)
    return false;
  // [END MODIFIED]
  // Reset the currently active button, if any.
  if (activeButton != null)
    resetButton(activeButton);
  // Activate this button, unless it was the currently active one.
  if (button != activeButton) {
    depressButton(button);
    activeButton = button;
  }
  else
    activeButton = null;
  return false;
}

function buttonMouseover(event, menuId) {
  var button;
  // [MODIFIED] Added for activate/deactivate on mouseover.
  // Activates this button's menu if no other is currently active.
  if (activeButton == null) {
    buttonClick(event, menuId);
    return;
  }
  // [END MODIFIED]
  // Find the target button element.
  if (browser.isIE)
    button = window.event.srcElement;
  else
    button = event.currentTarget;

  // If any other button menu is active, make this one active instead.

  if (activeButton != null && activeButton != button)
    buttonClick(event, menuId);
}

function depressButton(button) {
  var x, y;
  // Update the button's style class to make it look like it's
  // depressed.
  button.className += " menuButtonActive";
  // [MODIFIED] Added for activate/deactivate on mouseover.
  // Set mouseout event handler for the button, if not already done.
  if (button.onmouseout == null)
    button.onmouseout = buttonOrMenuMouseout;
  if (button.menu.onmouseout == null)
    button.menu.onmouseout = buttonOrMenuMouseout;
  // [END MODIFIED]
  // Position the associated drop down menu under the button and
  // show it.
  x = getPageOffsetLeft(button);
  y = getPageOffsetTop(button) + button.offsetHeight;
  // For IE, adjust position.
  if (browser.isIE) {
    x += button.offsetParent.clientLeft;
    y += button.offsetParent.clientTop;
  }

  button.menu.style.left = x + "px";
  button.menu.style.top  = y + "px";
  button.menu.style.visibility = "visible";

  // For IE; size, position and show the menu's IFRAME as well.

  if (button.menu.iframeEl != null)
  {
    button.menu.iframeEl.style.left = button.menu.style.left;
    button.menu.iframeEl.style.top  = button.menu.style.top;
    button.menu.iframeEl.style.width  = button.menu.offsetWidth + "px";
    button.menu.iframeEl.style.height = button.menu.offsetHeight + "px";
    button.menu.iframeEl.style.display = "";
  }
}

function resetButton(button) {
  // Restore the button's style class.
  removeClassName(button, "menuButtonActive");
  // Hide the button's menu, first closing any sub menus.
  if (button.menu != null) {
    closeSubMenu(button.menu);
    button.menu.style.visibility = "hidden";
    // For IE, hide menu's IFRAME as well.
    if (button.menu.iframeEl != null)
      button.menu.iframeEl.style.display = "none";
  }
}

//----------------------------------------
// Code to handle the menus and sub menus.
//----------------------------------------

function menuMouseover(event) {
  var menu;
  // Find the target menu element.
  if (browser.isIE)
    menu = getContainerWith(window.event.srcElement, "DIV", "menu");
  else
    menu = event.currentTarget;
  // Close any active sub menu.
  if (menu.activeItem != null)
    closeSubMenu(menu);
}

function menuItemMouseover(event, menuId) {
  var item, menu, x, y;
  // Find the target item element and its parent menu element.
  if (browser.isIE)
    item = getContainerWith(window.event.srcElement, "A", "menuItem");
  else
    item = event.currentTarget;
  menu = getContainerWith(item, "DIV", "menu");
  // Close any active sub menu and mark this one as active.
  if (menu.activeItem != null)
    closeSubMenu(menu);
  menu.activeItem = item;
  // Highlight the item element.
  item.className += " menuItemHighlight";
  // Initialize the sub menu, if not already done.
  if (item.subMenu == null) {
    item.subMenu = document.getElementById(menuId);
    if (item.subMenu.isInitialized == null)
      menuInit(item.subMenu);
  }
  // [MODIFIED] Added for activate/deactivate on mouseover.
  // Set mouseout event handler for the sub menu, if not already done.
  if (item.subMenu.onmouseout == null)
    item.subMenu.onmouseout = buttonOrMenuMouseout;
  // [END MODIFIED]
  // Get position for submenu based on the menu item.
  x = getPageOffsetLeft(item) + item.offsetWidth;
  y = getPageOffsetTop(item);
  // Adjust position to fit in view.
  var maxX, maxY;
  if (browser.isIE) {
    maxX = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) +
      (document.documentElement.clientWidth != 0 ? document.documentElement.clientWidth : document.body.clientWidth);
    maxY = Math.max(document.documentElement.scrollTop, document.body.scrollTop) +
      (document.documentElement.clientHeight != 0 ? document.documentElement.clientHeight : document.body.clientHeight);
  }
  if (browser.isOP) {
    maxX = document.documentElement.scrollLeft + window.innerWidth;
    maxY = document.documentElement.scrollTop  + window.innerHeight;
  }
  if (browser.isNS) {
    maxX = window.scrollX + window.innerWidth;
    maxY = window.scrollY + window.innerHeight;
  }
  maxX -= item.subMenu.offsetWidth;
  maxY -= item.subMenu.offsetHeight;
  if (x > maxX)
    x = Math.max(0, x - item.offsetWidth - item.subMenu.offsetWidth
      + (menu.offsetWidth - item.offsetWidth));
  y = Math.max(0, Math.min(y, maxY));
  // Position and show the sub menu.
  item.subMenu.style.left       = x + "px";
  item.subMenu.style.top        = y + "px";
  item.subMenu.style.visibility = "visible";
  // For IE; size, position and display the menu's IFRAME as well.
  if (item.subMenu.iframeEl != null)
  {
    item.subMenu.iframeEl.style.left    = item.subMenu.style.left;
    item.subMenu.iframeEl.style.top     = item.subMenu.style.top;
    item.subMenu.iframeEl.style.width   = item.subMenu.offsetWidth + "px";
    item.subMenu.iframeEl.style.height  = item.subMenu.offsetHeight + "px";
    item.subMenu.iframeEl.style.display = "";
  }
  // Stop the event from bubbling.
  if (browser.isIE)
    window.event.cancelBubble = true;
  else
    event.stopPropagation();
}

function closeSubMenu(menu) {
  if (menu == null || menu.activeItem == null)
    return;
  // Recursively close any sub menus.
  if (menu.activeItem.subMenu != null) {
    closeSubMenu(menu.activeItem.subMenu);
    menu.activeItem.subMenu.style.visibility = "hidden";
    // For IE, hide the sub menu's IFRAME as well.
    if (menu.activeItem.subMenu.iframeEl != null)
      menu.activeItem.subMenu.iframeEl.style.display = "none";
    menu.activeItem.subMenu = null;
  }
  // Deactivate the active menu item.
  removeClassName(menu.activeItem, "menuItemHighlight");
  menu.activeItem = null;
}

// [MODIFIED] Added for activate/deactivate on mouseover. Handler for mouseout
// event on buttons and menus.

function buttonOrMenuMouseout(event) {
  var el;
  // If there is no active button, exit.
  if (activeButton == null)
    return;
  // Find the element the mouse is moving to.
  if (browser.isIE)
    el = window.event.toElement;
  else if (event.relatedTarget != null)
      el = (event.relatedTarget.tagName ? event.relatedTarget : event.relatedTarget.parentNode);
  // If the element is not part of a menu, reset the active button.
  if (getContainerWith(el, "DIV", "menu") == null) {
    resetButton(activeButton);
    activeButton = null;
  }
}

// [END MODIFIED]

//--------------------------
// Code to initialize menus.
//--------------------------

function menuInit(menu) {
  var itemList, spanList;
  var textEl, arrowEl;
  var itemWidth;
  var w, dw;
  var i, j;
  // For IE, replace arrow characters.
  if (browser.isIE) {
    menu.style.lineHeight = "2.5ex";
    spanList = menu.getElementsByTagName("SPAN");
    for (i = 0; i < spanList.length; i++)
      if (hasClassName(spanList[i], "menuItemArrow")) {
        spanList[i].style.fontFamily = "Webdings";
        spanList[i].firstChild.nodeValue = "4";
      }
  }
  // Find the width of a menu item.
  itemList = menu.getElementsByTagName("A");
  if (itemList.length > 0)
    itemWidth = itemList[0].offsetWidth;
  else
    return;
  // For items with arrows, add padding to item text to make the
  // arrows flush right.
  for (i = 0; i < itemList.length; i++) {
    spanList = itemList[i].getElementsByTagName("SPAN");
    textEl  = null;
    arrowEl = null;
    for (j = 0; j < spanList.length; j++) {
      if (hasClassName(spanList[j], "menuItemText"))
        textEl = spanList[j];
      if (hasClassName(spanList[j], "menuItemArrow"))
        arrowEl = spanList[j];
    }
    if (textEl != null && arrowEl != null) {
      textEl.style.paddingRight = (itemWidth 
        - (textEl.offsetWidth + arrowEl.offsetWidth)) + "px";
      // For Opera, remove the negative right margin to fix a display bug.
      if (browser.isOP)
        arrowEl.style.marginRight = "0px";
    }
  }
  // Fix IE hover problem by setting an explicit width on first item of
  // the menu.
  if (browser.isIE) {
    w = itemList[0].offsetWidth;
    itemList[0].style.width = w + "px";
    dw = itemList[0].offsetWidth - w;
    w -= dw;
    itemList[0].style.width = w + "px";
  }
  // Fix the IE display problem (SELECT elements and other windowed controls
  // overlaying the menu) by adding an IFRAME under the menu.
  if (browser.isIE) {
    var iframeEl = document.createElement("IFRAME");
    iframeEl.frameBorder = 0;
    iframeEl.src = "javascript:;";
    iframeEl.style.display = "none";
    iframeEl.style.position = "absolute";
    iframeEl.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
    menu.iframeEl = menu.parentNode.insertBefore(iframeEl, menu);
  }
  // Mark menu as initialized.
  menu.isInitialized = true;
}

//---------------------------
// General utility functions.
//---------------------------

function getContainerWith(node, tagName, className) {
  // Starting with the given node, find the nearest containing element
  // with the specified tag name and style class.
  while (node != null) {
    if (node.tagName != null && node.tagName == tagName &&
        hasClassName(node, className))
      return node;
    node = node.parentNode;
  }
  return node;
}

function hasClassName(el, name) {
  var i, list;
  // Return true if the given element currently has the given class
  // name.
  list = el.className.split(" ");
  for (i = 0; i < list.length; i++)
    if (list[i] == name)
      return true;
  return false;
}

function removeClassName(el, name) {
  var i, curList, newList;
  if (el.className == null)
    return;
  // Remove the given class name from the element's className property.
  newList = new Array();
  curList = el.className.split(" ");
  for (i = 0; i < curList.length; i++)
    if (curList[i] != name)
      newList.push(curList[i]);
  el.className = newList.join(" ");
}

function getPageOffsetLeft(el) {
  var x;
  // Return the x coordinate of an element relative to the page.
  x = el.offsetLeft;
  if (el.offsetParent != null)
    x += getPageOffsetLeft(el.offsetParent);
  return x;
}

function getPageOffsetTop(el) {
  var y;
  // Return the x coordinate of an element relative to the page.
  y = el.offsetTop;
  if (el.offsetParent != null)
    y += getPageOffsetTop(el.offsetParent);
  return y;
}


// djf - moved in from build default page 

function helpme(x) {
  helper = window.open(x, 'helper', 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=yes,resizable=yes,width=340')}

function newImage(arg) {
 if (document.images) {
     rslt = new Image();
     rslt.src = arg;
     return rslt;
 }
}

function changeImages() {
 var preloadFlag = true;
 if (document.images && (preloadFlag == true)) {
     for (var i=0; i<changeImages.arguments.length; i+=2) {
         document[changeImages.arguments[i]].src = changeImages.arguments[i+1];
     }
 }
}

function changelist(path,sflag,templ) { ; 
    document.forms[0].loginpath.value = path ; 
    document.forms[0].searchflag.value = sflag ; 
    document.forms[0].customlist.value = templ ; 
    document.forms[0].submit() ; 
} 

function changecolor(thisdiv,bgcolor){
   var thisobj
   if (document.all) {
      thisobj=thisdiv
     thisobj.style.backgroundColor = bgcolor
   }
}

//Added Build of default bar djf 7/16/09 ;
function tshbar() { ;
   var bar1=createBar(300,15,'white',1,'black','blue',85,7,3,'')
   bar1.hideBar() ;
}

//added rounded corners using niftycheck 

function NiftyCheck()
{
if(!document.getElementById || !document.createElement)
    return(false);
var b=navigator.userAgent.toLowerCase();
if(b.indexOf("msie 5")>0 && b.indexOf("opera")==-1)
    return(false);
return(true);
}

function Rounded(selector,bk,color,size){
var i;
var v=getElementsBySelector(selector);
var l=v.length;
for(i=0;i<l;i++){
    AddTop(v[i],bk,color,size);
    AddBottom(v[i],bk,color,size);
    }
}

function RoundedTop(selector,bk,color,size){
var i;
var v=getElementsBySelector(selector);
for(i=0;i<v.length;i++)
    AddTop(v[i],bk,color,size);
}

function RoundedBottom(selector,bk,color,size){
var i;
var v=getElementsBySelector(selector);
for(i=0;i<v.length;i++)
    AddBottom(v[i],bk,color,size);
}

function AddTop(el,bk,color,size){
var i;
var d=document.createElement("b");
var cn="r";
var lim=4;
if(size && size=="small"){ cn="rs"; lim=2}
d.className="rtop";
d.style.backgroundColor=bk;
for(i=1;i<=lim;i++){
    var x=document.createElement("b");
    x.className=cn + i;
    x.style.backgroundColor=color;
    d.appendChild(x);
    }
el.insertBefore(d,el.firstChild);
}

function AddBottom(el,bk,color,size){
var i;
var d=document.createElement("b");
var cn="r";
var lim=4;
if(size && size=="small"){ cn="rs"; lim=2}
d.className="rbottom";
d.style.backgroundColor=bk;
for(i=lim;i>0;i--){
    var x=document.createElement("b");
    x.className=cn + i;
    x.style.backgroundColor=color;
    d.appendChild(x);
    }
el.appendChild(d,el.firstChild);
}

function getElementsBySelector(selector){
var i;
var s=[];
var selid="";
var selclass="";
var tag=selector;
var objlist=[];
if(selector.indexOf(" ")>0){  //descendant selector like "tag#id tag"
    s=selector.split(" ");
    var fs=s[0].split("#");
    if(fs.length==1) return(objlist);
    return(document.getElementById(fs[1]).getElementsByTagName(s[1]));
    }
if(selector.indexOf("#")>0){ //id selector like "tag#id"
    s=selector.split("#");
    tag=s[0];
    selid=s[1];
    }
if(selid!=""){
    objlist.push(document.getElementById(selid));
    return(objlist);
    }
if(selector.indexOf(".")>0){  //class selector like "tag.class"
    s=selector.split(".");
    tag=s[0];
    selclass=s[1];
    }
var v=document.getElementsByTagName(tag);  // tag selector like "tag"
if(selclass=="")
    return(v);
for(i=0;i<v.length;i++){
    if(v[i].className==selclass){
        objlist.push(v[i]);
        }
    }
return(objlist);
}


// end added code..
// added original nifty code for top.. 


window.onload=function(){if(!NiftyCheck()) return; 
//    Rounded("div#nifty", "#377CB1", "#9BD1FA", 30, 30);
var spr = document.getElementById("superholder") ;
var colr = spr.style.backgroundColor ; 
Rounded("div#superholder",colr,"#FFFFFF");
// Rounded("div#tsh",colr,"#FFFFFF");
// added rounded buttons.. 
Rounded("button","#FFF","#BBD8FF");
//Rounded("div#superholder","#CCCCCC","#FFFFFF");

//RoundedTop("div#superholder","#CCCCCC","#FFFFFF");
// Rounded("div#container","#FFF","#e7e7e7");
//RoundedBottom("div#RnFooter","#CCCCCC","#FFFFFF");
//Rounded("tr#lcolor1","#CCCCCC","white");
//Rounded("tr#lcolor2","#CCCCCC","red");
}

   

/***********************************************
* Floating Top Bar script- © Dynamic Drive (www.dynamicdrive.com)
* Sliding routine by Roy Whittle (http://www.javascript-fx.com/)
* This notice must stay intact for legal use.
* Visit http://www.dynamicdrive.com/ for full source code
***********************************************/

var persistclose=0 //set to 0 or 1. 1 means once the bar is manually closed, it will remain closed for browser session
var startX = 10 //set x offset of bar in pixels
var startY = 122 //set y offset of bar in pixels
var verticalpos="fromtop" //enter "fromtop" or "frombottom"
var dofloat="N" //enter "Y" or "N"
var smsg =    '<span class=Searchhdg> Product <input type=text name="prodidsm" value="" size=10 maxlength=20 id="prodidsm" > ' ;
smsg = smsg + ' Description <input type=text name="proddescsm" value="" size=20 maxlength=50 id="proddescsm" > ' ; 
smsg = smsg +  '  <input type=button class=gobutton name="GO1" value="Search" onclick=javascript:SearchSubmitsm() > </span>  ' ;
// smsg = smsg + ' <a href="#" onClick="javascript:viewcart() ;return false" > Create/ Open Ajax Window </a> ' ;


function iecompattest(){
return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}

function get_cookie(Name) {
var search = Name + "="
var returnvalue = "";
if (document.cookie.length > 0) {
offset = document.cookie.indexOf(search)
if (offset != -1) {
offset += search.length
end = document.cookie.indexOf(";", offset);
if (end == -1) end = document.cookie.length;
returnvalue=unescape(document.cookie.substring(offset, end))
}
}
return returnvalue;
}

function closebar(){
if (persistclose)
document.cookie="remainclosed=1"
document.getElementById("tsh").style.visibility="hidden"
}

function staticbar(){
	barheight=document.getElementById("tsh").offsetHeight
	var ns = (navigator.appName.indexOf("Netscape") != -1) || window.opera;
	var d = document;
	function ml(id){
		var el=d.getElementById(id);
		if (!persistclose || persistclose && get_cookie("remainclosed")=="")
		el.style.visibility="visible"
		if(d.layers)el.style=el;
		el.sP=function(x,y){this.style.left=x+"px";this.style.top=y+"px";};
		el.x = startX;
		if (verticalpos=="fromtop")
		el.y = startY;
		else{
		el.y = ns ? pageYOffset + innerHeight : iecompattest().scrollTop + iecompattest().clientHeight;
		el.y -= startY;
		}
		return el;
	}
	window.stayTopLeft=function(){
		if (verticalpos=="fromtop"){
		var pY = ns ? pageYOffset : iecompattest().scrollTop;
		ftlObj.y += (pY + startY - ftlObj.y)/8;
		}
		else{
		var pY = ns ? pageYOffset + innerHeight - barheight: iecompattest().scrollTop + iecompattest().clientHeight - barheight;
		ftlObj.y += (pY - startY - ftlObj.y)/8;
		}
		ftlObj.sP(ftlObj.x, ftlObj.y);
		if (dofloat=="Y") { ;
                 setTimeout("stayTopLeft()", 10) ;
                }
	}
	ftlObj = ml("RnMenu");
	// stayTopLeft();
        // added tsh code - djf ; 
	var r = document.getElementById('RnMenu'); 
         r.innerHTML = r.innerHTML + smsg ;
	// var colr = r.style.backgroundColor ; 
	// Rounded("div#tsh","#FFFFFF",colr);
}
function addfield(Text,Hname,objname) {
 if (testObj(objname)) {
        objname.value = Text ;
        return true;
  } else { 
	var field = document.createElement("input");
	field.setAttribute("type","hidden");
	field.setAttribute("value",Text);
	field.setAttribute("name",Hname);
	//add new element to the existing form
	document.forms[0].appendChild(field);
 }
}
function testObj(objToTest) {
if (objToTest == null || objToTest == undefined) {
return false;
}
return true;
}
function SearchSubmitsm(){ 
Sstr = document.getElementById("prodidsm").value ;
Sstr = Sstr + "|" + document.getElementById("proddescsm").value ;
 addfield(Sstr,"submitvar", document.forms[0].submitvar) ;
 addfield("Y","searchflag", document.forms[0].searchflag) ;
 addfield("1","searchptr", document.forms[0].searchptr) ;
 addfield("1","startptr", document.forms[0].startptr) ;
 addfield("SR","loginpath", document.forms[0].loginpath) ;
   document.forms[0].submit(); 
}
//ADDA LOGIN PATH JUST IN CASE YOU FORGOT TO ADD IT IN THE CODE
//addfield("XX","loginpath", document.forms[0].loginpath) ;
//Added Global Search and Replace Function - djf
function replacetext() { 
 var str = document.getElementById('RnMainBody');
 evar = str.innerHTML.replace(/<td id=datnorm><b>Click here to/gi, '<td id=datnorm style="VISIBILITY: hidden"><b>');
 evar2 = evar.replace(/<td id=datnorm><b>Click here if you wish to/gi, '<td id=datnorm style="VISIBILITY: hidden"><b>');
 str.innerHTML = evar2 ;
 var str = document.getElementById('RnMenu');
 evar = str.innerHTML.replace(/Home</gi, 'Log Out<');
 str.innerHTML = evar ;
}

function UpdateShipto() {
 var str = document.getElementById('RnMainBody');
 evar = str.innerHTML.replace(/Click Here to change ship to:/gi, 'Choose a Shipto <br><a href=javascript:ManualShipto()>Add A ShipTo</a> <br> <a href=javascript:changepath("OE")> Update this Shipto </a>');
  str.innerHTML = evar ;
  }
function ManualShipto() {
 //get selected shipto info
    var x = 1
    var val = document.forms[0].Shiptobox.options[x].value ;
    var my_array = new Array ;
    var my_array = string_decode(val) ;
    var shipto = my_array[0] ;
    var Shiptoname = my_array[1] ;
    var Shiptodesc = my_array[2] ;
    var Shiptodesc2 = my_array[3] ;
    var Shiptodesc3 = my_array[4] ;
    var Shiptocity = my_array[5] ;
    var Shiptostate = my_array[6] ;
    var Shiptozip = my_array[7] ;
    var Shiptocountry = my_array[8] ;
 // put variables into text boxes
    document.forms[0].shipto.value = shipto ;
    document.forms[0].Shiptoname.value = Shiptoname ;
    document.forms[0].Shiptodesc.value = Shiptodesc ;
    document.forms[0].Shiptodesc2.value = Shiptodesc2 ;
    document.forms[0].Shiptodesc3.value = Shiptodesc3 ;
    document.forms[0].Shiptocity.value = Shiptocity ;
    document.forms[0].Shiptostate.value = Shiptostate ;
    document.forms[0].Shiptozip.value = Shiptozip ;
    document.forms[0].Shiptocountry.value = Shiptocountry ;
    document.forms[0].Shiptoname.focus() ;
}
//ADDED TO allow blanking of fields in SR djf 12-9-10
function getElementsByClass( searchClass, domNode, tagName) { 
	if (domNode == null) domNode = document;
	if (tagName == null) tagName = '*';
	var el = new Array();
	var tags = domNode.getElementsByTagName(tagName);
	var tcl = " "+searchClass+" ";
	for(i=0,j=0; i<tags.length; i++) { 
		var test = " " + tags[i].className + " ";
		if (test.indexOf(tcl) != -1) 
			el[j++] = tags[i];
	} 
	return el;
} 
function hideIfEmpty(inner) {
// var inner = document.getElementById(innerdiv);
if (inner.parentNode&&inner.parentNode.id) 
var outerdiv=inner.parentNode.id;
  if (inner.innerHTML=="")
    document.getElementById(outerdiv).style.display="none";
    // document.getElementById(outerdiv).style.display="none";
}
function HideLoad(){
var divs = getElementsByClass('labelhide');
 for (var i = 0, l = divs.length; i < l; i++){
   //do something to each div like
   hideIfEmpty(divs[i])
 }
}
// below are the global load functions.. 
if (window.addEventListener)
window.addEventListener("load", staticbar, false)
else if (window.attachEvent)
window.attachEvent("onload", staticbar)
else if (document.getElementById)
window.onload=staticbar

//if (window.addEventListener)
//window.addEventListener("load", UpdateShipto, false)
//else if (window.attachEvent)
//window.attachEvent("onload", UpdateShipto)
//else if (document.getElementById)
//window.onload=UpdateShipto

if (window.addEventListener)
window.addEventListener("load", createhintbox, false)
else if (window.attachEvent)
window.attachEvent("onload", createhintbox)
else if (document.getElementById)
window.onload=createhintbox

if (window.addEventListener)
window.addEventListener("load", HideLoad, false)
else if (window.attachEvent)
window.attachEvent("onload", HideLoad)
else if (document.getElementById)
window.onload=HideLoad

// uncomment to add replace text function.. 

//if (window.addEventListener)
//window.addEventListener("load", replacetext, false)
//else if (window.attachEvent)
//window.attachEvent("onload", replacetext)
//else if (document.getElementById)
//window.onload=replacetext
