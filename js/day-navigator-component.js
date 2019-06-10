function DayNavigatorComponent(mediator) {
    const SELECTOR = '.day-navigator';
    const $datePicker = $(SELECTOR).find('[name=datepicker]');
    var service = null;

    this.hide = function () {
        service = null;
        $(SELECTOR).hide();
    };

    this.show = function (aService) {
        service = aService;
        $(SELECTOR).show();
    };

    this.getDate = function () {
        return getDate();
    };

    function init() {
        $datePicker.datepicker({ dateFormat: DATE_FORMAT });

        $(SELECTOR).find('.btn-prev-interval').click(function () {
            var d = getDate();
            var prevDate = (service) ? service.getPrevDate(d) : d;
            setDate(prevDate);
        });
        $(SELECTOR).find('.btn-prev-day').click(function () {
            let d = getDate();
            d.setDate(d.getDate() - 1);
            setDate(d);
        });
        $(SELECTOR).find('.btn-next-day').click(function () {
            let d = getDate();
            d.setDate(d.getDate() + 1);
            setDate(d);
        });
        $(SELECTOR).find('.btn-next-interval').click(function () {
            var d = getDate();
            var nextDate = (service) ? service.getNextDate(d) : d;
            setDate(nextDate);
        });
        $datePicker.datepicker("setDate", new Date());
    }

    function getDate() {
        return $datePicker.datepicker("getDate");
    }

    function setDate(date) {
        let oldDate = getDate()
        if (date.getTime() != oldDate.getTime()) {
            $datePicker.datepicker("setDate", date);
            mediator.notify({ type: MSG_CHANGE_CURRENT_DATE });
        }
    }

    init();
}
