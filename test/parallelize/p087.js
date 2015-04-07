#!/usr/local/bin/node --harmony

// parallelize -> groupByKey -> persist -> lookup

var co = require('co');
var ugrid = require('../../');
var groupByKey = require('../ugrid-test.js').groupByKey;

co(function *() {
	var uc = yield ugrid.context();
	console.assert(uc.worker.length > 0);

	var v = [[0, 1], [0, 2], [1, 3], [2, 4]];
	var key = 0;
	var loc = groupByKey(v).filter(function (e) {return (e[0] == key)});

	var data = uc.parallelize(v).groupByKey().persist();
	yield data.count();

	v.push([key, 11]);
	var dist = yield data.lookup(key);

	console.assert(loc[0][0] == dist[0][0]);
	console.assert(JSON.stringify(loc[0][1].sort()) == JSON.stringify(dist[0][1].sort()))

	uc.end();
}).catch(ugrid.onError);
