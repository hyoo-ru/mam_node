interface $node {
	[key:string]: any
}

var $node = new Proxy( { require } as any , {
	
	get( target , name : string , wrapper ) {

		if( target[ name ] ) return target[ name ]

		const mod = target.require( 'module' ) as typeof import( 'module' )
		
		if( mod.builtinModules.indexOf( name ) >= 0 ) return target.require( name )
		if( name[0] === '.' ) return target.require( name )
		
		const path = target.require( 'path' ) as typeof import( 'path' )
		const fs = target.require( 'fs' ) as typeof import( 'fs' )

		let dir = path.resolve( '.' )
		const suffix = `./node_modules/${ name }`

		const $$ = ( $ as any )
		
		while( !fs.existsSync( path.join( dir , suffix ) ) ) {

			const parent = path.resolve( dir , '..' )

			if( parent === dir ) {

				$$.$mol_exec( '.' , 'npm' , 'install' , '--omit=dev', name )
				
				try {
					$$.$mol_exec( '.' , 'npm' , 'install' , '--omit=dev', '@types/' + name )
				} catch {}

				break

			} else {

				dir = parent

			}

		}
		
		try {
			return $.$mol_wire_sync( target ).require( name )
		} catch( error ) {
			if( ( error as any ).code === 'ERR_REQUIRE_ESM' ) {
				return importSync( name )
			}
			$.$mol_fail_log( error )
			return null
		}

	},

	set( target , name : string , value ) {
		target[ name ] = value
		return true
	},

} ) as $node

const importAsync = async ( uri: string )=> import( uri )
const importSync = $.$mol_wire_sync( importAsync )

require = ( req =>
	Object.assign( function require( name : string ) {
		return $node[ name ]
	} , req )
)( require )

