interface $node {
	[key:string]: any
}

var $node = new Proxy( {} as any , { get( target , name : string , wrapper ) {

	if( require( 'module' ).builtinModules.indexOf( name ) >= 0 ) return require( name )
	
	if( !require( 'fs' ).existsSync( `./node_modules/${ name }` ) ) {

		$.$mol_exec( '.' , 'npm' , 'install' , name )
		
		try {
			$.$mol_exec( '.' , 'npm' , 'install' , '@types/' + name )
		} catch {}
		
	}
	
	return require( name )

} } ) as $node
