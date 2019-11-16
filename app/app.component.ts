import { Component, ViewChild } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';

import { UsersActions } from './actions/users.actions';
import { Users } from './model/users';


@Component({
  selector: 'my-app',
  template: `
    <div>
     TOTAL USER: {{ (users$ | async).list.length }}

     <form #f="ngForm" novalidate
        (ngSubmit)="save(f)"> 
        
        <input type="text" 
          name="name"
          [ngModel]="activeUser?.name"
          required
          #labelRef
          class="form-control">
          
        <input type="text"
          name="email"
          [ngModel]="activeUser.email"
          required
          class="form-control">
          
        <button class="btn btn-primary"
          type="submit"
          [disabled]="f.invalid">
          {{activeUser.id ? 'UPDATE' : 'ADD'  }}
        </button>

        <button class="btn btn-default"
          type="button"
          (click)="actions.resetActive()"
          *ngIf="activeUser.id"
          >ADD NEW</button>
      </form>

     <hr />
     <li class="list-group-item"
         *ngFor="let item of (users$ | async).list"
         [ngClass]="{active: item.id === (active$ | async)?.id}"
         (click)="actions.setActiveUser(item.id)">
         {{item.name}}
        <button class="btn btn-xs btn-danger pull-right" 
        (click)="actions.deleteUser( item.id)">
          delete
        </button>
      </li>

    </div>  `,
})
export class AppComponent  { 
  @select('users') public users$: Observable<Users>;
  @select(['users', 'active']) active$;
  activeUser;

  constructor(public actions:  UsersActions) {
    actions.getUsers();
  }


  ngOnInit() {
    this.active$.subscribe(res => {
      this.activeUser = res ;
    });
  }

   save(f: any) {
    // Merge form data with data model
    // (since form does not include all fields)
    const newUser = Object.assign({}, this.activeUser, f.value);
    this.actions.save(newUser);
  }

}
