import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class EarService {

  private earUrl = 'http://localhost:4000/api/ear';
  private currentUser = JSON.parse(localStorage.getItem("currentUser"));
  private token = this.currentUser.token;

  constructor(private http: HttpClient) { }

  public getStyles() {
    return this.http.get(this.earUrl + '/styles');
  }

  public getBandsByStyle(style: string) {
    return this.http.get(this.earUrl + '/bands?style=' + style);
  }

  public getDiscsByBandsAndStyle(style: string, band: string) {
    return this.http.get(this.earUrl + '/discs?style=' + style + '&band=' + band);
  }

  public getSongsByBandsAndStyleAndDisc(style: string, band: string, disc: string) {
    return this.http.get(this.earUrl + '/songs?style=' + style + '&band=' + band + '&disc=' + disc);
  }

  public getSong(style: string, band: string, disc: string, song: string) {
    var songUrl = this.earUrl + '/song?style=' + style + '&band=' + band + '&disc=' + disc + '&song=' + song + '&token=' + this.token;
    var audio = new Audio(songUrl);
    return audio;
  }
}