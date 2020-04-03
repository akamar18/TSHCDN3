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
        return (new Date (RegExp.$3, RegExp.$1-1, RegExp.$2));
}

function dt2dtstr4x(dt_datetime) {
	return (new String (
			(dt_datetime.getMonth()+1)+"/"+dt_datetime.getDate()+"/"+dt_datetime.getFullYear()));
}

