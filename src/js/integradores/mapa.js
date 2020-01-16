import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import './locations.json';

var geocoder;
var map;
var markers = [];
var infowindow;
var infoWindows = [];
var l_info;

window.initMap = function initMap() {
    map = new google.maps.Map(document.getElementById('mapa'), {
        center: { lat: 24.390519, lng: -85.4238198 },
        scrollwheel: false,
        zoom: 5,
        styles: 
        [
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
            ]
        }
        ]
    });
};


window.initMap = initMap;
// $('#mapa').lazyLoadGoogleMaps(
// {
//     key: 'AIzaSyB6JPVsCUTqKazE-LlvKvYl__C_M1BsCdk',
//     callback: window.initMap = initMap,
// });



$('.btn-integradores').on('click', function(){ 
    var indId = $(this).attr('data-industriaId'); 

    if($(this).hasClass('active')){
        $.each(markers, function(i,k){
            if(new RegExp(indId).test(k.title)) {
                markers[i].setVisible(false);
            }
        });
    }else{
        $.each(markers, function(i,k){
            if(new RegExp(indId).test(k.title)) {
                markers[i].setVisible(true);
            }
        });
    }
});


$(document).ready(function() {
    $.get('/api/integrador_info.json',function(data){  
        data = data.data;
        for (var i = 0; i < data.length; i++) {
            
            var industriaID = data[i].id;
            var industrias  = data[i].cats;
            var info = fillInfoWindow(data[i]);
            var integrador = data[i];

            geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': data[i].zipCode , "componentRestrictions":{"country":"MX"}
            }, geoCallback(industriaID, industrias, info, integrador));

            function geoCallback(industriaID, industrias, l_info, integrador){
                var ogCallback = function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location,
                            icon: "/assets/img/marker_map.png",
                            title: industrias,
                        });
                        google.maps.event.addListener(marker, 'click', function(event) {
                            closeAllInfoWindows();
                            try{
                                ga("send", {
                                    hitType: "pageview",
                                    page: "/mapa-marcador-integradores",
                                    title: "Mapa Marcador Integradores"
                                });
                            }catch(exc){
                                console.log('function ga no found');
                            }
                            
                            
                            var iwindow = new google.maps.InfoWindow({
                                content: l_info,
                            });
                            iwindow.open(map, this);
                            infoWindows.push(iwindow);
                            google.maps.event.addListener(iwindow,'closeclick',function(){
                                $('.integrador-ex-info').slideUp('fast');
                                $('.filtros').slideDown('fast');
                                // $('.filtros').removeClass('hidden');
                            });
                            
                            $('.external-logo-integrador').attr('src', integrador.logo);
                            $('.external-logo-integrador').attr('alt', integrador.title);
                            $('.integrador-title').text(integrador.title);
                            $('.integrador-body').html(integrador.body);
                            $('#integrador-input').val(integrador.title);
                            var tags = '';
                            $.each(integrador.tags, function(i,k){
                                tags += "<div class='ind-tag'>" + k + "</div>";
                            });
                            $('.integrador-tags').html(tags);

                                $('.integrador-ex-info').slideDown('fast');
                                $('.formulario-integradores').css('display', 'none');
                                $('.integrador-ex-info .botones').css('display', 'block');
                                $('.filtros').slideUp('fast');

                                // $('.integrador-ex-info').removeClass('hidden');
                                //$('.filtros').addClass('hidden');

                        });
                        markers.push(marker);

                    } else {
                        alert("Geocode was not successful for the following reason: " + status);
                    }
                }
                return ogCallback;
            }//end geoCallback

            $('.btn-integradores').on('click', function(){ closeAllInfoWindows(); });
            $('.return-to-map').on('click', function(){ 
                closeAllInfoWindows(); 
                $('.filtros').slideDown('fast');
                $('.integrador-ex-info').slideUp('fast');
                // $('.filtros').removeClass('hidden');
            });
            
            function closeAllInfoWindows() {
                for (var i=0;i<infoWindows.length;i++) {
                infoWindows[i].close();
               }
            }


            function fillInfoWindow(data){
                
                var getUrl = window.location;
                var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[0];
                var info_card  = "<div class='window_info'>";

                    info_card += "<div class='window_logo'>    <img src="+ data.logo +"> </div>";
                    info_card += "<div class='window_title'>   <p> "+ data.title +" </p> </div>";
                    info_card += "<div class='window_address'> <p> "+ data.address +" </p> </div>";
                    info_card += "<div class='window_contact'> </div>";
                    $.each(data.contacto, function(i,k){
                        info_card += "<p class='mb-0'> <img src='/assets/img/"+ k.type  +".svg' style='width: 15px; margin-right: 5px'>"+ k.data +" </p>";
                    });
                    info_card += "</div>";

                    info_card += "</div>";


                return info_card;
            }
        }
    });
});