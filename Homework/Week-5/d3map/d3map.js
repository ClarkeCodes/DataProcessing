/**
 * d3map.js
 *
 * Eline Jacobse
 * Data Processing
 * Student.nr: 11136235
 *
 * d3 script that sets up an interactive map
 * and fills them with the right color (for a certain value)
 *
 */

// get data from csv file
d3.csv("data.csv", function(error, data) {

    var dataset = {};

    // set up dictionary with country per_thousands to codes
    var codes = {};
    for (var i = 0; i < country_codes.length; i++) {
            codes[country_codes[i][2]] =  country_codes[i][1];
    }

    // all colors to be used for the data (source: http://colorbrewer2.org/)
    var all_colors = ['#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000'];
    var color_values = [0.5, 1, 3, 10, 20, 50, 100, 200];

    var colorScale = d3.scale.quantile()
           .domain(color_values)
           .range(all_colors);

    // create dataset in map format
    data.forEach(function(d) {
        d.per_thousand = +d.per_thousand
        d.refugees = +d.refugees
        var iso = codes[d.country];
        dataset[iso] = {
            refugees: d.refugees,
            per_thousand: d.per_thousand,
            fillColor: colorScale(d.per_thousand)
        };
    });

    // create datamap
    var map = new Datamap({
        element: document.getElementById('container'),
        projection: 'equirectangular',
        fills: {
            defaultFill: '#e2e2e2'
        },
        data: dataset,
        // show desired information in tooltip
        geographyConfig: {
            hideAntarctica: true,
            highlightOnHover: true,
            highlightBorderColor: '#7c0600',
            highlightBorderWidth: 1,
            // keep fillcolor the same on mousover
            highlightFillColor: function(geo) {
                return geo['fillColor'] || '#e2e2e2';
            },
            popupTemplate: function(geo, data) {
                // show 'data not available' for countries without data
                if (!data) {
                    return ['<div class="hoverinfo">' +
                            '<strong>' + geo.properties.per_thousand +'</strong>' +
                            '<br>No data available' +
                            '</div>'];
                }
                // show amount of refugees and refugees per thousand
                var total_refugees = data.refugees.toLocaleString();
                return ['<div class="hoverinfo">' +
                        '<strong>' + geo.properties.per_thousand +'</strong>' +
                        '<br>Total refugees: <strong>' + total_refugees + '</strong>' +
                        '<br>Refugees p/thousand: <strong>' + data.per_thousand + '</strong>' +
                        '</div>'];
                }
        }
    });

    var mapWidth = 850;
    var mapHeight = 650;

    // add title to map
    d3.select(".datamap").append("text")
        .attr("class", "title")
        .attr("x", mapWidth / 2 - 120)
        .attr("y", 70)
        .text("World refugee population in 2015");

    // set up attributes for legend
    var width = 110,
        height = 500;

    var svg = d3.select(".datamap").append("svg")
         .attr("width", width)
         .attr("height", height);

    var legend = svg.selectAll("g.legend")
        .data(color_values)
        .enter().append("g")
        .attr("class", "legend");

    // width and height for rects of legend
    var r_width = 20, r_height = 20;

    color_values.reverse();

    // add containers for legend
    legend.append("rect")
        .attr("x", 20)
        .attr("y", function(d, i){ return height - (i * r_height) - 2 * r_height;})
        .attr("width", r_width)
        .attr("height", r_height)
        .style("fill", function(d, i) { return colorScale(color_values[i]); })
        .style("opacity", 0.8);

    var legendLabels = ['0 - 0.5', '0.5 - 1', '1 - 3', '3 - 10', '10 - 20', '20 - 50', '50 - 100', '100+']
    legendLabels.reverse();

    // add labels for legend
    legend.append("text")
        .attr("x", 45)
        .attr("y", function(d, i){ return height - (i * r_height) - r_height - 5;})
        .text(function(d, i) { return legendLabels[i]; });

    // legend title
    svg.append("text")
        .attr("id", "legendTitle")
        .attr("x", 5)
        .attr("y", 290)
        .text("Refugees per");
    svg.append("text")
        .attr("id", "legendTitle")
        .attr("x", 5)
        .attr("y", 305)
        .text("1.000 people");
});
