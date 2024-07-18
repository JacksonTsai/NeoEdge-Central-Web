import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ContentChild, input, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'ne-expansion-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './ne-expansion-table.component.html',
  styleUrl: './ne-expansion-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class NeExpansionTableComponent {
  @ContentChild(TemplateRef) template: TemplateRef<any>;

  dataSource = input<any[]>([]);
  displayedColumns = input<string[]>([]);
  expandedElement: any;

  displayedColumnsWithExpand = computed<string[]>(() => {
    return [...this.displayedColumns(), 'expand'];
  });
}
