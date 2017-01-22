var requirejs = require("requirejs");
var expect = require('chai').expect;

requirejs.config({
    baseUrl: 'src/js',
    nodeRequire: require
});

global.window = {
	_store: {},
	localStorage: {
		setItem: function( k,v ) {
			global.window._store[ k ] = v;
		},
		getItem: function( k ) {
			try {
				return global.window._store[ k ];
			} catch( e ) {
				return null;
			}
		},
		removeItem: function(k) {
			delete global.window._store[ k ];
		},
		clear: function() {
			global.window._store = {};
		}
	}
}

var video = {
	title: 'a',
	recordDate: 'b',
	description: 'c',
	url: 'd'
};

var videosForSort = [
	{
		title: 'a'
	}, {
		title: 'b'
	}
];

describe('DatabaseManager', function() {
	var DatabaseManager;
	beforeEach(function(done) {
		requirejs(['managers/database', 'models/cached-storage'], function( dbClass, CachedStorage ) {
			DatabaseManager = dbClass;
			global.window.localStorage.clear();
			CachedStorage.prototype.startPolling = function() {};
			done();
		})
	});

	describe('initialization', function() {
		it('should create DatabaseManager instance', function() {
			var instance = DatabaseManager.getInstance();
			expect( instance ).to.be.an.instanceof( DatabaseManager );
		});
	});

	describe('data handling', function() {
		it('should check the videos table', function() {
			var instance = DatabaseManager.getInstance();
			expect( instance.checkTable( 'videos' ) ).to.be.equal(false);
		});

		it('should create table', function() {
			var instance = DatabaseManager.getInstance();
			var table = instance.createTable('videos');
			var persistedTable = JSON.parse(instance.storage.getItem( 'videos' ));
			expect( table ).to.deep.equal( persistedTable );
		});

		it('should throw if table exists', function() {
			var instance = DatabaseManager.getInstance();
			instance.clearDatabase();
			instance.createTable('videos');
			expect( instance.createTable.bind( instance, 'videos' ) ).to.throw( Error );
		});

		it('should return a table by name', function() {
			var instance = DatabaseManager.getInstance();
			instance.clearDatabase();
			instance.createTable('videos');
			var table = instance.getTableByTableName( 'videos' );
			expect( table ).to.be.an('object');
		});

		it('should persist a video instance', function() {
			var instance = DatabaseManager.getInstance();
			instance.clearDatabase();
			instance.createTable('videos');
			var obj = instance.createRecordInTable( 'videos', Object.assign({}, video) );
			expect( video ).to.deep.equal({
				title: obj.title,
				description: obj.description,
				url: obj.url,
				recordDate: obj.recordDate
			});
			expect( instance.getRecordByTableAndId( 'videos', obj.id ) ).to.deep.equal( obj );
			expect( instance.getTableByTableName( 'videos' ).records ).to.deep.equal( [ obj.id ] );
		});

		it('should update a video instance', function() {
			var instance = DatabaseManager.getInstance();
			instance.clearDatabase();
			instance.createTable('videos');
			var obj = instance.createRecordInTable( 'videos', Object.assign({}, video) );
			obj.title = 'e';
			instance.updateRecordInTableById( 'videos', obj.id, obj );
			expect( instance.getRecordByTableAndId( 'videos', obj.id ) ).to.deep.equal( obj );
		})

		it('should delete a video instance', function() {
			var instance = DatabaseManager.getInstance();
			instance.clearDatabase();
			instance.createTable('videos');
			var obj = instance.createRecordInTable( 'videos', Object.assign({}, video) );
			instance.deleteRecordFromTableById( 'videos', obj.id );
			expect( instance.getRecordByTableAndId( 'videos', obj.id ) ).to.equal( null );
		});

		it('should return multiple instances', function() {
			var instance = DatabaseManager.getInstance();
			instance.clearDatabase();
			instance.createTable('videos');
			var obj = instance.createRecordInTable( 'videos', Object.assign({}, video) );
			var obj2 = instance.createRecordInTable( 'videos', Object.assign({}, video) );
			var obj3 = instance.createRecordInTable( 'videos', Object.assign({}, video) );
			expect([ obj, obj2, obj3 ]).to.deep.equal( instance.getRecordsInTableByIds( 'videos', [ obj.id, obj2.id, obj3.id ] ) );
		});

		it('should sort', function() {
			var instance = DatabaseManager.getInstance();
			instance.clearDatabase();
			instance.createTable('videos');
			var obj = instance.createRecordInTable( 'videos', Object.assign({}, videosForSort[0]) );
			var obj2 = instance.createRecordInTable( 'videos', Object.assign({}, videosForSort[1]) );
			var index = instance.sortTableByNameAndProperty( 'videos', 'id' ); // reverting actual sort order
			expect( instance.getRecordsInTableByIds('videos', index ) ).to.deep.equal([ obj2, obj ]);
		})
	});
});