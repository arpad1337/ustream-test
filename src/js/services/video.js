define([
	'managers/database'
], function(
	DatabaseManager
) {

	function VideoService( databaseManager ) {
		this.databaseManager = databaseManager;
		this._loadIndex();
	}

	// static members
	VideoService.TABLE_NAME = 'videos';
	VideoService.LIMIT = 20;

	VideoService.getInstance = function() {
		if( !this.singleton ) {
			var databaseManager = DatabaseManager.getInstance();
			this.singleton = new VideoService( databaseManager );
		}
		return this.singleton;
	}

	VideoService.prototype._loadIndex = function() {
		if( !this.databaseManager.checkTable( VideoService.TABLE_NAME ) ) {
			this.databaseManager.createTable( VideoService.TABLE_NAME );
		}
		this.INDEX = this.databaseManager.getIndexForTable( VideoService.TABLE_NAME );
	}

	VideoService.prototype.getSortOptions = function( cb ) {
		var table = this.databaseManager.getTableByTableName( VideoService.TABLE_NAME );
		cb({
			sortedBy: table.sortedBy,
			order: table.order
		});
	}

	VideoService.prototype.getRecordsByPage = function( page, cb ) {
		page = page ? page - 1 : 0;
		var ids = this.INDEX.slice( page * VideoService.LIMIT, VideoService.LIMIT );
		cb( this.databaseManager.getRecordsInTableByIds( VideoService.TABLE_NAME, ids ) );
	}

	VideoService.prototype.sortByProperty = function( property, cb ) {
		this.INDEX = this.databaseManager.sortTableByNameAndProperty( VideoService.TABLE_NAME, property );
		this.getRecordsByPage( 1, cb );
	}

	VideoService.prototype.updateVideo = function( data, cb ) {
		var record = this.databaseManager.updateRecordInTableById( VideoService.TABLE_NAME, data.id, data );
		cb( record );
	}

	VideoService.prototype.createVideo = function( data, cb ) {
		var record = this.databaseManager.createRecordInTable( VideoService.TABLE_NAME, data );
		this.INDEX = this.databaseManager.getIndexForTable( VideoService.TABLE_NAME );
		cb( record );
	}

	return VideoService;

});