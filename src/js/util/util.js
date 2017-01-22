define([

], function() {

	return {
		isFieldEmpty: function( value ) {
			console.log(value);
			return String(value).trim().length === 0;
		}
	}

});