function DayNavigatorComponent() {
    const SELECTOR = '.day-navigator';
    const $datePicker = $(SELECTOR).find('[name=datepicker]');
    var service = null;

    $datePicker.datepicker({ dateFormat: DATE_FORMAT }); 

    this.hide = function () {
        service = null;
        $(SELECTOR).hide();
    }

    this.show = function (aService) {
        service = aService;
        $(SELECTOR).show();
    }

    init();

    function init() {
        setDate(new Date());
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
    }

    function getDate() {
        return $datePicker.datepicker("getDate");
    }

    function setDate(date) {
        $datePicker.datepicker("setDate", date);
    }

};
