'use strict';
/* global require:true, describe:true, it:true */

var polyUtil = require('../Polyline.encoded.js');
var chai = require('chai').should();

var delta = 0.000001;

var latlngs = [
	[38.5, -120.5],
	[40.7, -120.95],
	[43.252, -126.453]
];

var encoded = '_p~iF~cn~U_ulLn{vA_mqNvxq`@';
var encoded6 = '_izlhA~pvydF_{geC~{mZ_kwzCn`{nI';

describe('Polyline', function () {

	it('encodes', function () {
		polyUtil.encode(latlngs).should.eql(encoded);
	});

	it('encodes with precision = 6', function () {
		polyUtil.encode(latlngs, 6).should.eql(encoded6);
	});

	it('decodes', function () {
		var decoded = polyUtil.decode(encoded);

		for (var i in decoded) {
			decoded[i][0].should.be.closeTo(latlngs[i][0], delta);
		}
	});

	it('decodes with precision = 6', function () {
		var decoded = polyUtil.decode(encoded6, 6);

		for (var i in decoded) {
			decoded[i][0].should.be.closeTo(latlngs[i][0], delta);
		}
	});
});
