/**
 * main2.js
 *
 * Eline Jacobse
 * Data Processing
 * Student.nr: 11136235
 *
 * Script that gets data and uses this to
 * color countries on the world map according to their
 * corresponding values
 */

window.onload = function() {

    // get the data for all the countries form page
    var rawdata = document.getElementById('rawdata').innerHTML;
    var mapping = {};

    // set up dictionary with country names to codes
    for (var i = 0; i < country_codes.length; i++) {
            mapping[country_codes[i][2]] =  country_codes[i][0];
    }
    var data = JSON.parse(rawdata);

    // color the countries on the map using custom function
    for (var i = 0; i < data.length; i++) {
        var country_id = mapping[data[i].country]
        var color = mapColor(data[i].per_thousand);
        changeColor(country_id, color);
    }
}

// changeColor takes a classname and a color (hex value)
// and changes that path's fill color
function changeColor(classname, color) {
    var elements = document.getElementsByClassName(classname);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.fill = color;
    }
}

// function that maps a value to a certain color and returns that color
function mapColor(value) {
    // if there is no value, color is grey
    if (value == "") {
        color = '#E0E0E0'
    }
    else if (value < 0.05) {
        color = '#fef0d9'
    }
    else if (value >= 0.05 && value < 1) {
        color = '#fdd49e'
    }
    else if (value >= 1 && value < 3) {
        color = '#fdbb84'
    }
    else if (value >= 3 && value < 10) {
        color = '#fc8d59'
    }
    else if (value >= 10 && value < 20) {
        color = '#ef6548'
    }
    else if (value >= 20 && value < 100) {
        color = '#d7301f'
    }
    else if (value >= 100) {
        color = '#990000'
    }
    return color;
}
