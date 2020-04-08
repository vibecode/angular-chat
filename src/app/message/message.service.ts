import { Subject, Observable } from 'rxjs'
import { Message } from './message.model'
import { Thread } from '../thread/thread.model'
import { User } from '../user/user.model'
import { filter, scan, publishReplay, refCount } from 'rxjs/operators'

interface IMessagesOperation extends Function {
  (messages: Message[]): Message[]
}
export class MessagesService {
  newMessages: Subject<Message> = new Subject<Message>()
  messages: Observable<Message[]>

  // `updates` receives _operations_ to be applied to our `messages`
  // it's a way we can perform changes on *all* messages (that are currently // stored in `messages`)
  updates: Subject<any> = new Subject<any>()

  constructor() {
    this.messages = this.updates.pipe(
      // watch the updates and accumulate operations on the messages
      scan((messages: Message[], operation: IMessagesOperation) => {
        return operation(messages)
      }, initialMessages),
      // make sure we can share the most recent list of messages across anyone
      // who's interested in subscribing and cache the last known list of
      // messages
      publishReplay(1),
      refCount()
    )
  }

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
