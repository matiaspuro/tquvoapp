import { Injectable } from '@angular/core';

import {Router} from "@angular/router"
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';



const { Storage } = Plugins;



@Injectable({
  providedIn: 'root'
})
export class PrincipalService {
  private usuario:any = {
    dni:null,
    nombre:null,
    tokenPublico:null,
    tokenPrivado:null,
    tokenVerificacion:null,
    horaServidor:null,
    horaVencimientoToken:null

  }

  get usuariosInfo() {
    return this.usuario;
  }

  
  constructor(private router: Router,private http:HttpClient) {
  

  }

//Se utiliza al principio para recuperar las variables de entorno almacenadas
  async initializeApp() {
   this.usuario.tokenPrivado = (await Storage.get( { key:"tokenPrivado"})).value;
   console.log(this.usuario.tokenPrivado);
  }

// Se utiliza cuando el server tira un mensaje de token privado no válido para volver la app al inicio
  async resetApp() {
      await Storage.clear();
      console.log("paso por aqui");
      for(let key in this.usuario) {
        this.usuario[key] = null;
      }
  }


  //Lo utilizo en la pantalla 1 al recibir el token para almacenar al token y la clave publica que se va a mostrar en la pantalla 2
  async setToken() {
     await Storage.set( { key:"tokenPrivado" , value:this.usuario.tokenPrivado});    
   }


//lo utilizo en pantalla 1 para registrar los solicitar el token publico y privado con el dni correspondiente
  setRegistration(dni) {
    return this.http.post<any>('http://67.205.184.72:7003/registrar-app',{ dni:dni })
    .pipe(
        map(resData => {
          return resData
        }),
        tap(respuesta => {
            
            this.usuario.tokenVerificacion = respuesta.tokenVerificacion;
            this.usuario.horaVencimientoToken = respuesta.horaVencimientoToken
            this.usuario.horaServidor = respuesta.horaServidor;
            this.usuario.tokenPrivado = respuesta.tokenPrivado;


        
        })
      );

  }


  //lo utilizo en todas las pantallas en la primera para verificar el estado
  setVerification() {
      console.log(this.usuario);
    return this.http.post<any>('http://67.205.184.72:7003/validar-app',{ tokenPrivado: this.usuario.tokenPrivado })
    .pipe(
        map(resData => {
          return resData
        }),
        tap(respuesta => {
            
          this.usuario.dni = respuesta.dni;
          this.usuario.nombre = respuesta.nombre;
          this.usuario.email = respuesta.email;


          this.usuario.tokenPublico = respuesta.tokenPublico;
          this.usuario.horaVencimientoToken = respuesta.horaVencimientoToken

          this.usuario.horaServidor = respuesta.horaServidor;
          
            
        })
      );

  }

  redirectTab2() {
    this.router.navigate(['/tab2'])

  }

  getAllRecipes() {
    return [...this.usuario];
  }

  getRecipe(recipeId: string) {
    return {
      ...this.usuario.find(recipe => {
        return recipe.id === recipeId;
      })
    };
  }

  deleteRecipe(recipeId: string) {
    this.usuario = this.usuario.filter(recipe => {
      return recipe.id !== recipeId;
    });
  }
}
