define( "pageGroupDirective",
	[
		"amplify",
		"arbiter",
		"chance",
		"jquery",
		"requirejs",
		"angular",
		"moduleLoadNotifier",
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

										//This will bind the pagegroup object to the pagegroup directive.
										var pageGroupObject = scope.element.data( "page-group-object" );
										scope.pageGroupObject = pageGroupObject;
										pageGroupObject.scope = scope;

										scope.DOMID = halfpageObject.namespace;
										scope.element.attr( "domid", scope.DOMID );
	
										scope.GUID = pageGroupObject.GUID || attribute.pageGroup;
										if( typeof scope.GUID != "string" ){
											scope.GUID = chance.guid( ).toLowerCase( );
										}
										
										scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
										scope.safeApply( );

										scope.element.attr( "namespace", scope.namespace );
										pageGroupStyle( scope.GUID );

										Arbiter.subscribe( "on-resize:" + scope.namespace,
											"on-resize:" + scope.DOMID,
											function handler( ){
												scope.element.css( {
													"position": "absolute !important",
													"top": scope.pageGroupObject.getY( ),
													"left": scope.pageGroupObject.getX( ),
													"z-index": scope.pageGroupObject.getZIndex( ),
													"height": scope.pageGroupObject.getHeight( ),
													"width": scope.pageGroupObject.getWidth( )
												} );
											} );
									}
								}
							}
						] );
				
				moduleLoadNotifier( "page-group-directive" ).notifyModuleLoaded( );
			} );
	} );