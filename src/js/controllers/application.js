define([
	'services/video',
	'views/table',
	'views/layout',
	'views/edit-video'
], function(
	VideoService,
	TableView,
	LayoutView,
	EditVideoView
) {

	function ApplicationController( videoService ) {
		this.videoService = videoService;
		this.page = 1;
	}

	ApplicationController.prototype.displayVideos = function() {
		var self = this;
		this.page = 1;
		self.videoService.getSortOptions(function(sortOptions) {
			self.sortOptions = sortOptions;
			self.displayTable();
		});
	}

	ApplicationController.prototype.displayTable = function() {
		var self = this;
		this.page = 1;
		self.videoService.getRecordsByPage( this.page, function( records ) {
			self.records = records;
			var tableView = new TableView( self, self.records, self.sortOptions.sortedBy, self.sortOptions.order );
			self.layout = new LayoutView( tableView );
			self.layout.render();
		});
	}

	ApplicationController.prototype.backToMainView = function() {
		this.displayTable();
	}

	ApplicationController.prototype.onMoreButtonPressed = function() {
		var self = this;
		var page = this.page + 1;
		self.videoService.getRecordsByPage( page, function( records ) {
			if( records.length > 0 ) {
				self.page++;
			}
			self.records = self.records.concat( records );
			self.layout.childView.appendData( records );
		});
	};

	ApplicationController.prototype.onEditButtonPressed = function( video ) {
		console.log('ApplicationController->onEditButtonPressed');
		var editVideo = new EditVideoView( this, video );
		this.layout = new LayoutView( editVideo );
		this.layout.render();
	}

	ApplicationController.prototype.createNewVideo = function() {
		console.log('ApplicationController->createNewVideo');
		var editVideo = new EditVideoView( this );
		this.layout = new LayoutView( editVideo );
		this.layout.render();
	}

	ApplicationController.prototype.sortByProperty = function( property ) {
		var self = this;
		this.videoService.sortByProperty( property, function( records ) {
			self.page = 1;
			self.records = records;
			self.videoService.getSortOptions(function(sortOptions) {
				self.sortOptions = sortOptions;
				var tableView = new TableView( self, self.records, self.sortOptions.sortedBy, self.sortOptions.order );
				self.layout = new LayoutView( tableView );
				self.layout.render();
			});
		});
	}

	ApplicationController.prototype.onCommit = function( data ) {
		console.log('ApplicationController->onCommit', data );
		var self = this;
		if( data.id ) {
			this.videoService.updateVideo( data, function() {
				self.displayTable();
			});
		} else {
			this.videoService.createVideo( data, function() {
				self.displayTable();
			});
		}
	}

	ApplicationController.prototype.onCancel = function() {
		this.displayTable();
	}

	ApplicationController.prototype.onDelete = function( id ) {
		var self = this;
		this.videoService.deleteVideo( id, function( records ) {
			self.page = 1;
			self.records = records;
			var tableView = new TableView( self, self.records, self.sortOptions.sortedBy, self.sortOptions.order );
			self.layout = new LayoutView( tableView );
			self.layout.render();
		});
	}

	ApplicationController.createController = function() {
		return new ApplicationController( VideoService.getInstance() );
	}

	return ApplicationController;
});