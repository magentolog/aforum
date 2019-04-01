const CLASS = 'myType';
const CLASS_ROOM = 'Room';
const CLASS_TABLE = 'Table';
const CLASS_ROOM_ID = 'RoomId';
const CLASS_ROOM_NAME = 'RoomName';
const INDENT_X = 30;
const INDENT_Y = 30;
const FLOOR_PLAN_BASE_NAME = "FloorPlan";
const COLOR_TABLE_RESERVED = "lightgray";

var floorPlanLuenen =
{
  "height": 584,
  "width": 1364,
  "rooms": [{ "left": 0, "top": 8, "width": 236, "height": 180 }, { "left": 235, "top": 8, "width": 344, "height": 180 }, { "left": 579, "top": 8, "width": 257, "height": 180 }, { "left": 0, "top": 186, "width": 136, "height": 91 }, { "left": 693, "top": 187, "width": 145, "height": 134 }, { "left": 838, "top": 187, "width": 111, "height": 134 }, { "left": 948, "top": 164, "width": 170, "height": 157 }, { "left": 1119, "top": 164, "width": 240, "height": 157 }, { "left": 0, "top": 277, "width": 465, "height": 88 }, { "left": 0, "top": 367, "width": 465, "height": 217 }, { "left": 465, "top": 367, "width": 370, "height": 217 }, { "left": 835, "top": 367, "width": 169, "height": 158 }, { "left": 1005, "top": 367, "width": 169, "height": 180 }, { "left": 1176, "top": 367, "width": 185, "height": 180 }],
  "rnames": [{ "left": 143, "top": 122, "text": "Darth Vader" }, { "left": 26, "top": 208, "text": "Luke Skywalker" }, { "left": 415, "top": 70, "text": "R2-D2" }, { "left": 668, "top": 81, "text": "Glaskasten" }, { "left": 739, "top": 240, "text": "Küche" }, { "left": 872, "top": 239, "text": "WC's" }, { "left": 960, "top": 304, "text": "Chewobacca" }, { "left": 1154, "top": 303, "text": "C-3PO" }, { "left": 354, "top": 295, "text": "Obi-Wan Kenobi" }, { "left": 367, "top": 446, "text": "Boba Fett" }, { "left": 894, "top": 400, "text": "Princess Leia" }, { "left": 1017, "top": 395, "text": "Han Solo" }, { "left": 1199, "top": 424, "text": "Master Yoda" }],
  "rids": [{ "left": 182, "top": 164, "text": "L004" }, { "left": 350, "top": 164, "text": "L005" }, { "left": 667, "top": 162, "text": "L006" }, { "left": 89, "top": 257, "text": "L003" }, { "left": 415, "top": 340, "text": "L002" }, { "left": 417, "top": 395, "text": "L001" }, { "left": 960, "top": 374, "text": "L011" }, { "left": 1015, "top": 374, "text": "L010" }, { "left": 1189, "top": 376, "text": "L009" }, { "left": 1237, "top": 302, "text": "L008" }, { "left": 1075, "top": 302, "text": "L007" }],
  "tables": [{ "left": 78, "top": 30, "width": 30, "height": 67 }, { "left": 108, "top": 30, "width": 30, "height": 67 }, { "left": 238, "top": 73, "width": 30, "height": 67 }, { "left": 352, "top": 30, "width": 30, "height": 67 }, { "left": 522, "top": 9, "width": 30, "height": 67 }, { "left": 549, "top": 78, "width": 30, "height": 67 }, { "left": 580, "top": 78, "width": 30, "height": 67 }, { "left": 805, "top": 29, "width": 30, "height": 67 }, { "left": 805, "top": 99, "width": 30, "height": 67 }, { "left": 1003, "top": 166, "width": 30, "height": 67 }, { "left": 1035, "top": 166, "width": 30, "height": 67 }, { "left": 1003, "top": 234, "width": 30, "height": 67 }, { "left": 1035, "top": 234, "width": 30, "height": 67 }, { "left": 1203, "top": 212, "width": 30, "height": 67 }, { "left": 1233, "top": 212, "width": 30, "height": 67 }, { "left": 1262, "top": 369, "width": 30, "height": 67 }, { "left": 1263, "top": 479, "width": 30, "height": 67 }, { "left": 1231, "top": 479, "width": 30, "height": 67 }, { "left": 1059, "top": 414, "width": 30, "height": 67 }, { "left": 1090, "top": 414, "width": 30, "height": 67 }, { "left": 949, "top": 457, "width": 30, "height": 67 }, { "left": 918, "top": 457, "width": 30, "height": 67 }, { "left": 267, "top": 30, "width": 84, "height": 26 }, { "left": 238, "top": 142, "width": 84, "height": 26 }, { "left": 496, "top": 147, "width": 84, "height": 26 }, { "left": 411, "top": 147, "width": 84, "height": 26 }, { "left": 609, "top": 8, "width": 84, "height": 26 }, { "left": 693, "top": 8, "width": 84, "height": 26 }, { "left": 1149, "top": 184, "width": 84, "height": 26 }, { "left": 1234, "top": 184, "width": 84, "height": 26 }, { "left": 51, "top": 295, "width": 84, "height": 26 }, { "left": 51, "top": 322, "width": 84, "height": 26 }, { "left": 136, "top": 295, "width": 102, "height": 26 }, { "left": 136, "top": 322, "width": 102, "height": 26 }, { "left": 238, "top": 295, "width": 84, "height": 26 }, { "left": 238, "top": 322, "width": 84, "height": 26 }, { "left": 1059, "top": 388, "width": 62, "height": 26 }, { "left": 106, "top": 388, "width": 101, "height": 26 }, { "left": 208, "top": 388, "width": 88, "height": 26 }, { "left": 106, "top": 414, "width": 101, "height": 26 }, { "left": 208, "top": 414, "width": 88, "height": 26 }, { "left": 209, "top": 498, "width": 88, "height": 26 }, { "left": 209, "top": 524, "width": 88, "height": 26 }, { "left": 108, "top": 498, "width": 101, "height": 26 }, { "left": 108, "top": 524, "width": 101, "height": 26 }]
}

