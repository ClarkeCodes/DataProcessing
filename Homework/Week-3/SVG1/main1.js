/**
 * main1.js
 *
 * Eline Jacobse
 * Data Processing
 * Student.nr: 11136235
 *
 * Function that changes colors and
 * a test function to see if it works
 */

// test function that colors a few countries
window.onload = function() {
    changeColor("no","#deebf7");
    changeColor("se","#9ecae1");
    changeColor("fi","#3182bd");
    changeColor("it","green");
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
    document.getElementById(id).style.fill = color;
}
