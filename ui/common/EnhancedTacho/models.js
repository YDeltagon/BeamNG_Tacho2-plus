'use strict';

class BaseTachometer {
  constructor(
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
    speedTextElement,
    revCurveDashesElement,
    revNeedleElement,
    revRedLineElement,
    revTextGuideLineElement,
    gearTextElement,
    gearTextBackgroundElement,
    revCurveElement,
    revCurveMaskElement,
    revNeedleTrailElement,
    waterTempBarElement,
    waterTempBarDashesElement,
    fuelLevelBarElement,
    fuelLevelBarDashesElement,
    icoHandBrakeElement,
    icoAbsElement,
    icoIndicatorLeftElement,
    icoIndicatorRightElement,
    icoLightsLowBeamElement,
    icoLightsHighBeamElement,

    // YDeltagon add
    airspeedTextElement,
    maxgearTextElement,
    weightTextElement,
    oiltempTextElement,
    odomtempTextElement,
    icohasAbsElement,
    ////

    backlightElements
    // clickableAreaElements
  ) {
    this.initialized = false;
    this.revTrailMode = 0;
    this.revTrailOn = false;
    this.revNeedleOn = true;
    this.longRedlineOn = false;
    this.callCount = 0;

    this.width = width;
    this.height = height;
    this.rpmTextSize = rpmTextSize;
    this.rpmTextCount = rpmTextCount;
    this.rpmOffset = rpmOffset;
    this.rpmRange = rpmRange;
    this.barDashCount = barDashCount;
    this.barDashSize1 = barDashSize1;
    this.barDashSize2 = barDashSize2;
    this.revNeedleTrailDashSize = revNeedleTrailDashSize;
    this.revCurveDashSize1 = revCurveDashSize1;
    this.revCurveDashSize2 = revCurveDashSize2;

    this.speedTextElement = speedTextElement;

    this.revCurveDashesElement = revCurveDashesElement;
    this.revNeedleElement = revNeedleElement;
    this.revRedLineElement = revRedLineElement;
    this.revTextGuideLineElement = revTextGuideLineElement;

    this.gearTextElement = gearTextElement;
    this.gearTextBackgroundElement = gearTextBackgroundElement;

    this.revCurveElement = revCurveElement;
    this.revCurveMaskElement = revCurveMaskElement;
    this.revNeedleTrailElement = revNeedleTrailElement;

    this.waterTempBarElement = waterTempBarElement;
    this.waterTempBarDashesElement = waterTempBarDashesElement;
    this.fuelLevelBarElement = fuelLevelBarElement;
    this.fuelLevelBarDashesElement = fuelLevelBarDashesElement;

    this.icoHandBrakeElement = icoHandBrakeElement;
    this.icoAbsElement = icoAbsElement;
    this.icoIndicatorLeftElement = icoIndicatorLeftElement;
    this.icoIndicatorRightElement = icoIndicatorRightElement;
    this.icoLightsLowBeamElement = icoLightsLowBeamElement;
    this.icoLightsHighBeamElement = icoLightsHighBeamElement;

    // YDeltagon add
    this.airspeedTextElement = airspeedTextElement;
    this.maxgearTextElement = maxgearTextElement;
    this.weightTextElement = weightTextElement;
    this.oiltempTextElement = oiltempTextElement;
    this.odomtempTextElement = odomtempTextElement;
    this.icohasAbsElement = icohasAbsElement;
    ////

    this.backlightElements = backlightElements;
    // this.clickableAreaElements = clickableAreaElements;

    this.revCurveLength = revCurveElement.getTotalLength();
    this.revCurveMaskLength = revCurveMaskElement.getTotalLength();
    this.waterTempBarLength = waterTempBarElement.getTotalLength();
    this.waterTempBarDashesLength = waterTempBarDashesElement.getTotalLength();
    this.fuelLevelBarLength = fuelLevelBarElement.getTotalLength();
    this.fuelLevelBarDashesLength = fuelLevelBarDashesElement.getTotalLength();
    this.revCurveDashesLength = revCurveDashesElement.getTotalLength();
    this.revRedLineLength = revRedLineElement.getTotalLength();
    this.revTextGuideLineLength = revTextGuideLineElement.getTotalLength();
  }
}