var floorPlanDortmund =
{
  "height": 1000,
  "width": 754,
  "rooms": [{ "left": 0, "top": 0, "width": 226, "height": 202 }, { "left": 527, "top": 0, "width": 226, "height": 203 }, { "left": 527, "top": 203, "width": 226, "height": 180 }, { "left": 527, "top": 382, "width": 226, "height": 227 }, { "left": 0, "top": 203, "width": 226, "height": 275 }, { "left": 227, "top": 0, "width": 151, "height": 203 }, { "left": 377, "top": 0, "width": 150, "height": 203 }, { "left": 0, "top": 616, "width": 225, "height": 185 }, { "left": 0, "top": 800, "width": 225, "height": 198 }, { "left": 224, "top": 801, "width": 303, "height": 198 }, { "left": 527, "top": 610, "width": 226, "height": 189 }, { "left": 527, "top": 800, "width": 226, "height": 199 }],
  "rnames": [{ "left": 148, "top": 313, "text": "Ganymed" }, { "left": 91, "top": 178, "text": "Titan" }, { "left": 268, "top": 179, "text": "Ceres" }, { "left": 431, "top": 179, "text": "Callisto" }, { "left": 596, "top": 179, "text": "Io" }, { "left": 540, "top": 259, "text": "Hyperion" }, { "left": 541, "top": 437, "text": "Erde (Besprechungsraum)" }, { "left": 533, "top": 692, "text": "Luna" }, { "left": 612, "top": 806, "text": "Fitnessraum" }, { "left": 370, "top": 808, "text": "Mars" }, { "left": 56, "top": 808, "text": "Europa" }, { "left": 172, "top": 655, "text": "Pluto" }],
  "rids": [{ "left": 174, "top": 284, "text": "D201" }, { "left": 168, "top": 180, "text": "D202" }, { "left": 326, "top": 180, "text": "D203" }, { "left": 383, "top": 179, "text": "D204" }, { "left": 546, "top": 180, "text": "D205" }, { "left": 540, "top": 288, "text": "D206" }, { "left": 540, "top": 437, "text": "D207" }, { "left": 533, "top": 719, "text": "D208" }, { "left": 562, "top": 807, "text": "D209" }, { "left": 323, "top": 808, "text": "D210" }, { "left": 121, "top": 809, "text": "D211" }, { "left": 174, "top": 631, "text": "D212" }],
  "tables": [{ "left": 14, "top": 82, "width": 93, "height": 30 }, { "left": 14, "top": 113, "width": 93, "height": 30 }, { "left": 107, "top": 82, "width": 46, "height": 61 }, { "left": 105, "top": 241, "width": 46, "height": 61 }, { "left": 105, "top": 379, "width": 46, "height": 61 }, { "left": 251, "top": 91, "width": 69, "height": 37 }, { "left": 424, "top": 90, "width": 69, "height": 37 }, { "left": 250, "top": 876, "width": 68, "height": 37 }, { "left": 426, "top": 875, "width": 70, "height": 37 }, { "left": 12, "top": 241, "width": 93, "height": 30 }, { "left": 12, "top": 272, "width": 93, "height": 30 }, { "left": 12, "top": 379, "width": 93, "height": 30 }, { "left": 12, "top": 410, "width": 93, "height": 30 }, { "left": 644, "top": 79, "width": 93, "height": 30 }, { "left": 644, "top": 110, "width": 93, "height": 30 }, { "left": 642, "top": 293, "width": 93, "height": 30 }, { "left": 642, "top": 323, "width": 93, "height": 31 }, { "left": 643, "top": 223, "width": 93, "height": 30 }, { "left": 596, "top": 293, "width": 46, "height": 61 }, { "left": 14, "top": 643, "width": 93, "height": 30 }, { "left": 14, "top": 674, "width": 93, "height": 30 }, { "left": 107, "top": 643, "width": 46, "height": 61 }, { "left": 597, "top": 719, "width": 46, "height": 61 }, { "left": 643, "top": 750, "width": 93, "height": 30 }, { "left": 643, "top": 719, "width": 93, "height": 30 }, { "left": 650, "top": 613, "width": 87, "height": 30 }, { "left": 562, "top": 613, "width": 87, "height": 30 }, { "left": 13, "top": 768, "width": 93, "height": 30 }, { "left": 251, "top": 11, "width": 34, "height": 80 }, { "left": 286, "top": 11, "width": 34, "height": 80 }, { "left": 424, "top": 11, "width": 34, "height": 80 }, { "left": 459, "top": 11, "width": 34, "height": 80 }, { "left": 250, "top": 913, "width": 34, "height": 80 }, { "left": 284, "top": 913, "width": 34, "height": 80 }, { "left": 462, "top": 912, "width": 34, "height": 80 }, { "left": 427, "top": 912, "width": 34, "height": 80 }, { "left": 642, "top": 864, "width": 93, "height": 30 }, { "left": 642, "top": 895, "width": 93, "height": 30 }, { "left": 596, "top": 864, "width": 46, "height": 61 }]
};

