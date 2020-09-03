interface $node {
	[key:string]: any
}

var $node = new Proxy( {} as any , {
	
	get( target , name : string , wrapper ) {

		if( target[ name ] ) return target[ name ]

		const mod = $node_require( 'module' ) as typeof import( 'module' )
		
		if( mod.builtinModules.indexOf( name ) >= 0 ) return $node_require( name )
		
		const path = $node_require( 'path' ) as typeof import( 'path' )
		const fs = $node_require( 'fs' ) as typeof import( 'fs' )

		let dir = path.resolve( '.' )
		const suffix = `./node_modules/${ name }`

		const $$ = ( $ as any )
		
		while( !fs.existsSync( path.join( dir , suffix ) ) ) {

			const parent = path.resolve( dir , '..' )

			if( parent === dir ) {

				$$.$mol_exec( '.' , 'npm' , 'install' , name )
				
				try {
					$$.$mol_exec( '.' , 'npm' , 'install' , '@types/' + name )
				} catch {}

				break

			} else {

				dir = parent

			}

		}
		
		return $node_require( name )

	},

	set( target , name : string , value ) {
		target[ name ] = value
		return true
	},

} ) as $node

const $node_require = require

require = ( req =>
	Object.assign( function require( name : string ) {
		return $node[ name ]
	} , $node_require )
)( require )

