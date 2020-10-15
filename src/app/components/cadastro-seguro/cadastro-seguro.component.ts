import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MarcaCarro } from 'src/app/models/marcaCarro';
import { Seguro } from 'src/app/models/Seguro';
import { MarcaCarroService } from 'src/app/services/marca-carro.service';
import { SeguroService } from 'src/app/services/seguro.service';

@Component({
  selector: 'app-cadastro-seguro',
  templateUrl: './cadastro-seguro.component.html',
  styleUrls: ['./cadastro-seguro.component.scss']
})
export class CadastroSeguroComponent implements OnInit {

  public seguro = new Seguro();
  public marcasCarro$: Observable<MarcaCarro[]>
  constructor(
    private MarcaCarroService: MarcaCarroService,
    private seguroService: SeguroService
  ) { }

  ngOnInit(): void {
    this.marcasCarro$ = this.MarcaCarroService.getMarcas();
  }

  cadastrar(){
    this.seguro.id = this.seguro.placaCarro
    this.seguroService.cadastrar(this.seguro)
  }
}
