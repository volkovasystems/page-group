try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "pageGroup", 
		[
			"async",
			"amplify",
			"requirejs",
			"underscore",
			"angular",
			"jquery"
		],
		function construct( async ){
			requirejs.config( {
				"paths": {
					"pageGroupTemplate": staticBaseURL + "/page-group/template/page-component-template",
					"pageGroupDirective": staticBaseURL + "/page-group/directive/page-directive"
				}
			} );
			requirejs( [ 
					"pageGroupTemplate",
					"pageGroupDirective",
					"bindDOMFactory",
					"safeApplyFactory",
					"autoResizeDirective",
					"appDetermine"
				],
				function construct( pageComponentTemplate ){
					var pageApp = angular.module( "PageGroup", [ ] );
					var appNamespace = appDetermine( "PageGroup" ).name;
					
					safeApplyFactory( appNamespace );
					bindDOMFactory( appNamespace );
					autoResizeDirective( appNamespace );

					var PageGroup = function PageGroup( namespace ){
						this.namespace = namespace;
					};

					PageGroup.prototype.attachComponent = function attachComponent( component ){
						var componentObject;
						if( typeof component == "string" ){
							componentObject = $( "#" + component );	
						}else if( component instanceof $ ){
							componentObject = component;
						}else{
							throw new Error( "invalid component" );
						}

						var componentElement = componentObject[ 0 ];
						if( !componentElement ){
							throw new Error( "failed to attach page component" );
						}

						if( componentObject.hasClass( "page-group-attached" ) ){
							return;
						}

						this.pageGroupContainer = componentObject;
						pageGroupComponent = $( pageGroupTemplate );
						pageGroupComponent.attr( "app-name", appNamespace );
						componentObject.append( pageGroupComponent );

						var self = this;
						pageGroupComponent.ready( function onReady( ){
							if( appNamespace == "PageGroup" ){	
								appDetermine.bootstrap( componentObject, appNamespace );
							}
							componentObject.attr( "ng-bound-app", appNamespace );
							componentObject.addClass( "page-group-attached" );
							pageGroupComponent.data( "page-group-object", self );
						} );
					};

					base.PageGroup = PageGroup;
				}  );
			
			return ( function onModuleLoad( handler ){
				async.parallel( [
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:page-group-directive", callback );
						}
					], handler );
			} );
		} );
} )( base );
