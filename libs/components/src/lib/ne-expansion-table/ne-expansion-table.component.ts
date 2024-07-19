import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatColumnDef, MatTable, MatTableModule } from '@angular/material/table';

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
export class NeExpansionTableComponent<T> implements AfterContentInit {
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;

  /* add the ne-template with #detail that can show the detail, like this:
    <ng-template let-data #detail>
      <div>{{ data | json }}</div>
    </ng-template>
   */
  @ContentChild('detail') template: TemplateRef<any>;

  @ViewChild(MatTable, { static: true }) table: MatTable<T>;

  @Input() columns: string[];
  @Input() dataSource: DataSource<T>;

  expandedElement: any;

  displayedColumnsWithExpand = computed<string[]>(() => {
    return [...this.columns, 'expand'];
  });

  ngAfterContentInit() {
    this.columnDefs.forEach((columnDef) => this.table.addColumnDef(columnDef));
  }
}
