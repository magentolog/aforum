function ModeSwitcher(demo, editor) {
  const DEMO_MODE = 0;
  const EDIT_MODE = 1;
  const SWITCH_MODE_BTN = "#btn-mode";

  $(SWITCH_MODE_BTN).click(function () {
    if (getMode() == DEMO_MODE) {
      setMode(EDIT_MODE);
      $(SWITCH_MODE_BTN).text('Go to Demo Mode');
    } else {
      setMode(DEMO_MODE);
      $(SWITCH_MODE_BTN).text('Go to Edit Mode');
    }
  });

  function setMode(mode) {
    $(SWITCH_MODE_BTN).data('mode', mode);
    if (mode == DEMO_MODE) {
      editor.hide();
      demo.show(editor.getPlanId());
    } else { // RUN_MODE
      demo.hide();
      editor.show();
    }
  }

  function getMode() {
    return ($(SWITCH_MODE_BTN).data('mode') == DEMO_MODE) ? DEMO_MODE : EDIT_MODE;
  }

}

