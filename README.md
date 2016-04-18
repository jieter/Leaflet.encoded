# Support encoded polylines in Leaflet

This Leaflet plugin extends Leaflet with functions to encode to and decode from Google maps polyline encoding.

- Works with [Leaflet](https://github.com/Leaflet/Leaflet) v0.7.7 and v1.0.0-rc.1
- Algorithm described in the [Google maps API Documentation](https://developers.google.com/maps/documentation/utilities/polylinealgorithm).

## Escaping backslashes
*Make sure to always escape the backslashes in encoded strings!* Not doing so will result in the backslash to be interpreted as an escape character, yielding wrong results.

## API
### Utility methods

- `L.PolylineUtil.encode(latlngs [, precision])`

  Encode an array of `L.LatLng` objects, or an array of arrays.


- `L.PolylineUtil.decode(encoded [, precision])`

  Decode the string `encoded` to an array of `[lat, lng]`-arrays.

### Extensions for `L.Polyline`

- `L.Polyline.fromEncoded(encoded [, options])`

  Construct a new `L.Polyline` from a string, with optional `options` object. Backslashes in strings should be properly escaped.

- `L.Polyline.encodePath()`

  Return an encoded string for the current Polyline.

### Extensions for `L.Polygon`

- `L.Polygon.fromEncoded(encoded [, options])`

  Construct a new `L.Polygon` from a string, with optional `options` object. Backslashes in strings should be properly escaped.

- `L.Polygon.encodePath()`

  Return an encoded string for the current Polygon.

## Code examples
After loading ```leaflet.js```, ```src/Polyline.encoded.js``` should be included.

### Encoding

```javascript
var latlngs = [
	[38.5, -120.5],
	[40.7, -120.95],
	[43.252, -126.453]
];
var polyline = L.polyline(latlngs);

//prints "_p~iF~cn~U_ulLn{vA_mqNvxq`@" to the console
console.log(polyline.encodePath());
```

#### Decoding
```javascript
var encoded = "_p~iF~cn~U_ulLn{vA_mqNvxq`@";
var polyline = L.Polyline.fromEncoded(encoded);

// prints an array of 3 LatLng objects.
console.log(polyline.getLatLngs());
```

Use a decoding precision of 6 to decode OSRM Routing Engine geometries
```javascript
var encoded = "_izlhA~pvydF_{geC~{mZ_kwzCn`{nI";
var polyline = L.polyline(L.PolylineUtil.decode(encoded, 6));

// prints an array of 3 LatLng objects.
console.log(polyline.getLatLngs());
```

## Node package
You can use `encode()` and `decode()` in your Nodejs scripts:

`npm install polyline-encoded`

```javascript
var polyUtil = require('polyline-encoded');

var encoded = "_p~iF~cn~U_ulLn{vA_mqNvxq`@";
var latlngs = polyUtil.decode(encoded);
```
