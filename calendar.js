var monthDays = new Array; // day numbers for month (42 total)
var calendarButtons = new Array; // calendar buttons for each day in month (42 total)

// Month Buttons
var sepMonth;
var octMonth;
var novMonth;

// Current day and month
var currentDay;
var currentMonth;

// Selected date, year and month
var day;
var month;
var year;

// Event properties
//var keyProperties = new Array;
//var eventNameProperties = new Array; 
//var monthProperties = new Array; 
//var dayProperties = new Array; 
//var yearProperties = new Array; 
//var startTimeProperties = new Array; 
//var endTimeProperties = new Array; 
//var locationProperties = new Array; 
//var eventListStringProperties = new Array; 

// Key of the event (each event has its own key)
var keyToDelete;

// Editing event (0 for false, 1 for true)
var editingEvent = 0; 

// used by AJAX
var rootDir = "http://aurum.fishsicles.net/calendar/"

/* AJAX functionality */
function insertRequest(name, start, end, loc) {
   var url = rootDir + "insert-ajax.php";
   var params = new FormData();
   params.append("name",name);
   params.append("start",start);
   params.append("end",end);
   params.append("location",loc);
   var xhr = new XMLHttpRequest();
   xhr.open("POST", url, true);
   xhr.send(params);
}

function insertRequestNoLoc(name, start, end) {
   var url = rootDir + "insert-ajax.php";
   var params = new FormData();
   params.append("name",name);
   params.append("start",start);
   params.append("end",end);
   var xhr = new XMLHttpRequest();
   xhr.open("POST", url, true);
   xhr.send(params);
}

function deleteRequest(eventId) {
   console.log("deleteRequest() called\n");
   var url = rootDir + "delete-ajax.php";
   var params = new FormData();
   params.append("uid",eventId);
   
   var xhr = new XMLHttpRequest();
   xhr.open("POST", url, true);
   xhr.send(params);
}

function listRequest(date) {
   var url = rootDir + "list-ajax.php";
   var params = new FormData();
   params.append("date",date);
   var xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function()
   {
      if ( xhr.readyState == 4 && xhr.status == 200 )
      {
         document.getElementById("eventList").innerHTML = xhr.responseText;
      }
   }
   xhr.open("POST", url, true);
   xhr.send(params);
}

/* Sets up the calendar when the window loads */
function init() {    
        
    // Returns an array of all the calendar buttons with the name 'addButton'
	var buttons = document.getElementsByName("addButton");
    calendarButtons = buttons;
    
    // Get the current date
    var today = new Date();
    var mm = today.getMonth() + 1; //January is 0!
        
    // Initialize the date
    day = today.getDate();
    month = today.getMonth() + 1;
    year = 2014;
    
    // Initialize current date
    currentDay = today.getDate();
    currentMonth = today.getMonth() + 1;
    
    // Initialize the month buttons
    sepMonth = document.getElementById("monthOfSeptember");
    octMonth = document.getElementById("monthOfOctober");
    novMonth = document.getElementById("monthOfNovember");
    
    // If current month is September, set September month dates on calendar
    if (mm == 9) { monthOfSeptember(); }
    // If current month is October, set October month dates on calendar
    else if (mm == 10) { monthOfOctober(); }    
    // If current month is November, set November month dates on calendar
    else if (mm == 11) { monthOfNovember(); }
    // Else set to November dates on calendar 
    else { monthOfNovember(); }
    
    // Highlight the current date on the calendar
    selectFirstDayOfMonth();
    
    /* Add events to sidebar */
    addEventsToSidebarList();
}

/* Calls the init function when the window loads */
window.onload = init;

/* Highlights a calendar button when the user clicks on a new day in the calendar */
function buttonClicked(number) {
    
    // Deselect any other calendar day button that was previously selected
    for (var i = 0; i < calendarButtons.length; i += 1) {
        if (calendarButtons[i].disabled == true) {
            continue;
        }
        else {
            notHighlighedCalendarDay(i);
        }
    }
    
    // Select calendar day button user clicked on
    hightlightCalendarDay(number);    
    
    // Set day
    day = monthDays[number];

    // Change title (day of week, month, day) on sidebar
    changeMonthAndDayName(number);
    
    /* Add events to sidebar */
    addEventsToSidebarList();
}

