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
		var cols = ['ID', 'Title', 'Record date', 'Create new'];
		var tr = $("<tr>");
		cols.forEach(function( col ) {
			var td = $("<td>");

			if( col.toLowerCase() == 'create new' ) {
				col = $('<button>').html( col );
				col.on('click', self.createNewVideo.bind(self));
			} else  {
				if( self.sortedBy.toLowerCase() == col.toLowerCase().replace(' ', '') ) {
					td.addClass('sorted-by');
					td.addClass( self.order );
				}
			}
			td.html( col );
			tr.append( td )
		})
		thead.html(tr);
		return thead;
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

	TableView.prototype.onMorePressed = function() {
		this.delegate.onMorePressed();
	}

	TableView.prototype.render = function() {
		this.$el.html('');
		var table = $("<table>");
		var moreButton = $('<button>More</button>');
		moreButton.on('click', this.onMorePressed.bind( this ));
		table.append( this.renderHeader() );
		table.append( this.renderBody() );
		this.$el.append(table);
		this.$el.append(moreButton);
		return this.$el;
	}

	return TableView;

});