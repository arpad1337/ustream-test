define([

], function() {

	return {
		isFieldEmpty: function( value ) {
			return String(value).trim().length === 0;
		}
	}

});