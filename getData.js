var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    }
    xhr.send();
}

function deepSearch(theObject, searchFor, bindParent) {
    var results = [];
    var search = function(theObject) {
        if (theObject instanceof Array) {
            for (var i = 0; i < theObject.length; i++) {
                result = search(theObject[i]);
                if (result) {
                    break;
                }
            }
        } else {
            for (var prop in theObject) {
                if (prop === searchFor) {
                    if (bindParent)
                        bindParent.forEach(bP=> theObject[prop][bP] = theObject[bP]);
                    results.push(theObject[prop]);
                }
                if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                    result = search(theObject[prop]);
                    if (result) {
                        break;
                    }
                }
            }
        }
    }
    search(theObject, searchFor);
    return results;
}




var markers = {};
function getLeafs() {
    getJSON("http://realtime.mbta.com/developer/api/v2/vehiclesbyroutes?api_key=wX9NwuHnZU2ToO7GmGR9uw&routes=Green-B,Green-C,Green-D,Green-E,Mattapan,Blue,Orange,Red,CR-Fairmount,CR-Fitchburg,CR-Worcester,CR-Franklin,CR-Greenbush,CR-Haverhill,CR-Kingston,CR-Lowell,CR-Middleborough,CR-Needham,CR-Newburyport,CR-Providence,Beverly-Salem,701,747,708,741,742,751,749,746,1,4,5,7,8,9,10,11,14,15,16,17,18,19,21,22,23,24,2427,26,27,28,29,30,31,32,3233,33,34,34E,35,36,37,3738,38,39,40,4050,41,42,43,44,45,47,50,51,52,55,57,57A,59,60,62,627,64,65,66,67,68,69,70,70A,71,72,725,73,74,75,76,77,78,79,80,83,84,85,86,87,88,89,8993,90,91,92,93,94,95,96,97,99,100,101,104,105,106,108,109,110,111,112,114,116,116117,117,119,120,121,131,132,134,136,137,170,171,195,201,202,210,211,212,214,214216,215,216,217,220,221,222,225,230,236,238,240,245,325,326,350,351,352,354,411,424,426,428,429,430,434,435,436,439,441,441442,442,448,449,450,451,455,456,459,465,501,502,503,504,505,553,554,556,558,710,712,713,714,716,9701,9702,9703,Boat-F4,Boat-F1,Boat-F3&format=json",
    function(err, data) {
        if (err != null) {
            alert('Something went wrong: ' + err);
        } else {
            var vehicles = deepSearch(data, "vehicle", ["trip_name", "trip_headsign"]);
            vehicles.forEach(function(v) {
                if (v.vehicle_id in markers) {
                    markers[v.vehicle_id].setLatLng([parseFloat(v.vehicle_lat), parseFloat(v.vehicle_lon)]);
                } else {
                    var marker = L.marker([parseFloat(v.vehicle_lat), parseFloat(v.vehicle_lon)]);
                    marker.addTo(mymap);
                    marker.bindPopup("<b>Trip Name</b><br>" + v.trip_name + "<br><b>Trip Headsign</b><br>" + v.trip_headsign);
                    markers[v.vehicle_id] = marker;
                }
            });
        }
    });
}

getLeafs();
setInterval(getLeafs, 2000);