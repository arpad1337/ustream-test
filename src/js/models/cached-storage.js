define([

], function() {

	function CachedStorage( driver ) {
		this.driver = driver;
		this.database = {};
		this.processQueue = [];
	}

	CachedStorage.prototype.startPolling = function() {
		setInterval( this.onTick.bind( this ), 1000 );
	}

	CachedStorage.prototype.setItem = function( k, v ) {
		this.database[ k ] = v;
		this.processQueue.push( this.driver.setItem.bind( this.driver, k, v ) );
	}

	CachedStorage.prototype.clear = function() {
		this.database = {};
		this.processQueue.push( this.driver.clear.bind( this.driver ) );
	}

	CachedStorage.prototype.getItem = function( k ) {
		try {
			if( !this.database[ k ] ) {
				this.database[ k ] = this.driver.getItem( k );
			}
			return this.database[ k ];
		} catch( e ) {
			return null;
		}
	}

	CachedStorage.prototype.removeItem = function( k ) {
		delete this.database[ k ];
		this.processQueue.push( this.driver.removeItem.bind( this.driver, k ) );
	}

	CachedStorage.prototype.onTick = function() {
		if( this.processQueue.length > 0 ) {
			var action;
			while( action = this.processQueue.shift() ) {
				action();
			}
		}
	}

	return CachedStorage;

});