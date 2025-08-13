import { Component, OnInit,  Pipe, PipeTransform } from '@angular/core';
import { InputDatas } from '../input-datas';
import { Router } from '@angular/router';
import { ProperCasePipe } from '../shared/pipes/pipes';



@Component({
  selector: 'app-myshops',
  standalone: false,
  templateUrl: './myshops.html',
  styleUrl: './myshops.css'
})

export class Myshops {

shops: { name: string; id: string; formData: any }[] = [];


  constructor(private shopdata: InputDatas, private router: Router) {}

  ngOnInit(): void {
    this.shops = this.shopdata.getShops();
  }

  viewShop(id: string) {
    this.router.navigate(['/generatedshop', id]);
  }
}