# Support encoded polylines in Leaflet
--------------------------------------

This Leaflet plugin extends the [Leaflet](https://github.com/CloudMade/Leaflet) API with functions to encode en decode Google maps polyline encoding. It is just a convenient way to use the algorithm from http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/ in Leaflet.

### Provided methods

<table>
<tr>
	<th colspan="2">Utility methods</th>
</tr>
<tr>
	<td><code>L.PolylineUtil.encode(latlngs [, precision])</code></td>
	<td>Encode an array of <code>L.LatLng</code> objects,
	or an array of arrays.</td>
</tr>
<tr>
	<td><code>L.PolylineUtil.decode(encoded [, precision])</code></td>
	<td>Decode the string <code>encoded</code> to an array of <code>[lat, lng]</code>-arrays.</td>
</tr>

<tr>
	<th colspan="2">Extensions for <code>L.Polyline</code></th>
</tr>
<tr>
	<td><code>L.Polyline.fromEncoded(encoded [, options])</code></td>
	<td>Construct a <code>L.Polyline</code> from a string, with optional <code>options</code> object.</td>
</tr>
<tr>
	<td><code>L.Polyline.encodePath()</code></td><td>Return an encoded string for the current Polyline.</td>
</tr>

<tr>
	<th colspan="2">Extensions for <code>L.Polygon</code></th>
</tr>
<tr>
	<td><code>L.Polygon.fromEncoded(encoded [, options])</code></td>
	<td>Construct a <code>L.Polygon</code> from a string, with optional <code>options</code> object.</td>
</tr>
<tr>
	<td><code>L.Polygon.encodePath()</code></td><td>Return an encoded string for the current Polygon.</td>
</tr>

</table>

### Code examples
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
var polyline = new L.Polyline(PolylineUtil.decode(encoded, 6));

// prints an array of 3 LatLng objects.
console.log(polyline.getLatLngs());
```


### Node package
You can use `encode()` and `decode()` in your Nodejs scripts:

`npm install polyline-encoded`

```javascript
var polylineEncoded = require('polyline-encoded');

var encoded = "_p~iF~cn~U_ulLn{vA_mqNvxq`@";
var latlngs = polylineEncoded.decode(encoded);
```
