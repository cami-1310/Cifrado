import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cifrado';
  msj: string='';
  cifrado: string='';
  descifrado: string='';
  opc: string='';
  modulo: number=3;
  alfb: any;
  length: number=0;
  arrayCaracteres: string='';

  opcionesMetodos=[
    {id:'cesar', nombre:'Cesar'},
    {id:'atbash', nombre:'Atbash'}
  ];

  opcionesAlfabeto=[
    {id: 1, opc:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'},
    {id: 2, opc:'ASCII'},
    {id: 3, opc:'Otro'}
  ];

  enviarMsj(){
    this.cifrar();
    this.descifrar();
  }

  cifrar(){
    const alfabeto=this.getAlfabeto();
    if(!this.revisarMsj(this.msj, alfabeto)) return;
    if(this.opc==='cesar'){
      this.cifrado=this.cesar(this.msj, this.modulo, alfabeto);
    } else{
      this.cifrado=this.atbash(this.msj, alfabeto);
    }
  }

  descifrar(){
    const alfabeto=this.getAlfabeto();
    if(this.opc==='cesar'){
      this.descifrado=this.cesar(this.cifrado, -this.modulo, alfabeto);
    } else{
      this.descifrado=this.atbash(this.cifrado, alfabeto);
    }
  }

  getAlfabeto(): string{
    let alfabeto;

    if(this.alfb==="1"){
      //mayusculas
      alfabeto='';
      this.length=26;
      alfabeto='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      console.log(alfabeto);
    } else if(this.alfb==="2"){
      //ascii
      alfabeto='';
      //ASCII imprimible (sin espacio inicial 32)
      for (let i = 32; i <= 126; i++) {
        alfabeto += String.fromCharCode(i);
      }

      //Latin-1 extendido visible
      for (let i = 161; i <= 254; i++) {
        alfabeto += String.fromCharCode(i);
      }
      this.length=alfabeto.length;
      console.log(alfabeto);
    } else if(this.alfb==="3"){
      //personalizado
      if(!this.revisarAlfabetoP(this.arrayCaracteres)) return '';
      this.length=this.arrayCaracteres.length;
      alfabeto=this.arrayCaracteres;
      console.log(alfabeto);
    } else {
      //ninguno
      Swal.fire({
        title: "Opción inválida",
        text: "Por favor elige un alfabeto",
        icon: "error"
      });
      this.length=0;
      alfabeto='';
    }

    if(!alfabeto){
      Swal.fire({
        title: "Alfabeto vacío",
        text: "Por favor ingresa caracteres",
        icon: "warning"
      });
    }

    return alfabeto;
  }
  
  cesar(texto: string, k: number, alfabeto: string): string{
    let resultado='';
    const n=alfabeto.length;

    for(let char of texto){
      const index=alfabeto.indexOf(char);

      if(index===-1){
        //significa que el caracter del mensaje no pertenece al alfabeto para el cifrado
        resultado+=char; //lo concatena a resultado sin intercambiar por ningun caracter
      } else{
        let nuevaPos=(index+k)%n;
        if(nuevaPos<0){
          nuevaPos+=n;
        }
        resultado+=alfabeto[nuevaPos];
      }
    }
    return resultado;
  }

  atbash(texto: string, alfabeto: string){
    let resultado='';
    const n=alfabeto.length;

    for(let char of texto){
      const index=alfabeto.indexOf(char);

      if(index===-1){
        //significa que el caracter del mensaje no pertenece al alfabeto para el cifrado
        resultado+=char; //lo concatena a resultado sin intercambiar por ningun caracter
      } else{
        const nuevaPos=n-1-index;
        resultado+=alfabeto[nuevaPos];
      }
    }
    return resultado;
  }

  revisarAlfabetoP(alfabeto: string): boolean{
    if (!alfabeto) return false;

    // Quitar espacios accidentales
    alfabeto=alfabeto.trim();

    if (alfabeto.length < 2){
      Swal.fire({
        title: "Alfabeto inválido",
        text: "No es posible cifrar sólo con los caracteres ingresados, ingresa más",
        icon: "error"
      });
      return false;
    }

    //elimina repetidos, disminuye longitud tantas veces como caracteres repetidos encuentre
    const set=new Set(alfabeto); 

    if (set.size!==alfabeto.length) {
      //si las longitudes son diferentes es porque el alfabeto contiene caracteres repetidos
      Swal.fire({
        title: "Alfabeto inválido",
        text: "El alfabeto no puede contener caracteres repetidos",
        icon: "error"
      });
      return false;
    }

    return true;
  }

  revisarMsj(texto: string, alfabeto: string): boolean{
    //revisamos que cada caracter del mensaje este presente en el alfabeto
    for (let char of texto) {
      if (!alfabeto.includes(char)) {
        Swal.fire({
          title: "Mensaje inválido",
          text: "El mensaje que deseas cifrar no es compatible con los caracteres del alfabeto que elegiste. Intenta con otro.",
          icon: "error"
        });
        return false;
      }
    }

    if(this.alfb==="1" && texto!==texto.toUpperCase()){
      //si eige el alfabeto 1 el mensaje debe estar en mayusculas
      Swal.fire({
        title: "Mensaje inválido",
        text: "El mensaje que deseas cifrar no es compatible con los caracteres del alfabeto que elegiste.  Ingresalo en mayúsculas",
        icon: "error"
      });
      return false;
    }

    return true;
  }
}