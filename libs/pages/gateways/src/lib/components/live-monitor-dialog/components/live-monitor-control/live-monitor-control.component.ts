import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, model, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'ne-live-monitor-control',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './live-monitor-control.component.html',
  styleUrl: './live-monitor-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveMonitorControlComponent {
  @Output() handleStart = new EventEmitter<boolean>();
  @Output() handleStop = new EventEmitter();
  isRunning = input(false);
  readonly useReset = model(false);

  onStart = (): void => {
    this.handleStart.emit(this.useReset());
  };

  onStop = (): void => {
    this.handleStop.emit();
  };
}
