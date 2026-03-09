import { Component, OnInit } from '@angular/core';
import { InputDatas, IShop, RandomInputData, AuthModalService } from '../input-datas';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth';

@Component({
  selector: 'app-myshops',
  standalone: false,
  templateUrl: './myshops.html',
  styleUrl: './myshops.css'
})
export class Myshops implements OnInit {

  shops: IShop[] = [];
  isLoading = true;
  isAnonymous = false;

  constructor(
    private shopdata: InputDatas,
    private randomInputData: RandomInputData,
    private router: Router,
    private authService: AuthService,
    private authModal: AuthModalService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
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
    } else {
      this.isAnonymous = true;
      const formData = this.shopdata.getFormData();
      const randomItems = this.randomInputData.getRandomItems();

      if (formData) {
        const anonymousShop: IShop = {
          name: formData.shopName || 'Unnamed Shop',
          items: randomItems,
          formData: formData
        };
        this.shops = [anonymousShop];
      } else {
        this.shops = [];
      }

      this.isLoading = false;
    }
  }

  openRegister() {
    this.authModal.open('register');
  }

  viewShop(id: string | undefined) {
    if (this.isAnonymous) {
      // Anônimo: navega para /generatedshop sem ID — dados já estão em memória
      this.router.navigate(['/generatedshop']);
    } else if (id) {
      this.router.navigate(['/generatedshop', id]);
    }
  }

  deleteShop(id: string | undefined) {
    if (!id) return;

    const confirmDelete = confirm('Are you sure you want to delete this shop?');
    if (confirmDelete) {
      this.shopdata.deleteShop(id).subscribe({
        next: () => {
          this.shops = this.shops.filter(s => (s._id || s.id) !== id);
          console.log('Shop deleted successfully');
        },
        error: (err) => console.error('Failed to delete shop', err)
      });
    }
  }
}