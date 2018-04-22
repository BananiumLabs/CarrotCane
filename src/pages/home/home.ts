import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  lat: any;
  lng: any;
  constructor(public navCtrl: NavController, public geo: Geolocation) {

  }
  ionViewDidLoad(){
    this.geo.getCurrentPosition().then(pos => {
      this.lng = pos.coords.longitude;
      this.lat = pos.coords.latitude;
    }).catch(err => console.log(err));
  }
}
