'use strict';
/* global __dirname:true, require:true, describe:true, beforeEach:true, it:true */

var polyUtil = require('../Polyline.encoded.js');

var chai = require('chai');
require('chai-leaflet')
chai.should();

describe('PolyUtil', function () {
    var latlngs, encoded, encoded6, encoded5, delta;

    var floats, smallFloats, encodedFloats;
    var signedIntegers, encodedSignedIntegers;
    var unsignedIntegers, encodedUnsignedIntegers;

    beforeEach(function () {
        delta = 0.000001;

        latlngs = [
            [38.5, -120.5],
            [40.7, -120.95],
            [43.252, -126.453]
        ];

        encoded = '_p~iF~cn~U_ulLn{vA_mqNvxq`@';
        encoded5 = 'ehukEveaqO|D~Laf@YiZw[oOgQqGeIqE_GeXu_@aOiKkCkMbGrDxIzF`Ct@~@L`FYhAMrNoFfEoArIwBvGwBvB}@jHcBnFcBz@g@jMsDzJ_DfEoAf@SRjCrDbQbBg@vB{@jCoArDg@bBfE|CvKtIbWrDrNvBnAvGfEvBjGqNzNcMtDgN`I_LpM';
        encoded6 = '_izlhA~pvydF_{geC~{mZ_kwzCn`{nI';

        floats = [0.00, 0.15, -0.01, -0.16, 0.16, 0.01];
        smallFloats = [0.00000, 0.00015, -0.00001, -0.00016, 0.00016, 0.00001];
        encodedFloats = '?]@^_@A';

        signedIntegers = [0, 15, -1, -16, 16, 1];
        encodedSignedIntegers = '?]@^_@A';

        unsignedIntegers = [0, 30, 1, 31, 32, 2, 174];
        encodedUnsignedIntegers = '?]@^_@AmD';
    });

    describe('encoding', function () {
        it('simple 2d line', function () {
            polyUtil.encode(latlngs).should.eql(encoded);
        });

        it('with precision = 6', function () {
            polyUtil.encode(latlngs, 6).should.eql(encoded6);
        });

        it('integers with dimension = 1', function () {
            polyUtil.encodeUnsignedIntegers(unsignedIntegers, {
                dimension: 1
            }).should.eql(encodedUnsignedIntegers);

            polyUtil.encodeSignedIntegers(signedIntegers, {
                dimension: 1
            }).should.eql(encodedSignedIntegers);
        });

        it('floats with dimension = 1', function () {
            polyUtil.encodeFloats(smallFloats, {
                dimension: 1
            }).should.eql(encodedFloats);

            polyUtil.encodeFloats(floats, {
                factor: 1e2,
                dimension: 1
            }).should.eql(encodedFloats);
        });
    });

    describe('decoding', function () {
        it('2D line', function () {
            var decoded = polyUtil.decode(encoded);

            decoded.should.be.deepAlmostEqual(latlngs, delta);
        });

        it('with precision = 6', function () {
            var decoded = polyUtil.decode(encoded6, 6);

            decoded.should.be.deepAlmostEqual(latlngs, delta);
        });

        it('should respect the precision in the decoded coordinates', function () {
            var decoded = polyUtil.decode(encoded5, 5);
            decoded[0].should.eql(decoded[decoded.length - 1]);
        });

        it('integers with dimension = 1', function () {
            polyUtil.decodeUnsignedIntegers(encodedUnsignedIntegers)
                .should.eql(unsignedIntegers);

            polyUtil.decodeSignedIntegers(encodedSignedIntegers)
                .should.eql(signedIntegers);
        });

        it('floats with dimension = 1', function () {
            polyUtil.decodeFloats(encodedFloats, {
                dimension: 1
            }).should.eql(smallFloats);

            polyUtil.decodeFloats(encodedFloats, {
                factor: 1e2,
                dimension: 1
            }).should.eql(floats);
        });
    });

    describe('encode -> decode', function () {
        it('simple latlngs', function () {
            var encoded = polyUtil.encode(latlngs);
            polyUtil.decode(encoded).should.eql(latlngs);
        });

        it('latlngs height', function () {
            var xyz = [
                [38.5, -120.5, 3],
                [40.7, -120.95, 4],
                [43.252, -126.453, 5]
            ];
            var options = {
                dimension: 3
            };

            var encoded = polyUtil.encode(xyz, options);
            polyUtil.decode(encoded, options).should.eql(xyz);
        });
    });

    describe('Some strings', function () {
        var fs = require('fs');

        var path = require('path').join(__dirname, '/testcases/');

        fs.readdirSync(path).filter(function (filename) {
            return filename.match('.json$');
        }).forEach(function (filename) {
            var testcase = JSON.parse(fs.readFileSync(path + filename));

            it(testcase.description, function () {
                var encoded = testcase.encoded;

                polyUtil.decode(encoded)
                    .should.deepAlmostEqual(testcase.expected, testcase.delta);

            });
        });
    });
});
