export function initMap() {
    //here goes API key for google map
    let APIkey = "AIzaSyBK04nqVTOccf_UQ5airHZgru76FXnnUb4";


    let map = document.getElementById("map");
    let coords = [];
    let zoom;
    let addressesList = document.querySelector(".addresses-list");
    let bounds;



    //Generate markup with all addresses in json
    let counter = 0;
    for (let i in addressesJSON) {
        addressesList.innerHTML +=
            `
            <div class="item" data-marker="" data-lat="${addressesJSON[i].lat}" data-lng="${addressesJSON[i].lng}" data-marker-number="${counter}">
                <strong>
					${addressesJSON[i].title}
				</strong>
				<div class="address">
				    ${addressesJSON[i].address}
				    <a href="${addressesJSON[i].link}">MAP</a>
                </div>
            </div>`;

        counter++;
    }

    //add markers to the map
    let markers = $("[data-marker]");

    markers.each(function (i, it) {
        let item = $(it);
        let lat = item.data("lat");
        let lng = item.data("lng");
        coords[i] = {lat: +lat, lng: +lng};
    });


    //init Map
    function initMap() {
        map = new google.maps.Map(map, {
            zoom: 10,
            disableDefaultUI: true
        });

        //create empty array for future markers
        map.markers = [];

        //create emprty bounds collection
        bounds = new google.maps.LatLngBounds();

        //add all markers to map's markers array and add markers coordinates to bounds
        coords.forEach(function (item, i) {
            map.markers[i] = new google.maps.Marker({
                position: coords[i],
                map: map
            });

            bounds.extend(map.markers[i].getPosition());
        });


        //center map by all markers
        map.fitBounds(bounds);
    }

    initMap();


    //function to show message on the map
    function showMessage(message) {
        // eslint-disable-next-line quotes
        $("#map").append(`<div class="wrong-message">${message}</div>`);

        setTimeout(function () {
            $(".wrong-message").hide(300, function () {
                $(this).remove();
            });
        }, 3000);
    }

    $("form").submit(function (e) {
        e.preventDefault();

        let input = $("#zip");

        //current ZIP-code
        let zip = input.val().length > 0 ? +input.val() : " ";

        //selected zoom
        zoom = +$("option:selected").val();

        $.ajax({
            type: "get",
            url: "https://maps.googleapis.com/maps/api/geocode/json",
            data: {
                address: zip,
                key: APIkey
            },
            dataType: "json",

            success: function (response) {
                //marker counter
                let foundMarkers = 0;

                //new bounds
                bounds = new google.maps.LatLngBounds();


                if (response.status === "OK") {
                    // console.log(response);
                    //cetner of founded location by ZIP code;
                    let center = response.results[0].geometry.location;

                    //picked radius of search converted from miles to metters
                    let radius = +zoom * 1609;

                    //create LatLng obj from center coordinates
                    let placeCoords = new google.maps.LatLng(center.lat, center.lng);
                    let distance;

                    //hide all html markers
                    //hide all html markers
                    markers.hide();

                    map.markers.forEach(function (item, i) {

                        //get LatLNG object with marker position
                        let markerPosition = item.getPosition();

                        //check the distance between marker and founded location by zip
                        distance = google.maps.geometry.spherical.computeDistanceBetween(placeCoords, markerPosition);

                        if (distance <= radius) {

                            //set marker visible if it is included in radius of search
                            item.setVisible(true);

                            //add this marker to bounds area
                            bounds.extend(markerPosition);

                            //show html block that corresponds to founded marker
                            $(`[data-marker-number="${i}"]`).show();

                            //increase founded marker's counter
                            foundMarkers++;

                        } else {

                            //hide marker from the map if it is not included in search area
                            item.setVisible(false);
                        }
                    });

                    if (foundMarkers === 1) {
                        //if marker is only 1 - show it in the center of map
                        map.setCenter(bounds.getCenter());
                        map.setZoom(10);

                    } else if (foundMarkers > 1) {

                        //if marker's count is more than 1, center map by all markers included in search area
                        map.fitBounds(bounds);

                    } else {

                        //if there are no founded markers, set all markers visible add their coords to map bounds
                        map.markers.forEach(function (item) {
                            item.setVisible(true);
                            bounds.extend(item.getPosition());
                        });

                        //Center map by all marker's bounds
                        map.fitBounds(bounds);

                        //show all html markers
                        $("[data-marker]").show();

                        //show message on the map
                        showMessage("ZIP is incorrect");
                    }

                } else {

                    //if status of ajax response are not "OK"
                    //show all map markers, all html blocks, center map by all markers and show message with error
                    map.markers.forEach(function (item) {
                        item.setVisible(true);

                        bounds.extend(item.getPosition());
                    });

                    map.fitBounds(bounds);

                    $("[data-marker]").show();

                    showMessage("ZIP is incorrect");
                }
            },

            error: function () {

                map.markers.forEach(function (item) {
                    item.setVisible(true);
                    bounds.extend(item.getPosition());
                });

                map.fitBounds(bounds);

                $("[data-marker]").show();

                showMessage("Something went wrong.");
            }

        })
        ;
    });


    //submit form by changing select value
    $("select").change(function () {
        $("form").submit();
    });
}

