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

	// This function is very similar to Google's, but I added
	// some stuff to deal with the double slash issue.
	var encodeNumber = function (num) {
		var encodeString = '';
		var nextValue, finalValue;
		while (num >= 0x20) {
			nextValue = (0x20 | (num & 0x1f)) + 63;
			encodeString += (String.fromCharCode(nextValue));
			num >>= 5;
		}
		finalValue = num + 63;
		encodeString += (String.fromCharCode(finalValue));
		return encodeString;
	};

	// This one is Google's verbatim.
	var encodeSignedNumber = function (num) {
		var sgn_num = num << 1;
		if (num < 0) {
			sgn_num = ~(sgn_num);
		}

		return encodeNumber(sgn_num);
	};

	var getLat = function (latlng) {
		if (latlng.lat) {
			return latlng.lat;
		} else {
			return latlng[0];
		}
	};
	var getLng = function (latlng) {
		if (latlng.lng) {
			return latlng.lng;
		} else {
			return latlng[1];
		}
	};

	var PolylineUtil = {
		encode: function (latlngs, precision) {
			var i, dlat, dlng;
			var plat = 0;
			var plng = 0;
			var encoded_points = '';

			precision = Math.pow(10, precision || 5);

			for (i = 0; i < latlngs.length; i++) {
				var lat = getLat(latlngs[i]);
				var lng = getLng(latlngs[i]);
				var latFloored = Math.floor(lat * precision);
				var lngFloored = Math.floor(lng * precision);
				dlat = latFloored - plat;
				dlng = lngFloored - plng;
				plat = latFloored;
				plng = lngFloored;
				encoded_points += encodeSignedNumber(dlat) + encodeSignedNumber(dlng);
			}
			return encoded_points;
		},

		decode: function (encoded, precision) {
			var len = encoded.length;
			var index = 0;
			var latlngs = [];
			var lat = 0;
			var lng = 0;

			precision = Math.pow(10, -(precision || 5));

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

				latlngs.push([lat * precision, lng * precision]);
			}

			return latlngs;
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