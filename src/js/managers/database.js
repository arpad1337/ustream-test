define([
	'models/cached-storage'
], function( CachedStorage ) {

	function DatabaseManager( driver ) {
		if( !driver ) {
			throw new Error('DatabaseManager::constructor driver not defined');
		}
		this.storage = new CachedStorage( driver );
		this.storage.startPolling();
	}

	DatabaseManager.prototype.checkTable = function( tableName ) {
		return !!this.storage.getItem( tableName );
	}

	DatabaseManager.prototype.createTable = function( tableName ) {
		if( this.checkTable( tableName ) ) {
			throw new Error('DatabaseManager->createTable table ' + tableName + ' exists' );
		}
		var table = {
			sequence: 1,
			records: [],
			sortedBy: 'id',
			order: 'asc'
		};
		this.storage.setItem( tableName, JSON.stringify(table));
		return table;
	}

	DatabaseManager.prototype.getIndexForTable = function( tableName ) {
		var table = this.storage.getItem( tableName );
		return JSON.parse( table ).records;
	}

	DatabaseManager.prototype.getRecordByTableAndId = function( tableName, id ) {
		try {
			var record = this.storage.getItem( tableName + '_' + id );
			return JSON.parse( record );
		} catch( e ) {
			return null;
		}
	}

	DatabaseManager.prototype.getTableByTableName = function( tableName ) {
		var table = this.storage.getItem( tableName );
		var meta = JSON.parse( table );
		return meta;
	}

	DatabaseManager.prototype.createRecordInTable = function( tableName, data ) {
		var table = this.getTableByTableName( tableName );
		data.id = table.sequence;
		table.sequence++;
		table.records.push( data.id );
		this.storage.setItem( tableName, JSON.stringify( table ) );
		this.storage.setItem( tableName + '_' + data.id, JSON.stringify( data ) );
		table = this._performSort( tableName );
		return data;
	}

	DatabaseManager.prototype.updateRecordInTableById = function( tableName, id, data ) {
		data.id = id;
		this.storage.setItem( tableName + '_' + data.id, JSON.stringify( data ) );
		return data;
	}

	DatabaseManager.prototype.deleteRecordFromTableById = function( tableName, id ) {
		var table = this.getTableByTableName( tableName );
		table.records.splice( table.records.indexOf( id ), 1 );
		this.storage.setItem( tableName, JSON.stringify( table ) );
		this.storage.removeItem( tableName + '_' + id );
		return true;
	}

	DatabaseManager.prototype.getRecordsInTableByIds = function( tableName, ids ) {
		var accumulator = [];
		var self = this;
		ids.forEach(function( id ) {
			var record = self.getRecordByTableAndId( tableName, id );
			accumulator.push( record );
		});
		return accumulator;
	}

	DatabaseManager.prototype._performSort = function( tableName ) {
		var table = this.getTableByTableName( tableName );
		var property = table.sortedBy;
		var records = this.getRecordsInTableByIds( tableName, table.records );
		table.records = [];
		records = records.sort(function(a,b) {
			if( typeof a[ property ] == 'string' ) {
				a[property] = a[property].toLowerCase();
			}
			if( typeof b[ property ] == 'string' ) {
				b[property] = b[property].toLowerCase();
			}
			if( table.order == 'asc' ) {
				return a[property] < b[property] ? -1 : 1;
			} else {
				return a[property] < b[property] ? 1 : -1;
			}
		});
		records.forEach(function(record) {
			table.records.push( record.id );
		});
		this.storage.setItem( tableName, JSON.stringify( table ) );
		return table;
	}

	DatabaseManager.prototype.sortTableByNameAndProperty = function( tableName, property ) {
		var table = this.getTableByTableName( tableName );
		if( property === table.sortedBy ) {
			table.order = ( table.order == 'asc' ) ? 'desc' : 'asc';
		} else {
			table.order = 'asc';
			table.sortedBy = property;
		}
		this.storage.setItem( tableName, JSON.stringify( table ) );
		table = this._performSort( tableName );
		return table.records;
	}

	DatabaseManager.getInstance = function() {
		if( !this.singleton ) {
			this.singleton = new DatabaseManager( window.localStorage );
		}
		return this.singleton;
	}

	return DatabaseManager;
});