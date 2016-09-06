declare var Proxy
declare var require

var $node = new Proxy( {} , { get( target , field , wrapper ) {
	return require( field )
} } )
