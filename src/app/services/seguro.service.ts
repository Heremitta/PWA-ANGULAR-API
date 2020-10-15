import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Seguro } from '../models/Seguro';
import { OnlineOfflineService } from './online-offline.service';

@Injectable({
  providedIn: 'root'
})
export class SeguroService {
  private API_SEGUROS = 'http://localhost:9000';
  private db: Dexie;
  private table: Dexie.Table<Seguro,any> = null;
  private list;
  constructor(
    private http: HttpClient,
    private onlineOfflineService: OnlineOfflineService
  ) {
      this.ouvirStatusConexao();
      this.iniciarIndexedDb();
   }
   private iniciarIndexedDb(){
     this.db = new Dexie('db-seguros');
     this.db.version(1).stores({
       seguro: 'id'
     })
     if(this.db.table('seguro')){
       this.db.table('seguro').clear()
     }
     this.table = this.db.table('seguro')
   }
    private ouvirStatusConexao(){
      this.onlineOfflineService.statusConexao
      .subscribe(online =>{
        if(online){
          this.enviarIndexedDbParaApi();
        }else{
          console.log('estou offline');
        }
      })
    }
    private async cadastrarIndexedDb(seguro:Seguro){
      try {
        await this.table.add(seguro);
        const todosSeguros: Seguro[] = await this.table.toArray();
        console.log('Seguro foi salvo no indexedDb ', todosSeguros)
      } catch (e) {
        console.log("erro ao incluir seguro no indexedDb ", e)
      }

    }
    private async enviarIndexedDbParaApi(){
      let listaApi = this.listarDaAPI();
      const todosSeguros: Seguro[] = await this.table.toArray();
      for(const seguro  of todosSeguros){
        console.log(seguro)
        listaApi.forEach(itemApi=>{
          itemApi.forEach(e=>{
            if(e.placaCarro === seguro.placaCarro){
              debugger
              return
            }else{
              this.cadastrarAPI(seguro);
            }
          })
        })
        // console.log('Seguro com o Id'+ seguro.id + ' foi excluido com sucesso!')
        // await this.table.delete(seguro.id);
      }
    }
    private  cadastrarAPI(seguro:Seguro){
      let tableArray = this.table.toArray();
      tableArray.then((seguros)=>{
        if(seguros.length === 0){
          this.updateListaSeguroApi(seguro)
          return
        }
        seguros.forEach(e=>{
          if(e.placaCarro == seguro.placaCarro){
            return
          }else{
            this.updateListaSeguroApi(seguro)
            return
          }
        })
        })

    }

    updateListaSeguroApi(seguro:Seguro){
      this.http.post(this.API_SEGUROS+ '/api/seguros', seguro,{headers: new HttpHeaders().set("testando","BB0Rn5jpan8MUOuPJ20AtE-l1mo7Jjg5H2TshzfHYMI1r-mtXxy0VnCj2D1V3GfukEoVWzrqFjnlaZf5Udgcqiw")})
      .subscribe(
        ()=>{
          alert('seguro cadastrado com sucesso')
        },(erro)=>{
          console.log("erro ao cadastrar seguro",erro)
        }
      )
    }

    cadastrar(seguro:Seguro){
      if(this.onlineOfflineService.isOnline){
        this.cadastrarAPI(seguro)
      }else{
        this.cadastrarIndexedDb(seguro)
      }
    }
     listar(){
       if(this.onlineOfflineService.isOnline){
        let lista = this.listarDaAPI();
        lista.subscribe(e=>{
          this.table.clear()
          e.forEach((list)=>{
              this.table.add(list, list.id)
          })
        })
        return lista;
       }else{
          return  this.listarDoIndexDb();
       }
      }
       listarDaAPI(){
        return  this.http.get<Seguro[]>(this.API_SEGUROS+ '/api/seguros', {headers: new HttpHeaders().set("testando","BB0Rn5jpan8MUOuPJ20AtE-l1mo7Jjg5H2TshzfHYMI1r-mtXxy0VnCj2D1V3GfukEoVWzrqFjnlaZf5Udgcqiw")});
      }
       listarDoIndexDb(){
        this.list = this.table.toArray();
        return this.list;
      }

}
