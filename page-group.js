try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "pageGroup", 
		[
			"async",
			"arbiter",
			"amplify",
			"requirejs",
			"underscore",
			"angular",
			"jquery"
		],
		function construct( async ){
			var moduleLoadHandler = Arbiter.create( );

			requirejs.config( {
				"paths": {
					"page": staticBaseURL + "/page/page",
					"pageGroupComponentTemplate": staticBaseURL + "/page-group/template/page-group-component-template",
					"pageGroupDirective": staticBaseURL + "/page-group/directive/page-group-directive"
				}
			} );
			requirejs( [ 
					"page",
					"pageGroupComponentTemplate",
					"pageGroupDirective",
					"bindDOMFactory",
					"safeApplyFactory",
					"autoResizeDirective",
					"appDetermine"
				],
				function construct( pageModule, pageComponentTemplate ){
					pageModule( function onModuleLoad( ){
						moduleLoadHandler.publish( "module-loaded:page", null, { "persist": true } );
					} );

					var pageApp = angular.module( "PageGroup", [ ] );
					var appNamespace = appDetermine( "PageGroup" ).name;
					
					safeApplyFactory( appNamespace );
					bindDOMFactory( appNamespace );
					autoResizeDirective( appNamespace );

					var PageGroup = function PageGroup( namespace ){
						this.namespace = namespace;
						this.subPageGroupList = { };
						this.pageList = [ ];

						//Create a dummy page.
						/*
							A page group is a collection of pages.
							A page group can never be empty.
							For every creation of page group there must be a ready page inside.
						*/
						var firstPage = new Page( "first-page" );
						this.pageList.push( firstPage );
						this.currentPage = firstPage;
					};

					PageGroup.prototype.overrideGUID = function overrideGUID( GUID ){
						this.GUID = GUID;
					};

					PageGroup.prototype.attachComponent = function attachComponent( component ){
						var componentObject;
						if( typeof component == "string" ){
							componentObject = $( component );	
						}else if( component instanceof $ ){
							componentObject = component;
						}else{
							throw new Error( "invalid component" );
						}

						if( componentObject.length > 1 ){
							throw new Error( "component refers to many elements" );
						}

						if( componentObject.length == 0 ){
							throw new Error( "component does not exists" );
						}

						if( componentObject.hasClass( "page-group-attached" ) ){
							return;
						}

						this.pageGroupContainer = componentObject;
						pageGroupComponent = $( pageGroupComponentTemplate );
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

							//Start attaching the pages also.
							self.attachPages( );	
						} );
					};

					PageGroup.prototype.attachPages = function attachPages( ){
						for( var index = 0; index < self.pageList; index++ ){
							self.pageList[ index ].attachComponent( pageGroupComponent );
						}
					};

					PageGroup.prototype.getCurrentPage = function getCurrentPage( ){
						this.currentPage = this.currentPage || _.last( this.pageList );
						return this.currentPage;
					};

					PageGroup.prototype.checkIfAttached = function checkIfAttached( ){
						return ( "pageGroupContainer" in this )
							&& this.pageGroupContainer.hasClass( "page-group-attached" );
					};

					PageGroup.prototype.getSubPageGroupCount = function getSubPageGroupCount( ){
						return _.keys( this.subPageGroupList ).length;
					};

					PageGroup.prototype.getSubPageGroup = function getSubPageGroup( namespace ){
						return this.subPageGroupList[ namespace ];
					}

					PageGroup.prototype.getSubPageGroupList = function getSubPageGroupList( ){
						return this.subPageGroupList;
					}

					PageGroup.prototype.addSubPageGroup = function addSubPageGroup( namespace, GUID ){
						var subPageGroup = new PageGroup( namespace );
						subPageGroup.overrideGUID( GUID );
						this.subPageGroupList[ namespace ] = subPageGroup;
						return subPageGroup;
					};

					//This will insert the newly created page.
					PageGroup.prototype.insertPage = function insertPage( page ){

					};

					//Including the page is just referencing the page from other page groups.
					PageGroup.prototype.includePage = function includePage( page ){

					};

					base.PageGroup = PageGroup;
				}  );
			
			return ( function onModuleLoad( handler ){
				async.parallel( [
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:page-group-directive", callback );
						},
						function handler( callback ){
							moduleLoadHandler.subscribe( "module-loaded:page", callback );
						}
					], handler );
			} );
		} );
} )( base );
