interface $node {
	[key:string]: any
}

var $node = new Proxy( { require } as any , {
	
	get( target , name : string , wrapper ) {

		if( target[ name ] ) return target[ name ]

		const mod = target.require( 'module' ) as typeof import( 'module' )
		
		if( mod.builtinModules.indexOf( name ) >= 0 ) return target.require( name )
		if( name[0] === '.' ) return target.require( name )

		try {
			target.require.resolve( name )
		} catch {
		
			const $$ = ( $ as any )
			$$.$mol_exec( '.' , 'npm' , 'install' , '--omit=dev', name )
			
			try {
				$$.$mol_exec( '.' , 'npm' , 'install' , '--omit=dev', '@types/' + name )
			} catch (e) {
				if ($$.$mol_fail_catch(e)) {
					$$.$mol_fail_log(e)
				}
			}

		}
		
		try {
			return target.require( name )
		} catch( error ) {

			if($.$mol_fail_catch(error) && ( error as any ).code === 'ERR_REQUIRE_ESM' ) {
				const module = cache.get( name )
				if( module ) return module
				throw import( name ).then( module => cache.set( name, module ) )
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

const cache = new Map< string, any >()

require = ( req =>
	Object.assign( function require( name : string ) {
		return $node[ name ]
	} , req )
)( require )

