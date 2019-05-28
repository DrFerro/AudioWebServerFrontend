import { Component, OnInit } from '@angular/core';

import { EarService } from '../../services/ear.service';

@Component({
  selector: 'app-ear',
  templateUrl: './ear.component.html'
})
export class EarComponent implements OnInit {

  public styles: string[] = [];
  public selectedStyle: string = "";
  public bands: string[] = [];
  public selectedBand: string = "";
  public discs: string[] = [];
  public selectedDisc: string = "";
  public fileNames: string[] = [];
  public songs: string[] = [];
  public selectedSong: string = "";
  public contenedorAudio;
  public audio = new Audio();
  public positionSong: number = 0;

  constructor(private earService: EarService) { }

  ngOnInit() {
    this.getStyles();
  }

  getStyles() {
    this.earService.getStyles().subscribe(res => {
      for (let s in res) {
        this.styles.push(res[s]);
      };
    });
  }

  getBands(style: string) {
    this.bands = [];
    this.selectedStyle = style;
    this.earService.getBandsByStyle(style).subscribe(res => {
      for (let b in res) {
        this.bands.push(res[b]);
      };
    });
  }

  getDiscs(style: string, band: string) {
    this.discs = [];
    this.selectedBand = band;
    this.earService.getDiscsByBandsAndStyle(style, band).subscribe(res => {
      for (let d in res) {
        this.discs.push(res[d]);
      };
    });
  }

  getSongs(style: string, band: string, disc: string) {
    this.songs = [];
    this.selectedDisc = disc;
    this.earService.getSongsByBandsAndStyleAndDisc(style, band, disc).subscribe(res => {
      this.fileNames = [];
      for (let f in res) {
        this.fileNames.push(res[f]);
      };
      // Filter mp3 files
      for (var i = 0; i < this.fileNames.length; i++) {
        if (this.fileNames[i].substring(this.fileNames[i].length - 3, this.fileNames[i].length) === "mp3") {
          this.songs.push(this.fileNames[i]);
        }
      };
    });
  }

  getSong(style: string, band: string, disc: string, song: string) {

    this.selectedSong = song;    
    
    this.contenedorAudio = document.getElementById("contenedorAudio");
    if(document.getElementById("audioId")) {
      this.contenedorAudio.removeChild(this.audio);
    }

    this.audio = this.earService.getSong(style, band, disc, song);
    this.audio.id = "audioId";
    this.audio.controls = true;

    this.contenedorAudio.appendChild(this.audio);
    this.audio.play();

    this.audio.onended = () => {
      this.nextSong(this.selectedSong);
    }
  }

  nextSong(song: string) {
    this.positionSong = this.songs.indexOf(song);
    if(this.positionSong < this.songs.length-1) {
      this.getSong(this.selectedStyle, this.selectedBand, this.selectedDisc, this.songs[this.positionSong + 1]);
    }
  }

  prevSong(song: string) {
    this.positionSong = this.songs.indexOf(song);
    if(this.positionSong > 0) {
      this.getSong(this.selectedStyle, this.selectedBand, this.selectedDisc, this.songs[this.positionSong - 1]);
    }
  }

  stopSong() {
    this.audio.pause();
  }

}