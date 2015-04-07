#!/usr/local/bin/node --harmony

var co = require('co');
var ugrid = require('../../');

co(function *() {
	var uc = yield ugrid.context();
	console.assert(uc.worker.length > 0);

	var key = 1;
	var value = 2;
	var v = [[key, value], [3, 4], [5, 6]];
	var v_copy = JSON.parse(JSON.stringify(v));

	function by2 (e) {
		return e * 2;
	}

	var data = uc.parallelize(v).persist();
	yield data.lookup(key);

	v.push([key, value]);
	var res = yield data.mapValues(by2).collect();

	for (var i = 0; i < v_copy.length; i++)
		v_copy[i][1] = by2(v_copy[i][1]);

	res = res.sort();
	v_copy = v_copy.sort();

	console.assert(v_copy.length == res.length);
	for (var i = 0; i < v_copy.length; i++)
		for (var j = 0; j < v_copy[i].length; j++)
			console.assert(res[i][j] == v_copy[i][j])

	uc.end();
}).catch(ugrid.onError);
