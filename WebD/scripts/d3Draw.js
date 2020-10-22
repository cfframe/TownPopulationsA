const DataSource = "sampleData/10Towns.json";
// http://35.211.183.112/Circles/Towns/50

var dataset =
    [
        {
            "lng": -6.652,
            "Town": "Aghadowey",
            "Population": 48700,
            "County": "Londonderry",
            "lat": 55.029
        },
        {
            "lng": -3.89776,
            "Town": "Achiemore",
            "Population": 76948,
            "County": "Highland",
            "lat": 58.50062
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
        },
        {
            "lng": -2.73726,
            "Town": "Abbey Green",
            "Population": 89334,
            "County": "Shropshire",
            "lat": 52.89665
        },
        {
            "lng": -3.17467,
            "Town": "Acharn",
            "Population": 27950,
            "County": "Angus",
            "lat": 56.87436
        },
        {
            "lng": 1.25937,
            "Town": "Alby Hill",
            "Population": 77004,
            "County": "Norfolk",
            "lat": 52.8632
        },
        {
            "lng": -3.16277,
            "Town": "Abbeyhill",
            "Population": 104798,
            "County": "City of Edinburgh",
            "lat": 55.95803
        },
        {
            "lng": -3.05199,
            "Town": "Afon Eitha",
            "Population": 168790,
            "County": "Wrexham",
            "lat": 53.00216
        },
        {
            "lng": -1.87097,
            "Town": "Agglethorpe",
            "Population": 49126,
            "County": "North Yorkshire",
            "lat": 54.27408
        }
    ];


// Width and height
var BoxWidth = 628.09174;
var boxHeight = 1051.4788;
var padding = 20;
var mapDomain = {
    "longitudeMin": -10.476361,
    "longitudeMax": 1.765083,
    "latitudeMin": 49.162600,
    "latitudeMax": 60.846142
};

// Create scale functions
var xScale = d3.scaleLinear()
    .domain([mapDomain.longitudeMin, mapDomain.longitudeMax])
    .range([padding, BoxWidth - padding * 2]);

var yScale = d3.scaleLinear()
    .domain([mapDomain.latitudeMin, mapDomain.latitudeMax])
    .range([boxHeight - padding, padding]);

var aScale = d3.scaleSqrt()
    .domain([0, d3.max(dataset, function (d) { return d.Population; })])
    .range([0, 10]);


function d3Draw() {
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
        .attr("width", BoxWidth)
        .attr("height", boxHeight);

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
            return (aScale(d.Population));
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
window.onload = d3Draw;
