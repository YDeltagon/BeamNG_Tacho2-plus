'use strict';

class BaseTachometerController {
  constructor() {
    this.data = {}
    this.u1 = 0;
    this.u2 = 0;
  }

  updatehRevTrailModeState(tacho) {
    switch (tacho.revTrailMode) {
      case 1:
        tacho.revTrailOn = true;
        tacho.revNeedleOn = true;
        break;
      case 2:
        tacho.revTrailOn = true;
        tacho.revNeedleOn = false;
        break;
      default:
        tacho.revTrailOn = false;
        tacho.revNeedleOn = true;
        break;
    }
    tacho.revNeedleTrailElement.style['display'] = tacho.revTrailOn ? 'inline' : 'none';
    tacho.revNeedleElement.style['display'] = tacho.revNeedleOn ? 'inline' : 'none';
  }

  updateRedlineModeState(tacho) {
    let upshiftRPM_perc = tacho.longRedlineOn ? this.u2 : this.u1;
    tacho.revRedLineElement.style['stroke-dashoffset'] = -upshiftRPM_perc * tacho.revRedLineLength;
  }

  switchRevTrailMode(tacho) {
    tacho.revTrailMode++;
    if (tacho.revTrailMode > 2) {
      tacho.revTrailMode = 0;
    }
    this.updatehRevTrailModeState(tacho);
  }

  switchRedlineMode(tacho) {
    tacho.longRedlineOn = !tacho.longRedlineOn;
    this.updateRedlineModeState(tacho);
  }

  loadData(tachometer) {
    let tachometerDataJson = localStorage.getItem("tachometerData");
    let tachometerData = JSON.parse(tachometerDataJson);
    if (tachometerData) {
      tachometer.revTrailMode = tachometerData.revTrailMode;
      tachometer.longRedlineOn = tachometerData.longRedlineOn;
    } else {
      tachometer.revTrailMode = 0;
      tachometer.longRedlineOn = false;
    }
    this.updatehRevTrailModeState(tachometer);
    this.updateRedlineModeState(tachometer);
  }

  saveData(tachometer) {
    if (!document.isStreamValid(this.data)) return;
    const tachometerData = { revTrailMode: tachometer.revTrailMode, longRedlineOn: tachometer.longRedlineOn };
    const tachometerDataJson = JSON.stringify(tachometerData);
    localStorage.setItem("tachometerData", tachometerDataJson);
  }

