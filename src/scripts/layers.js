/**
 * Created by bdraper on 4/27/2015.
 */
var allLayers;
var renderer;

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
    renderer = new esri.renderer.UniqueValueRenderer(defaultSymbol, "network_centroids.P00940_Chloride");
	renderer2 = new esri.renderer.UniqueValueRenderer(defaultSymbol);

	orangeBigSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/orange_large.png", 45, 45);
	greenBigSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/green_large.png", 45, 45);
	noChangeSymbolSmall = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/no_change.png", 45, 25);
	noChangeSymbolLarge = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/no_change.png", 75, 40);
	orangeSmallSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/orange_small.png", 45, 25);
	greenSmallSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/green_small.png", 45, 25);
	blankSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/blank.png", 45, 25);
	noDataSymbol = new esri.symbol.PictureMarkerSymbol("https://nawqatrends.wim.usgs.gov/nawqaimages/no_data.png", 45, 25);

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
	renderer.addValue({
		value: "-999", 
		symbol: noDataSymbol,
		label: "Trend data not available"
	});
	
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
	renderer2.addValue({
		value: "-999", 
		symbol: noDataSymbol,
		label: "Trend data not available"
	});

    allLayers = [//
        {
            "groupHeading": "sites",
            "showGroupHeading": false,
            "includeInLayerList": false,
            "layers": {
                "Magnitude of change": {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/NAWQA/tablesTest/MapServer/0",
                    "options": {
                        "id": "pestSites",
                        /* "visibleLayers": [0], */
                        "mode": esri.layers.FeatureLayer.MODE_ONDEMAND,
                        /* "outFields": ["*"],
                        "orderByFields": [ "network_centroids.P00940_Chloride DESC" ], */
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
                "Pricipal Aquifers" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/NAWQA/DecadalMap/MapServer/1",
                    "options": {
                        "id": "ecoSites",
                        "opacity": 1.00,
                        "mode": FeatureLayer.MODE_SNAPSHOT,
                        "outFields": ["*"],
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisFeature",
                        "includeInLayerList": false,
                        "hasOpacitySlider": true,
                        "includeLegend" : true
                    }
                },
                "Land use 2001" : {
                    "url": "https://raster.nationalmap.gov/arcgis/rest/services/LandCover/conus_01/MapServer",
                    "visibleLayers": [0],
                    "options": {
                        "id": "wrtdsSites",
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
                },
                "Network Boundaries" : {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/NetworkBoundaries/MapServer",
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
                "Trend sites": {
                    "url": "https://gis.wim.usgs.gov/arcgis/rest/services/NAWQA/trendSites/MapServer",
                    "options": {
                        "id": "lu2012",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        /*"layerType": "agisImage",*/
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "includeLegend": false
                    }
                },
                "Principal Aquifers": {
                    "url": "https://nwis-mapper.s3.amazonaws.com/pr_aq/${level}/${row}/${col}.png",
                    "options": {
                        "id": "lu2002",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "webTiledLayer",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "includeLegend": true
                    }
                },
                "Inorganic": {
                    "url": "https://supermario.wim.usgs.gov/arcgis/rest/services/SWTrends/lu1982_100515_test/ImageServer",
                    "options": {
                        "id": "lu1982",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisImage",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "includeLegend": true
                    }
                },
                "Organic": {
                    "url": "https://supermario.wim.usgs.gov/arcgis/rest/services/SWTrends/lu1974_100515_test/ImageServer",
                    "options": {
                        "id": "lu1974",
                        "opacity": 0.5,
                        "visible": false
                    },
                    "wimOptions": {
                        "type": "layer",
                        "layerType": "agisImage",
                        "includeInLayerList": true,
                        "hasOpacitySlider": true,
                        "includeLegend": true
                    }
                }
            }
        }
    ]

});





