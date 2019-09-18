import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Storage } from '@ionic/storage';
import {PickerController} from '@ionic/angular';
import {PickerOptions} from '@ionic/core';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage implements OnInit {
//

    bands:any;
    chosenBand: any =undefined;
    newSong={name: '', tempo: 100, metrum: {beat: 4, bar: 4}};
    allSongs: any;
    bandSongs=[];
    tempoOptions = [];
    beatOptions=[];
    barsOptions=[
      {text: '2', value: 2},
      {text: '4', value: 4},
      {text: '8', value: 8},
      {text: '16', value: 16}
    ];
    constructor(private DB: DatabaseService, private storage: Storage, private tempoPicker: PickerController,private metrumPicker: PickerController) {
      this.populatelists();
    }
  //
    ngOnInit() {
    }

    populatelists(){

      for(let i=50; i<=240; i++){
        this.tempoOptions.push({text: i, value: i});
      }

      for(let i=1; i<=16; i++){
        this.beatOptions.push({text: i,value: i});
      }

      this.DB.loadBands().then((res)=>{
        this.bands=res;
      }).catch();


      this.DB.loadAllSongs().then((res)=>{
        this.allSongs=res;

      }).catch((e)=>{
        console.error(e)
      });
      ////console.log(this.bandList);
    }

    changeBand($event){

      this.chosenBand=$event.target.value;

      this.selectBandSongs()

    }

    selectBandSongs(){
      this.bandSongs=[];
      this.allSongs.forEach(song=>{

        if(song.band==this.chosenBand.id){
          this.bandSongs.push(song)
        }
      });
    }

    addNewSong(){
      if(this.newSong.name!=''){
        let song = {
          id: '_'+this.newSong.name.toLowerCase(),
          band: this.chosenBand.id,
          name: this.newSong.name,
          tempo: this.newSong.tempo,
          metrum: {
            beat: this.newSong.metrum.beat,
            bar: this.newSong.metrum.bar
          }
        }

        this.DB.addSong(song).then((res)=>{
          return this.DB.loadSongs(this.chosenBand.id);
        }).then((r2)=>{
          this.allSongs=r2;
          this.selectBandSongs();

          this.newSong = {name: '',tempo: 100, metrum: {beat: 4, bar: 4}}
          //this.allSongs = r2;
        }).catch((e)=>{console.error(e)});
      }
    }

    async pickTempo(){

      let opt: PickerOptions={
        buttons: [
          {text: 'Odrzuć', role: 'cancel'},
          {text: 'OK'}
        ],
        columns: [{
          name: 'Tempo',
          options: this.tempoOptions,
        }]
      };
      let picker = await this.tempoPicker.create(opt);

      picker.present();
      picker.onDidDismiss().then(async data=>{
        let col = await picker.getColumn('Tempo');
        //console.log(col.options[col.selectedIndex].value);
        this.newSong.tempo = col.options[col.selectedIndex].value;

      });
    }

    async pickMetrum(){

      let opt: PickerOptions={
        buttons: [
          {text: 'Odrzuć', role: 'cancel'},
          {text: 'OK'}
        ],
        columns: [{
          name: 'Beats',
          options: this.beatOptions,
        },
        {
          name: 'Bars',
          options: this.barsOptions,
        }]
      };
      let picker = await this.metrumPicker.create(opt);
      picker.present();
      picker.onDidDismiss().then(async data=>{
        let beats = await picker.getColumn('Beats');
        let bars = await picker.getColumn('Bars');
        this.newSong.metrum.beat = beats.options[beats.selectedIndex].value;
        this.newSong.metrum.bar = bars.options[bars.selectedIndex].value;
      });
    }
}