  applyData(tacho) {
    tacho.speedTextElement.textContent = this.data.speedtext;
    if (tacho.speedTextElement.textContent == "-Infinity" || tacho.speedTextElement.textContent == "Infinity") {
      tacho.speedTextElement.textContent = "-";
    };
    tacho.gearTextElement.textContent = this.data.geartext;

    tacho.fuelLevelBarElement.style['stroke-dashoffset'] = (1 - this.data.fuel) * tacho.fuelLevelBarLength;
    tacho.fuelLevelBarDashesElement.style['stroke'] = this.data.fuel < 0.1 ? '#ff8b19' : '#fff';
    tacho.waterTempBarElement.style['stroke-dashoffset'] = (1 + this.data.waterTemp) * tacho.waterTempBarLength;
    tacho.waterTempBarDashesElement.style['stroke'] = this.data.waterTemp > 0.8125 ? '#ff8b19' : '#fff';

    tacho.icoHandBrakeElement.style['visibility'] = this.data.parkingBrake ? 'visible' : 'hidden';
    tacho.icoAbsElement.style['visibility'] = this.data.absWorking ? 'visible' : 'hidden';
    tacho.icoIndicatorLeftElement.style['visibility'] = this.data.signalL ? 'visible' : 'hidden';
    tacho.icoIndicatorRightElement.style['visibility'] = this.data.signalR ? 'visible' : 'hidden';

    if (typeof this.data.lowBeam !== 'undefined' && typeof this.data.highBeam !== 'undefined') {
      for (let _i = 0; _i < tacho.backlightElements.length; _i++) {
        tacho.backlightElements[_i].style['display'] = this.data.tachoGlowDisplayValue;
      }
      tacho.icoLightsLowBeamElement.style['display'] = this.data.lowBeam > 0.9 ? 'inline' : 'none';
      tacho.icoLightsHighBeamElement.style['display'] = this.data.highBeam > 0.9 ? 'inline' : 'none';
    } else {
      for (let _i = 0; _i < tacho.backlightElements.length; _i++) {
        tacho.backlightElements[_i].style['display'] = 'none';
      }
      tacho.icoLightsLowBeamElement.style['display'] = 'none';
      tacho.icoLightsHighBeamElement.style['display'] = 'none';
    }

    tacho.revNeedleElement.setAttribute('transform', 'rotate(' + (
      (this.data.rpm * 270 - 135) < -135 ? -135 :
        (this.data.rpm * 270 - 135) > 135 ? 135 :
          (this.data.rpm * 270 - 135)
    ) + ',' + (tacho.width / 2) + ',' + (tacho.height / 2) + ')');

    tacho.revCurveMaskElement.style['stroke-dashoffset'] = (
      (1 - this.data.rpm) * tacho.revCurveMaskLength < 0 ? 0 :
        (1 - this.data.rpm) * tacho.revCurveMaskLength > tacho.revCurveMaskLength ? tacho.revCurveMaskLength :
          (1 - this.data.rpm) * tacho.revCurveMaskLength
    );

    if (this.data.rawRpm > (this.data.rawRpmMax - (tacho.rpmRange + tacho.rpmOffset))) {
      tacho.gearTextElement.style['fill'] = '#ff4a4a';
      tacho.gearTextBackgroundElement.style['stroke'] = '#ff4a4a';
      if (this.data.rawRpm > (this.data.rawRpmMax - tacho.rpmOffset)) {
        tacho.gearTextBackgroundElement.style['stroke'] = '#ff4a4a';
        if (tacho.callCount > 0 && tacho.callCount <= 2) {
          tacho.gearTextElement.style['fill'] = '#ffffff';
          tacho.gearTextBackgroundElement.style['stroke'] = '#ffffff';
        }
        if (tacho.callCount > 5) {
          tacho.callCount = 0;
        }
        tacho.callCount += 1;
      }
    } else {
      tacho.gearTextElement.style['fill'] = '#ffffff';
      tacho.gearTextBackgroundElement.style['stroke'] = 'none';
    }

      // YDeltagon add
      tacho.airspeedTextElement.textContent = this.data.airspeedtext;
      tacho.maxgearTextElement.textContent = this.data.maxgeartext;
      tacho.powerTextElement.textContent = Math.floor(parseFloat(this.data.powertext));
      tacho.torqueTextElement.textContent = Math.floor(parseFloat(this.data.torquetext));
      tacho.weightTextElement.textContent = Math.floor(parseFloat(this.data.weighttext));
      tacho.oiltempTextElement.textContent = Math.floor(parseFloat(this.data.oiltemptext));
      // tacho.l100kmTextElement.textContent = this.data.l100kmtext;
      // tacho.maxpowerTextElement.textContent = this.data.maxpowertext;
      // tacho.maxtorqueTextElement.textContent = this.data.maxtorquetext;
      tacho.icohasAbsElement.style['visibility'] = this.data.hasABS ? 'visible' : 'hidden';
      ////

  }

  getDashes(dashesLength, dashSize1, dashSize2, dashCount) {
    return (dashesLength - (dashSize1 * (dashCount + 1) * 1.0 / 2 + dashSize2 * (dashCount - 1) * 1.0 / 2)) * 1.0 / (dashCount - 1);
  }

  setLayersVisible(v) {
    document.getElementById('layer3').style['display'] = v ? 'inline' : 'none';
    document.getElementById('layer4').style['display'] = v ? 'inline' : 'none';
    document.getElementById('layer6').style['display'] = v ? 'inline' : 'none';
    document.getElementById('layer7').style['display'] = v ? 'inline' : 'none';
    document.getElementById('layer10').style['display'] = v ? 'inline' : 'none';
    document.getElementById('layer11').style['display'] = v ? 'inline' : 'none';
  }