/*
function theirMap() {
    /!* eslint-disable quotes *!/
    //10 miles = zoom 14;
    //25 miles = zoom 10;
    //50 miles = zoom 8;


    //Block with locations
    let this_lbl = $("#locations_block_list");

    //Clear zip input
    $("#zip_code", this_lbl).val("");

    //Submit listener
    $("#location_zip_in", this_lbl).submit(function () {

        let l_form = $("#location_zip_in", this_lbl),

            // zip_ch = /^\d{5}(-\d{4})?(?!-)$/,

            //value of zip input
            zip_code_in = $("#zip_code", this_lbl).val();

        if (!l_form.hasClass("loading")) {

            $("#zip_code", this_lbl).attr("readonly", true);

            $.ajax({
                type: "post",
                url: $("html").data("admin"),
                data: {
                    action: "loadLocationsZip",
                    zip: zip_code_in,
                    radius: $("#distance_loc_s", this_lbl).val(),
                    page_id: l_form.attr("data-page_id")
                },
                beforeSend: function () {
                    $("body").addClass("processing");
                },
                success: function (res) {

                    $("#zip_code", this_lbl).removeAttr("readonly");

                    if (res) {
                        $("#locations_out").html(res);
                        initMaps();
                    }
                    $("body").removeClass("processing");

                }
            });

        }

        return false;
    });

    function sendZipRequest() {
        $("#location_zip_in").submit();
    }

    //submit form after changing zoom select
    $("#distance_loc_s").change(function () {
        sendZipRequest();
    });

    // map
    initMaps();

    $("[data-marker]").on("click", function () {

        let el_index = $(this).data("pid");
        google.maps.event.trigger(markers[el_index], "click");
    });

    let markers = [];
    let map = null;
    let activeInfoWindow;


    function initMaps() {
        if ($(".acf-map").length > 0) {
            $(".acf-map").each(function () {
                map = new_map($(this));
            });
        }
    }

    function new_map($el) {
        let $markers = $("[data-marker]");
        let args = {
            zoom: 10,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        let map = new google.maps.Map($el[0], args);
        map.markers = [];
        $markers.each(function () {
            add_marker($(this), map);
        });
        center_map(map);
        return map;
    }

    function add_marker($marker, map) {
        let latlng = new google.maps.LatLng($marker.attr("data-lat"), $marker.attr("data-lng"));
        let marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: $marker.attr("data-img")
        });


        map.markers.push(marker);


        if ($marker.html()) {
            let html = "<h3>" + $marker.data("title") + "</h3>";

            html = $marker.find(".address").length > 0 ? html + '<p>' + $marker.find(".address").html() + '</p>' : html + '';


            let infowindow = new google.maps.InfoWindow({content: html});

            marker.addListener('click', function () {
                activeInfoWindow && activeInfoWindow.close();
                infowindow.open(map, marker);
                activeInfoWindow = infowindow;
            });
        }

        let el_index = $marker.data('pid');

        markers[el_index] = marker;
    }

    function center_map(map) {
        let bounds = new google.maps.LatLngBounds();

        $.each(map.markers, function (i, marker) {

            let latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());

            bounds.extend(latlng);
        });

        if (map.markers.length === 1) {
            map.setCenter(bounds.getCenter());
            map.setZoom(10);
        } else {
            map.fitBounds(bounds);
        }
    }


    $('.reset_search').click(function () {
        let form = $('#location_zip_in');
        $('#zip_code').val("");
        // alert(1);
        form.submit();
        return false;
    });
}*/
