define([
	'jquery'
], function( $ ) {

	function LayoutView( childView ) {
		this.$el = $("#container");
		this.childView = childView;
	}

	LayoutView.prototype.render = function() {
		this.$el.html('');
		this.$el.append( this.childView.render() );
	}

	return LayoutView;

});