  init(tacho, streams) {
    if (!document.isStreamValid(streams)) {
      this.setLayersVisible(false);
      tacho.initialized = false;
      return;
    }

    for (let k = 1; k < tacho.rpmTextCount + 1; k++) {
      document.getElementById('rpmtext' + k).style['display'] = 'none';
      document.getElementById('rpmtext' + k).style['font-size'] = tacho.rpmTextSize + 'px';
    }

    this.data.rawRpmMax = streams.engineInfo[1];
    this.data.rpm = 0;
    this.data.rpmMax = Math.round(streams.engineInfo[1] / 1000) * 1000 + 1000;
    this.u1 = (this.data.rawRpmMax / this.data.rpmMax);
    this.u2 = ((Math.floor((this.data.rawRpmMax - 250) / 500) * 500) / (this.data.rpmMax + 250));

    let upShiftRpmPerc = tacho.longRedlineOn ? this.u2 : this.u1;
    if (streams.engineInfo[1] == 0) {
      upShiftRpmPerc = 1;
    }
    let upShiftRpm2Perc = 1;
    tacho.revRedLineElement.style['stroke-dasharray'] = (tacho.revRedLineLength * upShiftRpm2Perc) + ' ' + tacho.revRedLineLength;
    // tacho.revRedLineElement.style['stroke-dashoffset'] = -upShiftRpmPerc * tacho.revRedLineLength;

    let revCurveDashCount = Math.round(this.data.rpmMax / 1000) * 2 + 1;
    if (((revCurveDashCount - 3) / 2) > tacho.rpmTextCount) {
      revCurveDashCount = tacho.rpmTextCount * 2 + 3;
    }
    let revCurveDashes = this.getDashes(tacho.revCurveDashesLength, tacho.revCurveDashSize1, tacho.revCurveDashSize2, revCurveDashCount);
    tacho.revCurveDashesElement.style['stroke-dasharray'] = tacho.revCurveDashSize1 + ' ' + revCurveDashes + ' ' + tacho.revCurveDashSize2 + ' ' + revCurveDashes;

    let revNeedleTrailDashesLength = revCurveDashes * 2 + tacho.revCurveDashSize2;
    let revNeedleTrailDashCount = Math.round(7.0 * tacho.rpmTextCount / revCurveDashCount) * 2 - 1;
    let revNeedleTrailDashes = (revNeedleTrailDashesLength - tacho.revNeedleTrailDashSize * revNeedleTrailDashCount) / (revNeedleTrailDashCount + 1);
    let revNeedleTrailDashOffset = revNeedleTrailDashes + tacho.revCurveDashSize1;
    revNeedleTrailDashes = ' ' + tacho.revNeedleTrailDashSize + ' ' + revNeedleTrailDashes;
    revNeedleTrailDashes = revNeedleTrailDashes.repeat(revNeedleTrailDashCount);
    tacho.revCurveElement.style['stroke-dasharray'] = '0 ' + revNeedleTrailDashOffset + revNeedleTrailDashes;

    tacho.revCurveMaskElement.style['stroke-dasharray'] = tacho.revCurveMaskLength + ' ' + tacho.revCurveMaskLength;

    let barDashes = this.getDashes(tacho.waterTempBarDashesLength, tacho.barDashSize1, tacho.barDashSize2, tacho.barDashCount);
    tacho.waterTempBarDashesElement.style['stroke-dasharray'] = tacho.barDashSize1 + ' ' + barDashes + ' ' + tacho.barDashSize2 + ' ' + barDashes;
    tacho.fuelLevelBarDashesElement.style['stroke-dasharray'] = tacho.barDashSize1 + ' ' + barDashes + ' ' + tacho.barDashSize2 + ' ' + barDashes;

    let n = (revCurveDashCount - 1) / 2;
    let rpmSlice = this.data.rpmMax / n / 1000;
    for (let k = 1; k < n; k++) {
      let t = Math.round(rpmSlice * k * 10) / 10;
      let pos = tacho.revTextGuideLineElement.getPointAtLength(tacho.revTextGuideLineLength * (k / n));
      let rp = document.getElementById('rpmtext' + (k) + 'p');
      let cx = rp.getAttribute('x');
      let cy = rp.getAttribute('y');
      rp.setAttribute('transform', 'translate(' + (pos.x - cx) + ',' + (pos.y - cy + (tacho.rpmTextSize / 2)) + ')');
      document.getElementById('rpmtext' + (k)).textContent = t;
      document.getElementById('rpmtext' + (k)).style['display'] = 'inline';
    }

    tacho.fuelLevelBarElement.style['stroke-dasharray'] = tacho.fuelLevelBarLength + ' ' + tacho.fuelLevelBarLength;
    tacho.waterTempBarElement.style['stroke-dasharray'] = tacho.waterTempBarLength + ' ' + tacho.waterTempBarLength;

    tacho.initialized = true;
    this.applyData(tacho, this.data);
    this.loadData(tacho);
    this.setLayersVisible(true);
  }

