import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from "rxjs/operators";

import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public miFormulario: FormGroup = this.fb.group({
    region: ["", Validators.required],
    pais: ["", Validators.required],
    frontera: ["", Validators.required]
  });

  //llenar selectores
  public regiones: string[] = [];
  public paises: PaisSmall[] = [];
  public fronteras: PaisSmall[] = [];

  //UI
  public cargando: boolean = false;

  constructor(private fb: FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Cuando cambien la región
    /* this.miFormulario.get("region")?.valueChanges
      .subscribe(region => {
        console.log(region);

        this.paisesService.getPaisesPorRegion(region)
          .subscribe(paises => {
            console.log(paises)
            this.paises = paises;
          })
      }) */
    this.miFormulario.get("region")?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get("pais")?.reset("");
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });

    //Cuando cambien el país
    this.miFormulario.get("pais")?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get("frontera")?.reset("");
          this.cargando = true;
        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!))
      )
      .subscribe(paises => {
        //this.fronteras = pais?.borders || [];
        this.fronteras = paises;
        this.cargando = false;
      });
  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
