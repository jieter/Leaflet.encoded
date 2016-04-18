/* Use as a Nodejs module.
 *
 * Either require the file directly or use or use `npm install polyline-encoded` and require('polyline-encoded')
 */
var polyUtil = require('../Polyline.encoded.js');


// encoding
var latlngs = [
    [38.5, -120.5],
    [40.7, -120.95],
    [43.252, -126.453]
];
// should print '_p~iF~cn~U_ulLn{vA_mqNvxq`@'
console.dir(polyUtil.encode(latlngs));


var encoded = '_p~iF~cn~U_ulLn{vA_mqNvxq`@';
console.log(polyUtil.decode(encoded));
