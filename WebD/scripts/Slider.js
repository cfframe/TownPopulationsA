$(function () {
    $("#TownsSlider").slider({
        orientation: "vertical",
        animate: "fast",
        classes: {
            "ui-slider": "highlight"
        },
        range: "min",
        min: 1,
        max: 500,
        value: 20,
        slide: function (event, ui) {
            $("#ChosenNoOfTowns").val(ui.value);
        }
    });
    $("#ChosenNoOfTowns").val($("#TownsSlider").slider("value"));
});
