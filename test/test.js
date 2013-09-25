var polyUtil = require('../Polyline.encoded.js');
var expect = require('expect.js');

var d = 0.000001;

var latlngs = [
	[38.5, -120.5],
	[40.7, -120.95],
	[43.252, -126.453]
];

var encoded = '_p~iF~cn~U_ulLn{vA_mqNvxq`@';
var encoded6 = '_izlhA~pvydF_{geC~{mZ_kwzCn`{nI';

describe('Polyline', function () {

	it('encodes', function () {
		expect(polyUtil.encode(latlngs)).to.eql(encoded);
	});

	it('encodes6', function () {
		expect(polyUtil.encode(latlngs, 6)).to.eql(encoded6);
	});

	it('decodes', function () {
		var decoded = polyUtil.decode(encoded);

		for (var i in decoded) {
			expect(decoded[i][0]).to.be.within(latlngs[i][0] - d, latlngs[i][0] + d);
		}
	});

	it('decodes6', function () {
		var decoded = polyUtil.decode(encoded6, 6);

		for (var i in decoded) {
			expect(decoded[i][0]).to.be.within(latlngs[i][0] - d, latlngs[i][0] + d);
		}
	});
});