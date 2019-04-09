function ReservationDialog() {
    var _this = this;
    var dialog = null;
    var form = null;
    var dateFormat = DATE_FORMAT;
    var from = null;
    var to = null;
    var callbackfn = null;
    init();

    function addReservation() {
        var dateFrom = getDate(from.get(0));
        var dateTo = getDate(to.get(0));
        var result = (dateFrom && dateTo) && (dateFrom <= dateTo);
        if (result && (typeof callbackfn === "function")) {
            var data = serializeFormToJSON();
            callbackfn(data);
        }
        return result;
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
                minDate: 0,
                defaultDate: "0",
                changeMonth: true,
                numberOfMonths: 1,
                dateFormat: dateFormat
            });
        to = $("#to").datepicker({
            defaultDate: "+2w",
            changeMonth: true,
            numberOfMonths: 1,
            dateFormat: dateFormat
        });

        from.on("change", function () {
            to.datepicker("option", "minDate", getDate(this));
        });
        to.on("change", function () {
            from.datepicker("option", "maxDate", getDate(this));
        });


        dialog = $("#dialog-form").dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: {
                "Save": function () {
                    if (addReservation()) {
                        dialog.dialog("close");
                    }
                },
                Cancel: function () {
                    dialog.dialog("close");
                }
            },
            close: function () {
                form[0].reset();
                from.datepicker("option", "minDate", new Date());
                from.datepicker("option", "maxDate", new Date(2050,1,1));
                to.datepicker("option", "minDate", new Date());
                to.datepicker("option", "maxDate", new Date(2050,1,1));
                
                //allFields.removeClass("ui-state-error");
            }
        });

        form = dialog.find("form").on("submit", function (event) {
            event.preventDefault();
            //addReservation();
        });


    }
}
