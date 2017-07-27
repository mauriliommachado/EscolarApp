import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'nomePipe'})
export class NomePipe implements PipeTransform {
  transform(value: string, args): string {
    if (!value) return value;
    for(let i=0;i<args.length;i++){
      if(args[i].id == value){
        return args[i].name
      }
    }
    return args[0].id;
  }
}