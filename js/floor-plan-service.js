function FloorPlanService() {
  var _this = this;
  var storage = new FloorPlanStorage();

  this.load = function (planId) {
    return storage.loadFloorPlan(planId);
  };

  this.save = function (plan, planId) {
    storage.saveFloorPlan(planId, plan);
  };

  this.reset = function (planId) {
    storage.resetFloorPlan(planId);
  };

  this.getRoomList = function (planId) {
    return storage.getRoomList(planId);
  };

  this.getTables = function (planId, roomId = null) {
    return storage.getTables(planId, roomId);
  };

}
