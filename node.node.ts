interface $node {
	[key:string]: any
}

var _node_checked_types = new Set< string >()

var $node = new Proxy( {} as any , { get( target , name : string , wrapper ) {

	const fs = require( 'fs' ) as typeof import( 'fs' )
	const mod = require( 'module' ) as typeof import( 'module' )

	if( mod.builtinModules.indexOf( name ) >= 0 ) return require( name )

	const deps = JSON.parse( fs.readFileSync( 'package.json' ).toString() ).dependencies

	if(!( name in deps )) {

		$.$mol_exec( '.' , 'npm' , 'install' , name )

		if( name[0] !== '@' ) {
			try {
				$.$mol_exec( '.' , 'npm' , 'install' , '@types/' + name )
			} catch { }
		}

	}

	return require( name )

} } ) as $node
