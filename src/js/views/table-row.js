define([
	'jquery'
], function( $ ) {

	function TableRowView( delegate, data ) {
		this.delegate = delegate;
		this.data = data;
		this.$el = $("<tr>");
	}

	TableRowView.prototype.render = function() {
		var action = $('<button>Edit</button>');
		action.on('click', this.onEdit.bind( this ));
		this.$el.append( $("<td>").html( this.data.id ) );
		this.$el.append( $("<td>").html( this.data.title ) );
		this.$el.append( $("<td>").html( this.data.recordDate ) );
		this.$el.append( $("<td>").html( action ) );
		return this.$el;
	}

	TableRowView.prototype.onEdit = function() {
		this.delegate.onEdit( this.data );
	}

	return TableRowView;

});