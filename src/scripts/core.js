//for jshint
'use strict';
// Generated on 2015-04-13 using generator-wim 0.0.1

/**
 * Created by bdraper on 4/3/2015.
 */

var map;
var allLayers;
var maxLegendHeight;
var maxLegendDivHeight;
var printCount = 0;
var dragInfoWindows = true;
var defaultMapCenter = [-94.106, 35.729];

var constObj;

var currentConstType = "";
var currentSiteNo = "";
var currentConst = "Total Phosphorus";
var currentLayer = "wrtdsSites";


var previousConst = "Chloride";
var OID = "";
var oldValue = "";
var attFieldSpecial = "";
var attFieldSpecialLower = "";
var z = 0;

var legend;

var orgSel;
var inorgSel;
var orgCycle3Sel;
var inorgCycle3Sel;

var sucode4FeatureLinkZoom;

require([
    'esri/arcgis/utils',
    'esri/Color',
    'esri/map',
    'esri/dijit/HomeButton',
    'esri/dijit/LocateButton',
    'esri/layers/ArcGISImageServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/dijit/Geocoder',
    'esri/dijit/PopupTemplate',
    'esri/graphic',
    'esri/geometry/Multipoint',
    'esri/geometry/Point',
    'esri/graphicsUtils',
    'esri/symbols/PictureMarkerSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/tasks/LegendLayer',
    'esri/tasks/PrintTask',
    'esri/tasks/PrintParameters',
    'esri/tasks/PrintTemplate',
    'esri/tasks/query',
    'esri/geometry/webMercatorUtils',
    'dojo/dnd/Moveable',
    'dojo/query',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/on',
    'dojo/domReady!'
], function (
    arcgisUtils,
    Color,
    Map,
    HomeButton,
    LocateButton,
    ArcGISImageServiceLayer,
    ArcGISTiledMapServiceLayer,
    Geocoder,
    PopupTemplate,
    Graphic,
    Multipoint,
    Point,
    graphicsUtils,
    PictureMarkerSymbol,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    LegendLayer,
    PrintTask,
    PrintParameters,
    PrintTemplate,
    esriQuery,
    webMercatorUtils,
    Moveable,
    query,
    dom,
    domClass,
    on
) {

    //bring this line back after experiment////////////////////////////
    //allLayers = mapLayers;

    // Added for handling of ajaxTransport in IE
    if (!jQuery.support.cors && window.XDomainRequest) {
        var httpRegEx = /^https?:\/\//i;
        var getOrPostRegEx = /^get|post$/i;
        var sameSchemeRegEx = new RegExp('^'+location.protocol, 'i');
        var xmlRegEx = /\/xml/i;

        /*esri.addProxyRule({
            urlPrefix: "http://commons.wim.usgs.gov/arcgis/rest/services/Utilities/PrintingTools",
            proxyUrl: "http://commons.wim.usgs.gov/resource-proxy/proxy.ashx"
        });*/

        // ajaxTransport exists in jQuery 1.5+
        jQuery.ajaxTransport('text html xml json', function(options, userOptions, jqXHR){
            // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
            if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(userOptions.url) && sameSchemeRegEx.test(userOptions.url)) {
                var xdr = null;
                var userType = (userOptions.dataType||'').toLowerCase();
                return {
                    send: function(headers, complete){
                        xdr = new XDomainRequest();
                        if (/^\d+$/.test(userOptions.timeout)) {
                            xdr.timeout = userOptions.timeout;
                        }
                        xdr.ontimeout = function(){
                            complete(500, 'timeout');
                        };
                        xdr.onload = function(){
                            var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                            var status = {
                                code: 200,
                                message: 'success'
                            };
                            var responses = {
                                text: xdr.responseText
                            };

                            try {
                                if (userType === 'json') {
                                    try {
                                        responses.json = JSON.parse(xdr.responseText);
                                    } catch(e) {
                                        status.code = 500;
                                        status.message = 'parseerror';
                                        //throw 'Invalid JSON: ' + xdr.responseText;
                                    }
                                } else if ((userType === 'xml') || ((userType !== 'text') && xmlRegEx.test(xdr.contentType))) {
                                    var doc = new ActiveXObject('Microsoft.XMLDOM');
                                    doc.async = true;
                                    try {
                                        doc.loadXML(xdr.responseText);
                                    } catch(e) {
                                        doc = undefined;
                                    }
                                    if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                        status.code = 500;
                                        status.message = 'parseerror';
                                        throw 'Invalid XML: ' + xdr.responseText;
                                    }
                                    responses.xml = doc;
                                }
                            } catch(parseMessage) {
                                throw parseMessage;
                            } finally {
                                complete(status.code, status.message, responses, allResponseHeaders);
                            }
                        };
                        xdr.onerror = function(){
                            complete(500, 'error', {
                                text: xdr.responseText
                            });
                        };
                        xdr.open(options.type, options.url);
                        //xdr.send(userOptions.data);
                        xdr.send();
                    },
                    abort: function(){
                        if (xdr) {
                            xdr.abort();
                        }
                    }
                };
            }
        });
    };

    jQuery.support.cors = true;

    $.ajax({
        dataType: 'json',
        type: 'GET',
        url: constituentDropURl,
        headers: {'Accept': '*/*'},
        success: function (data) {
            constObj = data;
            $.each(data.features, function(key, value) {
                if (value.attributes.Constituent != null) {
                    if (value.attributes.ConstituentType == 'inorganic' && value.attributes.Tableorder == "Mappable") {
                        $('#inorganicConstituentSelect')
                            .append($("<option></option>")
                                .attr(value.attributes)
                                .text(value.attributes.DisplayName));
                        if (value.attributes.HasCycle3 == 1) {
                            $('#inorganicConstituentCycle3Select')
                                .append($("<option></option>")
                                    .attr(value.attributes)
                                    .text(value.attributes.DisplayName));
                        }
                        //.attr({"value": value.attributes.Constituent, "description": value.attributes.Description})
                        //$('#constitExp').html("Inorganic text<br/>*For " + value.attributes.DisplayName + ", " + value.attributes.Description);
                        if (value.attributes.DisplayName == "Chloride") {
                            $('#constitExp').html("<p>" + value.attributes.GenDescSmallChg + "</p>" +
                                "<p>" + value.attributes.GenDescLargeChg + "</p>" +
                                "<p>" + value.attributes.GenDescBenchmark + "</p>");
                        }
                    } else if (value.attributes.ConstituentType == 'organic' && value.attributes.Tableorder == "Mappable") {
                        $('#organicConstituentSelect')
                            .append($("<option></option>")
                                .attr(value.attributes)
                                .text(value.attributes.DisplayName));
                        if (value.attributes.HasCycle3 == 1) {
                            $('#organicConstituentCycle3Select')
                                .append($("<option></option>")
                                    .attr(value.attributes)
                                    .text(value.attributes.DisplayName));
                        }
                        //.attr({"value": value.attributes.Constituent, "description": value.attributes.Description})
                    }
                    /*$('#constituentSelect')
                     .append($("<option></option>")
                     .attr(value.attributes)
                     .text(value.attributes.DisplayName));
                     ////.attr({"value": value.attributes.Constituent, "description": value.attributes.Description})
                     $('#constitExp').html("*"+value.attributes.Description);*/
                }
            });
            orgSel = $("#organicConstituentSelect");
            inorgSel = $("#inorganicConstituentSelect");
            orgCycle3Sel = $('#organicConstituentCycle3Select');
            inorgCycle3Sel = $('#inorganicConstituentCycle3Select');
            inorgSel.val("Chloride");
            orgSel.hide();
            orgCycle3Sel.hide();
            inorgCycle3Sel.hide();

        },
        error: function (error) {
            console.log("Error processing the JSON. The error is:" + error);
        }
    });

    map = Map('mapDiv', {
        basemap: 'topo',
        //center: [-95.6, 38.6],
        center: defaultMapCenter,
        zoom: 5
    });
    //button for returning to initial extent
    var home = new HomeButton({
        map: map
    }, "homeButton");
    home.startup();
    //button for finding and zooming to user's location
    var locate = new LocateButton({
        map: map
    }, "locateButton");
    locate.startup();

    $('#legendButton').click();

    //following block forces map size to override problems with default behavior
    $(window).resize(function () {
        /*if ($("#legendCollapse").hasClass('in')) {
            maxLegendHeight =  ($('#mapDiv').height()) * 0.90;
            $('#legendElement').css('height', maxLegendHeight);
            $('#legendElement').css('max-height', maxLegendHeight);
            maxLegendDivHeight = ($('#legendElement').height()) - parseInt($('#legendHeading').css("height").replace('px',''));
            $('#legendDiv').css('max-height', maxLegendDivHeight);
        }
        else {
            $('#legendElement').css('height', 'initial');
        }*/
    });

    // All code for handling IE warning popup
    $("#IEwarnContinue").click(function () {
        $('#aboutModal').modal({backdrop: 'static'});
        $('#aboutModal').modal('show');
    });

    if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
        $("#IEwarningModal").modal('show');
    } else {
        $('#aboutModal').modal({backdrop: 'static'});
        $('#aboutModal').modal('show');
    }
    // End IE warning code

    $('#printExecuteButton').click(function (e) {
        e.preventDefault();
        $(this).button('loading');
        printMap();
    });

    function showPrintModal() {
        $('#printModal').modal('show');
    }

    map.on('extent-change', function(event) {
        //alert(event);
    });

    $('#printNavButton').click(function(){
        /*var trendPeriodVal = $("input:radio[name='trendPeriod']:checked").val();

        var trendPeriod = "";
        if (trendPeriodVal == "P10") {
            trendPeriod = "2002";
        } else if (trendPeriodVal == "P20") {
            trendPeriod = "1992";
        } else if (trendPeriodVal == "P30") {
            trendPeriod = "1982";
        } else if (trendPeriodVal == "P40") {
            trendPeriod = "1972";
        }

        var trendTypeVal = $('input[name=trendType]:checked').val();
        trendTypeVal = trendTypeVal.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });*/

        var printTitle = getPrintTitle();
        $("#printTitle").text(printTitle);
        showPrintModal();
    });

    function getPrintTitle() {
        var printTitle = "test";

        /*var trendPeriodVal = $("input:radio[name='trendPeriod']:checked").val();

        var trendPeriod = "";
        if (trendPeriodVal == "P10") {
            trendPeriod = "2002";
        } else if (trendPeriodVal == "P20") {
            trendPeriod = "1992";
        } else if (trendPeriodVal == "P30") {
            trendPeriod = "1982";
        } else if (trendPeriodVal == "P40") {
            trendPeriod = "1972";
        }*/

        var trendTypeVal = $('input[name=constButtons]:checked').val();
        /*trendTypeVal = trendTypeVal.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });*/

        var constituent = $("#" + trendTypeVal + "ConstituentSelect")[0].value;

        printTitle = "Decadal Change for " + constituent + " in Groundwater from 1988-2001 to 2002-2012";

        return printTitle;
    }

    var layers_all = ["pestSites","ecoSites","wrtdsSites","wrtdsFluxSites"];

    /*$("#typeSelect").on('change', function (event) {

        $("#siteInfoDiv").css("visibility", "hidden");
        map.graphics.clear();

        var val = event.currentTarget.value;
        $(".constSelect").hide();
        $.each(layers_all, function(key,value){
           map.getLayer(value).setVisibility(false);
        });
        if (val == "Pesticides" || val == "Algae" || val == "Fish" || val == "Macroinvertebrates") {
            if (!$("#trend1input").checked && !$("#trend2input").checked) {
                $("#trend1input").prop("checked", true);
            }
        }

        var selectVal = event.currentTarget[event.currentTarget.selectedIndex].attributes["select"].value
        $(selectVal).show();

        currentConst = selectVal;

        if (val == "Nutrients" || val == "Carbon" || val == "Major ions" || val == "Salinity" || val == "Sediment") {
            $("#trendTypes").show();
            $("#trend4,#trend3").show();
            wrtdsSelect();
        } else if (val == "Pesticides") {
            $("#trendTypes").show();
            $("#trend4,#trend3").hide();
            $("#load").prop('disabled', false);
            pestSelect();
        } else if (val == "Algae" || val == "Fish" || val == "Macroinvertebrates") {
            $("#trendTypes").hide();
            $("#trend4,#trend3").hide();
            $("#load").prop('disabled', false);
            ecoSelect();
        }
    });*/

    function layerUpdateListener(layer) {
        var layerUpdate = map.getLayer(layer).on('update-end', function(evt) {
            var graphicsNum = evt.target.graphics.length;
            if (graphicsNum == 0) {
                //alert("No sites are available for this constituent and trend period. Please select another option.");
                $(".alert-box").show();
                $("#siteInfoClose").click();
            } else {
                $(".alert-box").hide();
            }
            layerUpdate.remove();
        });
        map.getLayer(layer).refresh();
    }

    /*function pestSelect() {
        var val = $("#pesticideSelect").val();
        currentConst = val;
        var trendPeriod = $('input[name=trendPeriod]:checked').val();
        var expression = "Pesticide = '" + val + "' AND period = '" + trendPeriod + "'";
        map.getLayer("pestSites").setDefinitionExpression(expression);
        map.getLayer("pestSites").setVisibility(true);
        layerUpdateListener("pestSites");
    }

    function ecoSelect() {
        var val = "";
        var selectVal = $($("#typeSelect")[0][$("#typeSelect")[0].selectedIndex].attributes["select"].value).val();
        currentConst = selectVal;
        var trendPeriodVal = $('input[name=trendPeriod]:checked').val();
        var trendPeriod = "";
        if (trendPeriodVal == "P10") {
            trendPeriod = "AND (EcoTrendResults_Nyear = 8 OR EcoTrendResults_Nyear = 9 OR EcoTrendResults_Nyear = 10 OR EcoTrendResults_Nyear = 11)";
        } else if (trendPeriodVal == "P20") {
            trendPeriod = "AND (EcoTrendResults_Nyear = 18 OR EcoTrendResults_Nyear = 19 OR EcoTrendResults_Nyear = 20)";
        }
        var expression = "EcoTrendResults_y = '" + selectVal + "' " + trendPeriod;
        console.log(expression);
        map.getLayer("ecoSites").setDefinitionExpression("");
        map.getLayer("ecoSites").setDefinitionExpression(expression);
        map.getLayer("ecoSites").setVisibility(true);
        layerUpdateListener("ecoSites");
    }

    function wrtdsSelect() {
        var val = "";
        var typeSelectVal = $("#typeSelect").val()
        var constVal = $($("#typeSelect")[0][$("#typeSelect")[0].selectedIndex].attributes["select"].value).val();
        currentConst = constVal;
        if (typeSelectVal == "Nutrients") {
            val = $("#nutrientsSelect").val();
        } else if (typeSelectVal == "Carbon") {
            val = $("#carbonSelect").val();
        } else if (typeSelectVal == "Major ions") {
            val = $("#majorIonsSelect").val();
        } else if (typeSelectVal == "Salinity") {
            val = $("#salinitySelect").val();
        } else if (typeSelectVal == "Sediment") {
            val = $("#sedimentSelect").val();
        }

        if (val == "Specific conductance") {
            $("#load").prop('disabled', true);
            $('input:radio[name=trendType]')[0].checked = true;
        } else {
            $("#load").prop('disabled', false);
        }

        var trendTypeVal = $('input[name=trendType]:checked').val();
        var layer;
        var layerID;
        if (trendTypeVal == "concentration") {
            layer = map.getLayer("wrtdsSites");
            layerID = "wrtdsSites";
            layer.setVisibility(true);
        } else if (trendTypeVal == "load") {
            layer = map.getLayer("wrtdsFluxSites");
            layerID = "wrtdsFluxSites";
            layer.setVisibility(true);
        }

        var trendPeriodVal = $('input[name=trendPeriod]:checked').val();
        var trendPeriod = "";
        var trendPeriod2 = "";
        if (trendPeriodVal == "P10") {
            trendPeriod = "2002";
            trendPeriod2 = "2003"
        } else if (trendPeriodVal == "P20") {
            trendPeriod = "1992";
            trendPeriod2 = "1993"
        } else if (trendPeriodVal == "P30") {
            trendPeriod = "1982";
            trendPeriod2 = "1983"
        } else if (trendPeriodVal == "P40") {
            trendPeriod = "1972";
            trendPeriod2 = "1973"
        }
        var expression = "wrtds_trends_wm_new.id_unique LIKE '%" + val + "%" + trendPeriod + "%' OR wrtds_trends_wm_new.id_unique LIKE '%" + val + "%" + trendPeriod2 + "%'";
        layer.setDefinitionExpression(expression);
        layerUpdateListener(layerID);
    }*/

    $(".trendPeriod").on("change", function(event) {

        var button = event.currentTarget;

        var typeSelectVal = $("#typeSelect").val();

        var constButtonVal = $('input[name=constButtons]:checked').val();

        $("#" + constButtonVal + "ConstituentSelect").trigger("change");

    });

    //displays map scale on map load
    on(map, "load", function() {
        /*map.addLayer(shadedReliefBasemap);
        map.addLayer(referenceMapBasemap);
        map.removeLayer(nationalMapBasemap);*/
        $("#btnShadedRelief").click();//
        var scale =  map.getScale().toFixed(0);
        $('#scale')[0].innerHTML = addCommas(scale);
        var initMapCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
        $('#latitude').html(initMapCenter.y.toFixed(3));
        $('#longitude').html(initMapCenter.x.toFixed(3));

        //code for adding draggability to infoWindow. http://www.gavinr.com/2015/04/13/arcgis-javascript-draggable-infowindow/
        if (dragInfoWindows == true) {
            var handle = query(".title", map.infoWindow.domNode)[0];
            var dnd = new Moveable(map.infoWindow.domNode, {
                handle: handle
            });

            // when the infoWindow is moved, hide the arrow:
            on(dnd, 'FirstMove', function() {
                // hide pointer and outerpointer (used depending on where the pointer is shown)
                var arrowNode =  query(".outerPointer", map.infoWindow.domNode)[0];
                domClass.add(arrowNode, "hidden");

                var arrowNode =  query(".pointer", map.infoWindow.domNode)[0];
                domClass.add(arrowNode, "hidden");
            }.bind(this));
        }
    });
    //displays map scale on scale change (i.e. zoom level)
    on(map, "zoom-end", function () {
        var scale =  map.getScale().toFixed(0);
        $('#scale')[0].innerHTML = addCommas(scale);
    });

    //Supdates lat/lng indicator on mouse move. does not apply on devices w/out mouse. removes "map center" label
    on(map, "mouse-move", function (cursorPosition) {
        $('#mapCenterLabel').css("display", "none");
        if (cursorPosition.mapPoint != null) {
            var geographicMapPt = webMercatorUtils.webMercatorToGeographic(cursorPosition.mapPoint);
            $('#latitude').html(geographicMapPt.y.toFixed(3));
            $('#longitude').html(geographicMapPt.x.toFixed(3));
        }
    });
    //updates lat/lng indicator to map center after pan and shows "map center" label.
    on(map, "pan-end", function () {
        //displays latitude and longitude of map center
        $('#mapCenterLabel').css("display", "inline");
        var geographicMapCenter = webMercatorUtils.webMercatorToGeographic(map.extent.getCenter());
        $('#latitude').html(geographicMapCenter.y.toFixed(3));
        $('#longitude').html(geographicMapCenter.x.toFixed(3));
    });

    var nationalMapBasemap = new ArcGISTiledMapServiceLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer');
    var shadedReliefBasemap = new ArcGISTiledMapServiceLayer('http://server.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer');
    var referenceMapBasemap = new ArcGISTiledMapServiceLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer');
    //on clicks to swap basemap. map.removeLayer is required for nat'l map b/c it is not technically a basemap, but a tiled layer.
    function removeManualLayers() {
        map.removeLayer(nationalMapBasemap);
        map.removeLayer(referenceMapBasemap);
        map.removeLayer(shadedReliefBasemap);
    }
    on(dom.byId('btnStreets'), 'click', function () {
        map.setBasemap('streets');
        removeManualLayers();
    });
    on(dom.byId('btnSatellite'), 'click', function () {
        map.setBasemap('satellite');
        removeManualLayers();
    });
    on(dom.byId('btnHybrid'), 'click', function () {
        map.setBasemap('hybrid');
        removeManualLayers();
    });
    on(dom.byId('btnShadedRelief'), 'click', function () {
        map.addLayer(shadedReliefBasemap);
        map.addLayer(referenceMapBasemap);
        map.removeLayer(nationalMapBasemap);
    });
    on(dom.byId('btnTerrain'), 'click', function () {
        map.setBasemap('terrain');
        removeManualLayers();
    });
    on(dom.byId('btnDarkGray'), 'click', function () {
        map.setBasemap('dark-gray');
        removeManualLayers();
    });
    on(dom.byId('btnGray'), 'click', function () {
        map.setBasemap('gray');
        removeManualLayers();
    });
    on(dom.byId('btnNatGeo'), 'click', function () {
        map.setBasemap('national-geographic');
        removeManualLayers();
    });
    on(dom.byId('btnOSM'), 'click', function () {
        map.setBasemap('osm');
        removeManualLayers();
    });
    on(dom.byId('btnTopo'), 'click', function () {
        map.setBasemap('topo');
        removeManualLayers();
    });

    on(dom.byId('btnNatlMap'), 'click', function () {
        map.addLayer(nationalMapBasemap);
        map.removeLayer(referenceMapBasemap);
        map.removeLayer(shadedReliefBasemap);
    });

    //end code for adding draggability to infoWindow

    on(map, "click", function(evt) {
        /*var graphic = new Graphic();

        var feature = graphic;

        var template = new esri.InfoTemplate("test popup",
            "attributes and stuff go here");

        ///ties the above defined InfoTemplate to the feature result returned from a click event

        feature.setInfoTemplate(template);

        map.infoWindow.setFeatures([feature]);
        map.infoWindow.show(evt.mapPoint);

        map.infoWindow.show();*/
    });

    // Using Lobipanel: https://github.com/arboshiki/lobipanel
    $("#siteInfoDiv").lobiPanel({
        unpin: false,
        reload: false,
        minimize: false,
        close: false,
        expand: false,
        editTitle: false,
        width: 400,
        maxWidth: 800,
        maxHeight: 500
    });

    $("#siteInfoDiv .dropdown").prepend("<div id='siteInfoClose' title='close'><b>X</b></div>");
    $("#siteInfoDiv .dropdown").prepend("<div id='siteInfoMin' title='collapse'><b>_</b></div>");

    $("#siteInfoMin").click(function(){
        $("#siteInfoDiv").css("visibility", "hidden");
    });

    $("#siteInfoClose").click(function(){
        $("#siteInfoDiv").css("visibility", "hidden");
        map.graphics.clear();
        map.getLayer("trendSites").setVisibility(false);
    });

    var pestPDFs = "";

    function constTypeSelect(event) {

        var button = event.currentTarget;

        if (button.id == "organicButton") {
            /*if (!$("#cycle12input").checked) {
                $("#cycle12input").prop("checked", true);
                $(".trendPeriodWrap").hide();
                $(".trendPeriodWrap #cycle12input").show();
            }*/
            $("#organicConstituentSelect").show();
            $("#inorganicConstituentSelect").hide();
            $("#organicConstituentSelect").prependTo("#inputs");
            $("#organicConstituentSelect").trigger("change");

        } else if (button.id == "inorganicButton") {
            //$(".trendPeriodWrap").show();
            $("#organicConstituentSelect").hide();
            $("#inorganicConstituentSelect").show();
            $("#inorganicConstituentSelect").prependTo("#inputs");
            $("#inorganicConstituentSelect").trigger("change");

        }

    }

    function constituentUpdate(event) {

        z = z + 1;

        /*dojo.setStyle(constStatus.id, "color", "yellow");
         constStatus.innerHTML = "...Updating...";*/

        var select = event.target;

        var astText = "";

        if (select[select.selectedIndex].attributes.hasOwnProperty("GenDescLargeChg") == true) {
            astText = "<p>" + (select[select.selectedIndex].attributes.GenDescSmallChg.value).toString() + "</p><p>" +
                (select[select.selectedIndex].attributes.GenDescLargeChg.value).toString() + "</p>" +
                "<p>" + (select[select.selectedIndex].attributes.GenDescBenchmark.value).toString() + "</p>";
        } else {
            astText = "<p>" + (select[select.selectedIndex].attributes.GenDescSmallChg.value).toString() + "</p><p>" +
                "<p>" + (select[select.selectedIndex].attributes.GenDescBenchmark.value).toString() + "</p>";
        }

        var benchmarkText = (select[select.selectedIndex].attributes.GenDescBenchmark.value).toString();

        if (astText.match("No benchmark available") != null && astText.match("No benchmark available").length > 0) {
            astText = "<p>" + (select[select.selectedIndex].attributes.GenDescSmallChg.value).toString() + "</p>";
        }

        if (select.id == "organicConstituentSelect") {
            $('#constitExp').html(astText);
        } else if (select.id == "inorganicConstituentSelect") {
            $('#constitExp').html(astText);
        }

        var featureLayer = map.getLayer("networkLocations");

        var layerUpdateEnd = dojo.connect(featureLayer, "onUpdateEnd", function (evt) {
            dojo.disconnect(featureLayer, layerUpdateEnd);
            /*constStatus.innerHTML = "Updated";
             dojo.setStyle(constStatus.id, "color", "green");*/
        });

        var defaultSymbol = null;

        var attField ="";
        var mapFields = map.getLayer("networkLocations").fields;
        var trendPeriodVal = $('input[name=trendPeriod]:checked').val();
        $.each(mapFields, function(index, value) {
            if (mapFields[index].name.toLowerCase().indexOf(select[select.selectedIndex].attributes.constituent.value.toLowerCase()) != -1 &&
                mapFields[index].name.toLowerCase().indexOf(trendPeriodVal.toLowerCase()) != -1) {
                attField = mapFields[index].name;
            }
        });

        renderer.attributeField = attField;
        renderer2.attributeField = attField;

        featureLayer.setDefinitionExpression(attField + " IS NOT NULL");
        featureLayer.refresh();
        layerUpdateListener(featureLayer.id);

        if (benchmarkText.match("No benchmark available") != null && benchmarkText.match("No benchmark available").length > 0) {
            featureLayer.setRenderer(renderer2);
        } else {
            featureLayer.setRenderer(renderer);
        }

        //featureLayer.refresh();
        legend.refresh();

        var info = $("#siteInfoPanel").html();
        var info = info.replace(previousConst, event.target.value);
        $("#siteInfoPanel").html(info);

        previousConst = event.target.value;
        console.log("after: " + previousConst);

        /*var e = new jQuery.Event("click");
        e.pageX = latestHover.pageX;
        e.pageY = latestHover.pageY;
        jQuery("body").trigger(e);*/

        //code to regenerate query for new constituent when chosen from dropdown
        var query = new esri.tasks.Query();
        var featureLayer = map.getLayer("networkLocations");
        query.returnGeometry = false;
        query.where = "network_centroids.OBJECTID = " + OID;
        featureLayer.queryFeatures(query, function(event) {

            if (event.features.length > 0) {
                for (var i = 0; i < constObj.features.length; i++) {
                    //console.log(i);
                    if (constObj.features[i].attributes["DisplayName"] == previousConst) {
                        attFieldSpecial = "ChemData." + $('input[name=trendPeriod]:checked').val() + constObj.features[i].attributes["Constituent"];
                        var constSplit = constObj.features[i].attributes["Constituent"].split("_");
                        attFieldSpecialLower = "ChemData." + $('input[name=trendPeriod]:checked').val() + constSplit[0] + "_" + constSplit[1].toLowerCase();
                    }
                }

                var val = getValue(event.features[0].attributes[attFieldSpecial]);
                if (val == "") {
                    val = getValue(event.features[0].attributes[attFieldSpecialLower])
                    //val = "no data";
                }
                console.log("val: " + val + ", oldValue: " + oldValue);
                var info2 = $("#siteInfoPanel").html();
                info2 = info2.replace(oldValue, val);
                info2 = info2.replace(camelize(oldValue), camelize(val));

                $("#siteInfoPanel").html(info2);

                oldValue = val;
            } else {
                $("#siteInfoClose").click();
            }

        });

    }

    on(dom.byId('inorganicButton'), 'change', constTypeSelect);
    on(dom.byId('organicButton'), 'change', constTypeSelect);

    //on(dom.byId('organicConstituentSelect'), 'change', constituentUpdate);
    //on(dom.byId('inorganicConstituentSelect'), 'change', constituentUpdate);

    $(".constSelect").on("change", constituentUpdate);

    map.on('layer-add', function (evt) {
        var layer = evt.layer.id;
        var actualLayer = evt.layer;

        if (layer == "networkLocations") {

            /*var layerUpdate = on(map.getLayer(layer), 'update-end', function(evt) {
                if (layer != currentLayer) {
                    currentLayer = layer;
                    alert(layer);
                }
            });*/

            map.getLayer(layer).on('click', function (evt) {

                var select;

                map.graphics.clear();
                var symbol = new SimpleMarkerSymbol();
                symbol.setStyle(SimpleMarkerSymbol.STYLE_SQUARE);
                symbol.setColor(new Color([0,0,0,0.0]));
                symbol.setSize("20");
                var outline = new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([0,255,255]),
                    2
                );
                symbol.setOutline(outline);

                var pt = new Point(evt.mapPoint.x,evt.mapPoint.y,map.spatialReference)
                var newGraphic = new Graphic(evt.graphic.geometry, symbol);

                //newGraphic.setSymbol(symbol);
                //map.graphics.add(evt.graphic)
                map.graphics.add(newGraphic);


                $("#siteInfoDiv").css("visibility", "visible");
                var instance = $('#siteInfoDiv').data('lobiPanel');
                var docHeight = $(document).height();
                var docWidth = $(document).width();
                var percentageOfScreen = 0.9;
                var siteInfoHeight = docHeight*percentageOfScreen
                var siteInfoWidth = docWidth*percentageOfScreen;
                if (docHeight < 500) {
                    $("#siteInfoDiv").height(siteInfoHeight);
                }
                if (docWidth < 500) {
                    $("#siteInfoDiv").width(siteInfoWidth);
                }

                //var instanceX = docWidth*0.5-$("#siteInfoDiv").width()*0.5;
                //var instanceY = docHeight*0.5-$("#siteInfoDiv").height()*0.5;
                var instanceX = evt.x;
                var instanceY = evt.y;

                instance.setPosition(instanceX, instanceY);
                if (instance.isPinned() == true) {
                    instance.unpin();
                }

                var attr = evt.graphic.attributes;

                $("#siteInfoPanel").empty();

                currentLayer = layer;

                var feature = evt.graphic;
                var attr = feature.attributes;
                //alert('hovered');

                if (dojo.byId("organicButton").checked) {
                    select = dojo.byId("organicConstituentSelect");
                } else if (dojo.byId("inorganicButton").checked) {
                    select = dojo.byId("inorganicConstituentSelect");
                }

                var trendSitesLayer = map.getLayer("trendSites");

                trendSitesLayer.setVisibility(true);
                var tsLayerDefs = [];
                tsLayerDefs[0] = "SuCode = '" + attr["network_centroids.SUCode"] + "'";
                trendSitesLayer.setLayerDefinitions(tsLayerDefs);
                trendSitesLayer.refresh();

                //var currentConst = organicConstituentSelect.selectedOptions[0].attributes.constituent.value;
                var currentConst = select[select.selectedIndex].attributes.constituent.value;
                //var displayConst = organicConstituentSelect.selectedOptions[0].attributes.displayname.value;
                var displayConst = select[select.selectedIndex].attributes.displayname.value;

                //sucode4FeatureLinkZoom = attr["network_centroids.SUCode"];

                var attField;
                var mapFields = map.getLayer("networkLocations").fields;
                var trendPeriodVal = $('input[name=trendPeriod]:checked').val();
                $.each(mapFields, function(index, value) {
                    if (mapFields[index].name.toLowerCase().indexOf(select[select.selectedIndex].attributes.constituent.value.toLowerCase()) != -1 &&
                        mapFields[index].name.toLowerCase().indexOf(trendPeriodVal.toLowerCase()) != -1) {
                        attField = mapFields[index].name;
                    }
                });

                var depth25 = attr["tbl_Networks.Depth25thpercentile"];
                var depth75 = attr["tbl_Networks.Depth75thpercentile"];

                sucode4FeatureLinkZoom = attr["network_centroids.SUCode"];

                if (layer == "networkLocations") {
                    currentSiteNo = attr.EcoTrendResults_EcoSiteID;
                    /*$("#siteInfoTabPane").append("<br/><b>Site name: </b>" + attr.EcoSiteSummary_no_headers_csv_Ecology_site_name + "<br/>" +
                        "<b>Site number: </b>" + attr.EcoTrendResults_EcoSiteID + "<br/>" +
                        "<b>State: </b>" +  + "<br/>" +
                        "<b>Agency: </b>U.S. Geological Survey<br/>" +
                        "<b>Data source: </b>BioData<br/>" +
                        "<b>Latitude: </b>" + attr.EcoSiteSummary_no_headers_csv_LatDD + "<br/>" +
                        "<b>Longitude: </b>" + attr.EcoSiteSummary_no_headers_csv_LngDD + "<br/>" +
                        "<b>Drainage area: </b>" + attr.DA + " (km<sup>2</sup>)<br/>" +
                        "<b>HUC2: </b>" +  + "<br/>" +
                        "<b>HUC4: </b>" +  + "<br/>" +
                        "<b>HUC6: </b>" +  + "<br/>" +
                        "<b>HUC8: </b>" +  + "<br/>" +
                        "<b>Matched streamgage name: </b>" +  + "<br/>" +
                        "<b>Matched streamgage number: </b>" +  + "<br/>" +
                        "<b>Matched streamgage agency: </b>");*/

                    $("#siteInfoPanel").append("<table class='infoTable'><tr><td><b>" + displayConst + "</b></td><td><span class='" + camelize(getValue(attr[attField])) + "'>" + getValue(attr[attField]) + "</span></td></tr>" +

                        "<tr><td><div class='tableSpacer'></div></td><td></td></tr>" +

                        "<tr><td><b>Network type</b></td><td>" + networkTypeFind(attr["network_centroids.NETWORK_TYPE"]) + "</td></tr>" +
                        "<tr><td><b>Types of wells</b></td><td>" + attr["tbl_Networks.WellTypeDesc"] + "</td></tr>" +
                        "<tr><td><b>Typical depth range</b></td><td>" + checkSigFigs(depth25) + " to " + checkSigFigs(depth75) + " feet</td></tr>" +

                        "<tr><td><div class='tableSpacer'></div></td><td></td></tr>" +

                        "<tr><td><b>Principal aquifer</b></td><td>" + attr["tbl_Networks.PrincipleAquifer"] + "</td></tr>" +
                        "<tr><td><b>Regional aquifer</b></td><td>" + attr["tbl_Networks.RegionalAquifer"] + "</td></tr>" +
                        "<tr><td><b>Aquifer material</b></td><td>" + attr["tbl_Networks.AquiferMaterial"] + "</td></tr>" +

                        "<tr><td><div class='tableSpacer'></div></td><td></td></tr>" +

                        "<tr><td><b>Additional information</b></td><td>" + attr["tbl_Networks.AdditionalInfo"] + "</td></tr>" +
                        "<tr><td><b>NAWQA network code</b></td><td>" + attr["tbl_Networks.SUCode"] + "</td></tr>" +
                        "<tr><td><b>Sample dates (1<sup>st</sup>, 2<sup>nd</sup>)</b></td><td>" + attr["tbl_NetworkDates.FirstDecadalSample"] + ", " + attr["tbl_NetworkDates.SecondDecadalSample"] + "</td></tr>" +

                        "<tr><td><div class='tableSpacer'></div></td><td></td></tr>" +

                        "<tr><td colspan='2' align='center'><b><a id='infoWindowLink' href='javascript:linkClick()'>ZOOM TO NETWORK</a></b></td></tr>" +
                        "<tr><td colspan='2' align='center'><a href='javascript:showTermExp()'>For explanation of table entries click here</a></td></tr></table>");
                }

                OID = feature.attributes["network_centroids.OBJECTID"];
                oldValue = getValue(attr[attField]);

                $("#infoWindowLink").on('click', linkClick);

            });

        }

    });

    function networkTypeFind(networkType) {
        var networkText;

        if (networkType == "URB") {
            networkText = "Urban land use network";
        } else if (networkType == "SUS") {
            networkText = "Major aquifer study";
        } else if (networkType == "AG") {
            networkText = "Agricultural land use network";
        }

        return networkText;
    }

    function checkSigFigs(value) {
        var outVal;

        var splitVal = value.toString().split('.');

        if ((splitVal[1] != null || splitVal[1] != undefined) && splitVal[1].length > 2) {
            outVal = value.toFixed(2);
        } else {
            outVal = value;
        }

        return outVal;
    }

    var geocoder = new Geocoder({
        value: '',
        maxLocations: 25,
        autoComplete: true,
        arcgisGeocoder: true,
        autoNavigate: false,
        map: map
    }, 'geosearch');
    geocoder.startup();
    geocoder.on('select', geocodeSelect);
    geocoder.on('findResults', geocodeResults);
    geocoder.on('clear', clearFindGraphics);
    on(geocoder.inputNode, 'keydown', function (e) {
        if (e.keyCode == 13) {
            setSearchExtent();
        }
    });

    // Symbols
    var sym = createPictureSymbol('../images/purple-pin.png', 0, 12, 13, 24);

    map.on('load', function (){
        map.infoWindow.set('highlight', false);
        map.infoWindow.set('titleInBody', false);
    });

    // Geosearch functions
    on(dom.byId('btnGeosearch'),'click', geosearch);

    // Optionally confine search to map extent
    function setSearchExtent (){
        if (dom.byId('chkExtent').checked === 1) {
            geocoder.activeGeocoder.searchExtent = map.extent;
        } else {
            geocoder.activeGeocoder.searchExtent = null;
        }
    }
    function geosearch() {
        setSearchExtent();
        var def = geocoder.find();
        def.then(function (res){
            geocodeResults(res);
        });
        // Close modal
        $('#geosearchModal').modal('hide');
    }
    function geocodeSelect(item) {
        clearFindGraphics();
        var g = (item.graphic ? item.graphic : item.result.feature);
        g.setSymbol(sym);
        //addPlaceGraphic(item.result,g.symbol);
        // Close modal
        //$('#geosearchModal').modal('hide');
    }
    function geocodeResults(places) {
        places = places.results;
        if (places.length > 0) {
            clearFindGraphics();
            var symbol = sym;
            // Create and add graphics with pop-ups
            for (var i = 0; i < places.length; i++) {
                //addPlaceGraphic(places[i], symbol);
            }
            //zoomToPlaces(places);
            var centerPoint = new Point(places[0].feature.geometry);
            map.centerAndZoom(centerPoint, 17);
            //map.setLevel(15);

        } else {
            //alert('Sorry, address or place not found.');  // TODO
        }
    }
    function stripTitle(title) {
        var i = title.indexOf(',');
        if (i > 0) {
            title = title.substring(0,i);
        }
        return title;
    }
    function addPlaceGraphic(item,symbol)  {
        var place = {};
        var attributes,infoTemplate,pt,graphic;
        pt = item.feature.geometry;
        place.address = item.name;
        place.score = item.feature.attributes.Score;
        // Graphic components
        attributes = { address:stripTitle(place.address), score:place.score, lat:pt.getLatitude().toFixed(2), lon:pt.getLongitude().toFixed(2) };
        infoTemplate = new PopupTemplate({title:'{address}', description: 'Latitude: {lat}<br/>Longitude: {lon}'});
        graphic = new Graphic(pt,symbol,attributes,infoTemplate);
        // Add to map
        map.graphics.add(graphic);
    }

    function zoomToPlaces(places) {
        var multiPoint = new Multipoint(map.spatialReference);
        for (var i = 0; i < places.length; i++) {
            multiPoint.addPoint(places[i].feature.geometry);
        }
        map.setExtent(multiPoint.getExtent().expand(2.0));
    }

    function clearFindGraphics() {
        map.infoWindow.hide();
        map.graphics.clear();
    }

    function createPictureSymbol(url, xOffset, yOffset, xWidth, yHeight) {
        return new PictureMarkerSymbol(
            {
                'angle': 0,
                'xoffset': xOffset, 'yoffset': yOffset, 'type': 'esriPMS',
                'url': url,
                'contentType': 'image/png',
                'width':xWidth, 'height': yHeight
            });
    }

    // Show modal dialog; handle legend sizing (both on doc ready)
    $(document).ready(function(){
        function showModal() {
            $('#geosearchModal').modal('show');
        }
        // Geosearch nav menu is selected
        $('#geosearchNav').click(function(){
            showModal();
        });

        function showAboutModal () {
            $('#aboutModal').modal('show');
        }
        $('#aboutNav').click(function(){
            showAboutModal();
        });

        // Show User Guide
        $('.showUserGuide').click(function(){
            $('#searchTab').trigger('click');
            $('#geosearchModal').modal('hide');
            $('#aboutModal').modal('hide');
            $('#faqModal').modal('hide');
            $('#userGuideModal').modal('show');
        });
        // Show User Guide tab2
        $('.showUserGuide2').click(function(){
            $('#geosearchModal').modal('hide');
            $('#aboutModal').modal('hide');
            $('#faqModal').modal('hide');
            $('#userGuideModal').modal('show');
            $('#iconTab').trigger('click');
            console.log("Opening tab 2 user guide");
        });

        
        // Show User Guide tab3
        $('.showUserGuide3').click(function(){
            $('#geosearchModal').modal('hide');
            $('#aboutModal').modal('hide');
            $('#faqModal').modal('hide');
            $('#userGuideModal').modal('show');
            console.log("Opening tab 3 user guide");
            $('#layersTab').trigger('click');
        });
        $('#userGuideNav').click(function(){
            $('#userGuideModal').modal('show');
            $('#searchTab').trigger('click');
        });
        $('#dataNav').click(function(){
            $('#dataModal').modal('show');
        });
        $('#trendResultHelp').click(function(){
            $('#trendResultsHelpBox').slideToggle(200);
        });
        $('#faqNav').click(function(){
            $('#faqModal').modal('show');
        });

         $("#showFAQ14").click(function() {
            $('#geosearchModal').modal('hide');
            $('#aboutModal').modal('hide');
            $('#userGuideModal').modal('hide');
            $('#dataModal').modal('hide');
            $('#faqModal').modal('show');
            $('#faq14header').trigger('click');
            
            // scrolling to FAQ 14
            $(document).ready(function(){
                setTimeout(function(){
                    $('#faqModal').animate({
                        scrollTop: $("#faq14header").offset().top -80
                    }, 500); 
                }, 800);  
            }); 
        });

        $("#html").niceScroll();
        $("#sidebar").niceScroll();
        $("#sidebar").scroll(function () {
            $("#sidebar").getNiceScroll().resize();
        });

        $("#legendDiv").niceScroll();

        maxLegendHeight =  ($('#mapDiv').height()) * 0.90;
        $('#legendElement').css('max-height', maxLegendHeight);

        $('#legendCollapse').on('shown.bs.collapse', function () {
            maxLegendHeight =  ($('#mapDiv').height()) * 0.90;
            $('#legendElement').css('max-height', maxLegendHeight);
            maxLegendDivHeight = ($('#legendElement').height()) - parseInt($('#legendHeading').css("height").replace('px',''));
            $('#legendDiv').css('max-height', maxLegendDivHeight);
        });

        $('#legendCollapse').on('hide.bs.collapse', function () {
            $('#legendElement').css('height', 'initial');
        });


        // FAQ Modal controls.
        $('#faq1header').click(function(){$('#faq1body').slideToggle(250);});
        $('#faq2header').click(function(){$('#faq2body').slideToggle(250);});
        $('#faq3header').click(function(){$('#faq3body').slideToggle(250);});
        $('#faq4header').click(function(){$('#faq4body').slideToggle(250);});
        $('#faq5header').click(function(){$('#faq5body').slideToggle(250);});
        $('#faq6header').click(function(){$('#faq6body').slideToggle(250);});
        $('#faq7header').click(function(){$('#faq7body').slideToggle(250);});
        $('#faq8header').click(function(){$('#faq8body').slideToggle(250);});
        $('#faq9header').click(function(){$('#faq9body').slideToggle(250);});
        $('#faq10header').click(function(){$('#faq10body').slideToggle(250);});
        $('#faq11header').click(function(){$('#faq11body').slideToggle(250);});
        $('#faq12header').click(function(){$('#faq12body').slideToggle(250);});
        $('#faq13header').click(function(){$('#faq13body').slideToggle(250);});
        $('#faq14header').click(function(){$('#faq14body').slideToggle(250);});
        $('#faq15header').click(function(){$('#faq15body').slideToggle(250);});
        $('#faq16header').click(function(){$('#faq16body').slideToggle(250);});
        $('#faq17header').click(function(){$('#faq17body').slideToggle(250);});
        $('#faq18header').click(function(){$('#faq18body').slideToggle(250);});
        $('#faq19header').click(function(){$('#faq19body').slideToggle(250);});
        $('#faq20header').click(function(){$('#faq20body').slideToggle(250);});
        $('#faq21header').click(function(){$('#faq21body').slideToggle(250);});
        $('#faq22header').click(function(){$('#faq22body').slideToggle(250);});
        $('#faq23header').click(function(){$('#faq23body').slideToggle(250);});
        $('#faq24header').click(function(){$('#faq24body').slideToggle(250);});
        $('#faq25header').click(function(){$('#faq25body').slideToggle(250);});
        $('#faq26header').click(function(){$('#faq26body').slideToggle(250);});
        $('#faq27header').click(function(){$('#faq27body').slideToggle(250);});
        $('#faq28header').click(function(){$('#faq28body').slideToggle(250);});

        $('.fullsize').click(function(){
            var data = "<img src='"+$(this).attr('src')+"'/>";
            var myWindow = window.open("data:text/html," + encodeURIComponent(data),"_blank");
            myWindow.focus();
        });

    });

    function getValue(val) {
        var textValue = "";
        if (val !== undefined) {
            val = val.toString();
            switch (val) {
                case "-2":
                    textValue = "large decrease";
                    break;
                case "-1":
                    textValue = "small decrease";
                    break;
                case "0":
                    textValue = "no change";
                    break;
                case "1":
                    textValue = "small increase";
                    break;
                case "2":
                    textValue = "large increase";
                    break;
                default:
                    textValue = "trend data not available";
                    break;
            }
        }
        return textValue;
    }

    function printMap() {

        var printParams = new PrintParameters();
        printParams.map = map;

        var template = new PrintTemplate();
        template.exportOptions = {
            width: 500,
            height: 400,
            dpi: 300
        };
        template.format = "PDF";
        template.layout = "Letter ANSI A Landscape 2";
        template.preserveScale = false;
        /*var trendsLegendLayer = new LegendLayer();
        trendsLegendLayer.layerId = "1";*/
        //legendLayer.subLayerIds = [*];

        var legendLayers = [];
        //legendLayers.push(trendsLegendLayer);

        var printTitle = getPrintTitle();

        template.layoutOptions = {
            "titleText": printTitle,
            "authorText" : "NAWQA",
            "copyrightText": "This page was produced by the nawqa decadal trends mapper"
        }

        var docTitle = template.layoutOptions.titleText;

        printParams.template = template;
        var printMap = new PrintTask("https://gis.wim.usgs.gov/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task");
        printMap.execute(printParams, printDone, printError);

        function printDone(event) {
            //alert(event.url);
            //window.open(event.url, "_blank");
            printCount++;
            //var printJob = $('<a href="'+ event.url +'" target="_blank">Printout ' + printCount + ' </a>');
            var printJob = $('<p><label>' + printCount + ': </label>&nbsp;&nbsp;<a href="'+ event.url +'" target="_blank">' + docTitle +' </a></p>');
            //$("#print-form").append(printJob);
            $("#printJobsDiv").find("p.toRemove").remove();
            $("#printModalBody").append(printJob);
            $("#printTitle").val("");
            $("#printExecuteButton").button('reset');
        }

        function printError(event) {
            alert("Sorry, an unclear print error occurred. Please try refreshing the application to fix the problem");
        }
    }

    require([
        'esri/dijit/Legend',
        'esri/tasks/locator',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/graphicsUtils',
        'esri/geometry/Point',
        'esri/geometry/Extent',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/FeatureLayer',
        'esri/SpatialReference',
        'esri/layers/WMSLayer',
        'esri/layers/WMSLayerInfo',
        "esri/layers/WebTiledLayer",
        'dijit/form/CheckBox',
        'dijit/form/RadioButton',
        'dojo/query',
        'dojo/dom',
        'dojo/dom-class',
        'dojo/dom-construct',
        'dojo/dom-style',
        'dojo/on'
    ], function(
        Legend,
        Locator,
        Query,
        QueryTask,
        graphicsUtils,
        Point,
        Extent,
        ArcGISDynamicMapServiceLayer,
        FeatureLayer,
        SpatialReference,
        WMSLayer,
        WMSLayerInfo,
        WebTiledLayer,
        CheckBox,
        RadioButton,
        query,
        dom,
        domClass,
        domConstruct,
        domStyle,
        on
    ) {

        var legendLayers = [];
        var layersObject = [];
        var layerArray = [];
        var staticLegendImage;
        var identifyTask, identifyParams;
        var navToolbar;
        var locator;

        //create global layers lookup
        var mapLayers = [];

        $.each(allLayers, function (index,group) {
            console.log('processing: ', group.groupHeading)


            //sub-loop over layers within this groupType
            $.each(group.layers, function (layerName,layerDetails) {

                var legendLayerName = layerName;
                if (legendLayerName == "pest layer" || legendLayerName == "Eco Sites layer" || legendLayerName == "WRTDS Concentration Sites" || legendLayerName == "WRTDS Flux Sites") {
                    legendLayerName = "Trend results";
                }
                //check for exclusiveGroup for this layer
                var exclusiveGroupName = '';
                if (layerDetails.wimOptions.exclusiveGroupName) {
                    exclusiveGroupName = layerDetails.wimOptions.exclusiveGroupName;
                }

                if (layerDetails.wimOptions.layerType === 'agisFeature') {
                    var layer = new FeatureLayer(layerDetails.url, layerDetails.options);
                    if (layerDetails.wimOptions.renderer !== undefined) {
                        layer.setRenderer(layerDetails.wimOptions.renderer);
                    }
                    //check if include in legend is true
                    if (layerDetails.wimOptions && layerDetails.wimOptions.includeLegend == true){
                        legendLayers.push({layer:layer, title: legendLayerName});
                    }
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName, layerDetails.options, layerDetails.wimOptions);
                    //addMapServerLegend(layerName, layerDetails);
                }

                else if (layerDetails.wimOptions.layerType === 'agisWMS') {
                    var layer = new WMSLayer(layerDetails.url, {resourceInfo: layerDetails.options.resourceInfo, visibleLayers: layerDetails.options.visibleLayers }, layerDetails.options);
                    //check if include in legend is true
                    if (layerDetails.wimOptions && layerDetails.wimOptions.includeLegend == true){
                        legendLayers.push({layer:layer, title: legendLayerName});
                    }
                    //map.addLayer(layer);
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName, layerDetails.options, layerDetails.wimOptions);
                    //addMapServerLegend(layerName, layerDetails);
                }

                else if (layerDetails.wimOptions.layerType === 'webTiledLayer') {
                    var layer = new WebTiledLayer(layerDetails.url, layerDetails.options);
                    //check if include in legend is true
                    if (layerDetails.wimOptions && layerDetails.wimOptions.includeLegend == true){
                        legendLayers.push({layer:layer, title: legendLayerName});
                    }
                    //map.addLayer(layer);
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName, layerDetails.options, layerDetails.wimOptions);
                    //addMapServerLegend(layerName, layerDetails);
                }

                else if (layerDetails.wimOptions.layerType === 'agisDynamic') {
                    var layer = new ArcGISDynamicMapServiceLayer(layerDetails.url, layerDetails.options);
                    //check if include in legend is true
                    if (layerDetails.visibleLayers) {
                        layer.setVisibleLayers(layerDetails.visibleLayers);
                    }
                    if (layerDetails.wimOptions && layerDetails.wimOptions.layerDefinitions) {
                        var layerDefs = [];
                        $.each(layerDetails.wimOptions.layerDefinitions, function (index, def) {
                            layerDefs[index] = def;
                        });
                        layer.setLayerDefinitions(layerDefs);
                    }
                    if (layerDetails.wimOptions && layerDetails.wimOptions.includeLegend == true){
                        legendLayers.push({layer:layer, title: legendLayerName});
                    }
                    //map.addLayer(layer);
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName, layerDetails.options, layerDetails.wimOptions);
                    //addMapServerLegend(layerName, layerDetails);
                }

                else if (layerDetails.wimOptions.layerType === 'agisImage') {
                    var layer = new ArcGISImageServiceLayer(layerDetails.url, layerDetails.options);
                    //check if include in legend is true
                    if (layerDetails.wimOptions && layerDetails.wimOptions.includeLegend == true){
                        legendLayers.push({layer:layer, title: legendLayerName});
                    }
                    if (layerDetails.visibleLayers) {
                        layer.setVisibleLayers(layerDetails.visibleLayers);
                    }
                    //map.addLayer(layer);
                    addLayer(group.groupHeading, group.showGroupHeading, layer, layerName, exclusiveGroupName, layerDetails.options, layerDetails.wimOptions);
                    //addMapServerLegend(layerName, layerDetails);
                }
            });
        });

        function addLayer(groupHeading, showGroupHeading, layer, layerName, exclusiveGroupName, options, wimOptions) {

            //add layer to map
            //layer.addTo(map);
            map.addLayer(layer);

            //add layer to layer list
            mapLayers.push([exclusiveGroupName,camelize(layerName),layer]);

            //check if its an exclusiveGroup item
            if (exclusiveGroupName) {

                if (!$('#' + camelize(exclusiveGroupName)).length) {
                    var exGroupRoot;
                    if (exclusiveGroupName == "Data Source") {
                        var exGroupRoot = $('<div id="' + camelize(exclusiveGroupName +" Root") + '" class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + exclusiveGroupName + '<span id="info' + camelize(exclusiveGroupName) + '" title="Data Source identifies the scale, year and emulsion of the imagery that was used to map the wetlands and riparian areas for a given area. It also identifies areas that have Scalable data, which is an interim data product in areas of the nation where standard compliant wetland data is not yet available. Click for more info on Scalable data." class="glyphspan glyphicon glyphicon-question-sign pull-right"></span><span id="opacity' + camelize(exclusiveGroupName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span></button> </div>');
                    } else {
                        var exGroupRoot = $('<div id="' + camelize(exclusiveGroupName +" Root") + '" class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + exclusiveGroupName + '</button> </div>');
                    }

                    exGroupRoot.click(function(e) {
                        exGroupRoot.find('i.glyphspan').toggleClass('fa-check-square-o fa-square-o');

                        $.each(mapLayers, function (index, currentLayer) {

                            var tempLayer = map.getLayer(currentLayer[2].id);

                            if (currentLayer[0] == exclusiveGroupName) {
                                if ($("#" + currentLayer[1]).find('i.glyphspan').hasClass('fa-dot-circle-o') && exGroupRoot.find('i.glyphspan').hasClass('fa-check-square-o')) {
                                    console.log('adding layer: ',currentLayer[1]);
                                    map.addLayer(currentLayer[2]);
                                    var tempLayer = map.getLayer(currentLayer[2].id);
                                    tempLayer.setVisibility(true);
                                } else if (exGroupRoot.find('i.glyphspan').hasClass('fa-square-o')) {
                                    console.log('removing layer: ',currentLayer[1]);
                                    //map.removeLayer(currentLayer[2]);
                                    var tempLayer = map.getLayer(currentLayer[2].id);
                                    tempLayer.setVisibility(false);
                                }
                            }

                        });
                    });

                    var exGroupDiv = $('<div id="' + camelize(exclusiveGroupName) + '" class="btn-group-vertical" data-toggle="buttons"></div>');
                    $('#toggle').append(exGroupDiv);
                    console.log('here');
                }

                //create radio button
                //var button = $('<input type="radio" name="' + camelize(exclusiveGroupName) + '" value="' + camelize(layerName) + '"checked>' + layerName + '</input></br>');
                if (layer.visible) {
                    var button = $('<div id="' + camelize(layerName) + '" class="btn-group-vertical lyrTog radioTog" style="cursor: pointer;" data-toggle="buttons"> <label class="btn btn-default"  style="font-weight: bold;text-align: left"> <input type="radio" name="' + camelize(exclusiveGroupName) + '" autocomplete="off"><i class="glyphspan fa fa-dot-circle-o ' + camelize(exclusiveGroupName) + '"></i>&nbsp;&nbsp;' + layerName + '</label> </div>');
                } else {
                    var button = $('<div id="' + camelize(layerName) + '" class="btn-group-vertical lyrTog radioTog" style="cursor: pointer;" data-toggle="buttons"> <label class="btn btn-default"  style="font-weight: bold;text-align: left"> <input type="radio" name="' + camelize(exclusiveGroupName) + '" autocomplete="off"><i class="glyphspan fa fa-circle-o ' + camelize(exclusiveGroupName) + '"></i>&nbsp;&nbsp;' + layerName + '</label> </div>');
                }

                $('#' + camelize(exclusiveGroupName)).append(button);

                //click listener for radio button
                button.click(function(e) {

                    if ($(this).find('i.glyphspan').hasClass('fa-circle-o')) {
                        $(this).find('i.glyphspan').toggleClass('fa-dot-circle-o fa-circle-o');

                        var newLayer = $(this)[0].id;

                        $.each(mapLayers, function (index, currentLayer) {

                            if (currentLayer[0] == exclusiveGroupName) {
                                if (currentLayer[1] == newLayer && $("#" + camelize(exclusiveGroupName + " Root")).find('i.glyphspan').hasClass('fa-check-square-o')) {
                                    console.log('adding layer: ',currentLayer[1]);
                                    map.addLayer(currentLayer[2]);
                                    var tempLayer = map.getLayer(currentLayer[2].id);
                                    tempLayer.setVisibility(true);
                                    ////$('#' + camelize(currentLayer[1])).toggle();
                                }
                                else if (currentLayer[1] == newLayer && $("#" + camelize(exclusiveGroupName + " Root")).find('i.glyphspan').hasClass('fa-square-o')) {
                                    console.log('group heading not checked');
                                }
                                else {
                                    console.log('removing layer: ',currentLayer[1]);
                                    //map.removeLayer(currentLayer[2]);
                                    var tempLayer = map.getLayer(currentLayer[2].id);
                                    tempLayer.setVisibility(false);
                                    if ($("#" + currentLayer[1]).find('i.glyphspan').hasClass('fa-dot-circle-o')) {
                                        $("#" + currentLayer[1]).find('i.glyphspan').toggleClass('fa-dot-circle-o fa-circle-o');
                                    }
                                    //$('#' + camelize(this[1])).toggle();
                                }
                            }
                        });
                    }
                });
            }

            ////not an exclusive group item
            else if (wimOptions.includeInLayerList) {

                //create layer toggle
                //var button = $('<div align="left" style="cursor: pointer;padding:5px;"><span class="glyphspan glyphicon glyphicon-check"></span>&nbsp;&nbsp;' + layerName + '</div>');
                if ((layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true && wimOptions.moreinfo !== undefined && wimOptions.moreinfo)) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + layerName + '<span id="info' + camelize(layerName) + '" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span><span id="opacity' + camelize(layerName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span></button></div>');
                } else if ((!layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true && wimOptions.moreinfo !== undefined && wimOptions.moreinfo)) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;' + layerName + '<span id="info' + camelize(layerName) + '" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></span><span id="opacity' + camelize(layerName) + '" style="padding-right: 5px" class="glyphspan glyphicon glyphicon-adjust pull-right"></span></button></div>');
                } else if (layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + layerName + '<span id="info' + camelize(layerName) + '" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></button></span></div>');
                } else if ((!layer.visible && wimOptions.hasOpacitySlider !== undefined && wimOptions.hasOpacitySlider == true)) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;' + layerName + '<span id="opacity' + camelize(layerName) + '" class="glyphspan glyphicon glyphicon-adjust pull-right"></button></span></div>');
                } else if ((layer.visible && wimOptions.moreinfo !== undefined && wimOptions.moreinfo)) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + layerName + '<span id="opacity' + camelize(layerName) + '" class="glyphspan glyphicon glyphicon-adjust pull-right"></button></span></div>');
                } else if ((!layer.visible && wimOptions.moreinfo !== undefined && wimOptions.moreinfo)) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;' + layerName + '<span id="info' + camelize(layerName) + '" title="more info" class="glyphspan glyphicon glyphicon-question-sign pull-right"></button></span></div>');
                } else if (layer.visible) {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default active" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-check-square-o"></i>&nbsp;&nbsp;' + layerName + '</button></span></div>');
                } else {
                    var button = $('<div class="btn-group-vertical lyrTog" style="cursor: pointer;" data-toggle="buttons"> <button type="button" class="btn btn-default" aria-pressed="true" style="font-weight: bold;text-align: left"><i class="glyphspan fa fa-square-o"></i>&nbsp;&nbsp;' + layerName + '</button> </div>');
                }


                //click listener for regular
                button.click(function(e) {

                    //toggle checkmark
                    $(this).find('i.glyphspan').toggleClass('fa-check-square-o fa-square-o');
                    $(this).find('button').button('toggle');



                    //$('#' + camelize(layerName)).toggle();

                    //layer toggle
                    if (layer.visible) {
                        layer.setVisibility(false);
                    } else {
                        layer.setVisibility(true);
                    }

                    if (wimOptions.otherLayersToggled) {
                        $.each(wimOptions.otherLayersToggled, function (key, value) {
                            var lyr = map.getLayer(value);
                            lyr.setVisibility(layer.visible);
                        });
                    }

                });
            }

            //group heading logic
            if (showGroupHeading !== undefined) {

                //camelize it for divID
                var groupDivID = camelize(groupHeading);

                //check to see if this group already exists
                if (!$('#' + groupDivID).length) {
                    //if it doesn't add the header
                    if (showGroupHeading) {
                        var groupDiv = $('<div id="' + groupDivID + '"><div class="alert alert-info" role="alert"><strong>' + groupHeading + '</strong></div></div>');
                    } else {
                        var groupDiv = $('<div id="' + groupDivID + '"></div>');
                    }
                    $('#toggle').append(groupDiv);
                }

                //if it does already exist, append to it

                if (exclusiveGroupName) {
                    //if (!exGroupRoot.length)$("#slider"+camelize(layerName))
                    $('#' + groupDivID).append(exGroupRoot);
                    $('#' + groupDivID).append(exGroupDiv);
                    if (wimOptions.moreinfo !== undefined && wimOptions.moreinfo) {
                        var id = "#info" + camelize(exclusiveGroupName);
                        var moreinfo = $(id);
                        moreinfo.click(function(e) {
                            window.open(wimOptions.moreinfo, "_blank");
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    }
                    if ($("#opacity"+camelize(exclusiveGroupName)).length > 0) {
                        var id = "#opacity" + camelize(exclusiveGroupName);
                        var opacity = $(id);
                        opacity.click(function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            $(".opacitySlider").remove();
                            var currOpacity = map.getLayer(options.id).opacity;
                            var slider = $('<div class="opacitySlider"><label id="opacityValue">Opacity: ' + currOpacity + '</label><label class="opacityClose pull-right">X</label><input id="slider" type="range"></div>');
                            $("body").append(slider);
                            $("#slider")[0].value = currOpacity * 100;
                            $(".opacitySlider").css('left', event.clientX - 180);
                            $(".opacitySlider").css('top', event.clientY - 50);

                            $(".opacitySlider").mouseleave(function () {
                                $(".opacitySlider").remove();
                            });

                            $(".opacityClose").click(function () {
                                $(".opacitySlider").remove();
                            });
                            $('#slider').change(function (event) {
                                //get the value of the slider with this call
                                var o = ($('#slider')[0].value) / 100;
                                console.log("o: " + o);
                                $("#opacityValue").html("Opacity: " + o)
                                map.getLayer(options.id).setOpacity(o);

                                if (wimOptions.otherLayersToggled) {
                                    $.each(wimOptions.otherLayersToggled, function (key, value) {
                                        var lyr = map.getLayer(value);
                                        lyr.setOpacity(o);
                                    });
                                }
                                //here I am just specifying the element to change with a "made up" attribute (but don't worry, this is in the HTML specs and supported by all browsers).
                                //var e = '#' + $(this).attr('data-wjs-element');
                                //$(e).css('opacity', o)
                            });

                        });
                    }
                } else {
                    $('#' + groupDivID).append(button);
                    if (wimOptions.moreinfo !== undefined && wimOptions.moreinfo) {
                        var id = "#info" + camelize(layerName);
                        var moreinfo = $(id);
                        moreinfo.click(function(e) {
                            window.open(wimOptions.moreinfo, "_blank");
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    }
                    if ($("#opacity"+camelize(layerName)).length > 0) {
                        $("#opacity"+camelize(layerName)).click(function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            $(".opacitySlider").remove();
                            var currOpacity = map.getLayer(options.id).opacity;
                            var slider = $('<div class="opacitySlider"><label id="opacityValue">Opacity: ' + currOpacity + '</label><label class="opacityClose pull-right">X</label><input id="slider" type="range"></div>');
                            $("body").append(slider);[0]

                            $("#slider")[0].value = currOpacity*100;
                            $(".opacitySlider").css('left', event.clientX-180);
                            $(".opacitySlider").css('top', event.clientY-50);

                            $(".opacitySlider").mouseleave(function() {
                                $(".opacitySlider").remove();
                            });

                            $(".opacityClose").click(function() {
                                $(".opacitySlider").remove();
                            });
                            $('#slider').change(function(event) {
                                //get the value of the slider with this call
                                var o = ($('#slider')[0].value)/100;
                                console.log("o: " + o);
                                $("#opacityValue").html("Opacity: " + o)
                                map.getLayer(options.id).setOpacity(o);

                                if (wimOptions.otherLayersToggled) {
                                    $.each(wimOptions.otherLayersToggled, function (key, value) {
                                        var lyr = map.getLayer(value);
                                        lyr.setOpacity(o);
                                    });
                                }
                                //here I am just specifying the element to change with a "made up" attribute (but don't worry, this is in the HTML specs and supported by all browsers).
                                //var e = '#' + $(this).attr('data-wjs-element');
                                //$(e).css('opacity', o)
                            });
                        });
                    }
                }
            }

            else {
                //otherwise append
                $('#toggle').append(button);
                if (wimOptions.moreinfo !== undefined && wimOptions.moreinfo) {
                    var id = "#info" + camelize(layerName);
                    var moreinfo = $(id);
                    moreinfo.click(function(e) {
                        alert(e.currentTarget.id);
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            }
        }



        //get visible and non visible layer lists
        function addMapServerLegend(layerName, layerDetails) {


            if (layerDetails.wimOptions.layerType === 'agisFeature') {

                //for feature layer since default icon is used, put that in legend
                var legendItem = $('<div align="left" id="' + camelize(layerName) + '"><img alt="Legend Swatch" src="https://raw.githubusercontent.com/Leaflet/Leaflet/master/dist/images/marker-icon.png" /><strong>&nbsp;&nbsp;' + layerName + '</strong></br></div>');
                $('#legendDiv').append(legendItem);

            }

            else if (layerDetails.wimOptions.layerType === 'agisWMS') {

                //for WMS layers, for now just add layer title
                var legendItem = $('<div align="left" id="' + camelize(layerName) + '"><img alt="Legend Swatch" src="https://placehold.it/25x41" /><strong>&nbsp;&nbsp;' + layerName + '</strong></br></div>');
                $('#legendDiv').append(legendItem);

            }

            else if (layerDetails.wimOptions.layerType === 'agisDynamic') {

                //create new legend div
                var legendItemDiv = $('<div align="left" id="' + camelize(layerName) + '"><strong>&nbsp;&nbsp;' + layerName + '</strong></br></div>');
                $('#legendDiv').append(legendItemDiv);

                //get legend REST endpoint for swatch
                $.getJSON(layerDetails.url + '/legend?f=json', function (legendResponse) {

                    console.log(layerName,'legendResponse',legendResponse);



                    //make list of layers for legend
                    if (layerDetails.options.layers) {
                        //console.log(layerName, 'has visisble layers property')
                        //if there is a layers option included, use that
                        var visibleLayers = layerDetails.options.layers;
                    }
                    else {
                        //console.log(layerName, 'no visible layers property',  legendResponse)

                        //create visibleLayers array with everything
                        var visibleLayers = [];
                        $.grep(legendResponse.layers, function(i,v) {
                            visibleLayers.push(v);
                        });
                    }

                    //loop over all map service layers
                    $.each(legendResponse.layers, function (i, legendLayer) {

                        //var legendHeader = $('<strong>&nbsp;&nbsp;' + legendLayer.layerName + '</strong>');
                        //$('#' + camelize(layerName)).append(legendHeader);

                        //sub-loop over visible layers property
                        $.each(visibleLayers, function (i, visibleLayer) {

                            //console.log(layerName, 'visibleLayer',  visibleLayer);

                            if (visibleLayer == legendLayer.layerId) {

                                console.log(layerName, visibleLayer,legendLayer.layerId, legendLayer)

                                //console.log($('#' + camelize(layerName)).find('<strong>&nbsp;&nbsp;' + legendLayer.layerName + '</strong></br>'))

                                var legendHeader = $('<strong>&nbsp;&nbsp;' + legendLayer.layerName + '</strong></br>');
                                $('#' + camelize(layerName)).append(legendHeader);

                                //get legend object
                                var feature = legendLayer.legend;
                                /*
                                 //build legend html for categorized feautres
                                 if (feature.length > 1) {
                                 */

                                //placeholder icon
                                //<img alt="Legend Swatch" src="http://placehold.it/25x41" />

                                $.each(feature, function () {

                                    //make sure there is a legend swatch
                                    if (this.imageData) {
                                        var legendFeature = $('<img alt="Legend Swatch" src="data:image/png;base64,' + this.imageData + '" /><small>' + this.label.replace('<', '').replace('>', '') + '</small></br>');

                                        $('#' + camelize(layerName)).append(legendFeature);
                                    }
                                });
                                /*
                                 }
                                 //single features
                                 else {
                                 var legendFeature = $('<img alt="Legend Swatch" src="data:image/png;base64,' + feature[0].imageData + '" /><small>&nbsp;&nbsp;' + legendLayer.layerName + '</small></br>');

                                 //$('#legendDiv').append(legendItem);
                                 $('#' + camelize(layerName)).append(legendFeature);

                                 }
                                 */
                            }
                        }); //each visible layer
                    }); //each legend item
                }); //get legend json
            }
        }
        /* parse layers.js */

        legend = new Legend({
            map: map,
            layerInfos: legendLayers
        }, "legendDiv");
        legend.startup();


    });//end of require statement containing legend building code

    function linkClick() {

        map.setCursor("wait");
        console.log(sucode4FeatureLinkZoom);
        var query = new esri.tasks.Query();
        query.where = "SUCODE = '" + sucode4FeatureLinkZoom + "'";
        query.returnGeometry = true;
        var queryTask = new esri.tasks.QueryTask(map.getLayer("networkBoundaries").url+"/0");
        queryTask.execute(query, function (results) {
            console.log('returned with result?');
            var feature = results.features[0];
            var featureExtent = feature.geometry.getExtent();
            map.setExtent(featureExtent, true);
            //setCursorByID("mainDiv", "default");
            map.setCursor("default");
        });

    }

});


$(document).ready(function () {
    //7 lines below are handler for the legend buttons. to be removed if we stick with the in-map legend toggle
    //$('#legendButtonNavBar, #legendButtonSidebar').on('click', function () {
    //    $('#legend').toggle();
    //    //return false;
    //});
    //$('#legendClose').on('click', function () {
    //    $('#legend').hide();
    //});

});
