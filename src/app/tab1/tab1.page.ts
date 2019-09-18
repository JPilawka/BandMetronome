import { Component, ViewChild } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { DatabaseService } from '../services/database.service';
import {PickerController, IonReorderGroup, ToastController } from '@ionic/angular';
import {PickerOptions} from '@ionic/core';
import { Storage } from '@ionic/storage';

//
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
      setsOptions={cssClass: 'sets-class'}
      songs= [{id: '_no_set_selected',name: 'Wybierz set', tempo: 0, metrum: {beat: 0, bar: 0}}];
      curSet:any;
      bands:any;
      curSong=0;
      curBand: any;
      isPlaying=false;
      counter = 1;
      interval: any;
      intVar: any;
      beat=0;
      tempoOptions = [];
      sets:any;
      set: any;
      allSongs: any;
      timer: any;
      constructor(private audioHigh: AudioService,
                  private audioLow: AudioService,
                  private tempoPicker: PickerController,
                  private DB: DatabaseService,
                  private storage: Storage,
                  public toastController: ToastController){
        //this.getSettings();
        this.preloadAudio();

      }

      async presentToast(message) {
        const toast = await this.toastController.create({
          position: 'bottom',
          color: 'dark',
          message: message,
          duration: 2000
        });
        toast.present();
      }

      preloadAudio(){

        this.audioHigh.preload('Downbeat', 'assets/audio/audioHigh.mp3');
        this.audioLow.preload('Upbeat', 'assets/audio/audioLow.mp3');

      }

      ionViewWillEnter(){
        this.getSettings();
      }

      getSettings(){

        for(let i=50; i<=240; i++){
          this.tempoOptions.push({text: i, value: i});
        }

        this.storage.get('currentBand').then((val) => {
          //console.log("currentBand",val);
          this.curBand = val;
          //zwraca id bierzącego setu setu
        });

        this.DB.loadBands().then((res)=>{
          //console.log(res);
          this.bands=res;
        }).catch();

        this.storage.get('currentSet').then((val) => {
          //console.log(val);
          this.curSet = val;
          //zwraca id bierzącego setu setu

          console.log("wczytany set: ",this.curSet);
          return this.DB.loadAllSets();
        }).then((res)=>{
            //console.log("po załadowaniu wszystkich setów",res)
            this.sets=res;
            this.sets.forEach(set=>{
              if(this.curSet==set.id)
                this.curSet=set;
                console.log("Set po sprawdzeniu: ",this.curSet);
            });
            //console.log("obecny set",this.curSet)

            return this.DB.loadAllSongs();
          }).then(r2=>{
            console.log(r2)
            this.allSongs = r2;
            this.getSetSongs()

          }).catch(e=>{
            //console.error(e)
          });

      }

      saveSet(){
        //console.log("this.selectedSongs", this.selectedSongs)
        console.log("songs",this.songs);

        let songs = this.songs.map(song=>{
          return song.id
        })
        console.log(this.curSet);
        console.log("songs",songs);
        //console.log("przed zapisame",songs);

        let set = {
          id: this.curSet.id,
          name: this.curSet.name,
          rev: this.curSet.rev,
          band: this.curSet.band,
          songs: songs

        }

        this.curSet.songs=songs;
        //console.log("set do bazy",set);
        this.DB.updateSet(set).then(res=>{
          console.log("res",res);
          this.presentToast('Set zachowany')
        }).catch(e=>{
          console.error(e)
        })
      }

      getSetSongs(){
        if(this.allSongs!=undefined && this.curSet.songs!=undefined){
          this.songs=[]
          this.curSet.songs.forEach(song=>{
            let i = this.allSongs.map(e=>{
              //console.log(e)
              return e.id
            }).indexOf(song);

            this.songs.push(this.allSongs[i])
          });

          //console.log("songs", this.songs)
        }

      }

      changeSet($event){
        this.curSet=$event.target.value;
        this.getSetSongs()

      }

      doReorder(event){

        let draggedItem = this.songs.splice(event.detail.from,1)[0];
        this.songs.splice(event.detail.to,0,draggedItem)
        event.detail.complete();
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
          }
          ]

        };
        let picker = await this.tempoPicker.create(opt);

        picker.present();
        picker.onDidDismiss().then(async data=>{
          let col = await picker.getColumn('Tempo');
          //console.log(col.options[col.selectedIndex].value);


          this.songs[this.curSong].tempo = col.options[col.selectedIndex].value;

        });
      }

      removeSong(index){
        this.songs.splice(index, 1);
        this.curSet.songs.splice(index, 1);
        if(index==this.curSong){
          this.stop();
        }

      }

      generateSound(){

        if(this.isPlaying){
          const setIntervalAsync = (fn, ms) => {
            if(this.isPlaying){
              fn().then(() => {
                this.timer = setTimeout(() => setIntervalAsync(fn, ms), ms);
              });
            }
            else{

              clearTimeout(this.timer);
              return;
            }

          };

          setIntervalAsync(async () => {
            if(this.counter==1){
              this.audioHigh.play('Downbeat');
            }
            else{
              this.audioLow.play('Upbeat');
            }
            if(this.counter>=this.beat){
              this.counter=1;
            }
            else{
              this.counter++;
            }

          }, this.interval);
        }
        else{
          clearTimeout(this.timer);
        }
    }

      play(){
        this.isPlaying=true;
        this.calculateIntervals();
        this.generateSound();
      }

      stop(){
        this.isPlaying=false;
        //clearInterval(this.intVar)
        clearTimeout(this.timer);
        this.beat=1;
      }

      nextSong(){
        this.stop();
        //console.log("next");
        if(this.curSong>=this.songs.length-1){
          this.curSong=0;
        }
        else{
          this.curSong++;
        }
        this.calculateIntervals();
        this.play();
      }

      previousSong(){
        this.stop();
        if(this.curSong<=0){
          this.curSong=this.songs.length-1;
        }
        else{
          this.curSong--;
        }
        this.calculateIntervals();
        this.play();
      }

      calculateIntervals(){
        if(this.songs[0].name!='Wybierz set'){
          this.beat = this.songs[this.curSong].metrum.beat;
          this.interval = Math.floor((60 / this.songs[this.curSong].tempo) * 1000);
          //console.log(this.interval);
        }

      }

      chooseSong(i){
        this.stop();
        this.curSong = i;
        this.calculateIntervals();
        this.play();
      }

}
