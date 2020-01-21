interface $node {
	[key:string]: any
}

var $node = new Proxy( {} as any , { get( target , name : string , wrapper ) {

	const path = require( 'path' ) as typeof import( 'path' )
	const fs = require( 'fs' ) as typeof import( 'fs' )
	const mod = require( 'module' ) as typeof import( 'module' )

	if( mod.builtinModules.indexOf( name ) >= 0 ) return require( name )

	let dir = path.resolve( '.' )
	const suffix = `./node_modules/${ name }`
	
	while( !fs.existsSync( path.join( dir , suffix ) ) ) {

		const parent = path.resolve( dir , '..' )

		if( parent === dir ) {

			$.$mol_exec( '.' , 'npm' , 'install' , name )
			
			try {
				$.$mol_exec( '.' , 'npm' , 'install' , '@types/' + name )
			} catch {}

		} else {

			dir = parent

		}

	}
	
	return require( name )

} } ) as $node
