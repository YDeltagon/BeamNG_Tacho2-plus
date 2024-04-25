'use strict';

document.getStreams = function () {
    return ['electrics', 'engineInfo', 'stats'];
  };
  
  // var
  var width  = 660;
  var height = 660;
  var initialized = false;
  var rpm_redline_len = 0;
  var dashSize = 5;
  
  
  // elements
  // oil temp
  var oilTempBar = document.getElementById('temp');
  var oilTempBarLen = oilTempBar.getTotalLength();
  oilTempBar.style['stroke-dasharray'] = oilTempBarLen + ' ' + oilTempBarLen;
  var oilTempIcoOff = document.getElementById('ico_temp');
  var oilTempIcoOn = document.getElementById('ico_temp_on');
  
  // speed and airspeed
  var speedText = document.getElementById('tacho2speed');
  var airspeedText = document.getElementById('tacho2airspeed');
  
  // gear and maxgear
  var gearText = document.getElementById('tacho2gear');
  var maxgearText = document.getElementById('tacho2maxgear');
  
  // HorsePower - Torque - Weight - Odo
  var powerrtText = document.getElementById('tacho2power');
  var torquertText = document.getElementById('tacho2torque');
  var weightText = document.getElementById('tacho2weight');
  var odomText = document.getElementById('tacho2odom');
  
  // oiltemp
  var oiltempText = document.getElementById('tacho2oiltemp');
  
  // revcurve
  var revCurve = document.getElementById('revcurve');
  var revCurveLen = revCurve.getTotalLength();
  revCurve.style['stroke-dasharray'] = revCurveLen + ' ' + revCurveLen;
  
  // revcurve dashes
  var revCurveDashes = document.getElementById('revcurve_dashes');
  var revCurveDashesLen = revCurveDashes.getTotalLength();
  
  // fuel
  var fuelBar = document.getElementById('fuel');
  var fuelBarLen = fuelBar.getTotalLength();
  fuelBar.style['stroke-dasharray'] = fuelBarLen + ' ' + fuelBarLen;
  var fuelWarnIcoOff = document.getElementById('ico_fuel');
  var fuelWarnIcoOn = document.getElementById('ico_fuel_on');
  
  // redline
  var redLine = document.getElementById('rpm_redline');
  var redLineLen = redLine.getTotalLength();
  
  // rpmTextGuideLine -- a helping line to position the text
  var rpmTextGuideLine = document.getElementById('rpmtextline');
  var rpmTextGuideLineLen = rpmTextGuideLine.getTotalLength();
  rpmTextGuideLine.style['display'] = 'none';
  
  // the rpm text
  var rpmTextSize = 50; // in px
  var maxRpmTexts = 13;
  
  // setup + hide all
  for (var k = 1; k < maxRpmTexts; k++) {
    document.getElementById('rpmtext' + k).style['visibility'] = 'hidden';
    document.getElementById('rpmtext' + k).style['font-size'] = rpmTextSize + 'px';
  }
  var rpm_max = 8000;
  //maxRpmTexts = 3; // this can artifically limit the number of rpm splits
  
  // revneedle
  var revNeedle = document.getElementById('revneedle');
  
  // Icons
  var icoHandBrakeOff = document.getElementById('ico_handbrake');
  var icoHandBrakeOn = document.getElementById('ico_handbrake_on');
  var icoABSOff = document.getElementById('ico_abs');
  var icoABSOn = document.getElementById('ico_abs_on');
  var hasABS = document.getElementById('hasABS');
  var icoIndicatorLeftOff = document.getElementById('ico_indicatorl');
  var icoIndicatorLeftOn = document.getElementById('ico_indicatorl_on');
  var icoIndicatorRightOff = document.getElementById('ico_indicatorr');
  var icoIndicatorRightOn = document.getElementById('ico_indicatorr_on');
  var icoLightsOff = document.getElementById('ico_lights');
  var icoLightsOn = document.getElementById('ico_lights_on');
  var icoLightsHigh = document.getElementById('ico_lights_high');
  var speedUnitText = document.getElementById('speedunit');
  
  var testVar = 0; // for the test mode
  var displayMode = 2;
  
  function applyData(data) {
    // speed and airspeed
    speedText.textContent = data.speedtext;
    if (speedText.textContent == "-Infinity" || speedText.textContent == "Infinity") { speedText.textContent = "-" };
    airspeedText.textContent = data.airspeedtext;
    
    // gear and maxgear
    gearText.textContent = data.geartext;
    maxgearText.textContent = data.maxgeartext;
    
    // weight
    weightText.textContent = Math.floor(parseFloat(data.weighttext));

    // odom
    odomText.textContent = (parseFloat(data.odomtext) / 1000).toFixed(1);
    
    
    // Power and Torque RealTime
    powerrtText.textContent = Math.floor(parseFloat(data.powerrttext));
    torquertText.textContent = Math.floor(parseFloat(data.torquerttext));
    
    // oiltemp
    oiltempText.textContent = Math.floor(parseFloat(data.oiltemptext));
    
    // fuel
    fuelBar.style['stroke-dashoffset'] = (1 - data.fuel) * fuelBarLen;
    var fuelLow = data.fuel < 0.1;
    fuelWarnIcoOff.style['visibility'] = fuelLow ? 'hidden' : 'visible';
    fuelWarnIcoOn.style['visibility'] = fuelLow ? 'visible' : 'hidden';
  
    icoHandBrakeOff.style['visibility'] = data.parkingBrake ? 'hidden' : 'visible';
    icoHandBrakeOn.style['visibility'] = data.parkingBrake ? 'visible' : 'hidden';
  
    icoABSOff.style['visibility'] = data.absWorking ? 'hidden' : 'visible';
    icoABSOn.style['visibility'] = data.absWorking ? 'visible' : 'hidden';
    // hasABS
    hasABS.style['visibility'] = data.hasABS ? 'visible' : 'hidden';
  
    icoIndicatorLeftOff.style['visibility'] = data.signalL ? 'hidden' : 'visible';
    icoIndicatorLeftOn.style['visibility'] = data.signalL ? 'visible' : 'hidden';
  
    icoIndicatorRightOff.style['visibility'] = data.signalR ? 'hidden' : 'visible';
    icoIndicatorRightOn.style['visibility'] = data.signalR ? 'visible' : 'hidden';
  
    var tempNormalized = Math.max(Math.min((data.waterTemp - 50) / 80, 1), 0)
    oilTempBar.style['stroke-dashoffset'] = (1 + tempNormalized) * oilTempBarLen;
    var oilTemp_warn = tempNormalized > 0.8125;
    oilTempIcoOff.style['visibility'] = oilTemp_warn ? 'hidden' : 'visible';
    oilTempIcoOn.style['visibility'] = oilTemp_warn ? 'visible' : 'hidden';
  
    // some temp fix for the lights logic
    if(typeof data.lowBeam !== 'undefined' && typeof data.highBeam !== 'undefined') {
      var nb = true;
      var lb = (data.lowBeam > 0.9);
      var hb = (data.highBeam > 0.9);
      if(lb) {nb = false;}
      if(hb) {nb = false;}
  
      icoLightsOff.style['visibility'] = nb ? 'visible' : 'hidden';
      icoLightsOn.style['visibility'] = lb ? 'visible' : 'hidden';
      icoLightsHigh.style['visibility'] = hb ? 'visible' : 'hidden';
    } else {
      icoLightsOff.style['visibility'] = 'hidden';
      icoLightsOn.style['visibility'] = 'hidden';
      icoLightsHigh.style['visibility'] = 'hidden';
    }
  
    var rpm_rotation = data.rpm * 270 - 180;
    if (rpm_rotation < -180) {
      rpm_rotation = -180;
    }
    if (rpm_rotation > 90) {
      rpm_rotation = 90;
    }
    revNeedle.setAttribute('transform','rotate(' + rpm_rotation + ',' + (width / 2) + ',' + (height / 2) + ')');
  
    var revCurveOffset = (1 - data.rpm) * revCurveLen;
    if (revCurveOffset < 0) {
      revCurveOffset = 0;
    }
    if (revCurveOffset > revCurveLen) {
      revCurveOffset = revCurveLen;
    }
    revCurve.style['stroke-dashoffset'] = revCurveOffset;
  };
  
  var data = {}; // local data to display, do not use by direct access, pass it to functions
  
  var layersVisible = false;
  document.setlayersVisible = function(v) {
    if(layersVisible != v) {
      var val = v ? 'inline' : 'none';
      document.getElementById('layer3').style['display'] = val;
      document.getElementById('layer4').style['display'] = val;
      document.getElementById('layer6').style['display'] = val;
      document.getElementById('layer7').style['display'] = val;
      document.getElementById('layer10').style['display'] = val;
      document.getElementById('layer11').style['display'] = val;
      document.getElementById('layer12').style['display'] = val;
      layersVisible = v;
    }
  }
  
  document.reset = function () {
    document.setlayersVisible(false);
    initialized = 0;
    for(var k = 1 ; k < maxRpmTexts + 1; k++) {
      document.getElementById('rpmtext' + (k + 1)).style['visibility'] = 'hidden';
    }
  };
  
  document.update = function (streams) {
    var isStreamValid = streams.engineInfo && streams.engineInfo[1] !== undefined && streams.engineInfo[1] !== 0 && streams.electrics;
  
    //console.log(streams);
    if(!initialized) {
      document.reset();
      if( isStreamValid ) {
        rpm_max = Math.round(streams.engineInfo[1] / 1000) * 1000 + 1000; // we round up to the nearest 1000
  
        // things that need to do once (and depending on the vehicle attributes)
        var upshiftRPM_perc = (streams.engineInfo[1] / rpm_max);
        if (streams.engineInfo[1] == 0)
          upshiftRPM_perc = 1
  
        // always draw the full gauge no matter what
        var upshiftRPM2_perc = 1; //((streams.engineInfo[1] - streams.engineInfo[2]) / rpm_max);
  
        redLine.style['stroke-dasharray'] = (redLineLen * upshiftRPM2_perc) + ' ' + redLineLen;
        redLine.style['stroke-dashoffset'] = -upshiftRPM_perc * redLineLen;
  
        var dashCount = Math.round(rpm_max / 1000) - 1;
        if(dashCount > maxRpmTexts) { dashCount = maxRpmTexts; }
  
        var dashes = (revCurveDashesLen - dashSize * dashCount) / (dashCount + 1);
        revCurveDashes.style['stroke-dasharray'] = dashSize + ' ' + dashes;
        revCurveDashes.style['stroke-dashoffset'] = dashSize;
  
        // setup and move the rpm gauge text
        var rpmSlice = rpm_max / (dashCount + 1) / 1000;
        var lastT = 0;
        for(var k = 1 ; k < dashCount + 1; k++) {
          var t = Math.round(rpmSlice * k * 10) / 10;
          var pos = rpmTextGuideLine.getPointAtLength(rpmTextGuideLineLen * (k / (dashCount + 1)));
          var rp = document.getElementById('rpmtext' + (k + 1) + 'p');
          var cx = rp.getAttribute('x');
          var cy = rp.getAttribute('y');
          rp.setAttribute('transform','translate(' + (pos.x - cx) + ',' + (pos.y - cy + (rpmTextSize / 2)) + ')');
          document.getElementById('rpmtext' + (k + 1)).textContent = t;
          document.getElementById('rpmtext' + (k + 1)).style['visibility'] = 'visible';
        }
  
        //console.log(streams);
        initialized = true;
      }
    }
  
    if(!isStreamValid) {
      return false;
    }
  
    document.setlayersVisible(true);
  
    if (displayMode == 2) {
      // real data mode, no animation
      if(streams.electrics.wheelspeed) {
        data.airspeedtext = UnitSpeed(streams.electrics.airspeed);
        data.speedtext = UnitSpeed(streams.electrics.wheelspeed);
        if (streams.electrics.wheelspeed > 9000) {
          speedUnitText.textContent = 'brrrr';
        }
      } else if (streams.electrics.airspeed) {
        data.airspeedtext = UnitSpeed(streams.electrics.airspeed);
        data.speedtext = UnitSpeed(streams.electrics.airspeed);
      }
      (function () {
        if(streams.engineInfo[13] == "manual") {
          var gear = streams.engineInfo[5];
          var gearStr = gear.toString();
          var maxFGears = streams.engineInfo[6];
          data.maxgeartext = "/" + maxFGears;
          if(gear == 0) gearStr = 'N';
          else if(gear == -1) gearStr = 'R';
          else if(-gear > 1) gearStr = 'R' + (-gear);
  
          data.geartext = gearStr;
        } else {
          data.geartext = ["P","R","N","D","2","1"][Math.round(streams.electrics.gear_A*5)];
        }
      })();
  
      data.powerrttext = streams.engineInfo[21];
      data.torquerttext = streams.engineInfo[8];
      data.weighttext = streams.stats.total_weight;
      data.odomtext = streams.electrics.odometer;
      data.oiltemptext = streams.electrics.oiltemp;
      data.fuel = streams.engineInfo[11] / streams.engineInfo[12];
      data.parkingBrake = streams.electrics.parkingbrake;
      data.absWorking = streams.electrics.abs;
      data.hasABS = streams.electrics.hasABS;
      data.signalL = streams.electrics.signal_L;
      data.signalR = streams.electrics.signal_R;
      data.waterTemp = streams.electrics.watertemp;
      data.lowBeam = streams.electrics.lowbeam;
      data.highBeam = streams.electrics.highbeam;
      data.rpm = (streams.electrics.rpmTacho || 0.0) / rpm_max;
  
    } else if (displayMode == 0) {
      // starting animation
      testVar = testVar + 0.04;
      if(testVar > 1) testVar = 1;
      data.speedtext = Math.round(testVar * 100) ;
      data.airspeedtext = Math.round(testVar * 100) ;
      data.geartext = Math.round(testVar * 5);
      data.fuel = testVar;
      var boolTest = true;  //Math.round(testVar * 10) % 10;
      data.parkingBrake = boolTest;
      data.absWorking = boolTest;
      data.signalL = boolTest;
      data.signalR = boolTest;
      data.oilTemp = testVar;
      data.lowBeam = boolTest;
      data.highBeam = !boolTest;
      data.rpm = testVar;
      if(testVar >= 1) {
        testVar = 0;
        displayMode = 1;
      }
  
    } else if (displayMode == 1) {
      // starting animation -> real data transition
  
      if(streams.electrics.wheelspeed) {
        data.speedtext = UnitSpeed(streams.electrics.wheelspeed);
        data.airspeedtext = UnitSpeed(streams.electrics.airspeed);
      } else {
        data.speedtext = '';
        data.airspeedtext = '';
        speedUnitText.textContent = '';
      }
  
      (function () {
        var gear = streams.engineInfo[5];
        var gearStr = gear.toString();
        var maxFGears = streams.engineInfo[6];
        data.maxgeartext = "/" + maxFGears;
        if(gear == 0) {
          gearStr = 'N';
        }
        else if(gear == -1) {
          gearStr = 'R';
        }
        data.geartext = gearStr;
      })();
  
      data.parkingBrake = streams.electrics.parkingbrake;
      data.absWorking = streams.electrics.abs;
      data.signalL = streams.electrics.signal_L;
      data.signalR = streams.electrics.signal_R;
      data.lowBeam = streams.electrics.lowbeam;
      data.highBeam = streams.electrics.highbeam;
  
      var oilok = Math.abs(data.oilTemp - streams.electrics.oiltemp) < 0.005;
      if(!oilok) data.oilTemp += (streams.electrics.oiltemp - data.oilTemp) * 0.2;
  
      var rpmperc = streams.electrics.rpm / rpm_max;
      var rpmok = Math.abs(data.rpm - rpmperc) < 0.005;
      if(!rpmok) data.rpm += (rpmperc - data.rpm) * 0.2;
  
      var fuelperc = streams.engineInfo[11] / streams.engineInfo[12];
      var fuelok = Math.abs(data.fuel - fuelperc) < 0.005;
      if(!fuelok) data.fuel += (fuelperc - data.fuel) * 0.2;
  
      if(oilok && rpmok && fuelok) {
        displayMode = 2;
      }
    }
  
    applyData(data);
    return true;
  };
  
  document.vehicleChanged = function () {
    // redo the elements 
    initialized = false;
  };
  
  var UiUnitscallback;
  
  function UnitSpeed (val) {
    var convertedVal = UiUnitscallback(val, 'speed');
    speedUnitText.textContent = convertedVal.unit;
    return Math.round(convertedVal.val);
  }
  
  document.wireThroughUnitSystem = function (callback) {
    UiUnitscallback = callback;
  };

  document.getElementById('wheelspeed').addEventListener('click', function() {
    var opacite = this.getAttribute('opacity');
    if (opacite == "1") {
        this.setAttribute('opacity', '0');
    } else {
        this.setAttribute('opacity', '1');
    }
});
