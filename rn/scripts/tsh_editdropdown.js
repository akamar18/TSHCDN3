// Title: EDITABLE DROP DOWN
// Description: Editable Dropdown Menu
// URL: http://www.javascriptsource.com/
// Version: 1.0
// Date: 01-03-2003
// Author: Subrata Chakrabarty
// Notes:
//    Handles the "automatic Jump" bug
// Version 2.0
// Date: 05-28-2003
// reworked by The Systems House, Inc. (www.tshinc.com)

    var PreviousSelectIndex = 0;       
    /* Contains the Previously Selected Index */
    
    var SelectIndex = 0;               
    /* Contains the Currently Selected Index  */
    
    var SelectChange = 'MANUAL_CLICK'; 
    /* Indicates whether Change in dropdown selected value */
    /* was due to a Manual Click                           */
    /* or due to System properties of dropdown             */

    function ChangeHandler() {
      PreviousSelectIndex = SelectIndex;       
      /* Contains the Previously Selected Index */

      SelectIndex = document.forms[0].lstDropDown.options.selectedIndex;
      /* Contains the Currently Selected Index  */

      if ((PreviousSelectIndex == (document.forms[0].lstDropDown.options.length - 1)) && (SelectIndex != (document.forms[0].lstDropDown.options.length - 1)) && (SelectChange != 'MANUAL_CLICK')) 
      /* To Set value of Index variables */
      {
        document.forms[0].lstDropDown[(document.forms[0].lstDropDown.options.length - 1)].selected=true;
        PreviousSelectIndex = SelectIndex;
        SelectIndex = document.forms[0].lstDropDown.options.selectedIndex;
        SelectChange = 'MANUAL_CLICK';         
        /* Indicates that the Change in dropdown selected 
			value was due to a Manual Click */
      }
    }

    function KeyPressHandler() {
      if(document.forms[0].lstDropDown.options.length != 0)
      /*if dropdown is not empty*/
        if (document.forms[0].lstDropDown.options.selectedIndex == (document.forms[0].lstDropDown.options.length - 1))
        /*if option the Editable field i.e. the last option */
        {
          var EditString = EditMe.innerText;    
          /* Contents of Editable Option */

          if (EditString == "--?--")            
          /* On backspace on default value of Editable option make Editable option Null */
            EditString = "";

          if ((window.event.keyCode==8 || window.event.keyCode==127)) 
          /* To handle backspace*/
          {
            EditString = EditString.substring(0,EditString.length-1); 
            /* Decrease length of string by one from right */

            SelectChange = 'MANUAL_CLICK';      
            /* Indicates that the Change in dropdown selected 
				value was due to a Manual Click */

          }

          /* Check for allowable Characters  */
          /*
          The various characters allowable for entry into Editable option..
          may be customized by minor modifications in the code (if condition below)
          (you need to know the keycode/ASCII value of the  character to be allowed/disallowed.
          */

          if ((window.event.keyCode==46) || (window.event.keyCode>47 && window.event.keyCode<59)||(window.event.keyCode>62 && window.event.keyCode<127) ||(window.event.keyCode==32)) 
          /* To handle addition of a character */
          {
            EditString+=String.fromCharCode(window.event.keyCode);
            /*Concatenate Enter character to Editable string*/

            /* The following portion handles the "automatic Jump" bug*/
            /*
            The "automatic Jump" bug (Description):
               If a alphabet is entered (while editing)
               ...which is contained as a first character in one of the read-only options
               ..the focus automatically "jumps" to the read-only option
               (-- this is a common property of normal dropdowns
                ..but..is undesirable while editing).
            */

            var i=0;
            var EnteredChar = String.fromCharCode(window.event.keyCode);
            var UpperCaseEnteredChar = EnteredChar;
            var LowerCaseEnteredChar = EnteredChar;

            if(((window.event.keyCode)>=97)&&((window.event.keyCode)<=122))
            /*if EnteredChar lowercase*/
              UpperCaseEnteredChar = String.fromCharCode(window.event.keyCode - 32); 
              /*This is UpperCase*/

            if(((window.event.keyCode)>=65)&&((window.event.keyCode)<=90))
            /*if EnteredChar is UpperCase*/            
              LowerCaseEnteredChar = String.fromCharCode(window.event.keyCode + 32); 
              /*This is lowercase*/

            for (i=0;i<(document.forms[0].lstDropDown.options.length-1);i++)
            { var ReadOnlyString = document.forms[0].lstDropDown[i].innerText;
              var FirstChar = ReadOnlyString.substring(0,1);
              if((FirstChar == UpperCaseEnteredChar)||(FirstChar == LowerCaseEnteredChar))
              {
                SelectChange = 'AUTO_SYSTEM';   
                /* Indicates that the Change in dropdown selected 
                value was due to System properties of dropdown */
                break;
              }
              else
              {
                SelectChange = 'MANUAL_CLICK';   
                /* Indicates that the Change in dropdown selected 
                value was due to a Manual Click */
              }
            }
          }
          
          /*Set new value of edited string into the Editable field */
          EditMe.innerText = EditString;
          EditMe.value = EditString;
          return false;
        }
      return true;
    }
