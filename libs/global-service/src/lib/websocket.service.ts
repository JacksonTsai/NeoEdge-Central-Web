import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { REST_CONFIG } from './http-service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  #restConfig = inject(REST_CONFIG);

  initialize(): Observable<any> {
    return new Observable((observer) => {
      try {
        const protocol = location.protocol.includes('https') ? 'wss' : 'ws';
        const subject$ = webSocket(`${protocol}://${this.#restConfig.basePath}/ws`);
        const subscription = subject$.asObservable().subscribe(
          (data) => observer.next(data),
          (error: unknown) => observer.error(error),
          () => observer.complete()
        );

        return () => {
          subscription.unsubscribe();
          subject$.complete();
        };
      } catch (error) {
        return observer.error(error);
      }
    });
  }
}
