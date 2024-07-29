import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { NeoFlowNodeComponent } from '@neo-edge-web/components';
import 'leader-line-types';

// eslint-disable-next-line no-var
declare var LeaderLine: any;

@Component({
  selector: 'ne-message-link-datasource',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatDividerModule, MatIconModule, MatButtonModule, NeoFlowNodeComponent],
  templateUrl: './message-link-datasource.component.html',
  styleUrl: './message-link-datasource.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageLinkDataSourceComponent implements OnInit {
  addedOt = input<any>();
  addedMessageSchema = input<any>();

  ngOnInit(): void {
    console.log(this.addedOt());
    console.log(this.addedMessageSchema());
  }
}
