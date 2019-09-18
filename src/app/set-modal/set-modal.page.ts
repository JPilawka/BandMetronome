import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import {NavParams, ModalController} from '@ionic/angular';
import { IonReorderGroup } from '@ionic/angular';

interface Set{
  songs: any,
  band: any,
  rev: any,
  name: any,
  id: any
}

@Component({
  selector: 'app-set-modal',
  templateUrl: './set-modal.page.html',
  styleUrls: ['./set-modal.page.scss'],
})
export class SetModalPage implements OnInit {



  setId:any;
  songs:any;
  band:any;
  setName:any;
  selectedSongs=[];
  allSongs: any;
  setRev:any;
  addSongSectionOpen = false;

  constructor(private navParams: NavParams, private modalController: ModalController, private DB:DatabaseService) { }

  ngOnInit() {
    this.setId = this.navParams.get('setId');
    this.getData();
  }

  closeModal(){
    this.modalController.dismiss();
  }

  addSongToSet(){
    this.addSongSectionOpen = true;

  }

  addItemToSet(songId){
    this.addTitlesToList(songId);
    this.addSongSectionOpen = false;
  }

  saveSet(){
    //console.log("this.selectedSongs", this.selectedSongs)
    let songs = this.selectedSongs.map(song=>{
      return song.songId
    })

    //console.log("przed zapisame",songs);

    let set = {
      id: this.setId,
      name: this.setName,
      rev: this.setRev,
      band: this.band,
      songs: songs

    }
    //console.log("set do bazy",set);
    this.DB.updateSet(set).then(res=>{
      //console.log("res",res);
      this.modalController.dismiss();
    }).catch(e=>{
      console.error(e)
    })
  }

  deleteSong(songIndex){

    this.selectedSongs.splice(songIndex,1)
  }

  doReorder(event){

    let draggedItem = this.selectedSongs.splice(event.detail.from,1)[0];
    this.selectedSongs.splice(event.detail.to,0,draggedItem)
    event.detail.complete();

    //console.log("po reorderze",this.selectedSongs)
  }

  getData(){
    //najpierw wszystkie piosenki

    this.DB.loadAllSets().then(r=>{
      //console.log("r",Object.entries(r));

      Object.entries(r).forEach(s=>{

        let set:Set=s[1];
        //console.log("set",set)

        if(set.id==this.setId){
          //console.log("set dwa", set.id)

          this.songs=set.songs;
          this.band=set.band;
          this.setRev = set.rev;
          this.setName = set.name;
          ////console.log("rev",this.setRev)
        }

      });
      return this.DB.loadSongs(this.band);
    }).then(r2=>{
      this.allSongs = r2;
        //console.log("this.songs", this.songs);

      this.songs.forEach(song=>{
        ////console.log("song pobrany", song.name, song.band);
        this.addTitlesToList(song);

      });

      //console.log(this.selectedSongs);
    }).catch(e=>{
      console.error(e);
    });
  }

  addTitlesToList(songId){
    let s = this.allSongs.map(e=>{
      ////console.log(e)
      return e.id
    }).indexOf(songId);
    ////console.log("s", s)

    this.selectedSongs.push({songId: songId, songName: this.allSongs[s].name});
  }
}
