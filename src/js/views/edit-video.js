define([
	'jquery',
	'util/util'
], function( $, Util ) {

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
			type: 'date',
			placeholder: 'Record date'
		}];
	}

	EditVideoView.prototype.render = function() {
		var self = this;
		var label = this.data.id ? 'Edit' : 'Create';
		this.$el.html('');
		var $backButton = $('<button class="back">');
		$backButton.html('Back');
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
		var $button = $('<button class="create">');
		$button.html(label);
		$button.on('click', this.commit.bind(this));
		self.$el.append( $button );
		if( this.data.id ) {
			var $deleteButton = $('<button class="delete">Delete</button>');
			$deleteButton.on('click', this.delete.bind(this));
			self.$el.append( $deleteButton );
		}
		return this.$el;
	}

	EditVideoView.prototype.onInputChange = function( type, event ) {
		this.data[ type ] = event.target.value;
	}

	EditVideoView.prototype.cancel = function() {
		this.delegate.onCancel();
	}

	EditVideoView.prototype.delete = function() {
		var r = confirm('Are you sure you want to delete ' + this.data.title + '?');
		if( r ) {
			this.delegate.onDelete( this.data.id );
		}
	}

	EditVideoView.prototype.commit = function() {
		var keys = Object.keys( this.data );
		console.log(keys);
		for( var i = 0; i < keys.length; i++ ) {
			if( Util.isFieldEmpty( this.data[ keys[i] ] ) ) {
				console.log(keys[i]);
				this.displayError( keys[i] );
				return;
			}
		}
		this.delegate.onCommit( this.data );
	}

	EditVideoView.prototype.displayError = function( property ) {
		var i = 0;
		while( i < this.inputs.length && this.inputs[i].name != property ) {
			i++;
		}
		alert('You must fill the "' + this.inputs[i].placeholder + '" field!');
	}

	return EditVideoView;

});