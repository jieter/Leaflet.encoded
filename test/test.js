var polyUtil = require('../Polyline.encoded.js');
var expect = require('expect.js');

var d = 0.000001;

var latlngs = [
	[38.5, -120.5],
	[40.7, -120.95],
	[43.252, -126.453]
];
var encoded = '_p~iF~cn~U_ulLn{vA_mqNvxq`@';

describe('Polyline', function () {

	it('encodes', function () {
		expect(polyUtil.encode(latlngs)).to.eql(encoded);
	});

	it('decodes', function () {
		var decoded = polyUtil.decode(encoded);

		for (var i in decoded) {
			expect(decoded[i][0]).to.be.within(latlngs[i][0] - d, latlngs[i][0] + d);
		}
	});
});