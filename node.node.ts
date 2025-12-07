interface $node {
	[key:string]: any
}

var $node = new Proxy( { require: require/**/( 'node:module' ).createRequire( process.cwd() + '/package.json' ) } as any , {
	
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

		return target.require( name )
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

