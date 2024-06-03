import { Injectable, NgZone, inject, signal } from '@angular/core';
import * as AuthStore from '@neo-edge-web/global-store';
import { Store, select } from '@ngrx/store';
import { Subscription, fromEvent, interval, merge } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

const DEFAULT_TIMEOUT = 5; // Minute
const CHECK_INTERVAL = 5000; // ms

@Injectable()
export class AutoLogoutService {
  private isLoggedIn = false;
  private documentSub: Subscription;
  private isLoginSub: Subscription;
  private checkTimer: Subscription;

  ngZone = inject(NgZone);
  store = inject(Store);
  lastOperationTime = signal<number>(0);
  timeout = DEFAULT_TIMEOUT;

  private initListener() {
    this.ngZone.runOutsideAngular(() => {
      const mousemove$ = fromEvent(document, 'mousemove');
      const click$ = fromEvent(document, 'click');
      this.documentSub = merge(mousemove$, click$)
        .pipe(debounceTime(100))
        .subscribe(() => this.reset());
    });
  }

  private initInterval() {
    this.ngZone.runOutsideAngular(() => {
      this.checkTimer = interval(CHECK_INTERVAL)
        .pipe(
          tap(() => {
            this.check();
          })
        )
        .subscribe();
    });
  }

  private check() {
    if (this.timeout === 0 || !this.isLoggedIn) {
      return;
    }
    const now = Date.now();
    const lastTime = this.lastOperationTime() + this.timeout * 60 * 1000;
    const diff = lastTime - now;
    const isTimeout = diff < 0;

    this.ngZone.run(() => {
      if (isTimeout) {
        this.reset();
        this.store.dispatch(AuthStore.logoutAction());
      }
    });
  }

  init() {
    this.store.select(AuthStore.selectUserProfile).subscribe((d) => {
      this.timeout = d.userProfile?.idleTimeout ?? 5;
    });
    this.reset();
    this.initListener();
    this.initInterval();
    this.isLoginSub = this.store
      .pipe(select(AuthStore.selectLoginState))
      .subscribe((d) => (this.isLoggedIn = d.isLoginSuccess));
  }

  destroy() {
    this.checkTimer.unsubscribe();
    this.documentSub.unsubscribe();
    this.isLoginSub.unsubscribe();
  }

  reset() {
    this.lastOperationTime.set(Date.now());
  }
}
