function ReservationDialog() {
    var _this = this;
    var dialog = null;
    var form = null;
    var dateFormat = "mm/dd/yy";
    var from = null;
    var to = null;
    var callbackfn = null;
    init();

    function addReservation() {
        var result = serializeFormToJSON();
        if (typeof callbackfn === "function") {
            callbackfn(result);
        }
    }

    function serializeFormToJSON() {
        var fields = form.serializeArray();
        var result = {};
        jQuery.each(fields, function (i, field) {
            result[field.name] = field.value;
        });
        return result;
    }

    this.show = function (data, aCallbackFn) {
        for (x in data) {
            form.find("#" + x).val(data[x]);
        }
        callbackfn = aCallbackFn;
        dialog.dialog("open");
    }


    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }


    function init() {
        from = $("#from")
            .datepicker({
                defaultDate: "-1d",
                changeMonth: true,
                numberOfMonths: 2
            })
            .on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            });
        to = $("#to").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 2
        })
            .on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });


        dialog = $("#dialog-form").dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: {
                "Save": function () {
                    addReservation();
                    dialog.dialog("close");
                },
                "Delete": function () {
                    $("#name").val("");
                    addReservation();
                    dialog.dialog("close");
                },
                Cancel: function () {
                    dialog.dialog("close");
                }
            },
            close: function () {
                form[0].reset();
                //allFields.removeClass("ui-state-error");
            }
        });

        form = dialog.find("form").on("submit", function (event) {
            event.preventDefault();
            addReservation();
        });


    }
}
