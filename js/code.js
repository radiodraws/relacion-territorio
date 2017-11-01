(function($, window, document) {

  extendTopoJson();

  var vlc = [39.475339, -0.376703];
  var kyoto = [34.980603, 135.761296];
  var bogota = [4.608943, -74.070867];

  var leafletMap = L.map('mapid', {
      minZoom: 1,
      maxZoom: 20,
    })
    .setView(vlc)
    .setZoom(13)
    .on('zoomend', function(e) {
      var latlng = L.latLng(vlc[0], vlc[1]);
      var pointlatlng = leafletMap.latLngToLayerPoint(latlng);

      for (var i = arrRandom.length; i--;) {
        updatesvg([arrRandom[i][0].lat, arrRandom[i][0].lng]);
      }
    });

  //--create svg layer
  var myRenderer = L.svg({ padding: 0 });
  myRenderer.addTo(leafletMap);

  var pixiContainer = new PIXI.Container(),
    firstDraw = true,
    prevZoom,
    frame = null,
    animation,
    factorScale,
    renderer,
    container;

  const ticker = new PIXI.ticker.Ticker();;

  var routeArr = [];
  //--ARR FOR DRAW CITY
  var arrGeo = [];
  var arrRandom = [];

  var barras;

  $(function() {

    d3.json('maps/vlc-map.json', function(error, datacoords) {
      if (error) throw error;


      barras = d3.select('svg')
        .append('g')
        .attrs({
          id: 'barras'
        });


      //crear random de coords unas 40 y guardarlas local, conectar recorridos
      var url_ = 'data.php?coordinates=-0.323168,39.465528|-0.368039,39.478622';
      var url = 'data/route2.json';

      d3.json(url, function(error, dataroute) {
        if (error) throw error;


        var topolayer = new L.TopoJSON();
        topolayer.addData(datacoords);



        for (var keys in topolayer._layers) {
          arrGeo.push(topolayer._layers[keys]._latlngs);
          parseInt(getRnd(1, 500)) === 1 && arrRandom.push(topolayer._layers[keys]._latlngs);
        }

        //--ARR FOR ROUTES
        var arrGeoRoute = [];

        for (var i = dataroute.routes[0].geometry.coordinates.length; i--;) {

          arrGeoRoute.push({
            lat: dataroute.routes[0].geometry.coordinates[i][1],
            lng: dataroute.routes[0].geometry.coordinates[i][0]
          });
        }

        pixiLayer(arrGeo, [arrGeoRoute]);

        console.log(arrRandom);



      }); //---GET DATA
    }); //---ROUTE
  }); ///--- ON READY

  //----MARKERS
  var icon_w = 12;
  var wPop = 260;
  var popOtions = {
    closeOnClick: false,
    autoClose: false,
    offset: new L.Point(wPop / 2, icon_w + 10),
    minWidth: wPop,
    maxWidth: wPop,
    keepInView: false
  };
  var localIcon = L.Icon.extend({
    options: {
      iconSize: [icon_w, icon_w],
      iconAnchor: [(icon_w / 2), (icon_w)],
      popupAnchor: [0, 0]
    }
  });

  markerIcon = new localIcon({ iconUrl: 'assets/marker.svg' });
  var markers = L.layerGroup();
  leafletMap.addLayer(markers);


  var strTrans_ = 'rotateX(53deg) rotateZ(-25deg)';
  var strTrans = 'rotateX(49deg) rotateZ(-32deg) skewY(23deg) skewX(-17deg)';
  var strUnTrans = 'skewX(17deg) skewY(-23deg) rotateZ(32deg) rotateX(-49deg)';

  function updatesvg(dataMarker) {


    for (var i = arrRandom.length; i--;) {
      var latlng = L.latLng(arrRandom[i][0].lat, arrRandom[i][0].lng);

      var pointlatlng = leafletMap.latLngToLayerPoint(latlng);
      d3.select('#barra-' + i)
        .styles({
          'transform': 'translate3d(' + pointlatlng.x + 'px, ' + pointlatlng.y + 'px, 0px) ' + strUnTrans

        });

    }



  }
  var counterBarras = 0;

  function markerConstructor(dataMarker) {

    var latlng = L.latLng(dataMarker[0], dataMarker[1]);
    var pointlatlng = leafletMap.latLngToLayerPoint(latlng);



    var h = getRnd(10, 200);
    $('#mapcontainer')
      .css({
        'transform' : 'matrix3d(0.437662, -0.016154, 0, -9.3e-05, -0.243355, -0.071613, 0, -0.001365, 0, 0, 1, 0, 81, 173, 0, 1) matrix3d(2.2465e+00, 8.8749e-04, -0.0000e+00, 2.1013e-04, 1.8131e+00, 6.0786e+00, -0.0000e+00, 8.4659e-03, 0.0000e+00, 0.0000e+00, 1.0000e+00, 0.0000e+00, -4.9563e+02, -1.0517e+03, 0.0000e+00, -4.8161e-01)'



      })
      .children()
      .css({

           
    
      })


    counterBarras++;

    barras
      .append('rect')
      .attrs({
        'id': 'barra-' + counterBarras,
        'r': 10,
        'x': pointlatlng.x,
        'y': pointlatlng.y - h,
        'width': 2,
        'height': h
      })
      .styles({
        'fill': 'red',
        'fill-opacity': 1,
     });


  }

  function pixiLayer(data, routeData) {

    var loader = new PIXI.loaders.Loader();
    loader.add('iris', 'assets/iris.png');

    loader.load(function(loader, resources) {

      var pixiOverlay = L.pixiOverlay(function(utils) {

          var zoom = utils.getMap().getZoom();
          container = utils.getContainer();
          renderer = utils.getRenderer();
          var project = utils.latLngToLayerPoint;
          var scale = utils.getScale();

          if (frame) {
            frame = null;
          }

          if (firstDraw) {}

          if (firstDraw && prevZoom !== zoom) {

            for (var i = arrRandom.length; i--;) {

              markerConstructor([arrRandom[i][0].lat, arrRandom[i][0].lng]);
            }

            function Riders(data) {

              var numpart = data.length;
              // var numpart = 10;
              var ridersParticles = new PIXI.particles.ParticleContainer(numpart);
              //var ridersParticles = new PIXI.Container();
              container.addChild(ridersParticles);

              var starterNum = 0;

              this.val = 1;
              this.loopLength = 5;

              var counterRepeat = 0;

              var max = d3.max(data, function(d) {
                return d.length;
              });

              var ridersArr = [];
              var totalRiders = renderer instanceof PIXI.WebGLRenderer ? numpart : 1;
              var inArr = [];
              var stateArr = [];

              var wUnit = 17;
              var hUnit = 18;
              var indexStart = 14;
              var indexEnd = 18;

              for (var i = totalRiders; i--;) {

                var texture = new PIXI.Texture(resources.iris.texture);
                var rect1 = new PIXI.Rectangle(wUnit * (parseInt(getRnd(indexEnd, indexStart))), 0, wUnit, hUnit);
                texture.frame = rect1;

                var rider = new PIXI.Sprite(texture);

                var pos = [data[starterNum + i][0].lat, data[starterNum + i][0].lng];

                rider.anchor.set(0.5);
                rider.scale.set(1 * 0.06);
                rider.transform.position.set(project(pos).x, project(pos).y);

                //-----RIDRES ARRAYS 
                ridersArr.push(rider);
                ridersParticles.addChild(rider);



                if (counterRepeat + 1 < data[starterNum + i].length) {
                  stateArr.push(true);
                } else {
                  stateArr.push(false);
                }

              }

              this.onRepeat = function() {

                counterRepeat++;

                for (var i = totalRiders; i--;) {
                  if (counterRepeat + 1 < data[starterNum + i].length) {
                    stateArr[i] = true;

                  } else {
                    stateArr[i] = false;
                  }
                }
              };
              this.updateHandler = function(value) {


                for (var i = totalRiders; i--;) {

                  if (stateArr[i]) {

                    var pos = [data[starterNum + i][counterRepeat].lat,
                      data[starterNum + i][counterRepeat].lng
                    ];
                    ridersArr[i].transform.position.set(project(pos).x, project(pos).y);

                  }


                }
                renderer.render(container);


              }
            } //---RIDERS

            var ridersGroup = new Riders(routeData);

            function drawCity() {

              var buffer = new PIXI.Graphics();
              container.addChild(buffer);

              drawPolyline(data);

              function drawPolyline(arr) {


                buffer.lineStyle(0.095, '0x000000', 0.3);
                buffer.beginFill(0xFFFF0B, 0.0);
                buffer.blendMode = PIXI.BLEND_MODES.SCREEN;


                var polys = [];
                for (var i = arr.length; i--;) {

                  var subPolys = [];

                  arr[i].forEach(function(coords, index) {
                    subPolys.push(project(coords).x);
                    subPolys.push(project(coords).y);
                  });

                  polys.push(subPolys);


                } //---end for

                for (var i = polys.length; i--;) {
                  buffer.drawPolygon(polys[i]);
                }

                $('.spinner').addClass('stop');

              } //---FINAL DRAW POLYLINE

            }
            drawCity();


            //---ANIMATION


            ticker.speed = 0.5;
            var oldDelta = 0;
            var newDelta = 0;

            ticker.stop();

            ticker.add((deltaTime) => {

              if (ridersGroup.val > ridersGroup.loopLength) {
                ridersGroup.val = 1;
              } else {
                ridersGroup.val += 1 * deltaTime;
              }

              oldDelta = newDelta;
              newDelta = parseInt(ridersGroup.val);

              if (oldDelta !== newDelta) {

                if (ridersGroup.val > ridersGroup.loopLength) {
                  ridersGroup.onRepeat();
                }
                ridersGroup.updateHandler(newDelta);

              }
            });
            ticker.start();
            ticker.stop();






          }



          if (!firstDraw && prevZoom !== zoom) {
            //console.log(zoom);
          }
          firstDraw = false;
          prevZoom = zoom;
          renderer.render(container);


        },
        pixiContainer);
      pixiOverlay.addTo(leafletMap);


    }); //---LOADER

    function render() {
      renderer.render(container);
    }


    //---STOP BUTTON
    $('#stop-animation').on('click', function() {
      $(this).hide();
      $('#play-animation').show();
      ticker.stop();

    });

    $('#play-animation').on('click', function() {
      $(this).hide();
      $('#stop-animation').show();
      ticker.start();




    }); //----PIXI OVERLAY


  } //----PIXILAYER


  function getRnd(max, min) {
    return Math.random() * (max - min) + min;
  }

  function extendTopoJson() {
    L.TopoJSON = L.GeoJSON.extend({
      addData: function(jsonData) {
        if (jsonData.type === "Topology") {
          for (key in jsonData.objects) {
            geojson = topojson.feature(jsonData, jsonData.objects[key]);
            L.GeoJSON.prototype.addData.call(this, geojson);
          }
        } else {
          L.GeoJSON.prototype.addData.call(this, jsonData);
        }
      }
    });

  }


  function disableMapInteraction(map, idmap) {

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
    document.getElementById(idmap).style.cursor = 'default';
  }

  function drawTilesMap(map) {
    var mapLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}' + '' + '?access_token=pk.eyJ1IjoiY2Fyb2xpbmF2YWxsZWpvIiwiYSI6ImNqNGZuendsZDFmbmwycXA0eGFpejA5azUifQ._a5sIBQuS72Kw24eZgrEFw', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiY2Fyb2xpbmF2YWxsZWpvIiwiYSI6ImNqNGZuendsZDFmbmwycXA0eGFpejA5azUifQ._a5sIBQuS72Kw24eZgrEFw'
    }).addTo(map);
  }

  function getRnd(max, min) {
    return Math.random() * (max - min) + min;
  }

  function hex(r, g, b) {
    return "0x" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
  }

}(window.jQuery, window, document));


/*---------

TO_DO:
 - stop ticker cuando ya no hay mas animations

//---------


geo2topo countries=bogota.geojson > bogota-map.json

var inter = d3.interpolateArray([x,y],[x,y])
var pos = inArr[i](deltaTime * 0.1, deltaTime * 0.1);

ridersArr[i].transform.position.set(project(pos).x, project(pos).y);


----------------*/