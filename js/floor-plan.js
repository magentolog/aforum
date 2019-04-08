const FLOOR_PLAN_BASE_NAME = "FloorPlan";

function FloorPlan() {
  var _this = this;
  var _planId = 2;

  this.load = function (planId) {
    if (planId) {
      _planId = planId;
    }
    var st = localStorage.getItem(FLOOR_PLAN_BASE_NAME + _planId);
    var plan = (st) ? JSON.parse(st) : floorPlanMocks[_planId];
    return plan;
  }

  this.save = function (plan, planId) {
    if (planId) {
      _planId = planId;
    }
    localStorage.setItem(FLOOR_PLAN_BASE_NAME + _planId, JSON.stringify(plan));
  }

  this.reset = function (planId) {
    if (planId) {
      _planId = planId;
    }
    localStorage.setItem(FLOOR_PLAN_BASE_NAME + _planId, "");
  }
}

