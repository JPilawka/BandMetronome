import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  host = 'https://bandsets-a8369.firebaseio.com/';
  constructor() { }

  addSong(song){
    return new Promise((resolve)=>{
      axios.post(this.host+'songs.json',song).then((res)=>{
        //console.log(res);
        resolve();
      }).catch((e)=>{
        console.error(e)
      });
    })

  }
  loadAllSongs(){
    return new Promise((resolve)=>{
      axios.get(this.host+'songs.json').then((res)=>{

        let songs=[];
        for(let key in res.data){
          res.data[key].rev = key;
          songs.push(res.data[key]);
        }

        resolve(songs);
      }).catch((err)=>{
        //pobrać lokalnie
      });
    });
  }

  loadSongs(bandId){
    ////console.log(bandId)
    //trzeba przekazać banda i set
    ////console.log(params)

    return new Promise((resolve)=>{
      axios.get(this.host+'songs.json',{
        params: {
          band: bandId,
        }
      }).then((res)=>{

        let songs=[];
        for(let key in res.data){
          res.data[key].rev = key;
          songs.push(res.data[key]);
        }
        let s = songs.filter(s=>{
          if(s.band == bandId){
            return s
          }
        })

        resolve(s);
      }).catch((err)=>{
        //pobrać lokalnie
      });
    });
  }

  deleteSong(id){
    return new Promise((resolve)=>{
      axios.delete(''+this.host+'/songs/'+id+'.json').then((res)=>{
        resolve();
      }).catch((e)=>{
        console.error(e)
        //usunąć lokalnie
      });
    });
  }

  addSet(set){
    return new Promise((resolve)=>{
      axios.post(this.host+'/sets.json', set).then((res)=>{
        //console.log(res);
        resolve();
      }).catch((e)=>{
        console.error(e)
        //usunąć lokalnie
      });
    });
  }

  loadAllSets(){
    return new Promise((resolve)=>{
      axios.get(this.host+'sets.json').then((res)=>{

        let sets=[];
        for(let key in res.data){
          res.data[key].rev = key;
          sets.push(res.data[key]);
        }
        ////console.log("wszystkie sety", sets)
        resolve(sets);
      }).catch((err)=>{
        //pobrać lokalnie
      });
    });
  }

  loadSets(bandName){
    //console.log(bandName)
    //trzeba przekazać banda i set
    let params = {
      params: {
        band: bandName,
      }
    };
    //console.log(params)

    return new Promise((resolve)=>{
      axios.get(this.host+'sets.json',params).then((res)=>{


        let sets=[];
        for(let key in res.data){
          res.data[key].rev = key;
          sets.push(res.data[key]);
        }

        resolve(sets);
      }).catch((err)=>{
        //pobrać lokalnie
      });
    });
  }

  updateSet(set){
    return new Promise((resolve)=>{
      axios.put(this.host+'/sets/'+set.rev+'.json', set).then((res)=>{
        resolve();
      }).catch((e)=>{
        console.error(e);
      })
    });
  }

  deleteSet(rev){

    return new Promise((resolve)=>{
      axios.delete(''+this.host+'/sets/'+rev+'.json').then((res)=>{
        resolve();
      }).catch((e)=>{
        console.error(e)
        //usunąć lokalnie
      });
    });
  }


  deleteBand(id){
    return new Promise((resolve)=>{
      axios.delete(''+this.host+'/bands/'+id+'.json').then((res)=>{
        resolve();
      }).catch((e)=>{
        console.error(e)
        //usunąć lokalnie
      });
    });

  }

  updateBand(band){
    return new Promise((resolve)=>{
      axios.put(this.host+'/bands/'+band.id+'.json', band).then((res)=>{
        resolve();
      }).catch((e)=>{
        console.error(e);
      })
    });
  }

  saveBand(band){
    return new Promise((resolve)=>{
      axios.post(this.host+'bands.json', band).then((res)=>{

        resolve();
        //dodajemy nowy set główny ze wszystkimi numerami
      }).catch((err)=>{
        //console.log(err);
        //zapisać lokalnie
      });
    });

  }

  loadBands(){
    return new Promise((resolve)=>{
      axios.get(this.host+'bands.json').then((res)=>{
        let bands=[];
        for(let key in res.data){
          res.data[key].rev = key;
          bands.push(res.data[key]);
        }
        ////console.log("bands",bands)
        resolve(bands);
      }).catch((err)=>{
        //pobrać lokalnie
      })
    });

  }
}
