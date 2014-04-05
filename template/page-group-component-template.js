define( "pageGroupComponentTemplate",
	[
		"domo",
		"domoStringify"
	],
	function construct( ){
		return domoStringify( DIV( {
			"page-group": "",
			"auto-resize": "",
			"name": "page-group",
			"container": ""
		} ) );
	} );