var floorPlanNew = {
  "height": 600,
  "width": 600,
  "rooms": [],
  "rnames": [],
  "rids": [],
  "tables": []
};

var floorPlanMocks = [floorPlanDortmund, floorPlanLuenen, floorPlanNew];
var floorPlanImgs = ["img/PlanDortmund.png", "img/PlanLuenen.jpg", "#"];

function getPlanFromStorage(planId) {
    var st = localStorage.getItem(FLOOR_PLAN_BASE_NAME + planId);
    var plan = (st)? JSON.parse(st) : floorPlanMocks[planId];
    return plan;
}

var roomTemplate = {
  hasRotatingPoint: false,
  left: 100,
  top: 100,
  stroke: "black",
  strokeWidth: 2,
  fill: "rgba(0,0,0,0)",
  width: 100,
  height: 100
};

var tableTemplate = {
  hasRotatingPoint: false,
  //left: 100,
  //top: 100,
  angle: 0,
  stroke: "black",
  strokeWidth: 1,
  fill: "rgb(193, 154, 107)",
  width: 120,
  height: 30
};

var roomNameTemplate = {
  left: 100,
  top: 100,
  //fontFamily: 'Comic Sans',
  fontFamily: 'Arial',
  shadow: 'rgba(0,0,0,0.3) 4px 4px 4px',
  fill: "blue",
  fontSize: 16,
  //lockScalingX: true,
  lockScalingY: true,
  //lockRotation: true
  textAlign: 'center'
};

var roomIdTemplate = {
  left: 110,
  top: 110,
  //fontFamily: 'Comic Sans',
  fontFamily: 'Arial',
  fill: "black",
  fontSize: 16,
  //lockScalingX: true,
  lockScalingY: true,
  //lockRotation: true
  textAlign: 'center'
};

var tableTextTemplate = {
  fontSize: 16,
  originX: 'center',
  originY: 'center'
}

var users = [
  {name: 'Andre', type: 'Boss', priority: '50'},  
  {name: 'Björn', type: 'Mitarbeiter', priority: '30'},  
  {name: 'Marvin', type: 'Mitarbeiter', priority: '20'},  
  {name: 'Lasse', type: 'Student', priority: '10'},
  {name: 'Robin', type: 'Student', priority: '10'},
  {name: 'Thilo', type: 'Student', priority: '10'},
  {name: 'Patrick', type: 'Praktikant', priority: '1'},
  {name: 'Tim', type: 'Praktikant', priority: '1'},  
  {name: 'Alex', type: 'Praktikant', priority: '1'},
];