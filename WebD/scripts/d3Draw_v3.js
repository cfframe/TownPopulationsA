// Further ideas:
// Add transition delay, limited by dataset size
// Add flash when transition ends?
// Improve error handling

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
var TownHoverFillColour = "rgb(127,127,127)";
var ReferenceBigCircleSize = 10;

var TransitionStyle = {
    Duration: 2000,
    Ease: "bounce"
};


// Define Projection
var Projection = d3.geo.albers()
    .center([0, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(4000)
    .translate([BoxWidth / 2, BoxHeight / 2]);


function D3Draw(TownsData) {
    // Create SVG element
    SvgUK = d3.select("#svgMap")
        .append("svg")
        .attr("width", BoxWidth)
        .attr("height", BoxHeight)
        ;

    // Draw UK map and add towns
    d3.json("uk.json", function (Error, UKData) {
        if (Error) return console.error(Error);

        // Get countries
        var subunits = topojson.feature(UKData, UKData.objects.subunits);

        var path = d3.geo.path()
            .projection(Projection);

        SvgUK.append("path")
            .datum(subunits)
            .attr("d", path);

        // Add subunit class to all subunits so can control styling of each country
        SvgUK.selectAll(".subunit")
            .data(topojson.feature(UKData, UKData.objects.subunits).features)
            .enter().append("path")
            .attr("class", function (d) { return "subunit " + d.id; })
            .attr("d", path);

        DrawTowns(TownsData);

    });
}

function DrawTowns(TownsData, IsReload) {
    console.log("Called LoadTowns at " + (new Date).toLocaleTimeString());
    IsReload = null ? false : IsReload;

    // Create scale function for circles
    var areaScale = d3.scale.sqrt()
        .domain([0, d3.max(TownsData, function (d) { return d.Population; })])
        .range([0, ReferenceBigCircleSize]);

    // Initialize Town Circles and names
    var townCircles = SvgUK.selectAll("circle").data(TownsData);
    var townNames = SvgUK.selectAll("text").data(TownsData);

    if (!IsReload) {
        townCircles.enter().append("circle");

        // Circles - position from lng/lat, size from population
        townCircles
            .attr("cx", function (d) {
                return Projection([d.lng, d.lat])[0];
            })
            .attr("cy", function (d) {
                return Projection([d.lng, d.lat])[1];
            })
            .attr("r", function (d) {
                return areaScale(d.Population);
            })
            .attr("fill", TownFillColour)
            .attr("stroke", TownStrokeColour)
            .attr("stroke-width", function (d) {
                return (areaScale(d.Population) / 5);
            })
            .append("title")
            .text(function (d) {
                return ("Town: " + d.Town
                    + "\nCounty: " + d.County
                    + "\nPopulation: " + d.Population
                );
            });

        townNames.enter().append("text");

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
            .style("pointer-events", "none");

        townNames.text(function (d) {
            return d.Town;
        });

    } else {

        // Position new items to right initially. Otherwise, same as above.
        townCircles.enter().append("circle")
            .attr("cx", function (d) {
                return BoxWidth;
            })
            .attr("cy", function (d) {
                return (Projection([d.lng, d.lat])[1]);
            })
            .attr("r", function (d) {
                return (areaScale(d.Population));
            })
            .attr("fill", "white")
            .attr("stroke", TownStrokeColour)
            .attr("stroke-width", function (d) {
                return (areaScale(d.Population) / 5);
            })
            .append("title");

        townCircles.select("title")
            .text(function (d) {
                return ("Town: " + d.Town
                    + "\nCounty: " + d.County
                    + "\nPopulation: " + d.Population
                );
            });

        townCircles.transition().duration(TransitionStyle.Duration).ease(TransitionStyle.Ease)
            .attr("cx", function (d) {
                console.log("Lng " + d.lng + "; Lat " + d.lat + "; Town: " + d.Town + "; CharCode1:" + d.Town.charCodeAt(0) + "; CharCode2: " + d.Town.charCodeAt(1));
                return Projection([d.lng, d.lat])[0];
            })
            .attr("cy", function (d) {
                return (Projection([d.lng, d.lat])[1]);
            })
            .attr("r", function (d) {
                return (areaScale(d.Population));
            })
            .attr("fill", TownFillColour)
            .attr("stroke-width", function (d) {
                return (areaScale(d.Population) / 5);
            });

        townCircles.exit()
            .transition()
            .duration(TransitionStyle.Duration)
            .style("opacity", 0)
            .remove();

        // Position new items to right initially. Otherwise, same as above.
        townNames.enter().append("text")
            .attr("x", function (d) {
                return BoxWidth + areaScale(d.Population) + 1; 
            })
            .attr("y", function (d) {
                return Projection([d.lng, d.lat])[1] + 4;
            })
            .attr("font-family", "arial, sans-serif")
            .attr("font-size", 11)
            .attr("fill", "darkblue")
            .style("pointer-events", "none");

        townNames.text(function (d) {
                return d.Town;
            });

        townNames.transition().duration(TransitionStyle.Duration).ease(TransitionStyle.Ease)
            .attr("x", function (d) {
                return Projection([d.lng, d.lat])[0] + areaScale(d.Population) + 1;
            })
            .attr("y", function (d) {
                return Projection([d.lng, d.lat])[1] + 4;
            });

        townNames.exit()
            .transition()
            .duration(TransitionStyle.Duration)
            .style("opacity", 0)
            .remove();
    }
}

function LoadPage() {

    d3.select("button")
        .on("click", function () {
            RefreshTownsData($("#TownsSlider").slider("value"));
        });

    LoadData(DefaultNumberOfTowns);

}

function RefreshTownsData(NumberOfTowns) {

    console.log("Called RefreshTownsData at " + (new Date).toLocaleTimeString());

    var dataSource = TownsDataSource(NumberOfTowns.toString());

    d3.json(dataSource, function (error, data) {
        if (error) {
            HandleError(error);
        } else {
            DrawTowns(data, true);
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
            dataSource = "sampleData/10TownsDodgy.json";
            //dataSource = "sampleData/10Towns.json";
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

function TownsDataSource(NoOfTowns) {
    return RemoteDataSourceBase + NoOfTowns.toString();
}

function HandleError(Error) {
    var errorMessage = "Unexpected error, pass details below to IT Support.";

    if (Error.innerHtml) {
        errorMessage += "\nInnerHtml:\n";
        errorMessage += Error.stack;
    } else if (Error.stack) {
        errorMessage += "\nStack:\n";
        errorMessage += Error.stack;
    } else if (Error.message) {
        errorMessage += "\nMessage:\n";
        errorMessage += Error.message
    } else {
        errorMessage += "No message attached to caught error."
    }

    alert(errorMessage);
}

window.onload = LoadPage;

