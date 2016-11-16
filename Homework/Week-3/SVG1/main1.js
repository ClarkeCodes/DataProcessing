/* use this to test out your function */
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
