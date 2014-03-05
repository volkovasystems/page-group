define( "pageGroupStyle",
	[
		"absurd",
		"jquery",
		"absurdCompiler"
	],
	function construct( ){
		var absurd = Absurd( );
		var pageGroupStyle = function pageGroupStyle( GUID ){
			var style = { };
			var selector =  "div[page-group='" + GUID + "']";
			style[ selector ] = {
				"position": "absolute !important",
				"top": "0px !important",
				"left": "0px !important"
			};
			absurd.add( style ).compile( absurdCompiler( "page-group", GUID ) );
			return style[ selector ];
		};
		return pageGroupStyle;
	} );