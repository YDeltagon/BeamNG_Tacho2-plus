'use strict'
angular.module('beamng.apps')
.directive('tacho2classic', [function () {
  return {
    template:
        '<object style="width:100%; height:100%; box-sizing:border-box; pointer-events: none" type="image/svg+xml" data="/ui/modules/apps/Tacho2Classic/app.svg"></object>',
    replace: true,
    restrict: 'EA',
    link: function (scope, element, attrs) {
      element.css({transition:'opacity 0.3s ease'});

        // YDeltagon add
        function updateVehiculeStats(element, scope) {
          var curTime = 0
          var timer = 0
          var previousFuel = 0
          const LuaData = `(function() return { 
              maxPower = powertrain.getDevicesByCategory("engine")[1].maxPower,
              maxTorque = powertrain.getDevicesByCategory("engine")[1].maxTorque
          } end)()`;
      
          bngApi.activeObjectLua(LuaData, function(data) {
            svg.getElementById('tacho2maxpower').textContent = (data.maxPower && !isNaN(data.maxPower)) ? Math.ceil(data.maxPower * 0.986).toString() : '0';
            svg.getElementById('tacho2maxtorque').textContent = (data.maxTorque && !isNaN(data.maxTorque)) ? Math.ceil(data.maxTorque).toString() : '0';
          });
          
          scope.$on('streamsUpdate', function (event, streams) {
            scope.$evalAsync(function () {
                var prevTime = curTime
                curTime  = performance.now()
                var dt = (curTime - prevTime)/1000
                var fuelConsumptionRate
                timer += dt
                if(timer >= 1) {
                  fuelConsumptionRate = (previousFuel - streams.engineInfo[11]) / (timer * streams.electrics.wheelspeed); // l/(s*(m/s)) = l/m
                  previousFuel = streams.engineInfo[11]
                  timer = 0
                  var consumptionValue = parseFloat(UiUnits.buildString('consumptionRate', fuelConsumptionRate, 0));
                  scope.l100km = Math.max(0, Math.min(999, Math.round(consumptionValue)));
                  svg.getElementById('tacho2l100km').textContent = scope.l100km ? scope.l100km.toString() : '0';
                }
              })
            })
          }
      /////

      let visible = false;
      let initialized = false;
      let svg;

      element.on('load', function () {
          // YDeltagon add
          updateVehiculeStats(element, scope);
          /////
        svg = element[0].contentDocument;
        svg.wireThroughUnitSystem((val, func) => UiUnits[func](val));
      });

      element.one('load', function(){
        var svg = element[0].contentDocument;
        StreamsManager.add(svg.getStreams());
      });
    
      scope.$on('streamsUpdate', function (event, streams) {
        if(svg) {
          if (svg.update(streams)) {
            if(!visible) {
              element[0].style.opacity = 1;
              visible = true;
            }
          } else {
            if(visible) {
              element[0].style.opacity = 0;
              visible = false;
            }
          }
        }
      });

      scope.$on('VehicleChange', function() {
        if(svg && svg.vehicleChanged) {
          // YDeltagon add
          updateVehiculeStats(element, scope);
          /////
        } 
        svg.vehicleChanged(); });

      scope.$on('VehicleFocusChanged', function (event, data) {
        if(data.mode === true && svg && svg.vehicleChanged) {
            // YDeltagon add
            updateVehiculeStats(element, scope);
            /////
           svg.vehicleChanged();
        }
      });

      scope.$on('$destroy', function () {
        if(svg)
          StreamsManager.remove(svg.getStreams());
      });
    }
  };
}]);