/* Add events to sidebar */
function addEventsToSidebarList() {
    // Clear all events from sidebar (or else there will be duplicates)
    var myNode = document.getElementById("eventList");
    var fc = myNode.firstChild;
    while( fc ) {
        myNode.removeChild(fc);
        fc = myNode.firstChild;
    }
    
    // Get the date from variables
    var nameOfMonth = "";
    if (month == 9) {
        nameOfMonth = "September";
    }
    else if (month == 10) {
        nameOfMonth = "October";
    }
    else if (month == 11) {
        nameOfMonth = "November";
    }
    var dateName = day + " " + nameOfMonth + " " + year;
    // request the data from the database
    listRequest(dateName);
}

/* Change title (day of week, month, day) on sidebar */
function changeMonthAndDayName(number) {
    
    // Get day of week (e.g. Monday, Tues, Wed)
    if (number % 7 == 0) {
        document.getElementById("dayOfWeek").innerHTML = "Sunday";
    }
    else if (number % 7 == 1) {
        document.getElementById("dayOfWeek").innerHTML = "Monday";
    }
    else if (number % 7 == 2) {
        document.getElementById("dayOfWeek").innerHTML = "Tuesday";
    }
    else if (number % 7 == 3) {
        document.getElementById("dayOfWeek").innerHTML = "Wednesday";
    }
    else if (number % 7 == 4) {
        document.getElementById("dayOfWeek").innerHTML = "Thursday";
    }
    else if (number % 7 == 5) {
        document.getElementById("dayOfWeek").innerHTML = "Friday";
    }
    else if (number % 7 == 6) {
        document.getElementById("dayOfWeek").innerHTML = "Saturday";
    } 
    
    // Get name of month
    var nameOfMonth = "";
    if (month == 9) {
        nameOfMonth = "September";
    }
    else if (month == 10) {
        nameOfMonth = "October";
    }
    else if (month == 11) {
        nameOfMonth = "November";
    }
    
    // Update sidebar title
    document.getElementById("monthAndDay").innerHTML = nameOfMonth + " " + day;
}

/* Highlights September button and changes calendar days to September 
 * when user clicks on September button */
function monthOfSeptember() {
    septMonth = document.getElementById("monthOfSeptember");

    // Highlights selected month button, unselect other month buttons
    selectedMonthButton(9);

    // Dates for September calendar
    var septemberDates = [31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                          13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 
                          24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 
                          6, 7, 8, 9, 10, 11];
    
    // Returns an array of all calendar day buttons
	var button = document.getElementsByName("addButton");
    
    // Add the day number to each button in the calendar
    for (var i = 0; i < button.length; i += 1) {
        button[i].innerHTML = septemberDates[i];
    }
        
    // Add new dates to month days array
    while(monthDays.length) { // Remove previous dates
        monthDays.pop();
    }
    for (var i = 0; i < septemberDates.length; i++) { // Add new dates
        monthDays.push(septemberDates[i]);
    }
    
    // Set month
    month = 9;
    
    // Re-enable all buttons and then disable other month's buttons
    renableButtons();
    disableOtherMonthsButtons(30);
    
    // Select first day of month
    selectFirstDayOfMonth();

    // Change image in sidebar
    changeImage();
    
    /* Add events to sidebar */
    addEventsToSidebarList();
}

/* Highlights October button and changes calendar days to October 
 * when user clicks on October button */
function monthOfOctober() {
    octMonth = document.getElementById("monthOfOctober");
    
    // Highlights selected month button, unselect other month buttons
    selectedMonthButton(10);
    
    // Dates for October calendar
    var octoberDates = [28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 
                        12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 
                        24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 
                        6, 7, 8];
    
    // Returns an array of all calendar day buttons
	var button = document.getElementsByName("addButton");
    
    // Add the day number to each button in the array
    for (var i = 0; i < button.length; i += 1) {
        button[i].innerHTML = octoberDates[i];
    }
    
    // Add new dates to month days array
    while(monthDays.length) { // Remove old dates
        monthDays.pop();
    }
    for (var i = 0; i < octoberDates.length; i++) {
        monthDays.push(octoberDates[i]); // Add new dates
    }
    
    // Set month
    month = 10;
    
    // Re-enable all buttons and then disable other month's buttons
    renableButtons();
    disableOtherMonthsButtons(31);
    
    // Select first day of month
    selectFirstDayOfMonth();
    
    // Change image
    changeImage();
    
    /* Add events to sidebar */
    addEventsToSidebarList();
}

