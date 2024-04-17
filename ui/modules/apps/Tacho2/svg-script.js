'use strict';

document.getStreams = () => {
  return ['electrics', 'engineInfo', 'stats'];
}

let width = 660;
let height = 660;
let rpmTextSize = 50; // in px
let rpmTextCount = 14;
let rpmOffset = 400;
let rpmRange = 600;
let barDashCount = 4;
let barDashSize1 = 5;
let barDashSize2 = 5;
let revNeedleTrailDashSize = 5;
let revCurveDashSize1 = 10;
let revCurveDashSize2 = 6;

let tachometer = new TachometerV2(
  width,
  height,
  rpmTextSize,
  rpmTextCount,
  rpmOffset,
  rpmRange,
  barDashCount,
  barDashSize1,
  barDashSize2,
  revNeedleTrailDashSize,
  revCurveDashSize1,
  revCurveDashSize2,
  document.getElementById('tacho2speed'),
  document.getElementById('revcurve_dashes'),
  document.getElementById('revneedle'),
  document.getElementById('rpm_redline'),
  document.getElementById('rpmtextline'),
  document.getElementById('tacho2gear'),
  document.getElementById('center_circle'),
  document.getElementById('revcurve'),
  document.getElementById('revmask'),
  document.getElementById('revtrail'),
  document.getElementById('temp'),
  document.getElementById('temp_dashes'),
  document.getElementById('fuel'),
  document.getElementById('fuel_dashes'),
  document.getElementById('ico_handbrake_on'),
  document.getElementById('ico_abs_on'),
  document.getElementById('ico_indicatorl_on'),
  document.getElementById('ico_indicatorr_on'),
  document.getElementById('ico_lights_on'),
  document.getElementById('ico_lights_high'),

  // YDeltagon add
  document.getElementById('tacho2airspeed'),
  document.getElementById('tacho2maxgear'),
  document.getElementById('tacho2power'),
  document.getElementById('tacho2torque'),
  document.getElementById('tacho2weight'),
  document.getElementById('tacho2oiltemp'),
  // document.getElementById('tacho2l100km'),
  // document.getElementById('tacho2maxpower'),
  // document.getElementById('tacho2maxtorque'),
  document.getElementById('ico_abs'),

  document.getElementsByClassName("tacho_glow")
);

let controller = new TachometerV2Controller();
controller.setLayersVisible(false);

let UiUnitscallback;

let unitSpeed = (val) => {
  let convertedVal = UiUnitscallback(val, 'speed');
  return Math.round(convertedVal.val);
}

document.roundDec = () => 0;

document.wireThroughUnitSystem = (callback) => {
  UiUnitscallback = callback;
}

document.saveData = () => {
  controller.saveData(tachometer);
}

document.reset = () => {
  document.saveData();
  controller.setLayersVisible(false);
  tachometer.initialized = false;
}

document.update = (streams) => {
  if (!tachometer.initialized) {
    controller.init(tachometer, streams);
  }
  controller.update(tachometer, streams);
}

let switchRedlineMode = () => {
  controller.switchRedlineMode(tachometer);
}

let switchRevTrailMode = () => {
  controller.switchRevTrailMode(tachometer);
}

document.vehicleChanged = () => {
  document.saveData();
  tachometer.initialized = false;
}

document.isStreamValid = (streams) => {
  return streams.engineInfo && streams.engineInfo[1] !== undefined && streams.engineInfo[1] !== 0 && streams.electrics;
}
