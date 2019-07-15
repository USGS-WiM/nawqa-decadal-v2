/**
 * Created by bdraper on 4/27/2015.
 */
var allLayers;
var renderer;

var constituentDropURl = 'https://gis.wim.usgs.gov/arcgis/rest/services/NAWQA/decadal_test/MapServer/6/query?where=OBJECTID+%3E+0&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=ConstituentType,DisplayName&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=json';
//PROD == NAWQA/decadal

require([
    "esri/geometry/Extent",
    "esri/layers/WMSLayerInfo",
    "esri/layers/FeatureLayer",
    "esri/layers/WebTiledLayer",
    "esri/renderers/UniqueValueRenderer",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "dojo/domReady!"
], function(
    Extent,
    WMSLayerInfo,
    FeatureLayer,
    WebTiledLayer,
    UniqueValueRenderer,
    SimpleLineSymbol,
    SimpleMarkerSymbol
) {

    var defaultSymbol = null;

	var count = 2;
    renderer = new esri.renderer.UniqueValueRenderer(defaultSymbol, "ChemData.C12_P00940_Chloride");
    renderer2 = new esri.renderer.UniqueValueRenderer(defaultSymbol);
    renderer3 = new esri.renderer.UniqueValueRenderer(defaultSymbol, "ChemData.C12_P00940_Chloride");

	orangeBigSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/orange_large.png", 45, 45);
	greenBigSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/green_large.png", 45, 45);
	noChangeSymbolSmall = new esri.symbol.PictureMarkerSymbol("images/nochange.png", 12, 12);
	noChangeSymbolLarge = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/no_change.png", 75, 40);
	orangeSmallSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/orange_small.png", 45, 25);
	greenSmallSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/green_small.png", 45, 25);
	blankSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/blank.png", 45, 25);
	/* noDataSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/no_data.png", 45, 25); */
    allNetworksSymbol = new esri.symbol.PictureMarkerSymbol("images/allnetworks.png", 14, 14);

	renderer.addValue({
		value: "2", 
		symbol: orangeBigSymbol,
		label: "Large increase"
	});
    renderer.addValue({
		value: "1", 
		symbol: orangeSmallSymbol,
		label: "Small increase"
	});
    /*renderer.addValue({
    	value: "0", 
    	symbol: new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 9,
							new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
							new dojo.Color([155,155,155,0]), 0),
							new dojo.Color([0,0,0,1])),
    	label: "No change"
    });*/
	renderer.addValue({
		value: "0",
		symbol: noChangeSymbolSmall,
		label: "No significant change"
	});
    renderer.addValue({
		value: "-1", 
		symbol: greenSmallSymbol,
		label: "Small decrease"
	});
    renderer.addValue({
		value: "-2", 
		symbol: greenBigSymbol,
		label: "Large decrease"
	});
	/* renderer.addValue({
		value: "-999", 
		symbol: noDataSymbol,
		label: "Trend data not available"
	}); */
	
	renderer2.addValue({
		value: "1", 
		symbol: orangeSmallSymbol,
		label: "Increase"
	});
    /*renderer2.addValue({
    	value: "0", 
    	symbol: new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 9,
							new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
							new dojo.Color([0,0,0]), 1),
							new dojo.Color([0,0,0,1])),
    	label: "No change"
    });*/
	renderer2.addValue({
		value: "0",
		symbol: noChangeSymbolSmall,
		label: "No significant change"
	});
    renderer2.addValue({
		value: "-1", 
		symbol: greenSmallSymbol,
		label: "Decrease"
	});
	/* renderer2.addValue({
		value: "-999", 
		symbol: noDataSymbol,
		label: "Trend data not available"
    }); */
    renderer3.addValue({
		value: "2", 
		symbol: allNetworksSymbol,
		label: "Network"
	});
    renderer3.addValue({
		value: "0", 
		symbol: allNetworksSymbol,
		label: "Network"
	});
    renderer3.addValue({
		value: "2", 
		symbol: allNetworksSymbol,
		label: "Network"
	});
    renderer3.addValue({
		value: "-2", 
		symbol: allNetworksSymbol,
		label: "Network"
	});
    renderer3.addValue({
		value: "1", 
		symbol: allNetworksSymbol,
		label: "Network"
	});
    renderer3.addValue({
		value: "-1", 
		symbol: allNetworksSymbol,
		label: "Network"
	});

    allLayers = [//
        {
            "groupHeading": "sites",
            "showGroupHeading": false,
            "includeInLayerList": false,
            "layers": {
                "All Networks": {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/NAWQA/decadal_test/MapServer/0", //PROD == NAWQA/decadal
                    "options": {
                        "id": "allNetworks",
                        /* "visibleLayers": [0], */
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        /* "orderByFields": [ "network_centroids.P00940_Chloride DESC" ], */
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "includeLegend": true,
                        "renderer": renderer3
                    }
                }, "Network Boundaries" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/NAWQA/networks/MapServer",
                    "visibleLayers": [0],
                    "options": {
                        "id": "networkBoundaries",
                        "opacity": 0.75,
                        "visible": true
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "includeLegend" : false
                    }
                },
                "Magnitude of change": {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/NAWQA/decadal_test/MapServer/0", //PROD == NAWQA/decadal
                    "options": {
                        "id": "networkLocations",
                        /* "visibleLayers": [0], */
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        /* "orderByFields": [ "network_centroids.P00940_Chloride DESC" ], */
                        "visible": true
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "includeLegend": true,
                        "renderer": renderer
                    }
                },
                 "Land use 2001" : {
                    "url": "https://smallscale.nationalmap.gov/arcgis/rest/services/LandCover/MapServer",
                    "visibleLayers": [2],
                    "options": {
                        "id": "nlcd",
                        "opacity": 0.75,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                }, "Trend sites" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/NAWQA/trendSites_test/MapServer",
                    "options": {
                        "id": "trendSites",
                        "opacity": 1.0,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": false,
                        "includeLegend": false
                    }
                }, "Principal Aquifers": {
                    "url": "https://nwismapper.s3.amazonaws.com/pr_aq/${level}/${row}/${col}.png",
                    "options": {
                        "id": "principalAquifers",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "webTiledLayer",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "includeLegend": true,
                        "otherLayersToggled": ["glacialAquifer"],
                        "moreinfo": "https://water.usgs.gov/ogw/aquifer/principal/aquifrp025.xml",
                    }
                }, "Glacial Aquifer" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/NAWQA/decadal_test/MapServer", //PROD == NAWQA/decadal
                    "visibleLayers": [2],
                    "options": {
                        "id": "glacialAquifer",
                        "opacity": 0.4,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisDynamic",
                        "includeInLayerList": false,
                        "includeLegend": false
                    }
                }
            }
        }
    ]

});





/* "Land use 2001" : {
    "url": "https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2001_Land_Cover_L48/wms",
    //"visibleLayers": [24],
    "options": {
        "id": "nlcd",
        "opacity": 0.75,
        "visible": false,
        "resourceInfo": {
            extent: new Extent(-8.64846,49.8638,1.76767,60.8612,
                {wkid: 4326
                }),
                "layerInfos": [new WMSLayerInfo({
                    "name": 'NLCD_2001_Land_Cover_L48',
                    "title": 'NLCD_2001_Land_Cover_L48',
                    "transparent": false
                })]
        },
        visibleLayers: ['NLCD_2001_Land_Cover_L48']
    },
    "wimOptions": {
        "type": "layer",
        "layerType": "agisWMS",
        "includeInLayerList": true,
        "hasOpacitySlider": true,
        "includeLegend" : true
    }
}, */