/* Highlights November button and changes calendar days to November 
 * when user clicks on November button */
function monthOfNovember() {
    novMonth = document.getElementById("monthOfNovember");

    // Highlights selected month button, unselect other month buttons
    selectedMonthButton(11);

    // Dates for November calendar
    var novemberDates = [26, 27, 28, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 
                         9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
                         21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 
                         3, 4, 5, 6, 7];
    
    // Returns an array of all calendar day buttons
	var button = document.getElementsByName("addButton");
    
    // Add the day number to each button in the array
    for (var i = 0; i < button.length; i += 1) {
        button[i].innerHTML = novemberDates[i];
    }
    
    // Add new dates to month days array
    while(monthDays.length) { // Remove old dates
        monthDays.pop();
    }
    for (var i = 0; i < novemberDates.length; i++) { // Add new dates
        monthDays.push(novemberDates[i]);
    }

    // Set month
    month = 11;
    
    // Re-enable all buttons and then disable other month's buttons
    renableButtons();
    disableOtherMonthsButtons(30);
    
    // Select first day of month
    selectFirstDayOfMonth();
    
    // Change image
    changeImage();
    
    /* Add events to sidebar */
    addEventsToSidebarList();
}

/*  When a different month is selected, highlight the month selected
    and restores their style to basic state */
function selectedMonthButton(month) {
    
    // Reset text color to normal
    sepMonth.style.color = 'pink';
    octMonth.style.color = 'pink';
    novMonth.style.color = 'pink';

    // Set text color of highlighted month
    if (month == 9) {
        sepMonth.style.color = '#ed5a92';
    }
    else if (month == 10) {
        octMonth.style.color = '#ed5a92';
    }
    else if (month == 11) {
        novMonth.style.color = '#ed5a92';
    }
}

/*  Re-enables all calendar day buttons and restores their style to basic state */
function renableButtons() {
    for (var i = 0; i < calendarButtons.length; i += 1) {
        calendarButtons[i].disabled = false;
        notHighlighedCalendarDay(i);
    }
}

/*  Disables all buttons in the calendar that are not part of the current
    month. Disabled buttons are greyed out */
function disableOtherMonthsButtons(lastDay) {
    
    // Disable other month's days buttons at the beginning of the calendar
    for (var i = 0; i < monthDays.length; i += 1) {
        if (monthDays[i] > 1) {
            disableCalendarDayButton(i);
        }
        else {
            break;
        }
    }
    // Disable other month's days buttons at end of calendar
    for (var i = monthDays.length - 1; i >= 0; i -= 1) {
        if (monthDays[i] < lastDay) {
            disableCalendarDayButton(i);
        }
        else {
            break;
        }
    }
}

/*  Disable calendar day button and grey it out */
function disableCalendarDayButton(i) {
    calendarButtons[i].disabled = true;
    calendarButtons[i].style.background = '#C9D3BF';
    calendarButtons[i].style.color = '#ABA898';
}

/*  When the user switches months, the first day of the month is highlighted
    in the calendar. The only exception is if the current month is selected,
    then the current day is highlighted */
function selectFirstDayOfMonth() {
    
    // Search for the first day of the month in the list of month days for
    // the current month selected
    var index;
    for (var i = 0; i < monthDays.length; i += 1) {
        if (monthDays[i] == 1) {
            index = i;
            break;
        }
    }
    
    // If the current month is selected, highlight the current day
    if (month == currentMonth) {
        selectCurrentDayOfMonth();
    }
    
    // Otherwise, highlight the first day of the month
    else {
        day = monthDays[index];
        hightlightCalendarDay(index);
    }
    
     // Change sidebar text
    changeMonthAndDayName(index);
}

