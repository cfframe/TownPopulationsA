//const DataSource = "sampleData/10Towns.json";
// http://35.211.183.112/Circles/Towns/50

var svgTowns;
var DataSourceBase = "http://35.211.183.112/Circles/Towns/";
var DefaultNumberOfTowns = 20;

// Width and height
var BoxWidth = 628.09174;
var BoxHeight = 1051.4788;
var BoxPadding = 0;
var MapDomain = {
    "LongitudeMin": -10.476361,
    "LongitudeMax": 1.765083,
    "LatitudeMin": 49.162600,
    "LatitudeMax": 60.846142
};


function D3Draw(dataset) {
    // Create scale functions
    var xScale = d3.scale.linear()
        .domain([MapDomain.LongitudeMin, MapDomain.LongitudeMax])
        .range([BoxPadding, BoxWidth - BoxPadding * 2]);

    var yScale = d3.scale.linear()
        .domain([MapDomain.LatitudeMin, MapDomain.LatitudeMax])
        .range([BoxHeight - BoxPadding, BoxPadding]);

    var aScale = d3.scale.sqrt()
        .domain([0, d3.max(dataset, function (d) { return d.Population; })])
        .range([0, 10]);

    // Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale).orient("bottom")
        .ticks(5);

    // Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale).orient("left")
        .ticks(5);

    // Create SVG element
    svgTowns = d3.select("body")
        .append("svg")
        .attr("width", BoxWidth)
        .attr("height", BoxHeight)
        ;

    // Create circles
    var circles = svgTowns.selectAll("circle").data(dataset).enter()
        .append("circle");

    circles
        .attr("cx", function (d) {
            return (xScale(d.lng));
        })
        .attr("cy", function (d) {
            return (yScale(d.lat));
        })
        .attr("r", function (d) {
            return (aScale(d.Population));
        })
        .attr("fill", function (d) {
            return ("rgb(0,255,0)");
        })
        .attr("stroke", function (d) {
            return ("rgb(255,0,0)");
        })
        .attr("stroke-width", function (d) {
            return (aScale(d.Population) / 5);
        })
;

    // Create town labels
    var townNames = svgTowns.selectAll("text").data(dataset).enter()
        .append("text")
        .attr("x", function (d) {
            return (xScale(d.lng));
        })
        .attr("y", function (d) {
            return (yScale(d.lat));
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", 11)
        .attr("fill", "lightblue")
;

    townNames.text(function (d) {
        return d.Town + ", " + d.County;
    });

    // todo: Create labels
    // todo: Create X axis, Y axis

}

function LoadPage() {

    LoadData(DefaultNumberOfTowns);

}

function LoadData(NumberOfTowns) {
    if (isNaN(NumberOfTowns)) {
        var newError = new Error;
        Error.message = "Value for number of towns is not a valid number."
        HandleError(Error);

        NumberOfTowns = 10;
    } else {

        var dataSource = DataSourceBase + NumberOfTowns.toString();

        // Local test data
        dataSource = "sampleData/10Towns.json";
        //dataSource = "sampleData/500Towns.json";

        d3.json(dataSource, function (error, data) {
            if (error) {
                HandleError(error);
            } else {
                D3Draw(data);
            }
        });
    }
}

function HandleError(error) {
    // This is so basic, it really doesn't give much help. All you usually know is something went wrong.
    var errorMessage = "Unexpected error: \n";
    if (error.message) {
        errorMessage += error.message
    } else {
        errorMessage += "No message attached to caught error."
    }
    errorMessage += "\nPass above details to IT Support (in the context of where you got this code)."

    alert(errorMessage);
}

window.onload = LoadPage();
//window.onload = D3Draw;
