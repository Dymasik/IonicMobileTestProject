import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

    @ViewChild('map', { static: false }) mapElement: ElementRef;
    map: any;
    currentMapTrack = null;
    currentLongitude: number;
    currentLatitude: number;
    address: string;
    userLatitude: number;
    userLongitude: number;
    userAddress: string;
    distance: number;
    directionsService: any;
    directionsRenderer: any;

    constructor(private plt: Platform, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
        this.plt.ready().then(() => {

            let mapOptions = {
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            }
            this.directionsService = new google.maps.DirectionsService();
            this.directionsRenderer = new google.maps.DirectionsRenderer();

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.directionsRenderer.setMap(this.map);

            this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 30000 }).then((pos) => {
                this.currentLongitude = pos.coords.longitude;
                this.currentLatitude = pos.coords.latitude;
                this.setMap();
            }).catch((error) => {
                alert('Error getting location' + error);
                this.currentLongitude = 22.298083;
                this.currentLatitude = 48.563686;
                this.setMap();
            });
        });
    }

    setMap() {
        this.getAddress();
        let latLng = new google.maps.LatLng(this.currentLatitude, this.currentLongitude);
        this.map.setCenter(latLng);
        this.map.setZoom(16);
    }

    getAddress() {
        let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 1
        };

        this.nativeGeocoder.reverseGeocode(this.currentLatitude, this.currentLongitude, options)
            .then((result) => {
                this.address = result[0].countryName + " " + result[0].administrativeArea +
                    " " + result[0].locality + " " + result[0].thoroughfare + " " + result[0].postalCode;
            })
            .catch((error: any) => alert(error));
    }

    calculateDist() {
        let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 1
        };
        this.nativeGeocoder.reverseGeocode(this.userLatitude, this.userLongitude, options)
            .then((result) => {
                this.userAddress = result[0].countryName + " " + result[0].administrativeArea +
                    " " + result[0].locality + " " + result[0].thoroughfare + " " + result[0].postalCode;
            })
            .catch((error: any) => alert(error));
        var scope = this;
        this.directionsService.route(
            {
                origin: new google.maps.LatLng(this.currentLatitude, this.currentLongitude),
                destination: new google.maps.LatLng(this.userLatitude, this.userLongitude),
                travelMode: 'DRIVING'
            },
            function (response, status) {
                if (status === 'OK') {
                    scope.directionsRenderer.setDirections(response);
                    var myroute = response.routes[0];
                    var total = 0;
                    for (var i = 0; i < myroute.legs.length; i++) {
                        total += myroute.legs[i].distance.value;
                    }
                    total = total / 1000;
                    scope.distance = total;
                } else {
                    alert('Directions request failed due to ' + status);
                }
            });

    }

    ngOnInit() { }

}
