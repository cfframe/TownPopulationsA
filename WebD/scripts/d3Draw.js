const DataSource = "sampleData/10Towns.json";
// http://35.211.183.112/Circles/Towns/50

var dataset = 
[
    {
        "lng": -4.42065,
        "Town": "Abernant",
        "Population": 77356,
        "County": "Carmarthenshire",
        "lat": 51.88513
    },
    {
        "lng": -3.26466,
        "Town": "Abertridwr",
        "Population": 51055,
        "County": "Caerphilly",
        "lat": 51.59752
    },
    {
        "lng": -3.61599,
        "Town": "Abbotskerswell",
        "Population": 67099,
        "County": "Devon",
        "lat": 50.50507
    }
];


function d3Draw2() {
    // Width and height
    var w = 500;
    var h = 300;
    var padding = 20;

    //Width = 300;
    //Height = 200;

    // Create scale functions
    var xScale = d3.scaleLinear()
        .domain([-10, 60])
        .range([padding, w - padding * 2]);

    var yScale = d3.scaleLinear()
        .domain([0, 60])
        .range([h - padding, padding]);

    var aScale = d3.scaleSqrt()
        .domain([0, d3.max(dataset, function (d) { return d.Population; })])
        .range([0, 10]);

    // Define X axis
    var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5);

    // Define Y axis
    var yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5);

    // Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    //var svg = d3.select("body").append("svg").attr("width", Width).attr(
    //    "Height", Height);

    // Create circles
    var circles = svg.selectAll("circle").data(dataset).enter()
        .append("circle");

    circles
        .attr("cx", function (d) {
            return (xScale(d.lng));
        })
        .attr("cy", function (d) {
            return (yScale(d.lat));
        })
        .attr("r", function (d) {
            return 10;
        })
        .attr("fill", function (d) {
            return ("rgb(0,255,0)");
        })
        .attr("stroke", function (d) {
            return ("rgb(255,0,0)");
        })
        .attr("stroke-width", function (d) {
            return (d / 5);
        });


			// todo: Create labels
    // todo: Create X axis, Y axis

}

function loadData() {

    //d3.select("p")
    //    .on("click", function () {

    //        updateData();
    //    });

    console.log("Got here");

    d3.json(DataSource, function (error, data) {
        if (error) {
            console.log(error)
        } else {
            console.log("Got here 2");
            d3Draw(data);
        }
    }
    );
}

//window.onload = loadData;
window.onload = d3Draw2;
