var $node = new Proxy( {} , { get( target : any, field : string , wrapper : any ) {
	return require( field )
} } )
