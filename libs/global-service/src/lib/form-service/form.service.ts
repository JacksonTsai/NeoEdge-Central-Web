import { Injectable, WritableSignal, signal } from '@angular/core';

interface IPasswordHiddenMap {
  [key: string]: WritableSignal<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private passwordHiddenMap: IPasswordHiddenMap = {};

  togglePasswordVisibility(passwordField: string) {
    this.passwordHiddenMap[passwordField].update((value) => !value);
  }

  getPasswordVisibility(passwordField: string): WritableSignal<boolean> {
    if (this.passwordHiddenMap[passwordField]) {
      return this.passwordHiddenMap[passwordField];
    } else {
      this.passwordHiddenMap[passwordField] = signal(true);
      return this.passwordHiddenMap[passwordField];
    }
  }

  restrictToNumbers(event: KeyboardEvent, maxLength = 10): void {
    const pattern = /[0-9]/;
    const inputChar = event.key;
    const inputElement = event.target as HTMLInputElement;
    if (!pattern.test(inputChar) || inputElement.value.length >= maxLength) {
      event.preventDefault();
    }
  }
}
