namespace $ {
	const path = require/****/( 'path' ) as typeof import/****/( 'path' )
	const mod = require/****/( 'module' ) as typeof import/****/( 'module' )
	const localRequire = mod.createRequire(path.join(process.cwd(), 'package.json'))

	export function $node_autoinstall(this: typeof $, name: string) {
		try {
			localRequire.resolve( name )
		} catch {

			this.$mol_run.spawn({ command: [ 'npm' , 'install' , '--omit=dev', name ], dir: '.' })

			try {
				this.$mol_run.spawn({ command: [ 'npm' , 'install' , '--omit=dev', '@types/' + name ], dir: '.' })
			} catch (e) {
				if( this.$mol_promise_like( e ) ) this.$mol_fail_hidden( e )
				this.$mol_fail_log(e)
			}

		}
	}
}