/*  Highlights the current day of the current month */
function selectCurrentDayOfMonth() {
    
    // Select the current date on the calendar
    var index;
    for (var i = 0; i < monthDays.length; i ++) {
        if (currentDay == monthDays[i]) {
            index = i;
            break;
        }
        else {
            index = 0;
        }
    }
    day = monthDays[i];
    hightlightCalendarDay(index);
}

/*  Color for non-highlighted calendar days */
function notHighlighedCalendarDay(i) {
    calendarButtons[i].style.color = '#3ca696';
    calendarButtons[i].style.background = '#5FD7C5';    
}

/*  Color for highlight of calendar day */
function hightlightCalendarDay(i) {
    calendarButtons[i].style.color = '#8a3e5b';
    calendarButtons[i].style.background = '#ed5a92';    
}

/* Image */
/**************************************************************************************/

/* Change image in sidebar based on selected month */
function changeImage() {
    if (month == 9) {
        document.getElementById("secondaryImage").src= "images/dogWithGlasses.jpeg";
    }
    else if (month == 10) {
        document.getElementById("secondaryImage").src= "images/catWithParrot.jpg";
    }
    else if (month == 11) {
        document.getElementById("secondaryImage").src= "images/babySkunk.jpeg";
    }
}

/* Pop-Over */
/**************************************************************************************/
// Show the add event pop-over

function showPopOver(divID) {
	// Set the div position on the screen
	document.getElementById(divID).style.left = "300px";
	document.getElementById(divID).style.top = "100px";

	// Show the div
	document.getElementById(divID).style.display = "block";
    
    // If user is editing event, populate the field with event's properties 
    if (editingEvent == 1) {
        
         var index;
        // Get the properties of the list item clicked
        for (var i = 0; i < keyProperties.length; i += 1) {
            if (keyToDelete == keyProperties[i]) {
                index = i;
                break;
            }
        }
        
        var eventName = document.getElementById("eventNameInput");
        eventName.value = eventNameProperties[index];

        var monthName = document.getElementById("dateMonth");
        var monthNameValue = monthProperties[index];
        if (monthNameValue == 9) { monthName.selectedIndex = 0; }
        if (monthNameValue == 10) { monthName.selectedIndex = 1; }
        if (monthNameValue == 11) { monthName.selectedIndex = 2; }

        var dayName = document.getElementById("dateDay");
        dayName.selectedIndex = (dayProperties[index] - 1); //index starts at 0

        var startTimeName = document.getElementById("startTimeInput");
        startTimeName.value = startTimeProperties[index];

        var endTimeName = document.getElementById("endTimeInput");
        endTimeName.value = endTimeProperties[index];

        var locationName = document.getElementById("locationInput");
        locationName.value = locationProperties[index];
    }
}

// Show the edit/delete event pop-over
function showDeletePopOver(key) {
   // div used for delete popover
	var divID = 'pop2';
   // Set the div position on the screen
	document.getElementById(divID).style.left = "300px";
	document.getElementById(divID).style.top = "100px";
   // Show the div
	document.getElementById(divID).style.display = "block";
   // Set key to delete
   keyToDelete = key;
}

/* Close add event pop-over if user clicked cancel button */
function cancelPopOver(divID) {
	// Hide the div
	document.getElementById(divID).style.display = "none";
   // Clear the fields
   clearFields();
   // No editing occuring
   editingEvent = 0;
}

/* Delete an event and close the delete/edit popover */
function deleteEventAndClosePopOver(divID) {
   // send the re
   deleteRequest(keyToDelete);
   // Hide the div
	document.getElementById(divID).style.display = "none";
   // Refresh the sidebar
   addEventsToSidebarList();
}

function editEventAndClosePopOver(divID) {
    
    // Hide the div
	document.getElementById(divID).style.display = "none";
    
    editingEvent = 1;

    // Show the add event popover
    javascript:showPopOver('pop1');
}

