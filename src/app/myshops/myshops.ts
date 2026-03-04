import { Component, OnInit } from '@angular/core';
import { InputDatas, IShop } from '../input-datas';
import { Router } from '@angular/router';



@Component({
  selector: 'app-myshops',
  standalone: false,
  templateUrl: './myshops.html',
  styleUrl: './myshops.css'
})

export class Myshops implements OnInit {

  shops: IShop[] = [];
  isLoading = true;

  constructor(private shopdata: InputDatas, private router: Router) { }

  ngOnInit(): void {
    this.shopdata.getShops().subscribe({
      next: (shops) => {
        this.shops = shops;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load shops', err);
        this.isLoading = false;
      }
    });
  }

  viewShop(id: string | undefined) {
    if (id) {
      this.router.navigate(['/generatedshop', id]);
    }
  }

  deleteShop(id: string | undefined) {
    if (!id) return;

    const confirmDelete = confirm('Are you sure you want to delete this shop?');
    if (confirmDelete) {
      this.shopdata.deleteShop(id).subscribe({
        next: () => {
          // Refresh the list after deletion
          this.shops = this.shops.filter(s => (s._id || s.id) !== id);
          console.log('Shop deleted successfully');
        },
        error: (err) => console.error('Failed to delete shop', err)
      });
    }
  }
}