var $node = new Proxy( {} , { get( target : any, name : string , wrapper : any ) {
	try {
		require.resolve( name )
	} catch( error ) {
		if( error.code !== 'MODULE_NOT_FOUND' ) return $.$mol_fail_hidden( error )
		$.$mol_exec( '.' , 'npm' , 'install' , name )
	}
	return require( name )
} } )
