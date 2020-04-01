import { Subject, BehaviorSubject } from 'rxjs'
import { User } from './user.model'
import { Injectable } from '@angular/core'

@Injectable()
export class UsersService {
  currentUser: Subject<User> = new BehaviorSubject<User>(null)

  setCurrentUser(newUser: User): void {
    this.currentUser.next(newUser)
  }
}

export const userServiceInjectables: Array<any> = [UsersService]
