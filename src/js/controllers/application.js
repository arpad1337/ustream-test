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

	function ApplicationController( context, videoService ) {
		this.context = context;
		this.videoService = videoService;
		this.page = 1;
		this.displayVideos();
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

	ApplicationController.prototype.onMorePressed = function() {
		var self = this;
		this.page++;
		var page = this.page;
		self.videoService.getRecordsByPage( page, function( records ) {
			self.records = self.records.concat( records );
			self.layout.childView.appendData( records );
		});
	};

	ApplicationController.prototype.onEdit = function( video ) {
		console.log('ApplicationController->onEdit');
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

	return new ApplicationController( window, VideoService.getInstance() );
});