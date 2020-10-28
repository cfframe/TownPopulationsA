//const DataSource = "sampleData/10Towns.json";
// http://35.211.183.112/Circles/Towns/50

var SvgUK;
var RemoteDataSourceBase = "http://35.211.183.112/Circles/Towns/";
var DataSourceLocation = "remote"; //"local" or "remote"
var DefaultNumberOfTowns = 20;

// Width and height
var BoxWidth = 640;
var BoxHeight = 784;

// Town styles
var TownFillColour = "rgb(63,255,63)";
var TownStrokeColour = "rgb(255,63,63)";
var MaxCircleSize = 10;

var TransitionStyle = {
    Duration: 2000,
    Ease: "bounce"
};


// Initialise Projection
var Projection = d3.geo.albers()
    .center([0, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(4000)
    .translate([BoxWidth / 2, BoxHeight / 2]);


function D3Draw(dataset) {
    // Create SVG element
    SvgUK = d3.select("body")
        .append("svg")
        .attr("width", BoxWidth)
        .attr("height", BoxHeight)
        ;

    // Draw UK map and add towns
    d3.json("uk.json", function (error, uk) {
        if (error) return console.error(error);

        // Get countries
        var subunits = topojson.feature(uk, uk.objects.subunits);

        var path = d3.geo.path()
            .projection(Projection);

        SvgUK.append("path")
            .datum(subunits)
            .attr("d", path);

        // Add subunit class to all subunits so can control styling of each country
        SvgUK.selectAll(".subunit")
            .data(topojson.feature(uk, uk.objects.subunits).features)
            .enter().append("path")
            .attr("class", function (d) { return "subunit " + d.id; })
            .attr("d", path);

        LoadTowns(dataset);

    });
}

function LoadTowns(dataset, isReload) {
    console.log("Called LoadTowns at " + (new Date).toLocaleTimeString());
    isReload = null ? false : isReload;

    // Create scale function for circles
    var areaScale = d3.scale.sqrt()
        .domain([0, d3.max(dataset, function (d) { return d.Population; })])
        .range([0, MaxCircleSize]);

    // Initialize Circles and Town labels
    var circles,
        townNames;

    if (!isReload) {
        circles = SvgUK.selectAll("circle").data(dataset).enter()
            .append("circle");
        townNames = SvgUK.selectAll("text").data(dataset).enter()
            .append("text");
    } else {
        circles = SvgUK.selectAll("circle").data(dataset)
            .transition().duration(TransitionStyle.Duration).ease(TransitionStyle.Ease);
        townNames = SvgUK.selectAll("text").data(dataset)
            .transition().duration(TransitionStyle.Duration).ease(TransitionStyle.Ease);
    }

    // Circles - position from lng/lat, size from population
    circles
        .attr("cx", function (d) {
            //console.log("Lng " + d.lng + "; Lat " + d.lat + "; Town: " + d.Town);
            return Projection([d.lng, d.lat])[0];
        })
        .attr("cy", function (d) {
            return (Projection([d.lng, d.lat])[1]);
        })
        .attr("r", function (d) {
            return (areaScale(d.Population));
        })
        .attr("fill", function (d) {
            return (TownFillColour);
        })
        .attr("stroke", function (d) {
            return (TownStrokeColour);
        })
        .attr("stroke-width", function (d) {
            return (areaScale(d.Population) / 5);
        });

    // Create town labels
    townNames
        .attr("x", function (d) {
            return Projection([d.lng, d.lat])[0] + areaScale(d.Population) + 1;
        })
        .attr("y", function (d) {
            return Projection([d.lng, d.lat])[1] + 4;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", 11)
        .attr("fill", "darkblue")
        ;

    townNames.text(function (d) {
        return d.Town;
    });
}

function LoadPage() {

    d3.select("button")
        .on("click", function () {
            RefreshTownsData(DefaultNumberOfTowns);
        });

    LoadData(DefaultNumberOfTowns);

}

function TownsDataSource(NoOfTowns) {
    return RemoteDataSourceBase + NoOfTowns.toString();
}

function RefreshTownsData(NumberOfTowns) {
    console.log("Called RefreshTownsData at " + (new Date).toLocaleTimeString());

    var dataSource = TownsDataSource(NumberOfTowns.toString());

    d3.json(dataSource, function (error, data) {
        if (error) {
            HandleError(error);
        } else {
            LoadTowns(data, true);
        }
    });

}

function LoadData(NumberOfTowns) {
    if (isNaN(NumberOfTowns)) {
        var newError = new Error;
        Error.message = "Value for number of towns is not a valid number."
        HandleError(Error);

        NumberOfTowns = DefaultNumberOfTowns;
    } else {

        var dataSource = TownsDataSource(NumberOfTowns.toString());

        // Local test data. Only interested in doing this on first load, not on data refresh.
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

window.onload = LoadPage;

