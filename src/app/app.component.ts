import { Component } from '@angular/core';
import { UserStorageService } from './services/storage/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ECommerceWeb';

  isCustomerLoggedIn : boolean = UserStorageService.isCustomerLoggedIdIn();
  isAdmiLoggedIn : boolean = UserStorageService.isAdminLoggedIdIn();

  constructor(private router: Router){}
  
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIdIn();
      this.isAdmiLoggedIn = UserStorageService.isAdminLoggedIdIn();
    })
  }

  logout() {
    UserStorageService.signOut();
    this.router.navigateByUrl('login');
  }
}
