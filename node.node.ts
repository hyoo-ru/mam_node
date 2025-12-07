interface $node {
	[key:string]: any
}

var $node = new Proxy( { require } as any , {
	
	get( target , name : string , wrapper ) {

		if( target[ name ] ) return target[ name ]

		const $$ = ( $ as any )
		if( $$.$node_internal_check(name, target) ) return target.require ( name )
		if( name[0] === '.' ) return target.require( name )
		
		try {
			target.require.resolve( name )
		} catch {
		
			$$.$mol_exec( '.' , 'npm' , 'install' , '--omit=dev', name )

			try {
				$$.$mol_exec( '.' , 'npm' , 'install' , '--omit=dev', '@types/' + name )
			} catch (e) {
				if( $$.$mol_promise_like( e ) ) $$.$mol_fail_hidden( e )
				$$.$mol_fail_log(e)
			}

		}
		
		try {
			return target.require( name )
		} catch( error ) {
			if( $$.$mol_promise_like( error ) ) $$.$mol_fail_hidden( error )

			if(error && typeof error === 'object' && ( error as { code?: string } ).code === 'ERR_REQUIRE_ESM' ) {
				const module = cache.get( name )
				if( module ) return module
                throw Object.assign(
                    import( name ).then( module => cache.set( name, module ) ),
                    { cause: error }
                )
			}
			
			$$.$mol_fail_log( error )

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