  update(tacho, streams) {
    if (streams.electrics.wheelspeed) {
      this.data.speedtext = unitSpeed(streams.electrics.wheelspeed);

      // YDeltagon add
      this.data.airspeedtext = unitSpeed(streams.electrics.airspeed);
      ////

    } else if (streams.electrics.airspeed) {
      this.data.speedtext = unitSpeed(streams.electrics.airspeed);

      // YDeltagon add
      this.data.airspeedtext = unitSpeed(streams.electrics.airspeed);
      ////

    }

    if (streams.engineInfo[13] == "manual") {
      this.data.geartext = streams.engineInfo[5].toString();

      // YDeltagon add
      this.data.maxgeartext = streams.engineInfo[6];
      ////

      if (streams.engineInfo[5] == 0) this.data.geartext = 'N';
      else if (streams.engineInfo[5] == -1) this.data.geartext = 'R';
      else if (-streams.engineInfo[5] > 1) this.data.geartext = 'R' + (-streams.engineInfo[5]);
    } else {
      this.data.geartext = ["P", "R", "N", "D", "2", "1"][Math.round(streams.electrics.gear_A * 5)];
    }

    this.data.fuel = streams.engineInfo[11] / streams.engineInfo[12];
    this.data.waterTemp =
      (streams.electrics.watertemp - 50) / 80 < 0 ? 0 :
        (streams.electrics.watertemp - 50) / 80 > 1 ? 1 :
          (streams.electrics.watertemp - 50) / 80;
    this.data.parkingBrake = streams.electrics.parkingbrake;
    this.data.absWorking = streams.electrics.abs;
    this.data.signalL = streams.electrics.signal_L;
    this.data.signalR = streams.electrics.signal_R;
    this.data.lowBeam = streams.electrics.lowbeam;
    this.data.highBeam = streams.electrics.highbeam;
    this.data.tachoGlowDisplayValue = streams.electrics.lowbeam > 0.9 || streams.electrics.highbeam > 0.9 ? 'inline' : 'none';
    this.data.rpm = (streams.electrics.rpmTacho || 0.0) / this.data.rpmMax;
    this.data.rawRpm = streams.electrics.rpmTacho;
    this.data.rawRpmMax = streams.engineInfo[1];

    // YDeltagon add
    this.data.powertext = (streams.engineInfo[21]* 0.986);
    this.data.torquetext = streams.engineInfo[8];
    this.data.weighttext = streams.stats.total_weight;
    this.data.oiltemptext = streams.electrics.oiltemp;
    // this.data.l100kmtext = "3";
    // this.data.maxpowertext = "10";
    // this.data.maxtorquetext = "10";
    this.data.hasABS = streams.electrics.hasABS;
    ////

    this.data.electrics = streams.electrics;
    this.data.engineInfo = streams.engineInfo;
    
    // YDeltagon add
    this.data.stats = streams.stats;
    ////

    this.applyData(tacho, this.data);
  }
}

class TachometerV2Controller extends BaseTachometerController {
  constructor() {
    super();
  }
}

class TachometerController extends BaseTachometerController {
  constructor() {
    super();
  }

  applyData(tacho) {
    super.applyData(tacho);

    tacho.fuelLevelBarElement.style['stroke-dashoffset'] = (1 - this.data.fuel) * tacho.fuelLevelBarLength;
    tacho.fuelLevelBarDashesElement.style['stroke'] = '#fff';
    tacho.waterTempBarElement.style['stroke-dashoffset'] = (1 - this.data.waterTemp) * tacho.waterTempBarLength;
    tacho.waterTempBarDashesElement.style['stroke'] = '#fff';

    tacho.revNeedleElement.setAttribute('transform', 'rotate(' + (
      (this.data.rpm * 270 - 180) < -180 ? -180 :
        (this.data.rpm * 270 - 180) > 90 ? 90 :
          (this.data.rpm * 270 - 180)
    ) + ',' + (tacho.width / 2) + ',' + (tacho.height / 2) + ')');
  }
}

