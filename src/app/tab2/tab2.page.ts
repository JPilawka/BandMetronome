import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { SetModalPage } from '../set-modal/set-modal.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  newBand='';
  newSet='';
  bandList: any;
  selectedBand: number;
  selectedSet: any;
  config: any;
  setListOpenManager=[];
  allBandSongs:any;
  allSets:any;
  constructor(private DB: DatabaseService, private storage: Storage, public modalController: ModalController) {
    this.loadData();
    //tutaj trzeba pobrać bierzący aktywny band z bazy danych
  }

  loadConfig(){
    //pobieramy dane config z localStorage
  }

  async editSet(setId) {
    const modal = await this.modalController.create({
      component: SetModalPage,
      componentProps: { setId: setId }
    });


    return await modal.present();
  }

  addNewBand(){
    ////console.log(this.newBand)
    if(this.newBand!=''){//Sprawdzić czy już taka nazwa nie istnieje
      let band={
        name: this.newBand,
        id: '_'+this.newBand.toLowerCase()
      };

      this.DB.saveBand(band).then((res)=>{
        this.newBand='';
        //console.log("saveBand", res)
        return this.DB.loadBands();
      }).then((r2)=>{
        //console.log("r2")
        //console.log(r2);
        this.bandList = r2;
      }).catch((e)=>{
        console.error(e);
      });
    }


  }

  addNewSet(bandIndex){
    if(this.newSet!=''){

    //console.log("bandid",this.bandList[bandIndex]);
    let songs=[];
    let bandId = this.bandList[bandIndex].id;

    this.DB.loadSongs(bandId).then(res=>{
      this.allBandSongs = res;

      if(this.allBandSongs!=[]){
        this.allBandSongs.forEach((song)=>{
          if(song.band==bandId){
            songs.push(song.id);
          }
        });
      }
      //console.log("band songs", songs);

      let newSet={
        id: '_'+this.newSet.toLowerCase()+bandId,
        name: this.newSet,
        band: bandId,
        songs: songs
      };

      return this.DB.addSet(newSet);
    }).then((res)=>{
      return this.DB.loadBands();
    }).then((r2)=>{
      this.newSet='';
      this.bandList = r2;

      return this.DB.loadSets(bandId);
    }).then(r3=>{
      this.allSets = r3;
      //console.log("all sets with rev?", r3);
    }).catch(e=>{
      console.error(e)
    });

    }
  }

  updateSet(){

  }

  deleteSet(setRev){
    ////console.log(setId)
    //this.bandList[bandId].sets.splice(setId,1);
    ////console.log(this.bandList[bandId].sets);

    this.DB.deleteSet(setRev).then((res)=>{
      return this.DB.loadAllSets();
    }).then((r2)=>{
      this.newSet='';
      this.allSets = r2;
    }).catch((e)=>{
      console.error(e)
    });
  }

  returnBandSets(bandId){
    let sets = [];
    this.allSets.forEach(set=>{
      if(set.band==bandId){
        sets.push(set)
      }
    });

    return sets;
  }

  loadData(){
    this.DB.loadBands().then((res)=>{
      this.bandList = res;
      this.loadConfig();
      this.selectedBand = 0;
      //console.log("bandy", this.bandList)
      for(let i=0; i<this.bandList.length; i++){
        this.setListOpenManager.push(false);
      }
      return this.DB.loadAllSets();
    }).then(r2=>{
        //console.log("all sets with rev?", r2);
        ////console.log("r3",r3)
        this.allSets = r2;
        return this.storage.get('currentSet');
      }).then(r3=>{

        this.selectedSet = r3
      }).catch();
  }

  populatelists(){
    this.DB.loadBands().then((res)=>{
      this.bandList = res;
    }).catch();
    ////console.log(this.bandList);

  }

  removeBand(id){
    this.DB.deleteBand(id).then((res)=>{
      return this.DB.loadBands();

      //jeśli ten item jest jednocześnie wybranym zespołem trzeba ustawić selectedBand na 0
    }).then((res2)=>{
      this.bandList = res2;
    }).catch((e)=>{
      console.error(e);
    });

  }

  selectBand(index){
    this.selectedBand = index;
    //console.log("wybieram zespół:",this.selectedBand);
    this.storage.set('currentBand', this.bandList[index].id)
  }

  selectSet(setId){
    //making  active
    //console.log("wybrany se id ", setId)

    this.selectedSet = setId;
    for(let i=0; i<this.allSets.length;i++){
      if(this.allSets[i].id==setId){
        this.allSets[i].main=true;
      }
      else{
        this.allSets[i].main=false;
      }
    }
    this.storage.set('currentSet', setId);

  }

  openSets(index){
    //tutaj robimy tak, żeby otworzyły się sety dla danego bandu
    for(let i=0; i<this.setListOpenManager.length; i++){
      if(index==i){
        this.setListOpenManager[i]=true;
        //console.log("wybrany index", i);
      }
      else{
        this.setListOpenManager[i]=false;
      }

    }
  }
}
