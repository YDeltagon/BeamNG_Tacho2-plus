document.getStreams = function () {
  return ['electrics', 'forcedInductionInfo'];
};

let width = 660;
let height = 660;
let pressureTextSize = 50; // in px
let pressureTextCount = 10;
let pressureCurveDashSize1 = 14;
let pressureCurveDashSize2 = 7;
let pressureCurveDashCount = 14;
let pressureNeedleDashSize = 7;
let pressureNeedleDashCount = 9;
let pressureMaxConst = 150;
let pressureMinConst = -100;

let forcedInduction = new BaseForcedInduction(
  width,
  height,
  pressureTextSize,
  pressureTextCount,
  pressureCurveDashSize1,
  pressureCurveDashSize2,
  pressureCurveDashCount,
  pressureNeedleDashSize,
  pressureNeedleDashCount,
  pressureMaxConst,
  pressureMinConst,
  document.getElementById('pressureText'),
  document.getElementById('pressureunit'),
  document.getElementById('pressureCurve_dashes'),
  document.getElementById('pressure_needle_d'),
  document.getElementById('pressure_redline'),
  document.getElementById('pressuretextline'),
  document.getElementById('pressureCurve'),
  document.getElementById('pressureMask'),
  document.getElementById('pressureTrail'),
  document.getElementsByClassName("fi_glow")
);

let controller = new BaseForcedInductionController();

let UiUnitscallback;

let unitPressure = (val) => {
  let convertedVal = UiUnitscallback(val, 'pressure');

  if (forcedInduction.pressureUnitTextElement.textContent !== convertedVal.unit) {
    forcedInduction.pressureUnitTextElement.textContent = convertedVal.unit;
    initialized = false;
  }

  return convertedVal.val;
}

document.wireThroughUnitSystem = (callback) => {
  UiUnitscallback = callback;
}

document.saveData = () => {
  controller.saveData(forcedInduction);
}

document.reset = () => {
  document.saveData();
  forcedInduction.initialized = false;
}

document.update = (streams) => {
  if (!forcedInduction.initialized) {
    controller.init(forcedInduction, streams);
  }
  controller.update(forcedInduction, streams);
}

let switchPressureTrailMode = () => {
  controller.switchPressureTrailMode(forcedInduction);
}

document.isStreamValid = (streams) => {
  return !!streams.forcedInductionInfo;
}
