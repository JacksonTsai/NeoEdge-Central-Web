import { Injectable } from '@angular/core';
import { IWebSocketAction } from '@neo-edge-web/models';
import { Observable, tap } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private ws$: WebSocketSubject<{ url: string }>;

  pushMsg = (msg: any) => {
    this.ws$.next(msg);
  };

  connect = ({ room, url }: { room: string; url: string }): Observable<IWebSocketAction> => {
    return new Observable((observer) => {
      try {
        this.ws$ = webSocket({ url });
        this.pushMsg({
          action: 'join-room',
          data: room
        });
        const subscription = this.ws$
          .asObservable()
          .pipe(
            tap((data: any) => {
              observer.next(data);
            })
          )
          .subscribe();
        return () => {
          subscription.unsubscribe();
          this.disconnect({ room });
        };
      } catch (error) {
        return observer.error(error);
      }
    });
  };

  disconnect = ({ room }: { room: string }) => {
    this.pushMsg({
      action: 'leave-room',
      data: room
    });
    this.ws$.complete();
    this.ws$.unsubscribe();
  };
}
