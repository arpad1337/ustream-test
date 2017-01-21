define([
	'jquery'
], function() {

	function EditVideoView( delegate, data ) {
		this.delegate = delegate;
		this.data = data || {
			title: '',
			description: '',
			url: '',
			recordDate: ''
		};
		this.$el = $('<div>');
		this.inputs = [{
			name: 'title',
			type: 'text',
			placeholder: 'Video title'
		},{
			name: 'description',
			type: 'text',
			placeholder: 'Description'
		},{
			name: 'url',
			type: 'text',
			placeholder: 'URL'
		},{
			name: 'recordDate',
			type: 'datetime',
			placeholder: 'Record date'
		}];
	}

	EditVideoView.prototype.render = function() {
		var self = this;
		var label = this.data.id ? 'Edit' : 'Create';
		this.$el.html('');
		var $backButton = $("<button>");
		$backButton.html('< Back');
		$backButton.on('click', this.cancel.bind(this));
		this.$el.append($backButton);
		this.inputs.forEach(function(input) {
			$element = $('<input>');
			$element.attr('name', input.name);
			$element.attr('placeholder', input.placeholder);
			$element.attr('type', input.type);
			$element.attr('value', self.data[ input.name ]);
			$element.on('change', self.onInputChange.bind(self, input.name));
			self.$el.append( $element );
		});
		var $button = $("<button>");
		$button.html(label);
		$button.on('click', this.commit.bind(this));
		self.$el.append( $button );
		return this.$el;
	}

	EditVideoView.prototype.onInputChange = function( type, event ) {
		this.data[ type ] = event.target.value;
	}

	EditVideoView.prototype.cancel = function() {
		this.delegate.onCancel();
	}

	EditVideoView.prototype.commit = function() {
		this.delegate.onCommit( this.data );
	}

	return EditVideoView;

});