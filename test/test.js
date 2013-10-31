'use strict';
/* global require:true, describe:true, beforeEach:true, it:true */

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

	var floats, smallFloats, encodedFloats;
	var signedIntegers, encodedSignedIntegers;
	var unsignedIntegers, encodedUnsignedIntegers;

	beforeEach(function () {
		floats = [0.00, 0.15, -0.01, -0.16, 0.16, 0.01];
		smallFloats = [0.00000, 0.00015, -0.00001, -0.00016, 0.00016, 0.00001];
		encodedFloats = '?]@^_@A';

		signedIntegers = [0, 15, -1, -16, 16, 1];
		encodedSignedIntegers = '?]@^_@A';

		unsignedIntegers = [0, 30, 1, 31, 32, 2, 174];
		encodedUnsignedIntegers = '?]@^_@AmD';
	});

	it('encodes', function () {
		polyUtil.encode(latlngs).should.eql(encoded);
	});

	it('encodes with precision = 6', function () {
		polyUtil.encode(latlngs, 6).should.eql(encoded6);
	});

	it('encodes integers with dimension = 1', function () {
		polyUtil.encodeUnsignedIntegers(unsignedIntegers, {
			dimension: 1
		}).should.eql(encodedUnsignedIntegers);

		polyUtil.encodeSignedIntegers(signedIntegers, {
			dimension: 1
		}).should.eql(encodedSignedIntegers);
	});

	it('encodes floats with dimension = 1', function () {
		polyUtil.encodeFloats(smallFloats, {
			dimension: 1
		}).should.eql(encodedFloats);

		polyUtil.encodeFloats(floats, {
			factor: 1e2,
			dimension: 1
		}).should.eql(encodedFloats);
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

	it('decodes integers with dimension = 1', function () {
		polyUtil.decodeUnsignedIntegers(encodedUnsignedIntegers, {
			dimension: 1
		}).should.eql(unsignedIntegers);

		polyUtil.decodeSignedIntegers(encodedSignedIntegers, {
			dimension: 1
		}).should.eql(signedIntegers);
	});
});
