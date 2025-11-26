namespace $ {

	const mod = require/****/( 'module' ) as typeof import/****/( 'module' )
	const internals = mod.builtinModules
	
	export function $node_internal_check(name: string) {
		if ( name.startsWith('node:') ) return true
		return internals.includes(name)
	}

}