class BaseForcedInductionController {
  constructor() {
    this.data = {}
  }

  updatePressureTrailModeState(forcedInduction) {
    switch (forcedInduction.pressureMode) {
      case 1:
        forcedInduction.pressureTrailOn = true;
        forcedInduction.pressureNeedleOn = true;
        break;
      case 2:
        forcedInduction.pressureTrailOn = true;
        forcedInduction.pressureNeedleOn = false;
        break;
      default:
        forcedInduction.pressureTrailOn = false;
        forcedInduction.pressureNeedleOn = true;
        break;
    }
    forcedInduction.pressureNeedleTrailElement.style['display'] = forcedInduction.pressureTrailOn ? 'inline' : 'none';
    forcedInduction.pressureNeedleElement.style['display'] = forcedInduction.pressureNeedleOn ? 'inline' : 'none';
  }

  switchPressureTrailMode(forcedInduction) {
    forcedInduction.pressureMode++;
    if (forcedInduction.pressureMode > 2) {
      forcedInduction.pressureMode = 0;
    }
    this.updatePressureTrailModeState(forcedInduction);
  }

  loadData(forcedInduction) {
    let forcedInductionDataJson = localStorage.getItem("forcedInductionData");
    let forcedInductionData = JSON.parse(forcedInductionDataJson);
    if (forcedInductionData) {
      forcedInduction.pressureMode = forcedInductionData.pressureMode;
    } else {
      forcedInduction.pressureMode = 0;
    }
    this.updatePressureTrailModeState(forcedInduction);
  }

  saveData(forcedInduction) {
    if (!document.isStreamValid(this.data)) return;
    const forcedInductionData = { pressureMode: forcedInduction.pressureMode };
    const forcedInductionDataJson = JSON.stringify(forcedInductionData);
    localStorage.setItem("forcedInductionData", forcedInductionDataJson);

  }

  applyData(forcedInduction) {
    forcedInduction.pressureTextElement.textContent = document.roundDec(unitPressure(this.data.boost), 1);

    for (let _i = 0; _i < forcedInduction.backlightElements.length; _i++) {
      forcedInduction.backlightElements[_i].style['display'] = this.data.forcedInductionGlowDisplayValue;
    }

    forcedInduction.pressureNeedleElement.setAttribute('transform', 'rotate(' + ((
      (unitPressure(this.data.boost) - this.data.pressureMin) / (this.data.pressureMax - this.data.pressureMin) < 0 ? 0 :
        (unitPressure(this.data.boost) - this.data.pressureMin) / (this.data.pressureMax - this.data.pressureMin) > 1 ? 1 :
          (unitPressure(this.data.boost) - this.data.pressureMin) / (this.data.pressureMax - this.data.pressureMin)
    ) * 270 - 135) + ',' + (width / 2) + ',' + (height / 2) + ')');

    forcedInduction.pressureCurveMaskElement.style['stroke-dashoffset'] = forcedInduction.pressureCurveMaskLength - (forcedInduction.pressureCurveMaskLength * (
      (unitPressure(this.data.boost) - this.data.pressureMin) / (this.data.pressureMax - this.data.pressureMin) < 0 ? 0 :
        (unitPressure(this.data.boost) - this.data.pressureMin) / (this.data.pressureMax - this.data.pressureMin) > 1 ? 1 :
          (unitPressure(this.data.boost) - this.data.pressureMin) / (this.data.pressureMax - this.data.pressureMin)
    ));
  }

  getDashes(dashesLength, dashSize1, dashSize2, dashCount) {
    return (dashesLength - (dashSize1 * (dashCount + 1) * 1.0 / 2 + dashSize2 * (dashCount - 1) * 1.0 / 2)) * 1.0 / (dashCount - 1);
  }