class TachometerV2 extends BaseTachometer {
  constructor(
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
    speedTextElement,
    revCurveDashesElement,
    revNeedleElement,
    revRedLineElement,
    revTextGuideLineElement,
    gearTextElement,
    gearTextBackgroundElement,
    revCurveElement,
    revCurveMaskElement,
    revNeedleTrailElement,
    waterTempBarElement,
    waterTempBarDashesElement,
    fuelLevelBarElement,
    fuelLevelBarDashesElement,
    icoHandBrakeElement,
    icoAbsElement,
    icoIndicatorLeftElement,
    icoIndicatorRightElement,
    icoLightsLowBeamElement,
    icoLightsHighBeamElement,
    
      // YDeltagon add
      airspeedTextElement,
      maxgearTextElement,
      weightTextElement,
      oiltempTextElement,
      odomtempTextElement,
      icohasAbsElement,
      ////

    backlightElements
    // clickableAreaElements
  ) {
    super(
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
      speedTextElement,
      revCurveDashesElement,
      revNeedleElement,
      revRedLineElement,
      revTextGuideLineElement,
      gearTextElement,
      gearTextBackgroundElement,
      revCurveElement,
      revCurveMaskElement,
      revNeedleTrailElement,
      waterTempBarElement,
      waterTempBarDashesElement,
      fuelLevelBarElement,
      fuelLevelBarDashesElement,
      icoHandBrakeElement,
      icoAbsElement,
      icoIndicatorLeftElement,
      icoIndicatorRightElement,
      icoLightsLowBeamElement,
      icoLightsHighBeamElement,

      // YDeltagon add
      airspeedTextElement,
      maxgearTextElement,
      weightTextElement,
      oiltempTextElement,
      odomtempTextElement,
      icohasAbsElement,
      ////

      backlightElements
      // clickableAreaElements
    );
  }
}

class BaseForcedInduction {
  constructor(
    width,
    height,
    pressureTextSize,
    pressureTextCount,
    pressureCurveDashSize1,
    pressureCurveDashSize2,
    pressureCurveDashCount,
    pressureNeedleTrailDashSize,
    pressureNeedleTrailDashCount,
    pressureMaxConst,
    pressureMinConst,
    pressureTextElement,
    pressureUnitTextElement,
    pressureCurveDashesElement,
    pressureNeedleElement,
    pressureRedLineElement,
    pressureTextGuideLineElement,
    pressureCurveElement,
    pressureCurveMaskElement,
    pressureNeedleTrailElement,
    backlightElements,
    // clickableAreaElements
  ) {
    this.initialized = false;
    this.pressureMode = 0;
    this.pressureTrailOn = false;
    this.pressureNeedlelOn = true;

    this.width = width;
    this.height = height;
    this.pressureTextSize = pressureTextSize;
    this.pressureTextCount = pressureTextCount;
    this.pressureCurveDashSize1 = pressureCurveDashSize1;
    this.pressureCurveDashSize2 = pressureCurveDashSize2;
    this.pressureCurveDashCount = pressureCurveDashCount;
    this.pressureNeedleTrailDashSize = pressureNeedleTrailDashSize;
    this.pressureNeedleTrailDashCount = pressureNeedleTrailDashCount;
    this.pressureMaxConst = pressureMaxConst;
    this.pressureMinConst = pressureMinConst;

    this.pressureTextElement = pressureTextElement;
    this.pressureUnitTextElement = pressureUnitTextElement;

    this.pressureCurveDashesElement = pressureCurveDashesElement;
    this.pressureNeedleElement = pressureNeedleElement;
    this.pressureRedLineElement = pressureRedLineElement;
    this.pressureTextGuideLineElement = pressureTextGuideLineElement;

    this.pressureCurveElement = pressureCurveElement;
    this.pressureCurveMaskElement = pressureCurveMaskElement;
    this.pressureNeedleTrailElement = pressureNeedleTrailElement;

    this.backlightElements = backlightElements;
    // this.clickableAreaElements = clickableAreaElements;

    this.pressureCurveDashesLength = pressureCurveDashesElement.getTotalLength();
    this.pressureRedLineLength = pressureRedLineElement.getTotalLength();
    this.pressureTextGuideLineLength = pressureTextGuideLineElement.getTotalLength();

    this.pressureCurveLength = pressureCurveElement.getTotalLength();
    this.pressureCurveMaskLength = pressureCurveMaskElement.getTotalLength();
  }
}
