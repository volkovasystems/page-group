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
			"jquery",
			"moduleLoader"
		],
		function construct( async ){
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
					var pageGroupApp = angular.module( "PageGroup", [ ] );
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

						pageGroupComponent.data( "page-group-object", self );
						pageGroupComponent.attr( "app-name", appNamespace );
						
						componentObject.append( pageGroupComponent );

						var self = this;
						pageGroupComponent.ready( function onReady( ){
							if( appNamespace == "PageGroup" ){	
								appDetermine.bootstrap( componentObject, appNamespace );
							}
							componentObject.attr( "ng-bound-app", appNamespace );
							componentObject.addClass( "page-group-attached" );

							//Start attaching the pages also.
							self.attachPages( );	
						} );
					};

					PageGroup.prototype.attachPages = function attachPages( ){
						for( var index = 0; index < self.pageList; index++ ){
							var page = this.pageList[ index ];
							if( !page.checkIfAttached( ) ){
								page.attachComponent( pageGroupComponent );
							}
						}
					};

					PageGroup.prototype.getCurrentPage = function getCurrentPage( ){
						this.currentPage = _.last( this.pageList );
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
					};

					PageGroup.prototype.getSubPageGroupList = function getSubPageGroupList( ){
						return this.subPageGroupList;
					};

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

					PageGroup.prototype.removePage = function removePage( page ){

					};

					/*
						This is the default layout method for retrieving
							the x distance for the pagegroup.

						By attaching a layout calibration this can be changed.
					*/
					PageGroup.prototype.getX = function getX( ){
						return 0;
					};

					/*
						This is the default layout method for retrieving
							the y distance for the pagegroup.

						By attaching a layout calibration this can be changed.
					*/
					PageGroup.prototype.getY = function getY( ){
						return 0;
					};

					/*
						The base default z-index for any element is 1. 

						We may be retrieving value as "auto" this is due
							to the fact that the position is not "absolute".

						Though this method will not check it any component
							belonging to the page component concept must be
							configured with "absolute" position.

						The default z-index now is the parent's z-index + 1.

						By attaching a layout calibration this can be changed.
					*/
					PageGroup.prototype.getZIndex = function getZIndex( ){
						var parentElement = this.scope.element.parent( );
						var zIndex = parentElement.css( "z-index" );
						if( zIndex === "auto" ){
							return 1;
						}else if( typeof zIndex == "string" ){
							zIndex = parseInt( zIndex );
						}
						if( isNaN( zIndex ) ){
							throw new Error( "invalid z-index value" );
						}
						return zIndex + 1;
					};

					/*
						This is the default dimension method for retrieving
							the height for the pagegroup.

						By attaching a dimension calibration this can be changed.
					*/
					PageGroup.prototype.getHeight = function getHeight( ){
						var parentElement = this.scope.element.parent( );
						return parentElement.height( );
					};

					/*
						This is the default dimension method for retrieving
							the height for the pagegroup.

						By attaching a dimension calibration this can be changed.
					*/
					PageGroup.prototype.getWidth = function getWidth( ){
						var parentElement = this.scope.element.parent( );
						return parentElement.width( );
					};

					base.PageGroup = PageGroup;
				} );
			
			return moduleLoader( "page-group-directive", pageModule ).notify;
		} );
} )( base );
