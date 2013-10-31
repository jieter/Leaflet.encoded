/*
 * L.PolylineUtil contains utilify functions for polylines, two methods
 * are added to the L.Polyline object to support creation of polylines
 * from an encoded string and converting existing polylines to an
 * encoded string.
 *
 *  - L.Polyline.fromEncoded(encoded [, options]) returns a L.Polyline
 *  - L.Polyline.encodePath() returns a string
 *
 * Actual code from:
 * http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/\
 */

(function () {
	'use strict';

	/* jshint bitwise:false */

	var fillOptions = function (opt_options) {
		var options = opt_options || {};
		if (typeof options === 'number') {
			// Legacy
			options = { precision: options };
		} else {
			options.precision = options.precision || 5;
		}
		options.factor = options.factor || Math.pow(10, options.precision);
		return options;
	};

	var PolylineUtil = {
		encode: function (points, opt_options) {
			var options = fillOptions(opt_options);

			var flatPoints = [];
			for (var i = 0, len = points.length; i < len; ++i) {
				var point = points[i];

				flatPoints.push(point.lat || point[0]);
				flatPoints.push(point.lng || point[1]);
			}

			return this.encodeDeltas(flatPoints, options);
		},

		decode: function (encoded, opt_options) {
			var options = fillOptions(opt_options);

			var len = encoded.length;
			var index = 0;
			var latlngs = [];
			var lat = 0;
			var lng = 0;

			while (index < len) {
				var b;
				var shift = 0;
				var result = 0;
				do {
					b = encoded.charCodeAt(index++) - 63;
					result |= (b & 0x1f) << shift;
					shift += 5;
				} while (b >= 0x20);
				var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
				lat += dlat;

				shift = 0;
				result = 0;
				do {
					b = encoded.charCodeAt(index++) - 63;
					result |= (b & 0x1f) << shift;
					shift += 5;
				} while (b >= 0x20);
				var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
				lng += dlng;

				latlngs.push([lat / options.factor, lng / options.factor]);
			}

			return latlngs;
		},

		encodeDeltas: function(numbers, opt_options) {
			var options = fillOptions(opt_options);

			var lastNumbers = [0, 0];

			var numbersLength = numbers.length;
			for (var i = 0; i < numbersLength;) {
				for (var d = 0; d < 2; ++d, ++i) {
					var num = numbers[i];
					var delta = num - lastNumbers[d];
					lastNumbers[d] = num;

					numbers[i] = delta;
				}
			}

			return this.encodeFloats(numbers, options);
		},

		encodeFloats: function(numbers, opt_options) {
			var options = fillOptions(opt_options);

			for (var i = 0, len = numbers.length; i < len; ++i) {
				numbers[i] = Math.round(numbers[i] * options.factor);
			}

			return this.encodeSignedIntegers(numbers);
		},

		encodeSignedIntegers: function(numbers) {
			for (var i = 0, len = numbers.length; i < len; ++i) {
				var num = numbers[i];

				var signedNum = num << 1;
				if (num < 0) {
					signedNum = ~(signedNum);
				}

				numbers[i] = signedNum;
			}

			return this.encodeUnsignedIntegers(numbers);
		},

		encodeUnsignedIntegers: function(numbers) {
			var encoded = '';

			var numbersLength = numbers.length;
			for (var i = 0; i < numbersLength; ++i) {
				encoded += this.encodeUnsignedInteger(numbers[i]);
			}

			return encoded;
		},

		// This one is Google's verbatim.
		encodeSignedInteger: function (num) {
			var sgn_num = num << 1;
			if (num < 0) {
				sgn_num = ~(sgn_num);
			}

			return this.encodeUnsignedInteger(sgn_num);
		},

		// This function is very similar to Google's, but I added
		// some stuff to deal with the double slash issue.
		encodeUnsignedInteger: function (num) {
			var value, encoded = '';
			while (num >= 0x20) {
				value = (0x20 | (num & 0x1f)) + 63;
				encoded += (String.fromCharCode(value));
				num >>= 5;
			}
			value = num + 63;
			encoded += (String.fromCharCode(value));
			return encoded;
		}
	};
	/* jshint bitwise:true */

	// Export Node module
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = PolylineUtil;
	}

	// Inject functionality into Leaflet
	if (typeof L === 'object') {
		if (!(L.Polyline.prototype.fromEncoded)) {
			L.Polyline.fromEncoded = function (encoded, options) {
				return new L.Polyline(PolylineUtil.decode(encoded), options);
			};
		}
		if (!(L.Polygon.prototype.fromEncoded)) {
			L.Polygon.fromEncoded = function (encoded, options) {
				return new L.Polygon(PolylineUtil.decode(encoded), options);
			};
		}

		var encodeMixin = {
			encodePath: function () {
				return PolylineUtil.encode(this.getLatLngs());
			}
		};

		if (!L.Polyline.prototype.encodePath) {
			L.Polyline.include(encodeMixin);
		}
		if (!L.Polygon.prototype.encodePath) {
			L.Polygon.include(encodeMixin);
		}

		L.PolylineUtil = PolylineUtil;
	}
})();
