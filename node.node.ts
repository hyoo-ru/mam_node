interface $node {
	[key:string]: any
}

var $node = new Proxy( { require } as any , {
	
	get( target , name : string , wrapper ) {

		if( target[ name ] ) return target[ name ]

		if( $.$node_internal_check(name) ) return target.require ( name )
		if( name[0] === '.' ) return target.require( name )

		$.$node_autoinstall(name)

		return target.require( name )
	},

	set( target , name : string , value ) {
		target[ name ] = value
		return true
	},

} ) as $node

require = ( req =>
	Object.assign( function require( name : string ) {
		return $node[ name ]
	} , req )
)( require )

