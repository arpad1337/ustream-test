define([
	'jquery',
	'views/table-row'
], function( $, TableRowView ) {

	function TableView( delegate, data, sortedBy, order ) {
		this.delegate = delegate;
		this.data = data;
		this.sortedBy = sortedBy;
		this.order = order;
		this.$el = $("<div>");
	}

	TableView.prototype.renderHeader = function() {
		var self = this;
		var thead = $("<thead>");
		var cols = [{
			title:'ID',
			property: 'id'
		}, {
			title: 'Title',
			property: 'title'
		}, {
			title: 'Record date',
			property: 'recordDate'
		}, {
			title: 'Create new'
		}];
		var tr = $("<tr>");
		cols.forEach(function( col ) {
			var td = $("<td>");

			if( !col.property ) {
				col.title = $('<button>').html( col.title );
				col.title.on('click', self.createNewVideo.bind(self));
			} else  {
				if( self.sortedBy == col.property ) {
					td.addClass('sorted-by');
					td.addClass( self.order );
				}
				td.on('click', self.onSortByProperty.bind( self, col.property ))
			}
			td.html( col.title );
			tr.append( td )
		})
		thead.html(tr);
		return thead;
	}

	TableView.prototype.onSortByProperty = function( property ) {
		this.delegate.sortByProperty( property );
	}

	TableView.prototype.createNewVideo = function() {
		this.delegate.createNewVideo();
	}

	TableView.prototype.renderBody = function() {
		var self = this;
		var tbody = $("<tbody>");
		this.data.forEach(function(row) {
			var tr = new TableRowView( self.delegate, row );
			tbody.append( tr.render() );
		});
		return tbody;
	}

	TableView.prototype.appendData = function( data ) {
		var tbody = this.$el.find('tbody');
		data.forEach(function(row) {
			var tr = new TableRowView( self.delegate, row );
			tbody.append( tr.render() );
		});
	}

	TableView.prototype.onMoreButtonPressed = function() {
		this.delegate.onMoreButtonPressed();
	}

	TableView.prototype.render = function() {
		this.$el.html('');
		var table = $("<table>");
		var moreButton = $('<button class="more">More</button>');
		moreButton.on('click', this.onMoreButtonPressed.bind( this ));
		table.append( this.renderHeader() );
		table.append( this.renderBody() );
		this.$el.append(table);
		if( this.data.length == 0 ) {
			this.$el.append($('<div class="no-videos">').html('There are no videos yet.'));
		}
		this.$el.append(moreButton);
		return this.$el;
	}

	return TableView;

});