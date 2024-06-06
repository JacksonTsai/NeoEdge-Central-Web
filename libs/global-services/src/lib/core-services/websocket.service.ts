import { Injectable, inject } from '@angular/core';
import { selectAuthToken } from '@neo-edge-web/auth-store';
import { IWebSocketAction } from '@neo-edge-web/models';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
@Injectable({ providedIn: 'root' })
export class WebSocketService {
  globalStore = inject(Store);
  private ws$: WebSocketSubject<{ url: string }>;

  pushMsg = (msg: any) => {
    this.ws$.next(msg);
  };

  connect = ({ room, url }: { room: string; url: string }): Observable<IWebSocketAction> => {
    return new Observable((observer) => {
      try {
        this.globalStore.select(selectAuthToken).subscribe((token) => {
          this.ws$ = webSocket({ url, protocol: ['Authorization', token.accessToken] });
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
        });
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