/* Save the event the user entered and close the add event popover */
function saveAndClosePopOver(divID) {
    
    // If user is editing event, delete old event and add new 
    if (editingEvent == 1) {
       
        // Delete the event being edited
        for (var i = 0; i < keyProperties.length; i += 1) {
            if (keyToDelete == keyProperties[i]) {

                // Delete from array
                eventNameProperties.splice(i, 1);
                locationProperties.splice(i, 1);
                startTimeProperties.splice(i, 1);
                endTimeProperties.splice(i, 1);
                monthProperties.splice(i, 1);
                dayProperties.splice(i, 1);
                yearProperties.splice(i, 1);
                eventListStringProperties.splice(i, 1);
                keyProperties.splice(i, 1);
            }
        }
        
        // Refresh sidebar list.
        addEventsToSidebarList();
            
        // Editing has completed
        editingEvent = 0;
    }
    
    // Get event name from text field
    var eventNameInput = document.getElementById("eventNameInput");
    var eventName = eventNameInput.value;
    
    // Get location from text field
    var locationInput = document.getElementById("locationInput");
    var locationName = locationInput.value;
    
    // Get start time from time field
    var startTimeInput = document.getElementById("startTimeInput");
    var startTimeName = startTimeInput.value;
    
    // Get end time from time field
    var endTimeInput = document.getElementById("endTimeInput");
    var endTimeName = endTimeInput.value;
    
    // Get month from selection
    var monthInput = document.getElementById("dateMonth");
    var monthName = monthInput.value;
    
    // Get day from selection
    var dayInput = document.getElementById("dateDay");
    var dayName = dayInput.value;
    
    // Get year from selection
    var yearInput = document.getElementById("dateYear");
    var yearName = yearInput.value;
    
    // Create a string for the event list
    var finalString;
    
    // If no location was entered
    if (locationName == "") {
        finalString = startTimeName + " to " +  endTimeName + " " + eventName;
    }
    // If a location was entered
    else {
        finalString = startTimeName + " to " +  endTimeName + " " + eventName + " at " + locationName;
    }
    
    // Create an unique key for each event
    var currentDate = new Date();
    var time = currentDate.getTime();
    var key = time;
    
    // Add alert if end time starts before start time
    if(startTimeName > endTimeName) {
        alert("Your end time for the event starts before the start time");
    }
    else {
        // If user does not enter an event name, use an alert window to notify
        // them that they must enter an event name
        if (eventName == "") {
            alert("Please enter an event name");
        }
        else if (startTimeName == "") {
            alert("Please enter a start time");
        }
        else if (endTimeName == "") {
            alert("Please enter an end time");
        }
        else {
            // Save the properties [deprecated]
            //saveEventProperties(eventName, locationName, startTimeName, endTimeName, monthName, dayName, yearName, finalString, key);
            
            // Save data to SQL database;
            dateName = dayName + " " + monthName + " " + yearName + " ";
            if ( locationName != "" ) { insertRequest(eventName,dateName + startTimeName,dateName + endTimeName,locationName); }
            else { insertRequestNoLoc(eventName,dateName + startTimeName,dateName+endTimeName); }
            
            var monthValue; // Change text (e.g September) to number (e.g. 9)
            if (monthName == "september") { monthValue = 9; }
            if (monthName == "october") { monthValue = 10; }
            if (monthName == "november") {monthValue = 11; }
            
            // If date user clicked is the same as the event date, refresh list
            if (day == dayName && month == monthValue) {
                addEventsToSidebarList();
            }

            // Hide the div
            document.getElementById(divID).style.display = "none";
            
            // Clear the fields in the form
            clearFields();
        } 
    }
}

/* Clear the fields in the add event form */
function clearFields() {
    var eventName = document.getElementById("eventNameInput");
    eventName.value = "";
    
    var monthName = document.getElementById("dateMonth");
    monthName.selectedIndex = 0;
    
    var dayName = document.getElementById("dateDay");
    dayName.selectedIndex = 0;
    
    var startTimeName = document.getElementById("startTimeInput");
    startTimeName.value = "";
    
    var endTimeName = document.getElementById("endTimeInput");
    endTimeName.value = "";
    
    var locationName = document.getElementById("locationInput");
    locationName.value = "";
}