  init(forcedInduction, streams) {
    for (let k = 1; k < pressureTextCount; k++) {
      document.getElementById('pressuretext' + k).style['font-size'] = forcedInduction.pressureTextSize + 'px';
      document.getElementById('pressuretext' + k).style['visibility'] = 'hidden';
    }
    forcedInduction.pressureTextGuideLineElement.style['display'] = 'none';

    this.data.pressureMax = Math.ceil(unitPressure(Math.max(forcedInduction.pressureMaxConst, streams.forcedInductionInfo.maxBoost)));
    this.data.pressureMin = Math.floor(unitPressure(forcedInduction.pressureMinConst));
    this.data.boost = 0;
    this.data.forcedInductionGlowDisplayValue = streams.electrics.lowbeam > 0.9 || streams.electrics.highbeam > 0.9 ? 'inline' : 'none';

    forcedInduction.pressureRedLineElement.style['stroke-dasharray'] = forcedInduction.pressureRedLineLength + ' ' + forcedInduction.pressureRedLineLength;
    forcedInduction.pressureRedLineElement.style['stroke-dashoffset'] = -0.8 * forcedInduction.pressureRedLineLength;

    let pressureCurveDashes = this.getDashes(forcedInduction.pressureCurveDashesLength, forcedInduction.pressureCurveDashSize1, forcedInduction.pressureCurveDashSize2, forcedInduction.pressureCurveDashCount - 1);
    forcedInduction.pressureCurveDashesElement.style['stroke-dasharray'] = forcedInduction.pressureCurveDashSize1 + ' ' + pressureCurveDashes + ' ' + forcedInduction.pressureCurveDashSize2 + ' ' + pressureCurveDashes;

    let pressureNeedleTrailDashesLength = pressureCurveDashes * 2 + forcedInduction.pressureCurveDashSize2;
    let pressureNeedleTrailDashes = (pressureNeedleTrailDashesLength - forcedInduction.pressureNeedleTrailDashSize * forcedInduction.pressureNeedleTrailDashCount) / (forcedInduction.pressureNeedleTrailDashCount + 1);
    let pressureNeedleTrailDashOffset = pressureNeedleTrailDashes + forcedInduction.pressureCurveDashSize1;
    pressureNeedleTrailDashes = ' ' + forcedInduction.pressureNeedleTrailDashSize + ' ' + pressureNeedleTrailDashes;
    pressureNeedleTrailDashes = pressureNeedleTrailDashes.repeat(forcedInduction.pressureNeedleTrailDashCount);
    forcedInduction.pressureCurveElement.style['stroke-dasharray'] = '0 ' + pressureNeedleTrailDashOffset + pressureNeedleTrailDashes;

    forcedInduction.pressureCurveMaskElement.style['stroke-dasharray'] = forcedInduction.pressureCurveMaskLength + ' ' + forcedInduction.pressureCurveMaskLength;

    let n = forcedInduction.pressureCurveDashCount / 2;
    for (let k = 0; k < n; k++) {
      let pos = forcedInduction.pressureTextGuideLineElement.getPointAtLength(forcedInduction.pressureTextGuideLineLength * (k / (n - 1)));
      let rp = document.getElementById('pressuretext' + (k + 1) + 'p');
      let cx = rp.getAttribute('x');
      let cy = rp.getAttribute('y');
      rp.setAttribute('transform', 'translate(' + (pos.x - cx) + ',' + (pos.y - cy) + ')');
      document.getElementById('pressuretext' + (k + 1)).textContent = document.roundDec(k * ((this.data.pressureMax - this.data.pressureMin) / (n - 1)) + this.data.pressureMin, (this.data.pressureMax > 10 ? 0 : 1));
      document.getElementById('pressuretext' + (k + 1)).style['visibility'] = 'visible';
    }

    forcedInduction.initialized = true;
    this.applyData(forcedInduction);
    this.loadData(forcedInduction);
  }

  update(forcedInduction, streams) {
    this.data.forcedInductionInfo = streams.forcedInductionInfo;
    this.data.boost = streams.forcedInductionInfo.boost;
    this.data.forcedInductionGlowDisplayValue = streams.electrics.lowbeam > 0.9 || streams.electrics.highbeam > 0.9 ? 'inline' : 'none';
    this.applyData(forcedInduction);
  }
}
