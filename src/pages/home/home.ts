import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from "@ionic-native/camera";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  lat: any;
  lng: any;
  public photos: any;
  public base64Image: string;
  public fileImage: string;
  public responseData: any;
  constructor(public camera: Camera, public navCtrl: NavController, public geo: Geolocation) {

  }
  ngOnInit() {
    this.photos = [];
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      // Handle error
    });
  }
  deletePhoto(index) {
    this.photos.splice(index, 1);
  }
  ionViewDidLoad() {
    this.geo.getCurrentPosition().then(pos => {
      this.lng = pos.coords.longitude;
      this.lat = pos.coords.latitude;
    }).catch(err => console.log(err));
  }
}
