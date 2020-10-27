//const DataSource = "sampleData/10Towns.json";
// http://35.211.183.112/Circles/Towns/50

var svgUK;
var RemoteDataSourceBase = "http://35.211.183.112/Circles/Towns/";
var DataSourceLocation = "remote"; //"local" or "remote"
var DefaultNumberOfTowns = 20;


// Width and height
var BoxWidth = 800;
var BoxHeight = 970;

// Town styles
var TownFillColour = "rgb(63,255,63)";
var TownStrokeColour = "rgb(255,63,63)";

function D3Draw(dataset) {
    // Create scale function for circles

    var aScale = d3.scale.sqrt()
        .domain([0, d3.max(dataset, function (d) { return d.Population; })])
        .range([0, 10]);

    // Create SVG element
    svgUK = d3.select("body")
        .append("svg")
        .attr("width", BoxWidth)
        .attr("height", BoxHeight)
        ;

    // Draw UK map and add towns
    d3.json("uk.json", function (error, uk) {
        if (error) return console.error(error);

        // Get countries
        var subunits = topojson.feature(uk, uk.objects.subunits);

        // 
        var projection = d3.geo.albers()
            .center([0, 55.4])
            .rotate([4.4, 0])
            .parallels([50, 60])
            .scale(5000)
            .translate([BoxWidth / 2, BoxHeight / 2]);

        var path = d3.geo.path()
            .projection(projection);

        svgUK.append("path")
            .datum(subunits)
            .attr("d", path);

        // Add subunit class to all subunits so can control styling of each country
        svgUK.selectAll(".subunit")
            .data(topojson.feature(uk, uk.objects.subunits).features)
            .enter().append("path")
            .attr("class", function (d) { return "subunit " + d.id; })
            .attr("d", path);

        // Create circles
        var circles = svgUK.selectAll("circle").data(dataset).enter()
            .append("circle");

        circles
            .attr("cx", function (d) {
                console.log("Lng " + d.lng + "; Lat " + d.lat + "; Town: " + d.Town);
                return projection([d.lng, d.lat])[0];
                //return (xScale(d.lng));
            })
            .attr("cy", function (d) {
                //return (yScale(d.lat));
                return (projection([d.lng, d.lat])[1]);
            })
            .attr("r", function (d) {
                return (aScale(d.Population));
            })
            .attr("fill", function (d) {
                return (TownFillColour);
            })
            .attr("stroke", function (d) {
                return (TownStrokeColour);
            })
            .attr("stroke-width", function (d) {
                return (aScale(d.Population) / 5);
            });

        // Create town labels
        var townNames = svgUK.selectAll("text").data(dataset).enter()
            .append("text")
            .attr("x", function (d) {
                //return (xScale(d.lng));
                return projection([d.lng, d.lat])[0] + aScale(d.Population) + 1 ;
            })
            .attr("y", function (d) {
                //return (yScale(d.lat));
                return projection([d.lng, d.lat])[1] + 4;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", 11)
            .attr("fill", "darkblue")
            ;

        townNames.text(function (d) {
            return d.Town;
        });
    });
}

function LoadPage() {

    LoadData(DefaultNumberOfTowns);

}

function LoadData(NumberOfTowns) {
    if (isNaN(NumberOfTowns)) {
        var newError = new Error;
        Error.message = "Value for number of towns is not a valid number."
        HandleError(Error);

        NumberOfTowns = DefaultNumberOfTowns;
    } else {

        var dataSource = RemoteDataSourceBase + NumberOfTowns.toString();

        // Local test data
        if (DataSourceLocation === "local") {
            dataSource = "sampleData/10Towns.json";
            //dataSource = "sampleData/500Towns.json";
        }

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

