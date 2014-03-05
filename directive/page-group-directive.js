define( "pageGroupDirective",
	[
		"amplify",
		"arbiter",
		"chance",
		"jquery",
		"requirejs",
		"angular"
	],
	function construct( ){
		requirejs.config( {
			"paths": {
				"pageGroupStyle": staticBaseURL + "/page-group/style/page-group-style",
				"pageGroupController": staticBaseURL + "/page-group/controller/page-group-controller"
			}
		} );

		requirejs( [
				"pageGroupStyle",
				"pageGroupController",
				"appDetermine"
			],
			function construct( pageGroupStyle, 
								pageGroupController )
			{
				appDetermine( "PageGroup" )
					.directive( "pageGroup",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": pageGroupController,
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@",
										"container": "@"
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );
	
										scope.GUID = attribute.pageGroup;
										if( typeof scope.GUID != "string" ){
											scope.GUID = chance.guid( ).toLowerCase( );
										}
										scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
										scope.safeApply( );

										scope.element.attr( "namespace", scope.namespace );
										pageGroupStyle( scope.GUID );
										Arbiter.subscribe( "on-resize:" + scope.namespace,
											function handler( ){
												var parentElement = scope.element.parent( );
												var parentZIndex = parentElement.css( "z-index" );
												scope.element.css( {
													"position": "absolute !important",
													"top": "0px !important",
													"left": "0px !important",
													//"z-index": " !important",
													"height": parentElement.height( ) + "px",
													"width": parentElement.width( ) + "px"
												} );
											} );
									}
								}
							}
						] );
				Arbiter.publish( "module-loaded:page-group-directive", null, { "persist": true } );
			} );
	} );