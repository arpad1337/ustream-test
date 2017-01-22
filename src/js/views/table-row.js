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
		action.on('click', this.onEditButtonPressed.bind( this ));
		this.$el.append( $("<td>").html( this.data.id ) );
		this.$el.append( $("<td>").html( this.data.title ) );
		this.$el.append( $("<td>").html( this.data.recordDate ) );
		this.$el.append( $("<td>").html( action ) );
		return this.$el;
	}

	TableRowView.prototype.onEditButtonPressed = function() {
		this.delegate.onEditButtonPressed( this.data );
	}

	return TableRowView;

});