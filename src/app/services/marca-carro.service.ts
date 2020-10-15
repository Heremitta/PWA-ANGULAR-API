import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MarcaCarro } from '../models/MarcaCarro';
import { map } from 'rxjs/operators'
import Dexie from 'dexie';
import { OnlineOfflineService } from './online-offline.service';

interface CarResponse{
  Makes: Array<any>;
}

@Injectable({
  providedIn: 'root'
})
export class MarcaCarroService {

  private API_CARROS = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes';
  private db: Dexie;
  private table: Dexie.Table<MarcaCarro,any> = null;
  private list;
  constructor(
    private http: HttpClient,  private onlineOfflineService: OnlineOfflineService
  ) {
    this.iniciarIndexedDb();
  }
  private iniciarIndexedDb(){
    this.db = new Dexie('db-marcas');
    this.db.version(1).stores({
      marcas: 'codigo'
    })
    this.table = this.db.table('marcas')
  }

  private mapMarcas(marcas): MarcaCarro[]{
    return marcas.map(marca=>({
      codigo:marca.make_id,
      nome: marca.make_display
    }))
  }
  public getMarcasAPI(): Observable<MarcaCarro[]>{
    return this.http.jsonp(this.API_CARROS,'callback')
    .pipe(
      map((res: CarResponse)=>this.mapMarcas(res.Makes))
    )
  }
  public getMarcasIndexedDb(){
    return this.table.toArray();
  }
  public getMarcas(): Observable<MarcaCarro[]>{
   if(this.onlineOfflineService.isOnline){
    this.cadastrarIndexedDb(this.getMarcasAPI());
     return this.getMarcasAPI();
   }else{
     this.list = this.getMarcasIndexedDb();
      return this.list;
   }
  }
  private async cadastrarIndexedDb(marcas:Observable<MarcaCarro[]>){
    try {
       marcas.subscribe(e=>{
         this.table.clear();
         e.forEach(m=>{
           this.table.add(m, m.codigo);
         })
      })
      console.log('Seguro foi salvo no indexedDb ', marcas)
    } catch (e) {
      console.log('não foi possivel salvar as marcas no indexDb', e)
    }
  }
}
