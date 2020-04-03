import { Subject, Observable } from 'rxjs'
import { Message } from './message.model'
import { Thread } from '../thread/thread.model'
import { User } from '../user/user.model'
import { filter } from 'rxjs/operators'

export class MessagesService {
  newMessages: Subject<Message> = new Subject<Message>()

  addMessage(message: Message): void {
    this.newMessages.next(message)
  }
  //akes a Thread and a User and returns a new stream of Messages
  //that are filtered on that Thread and not authored by the User.
  //That is, it is a stream of “everyone else’s” messages in this Thread.
  messagesForThreadUser(thread: Thread, user: User): Observable<Message> {
    return this.newMessages.pipe(
      filter((message: Message) => {
        // belongs to this thread and isn't authored by this user
        return message.thread.id === thread.id && message.author.id !== user.id
      })
    )
  }
}
