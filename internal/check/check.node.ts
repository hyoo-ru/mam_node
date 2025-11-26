namespace $ {

	export function $node_internal_check(name: string, target = global) {
		if ( name.startsWith('node:') ) return true
		const mod = target.require/****/( 'module' ) as typeof import/****/( 'module' )
		return mod.builtinModules.includes(name)
	}

}
