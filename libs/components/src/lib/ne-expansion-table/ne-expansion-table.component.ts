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
  // templateUrl: './ne-expansion-table.component.html',
  styleUrl: './ne-expansion-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  template: `
    <table mat-table [dataSource]="dataSource" multiTemplateDataRows class="mat-elevation-z8">
      <ng-content></ng-content>

      <ng-container matColumnDef="expand">
        <th mat-header-cell *matHeaderCellDef aria-label="row actions">&nbsp;</th>
        <td mat-cell *matCellDef="let element">
          <button
            mat-icon-button
            aria-label="expand row"
            (click)="expandedElement = expandedElement === element ? null : element; $event.stopPropagation()"
          >
            @if (expandedElement === element) {
              <mat-icon svgIcon="icon:keyboard_arrow_up"></mat-icon>
            } @else {
              <mat-icon svgIcon="icon:expand-more"></mat-icon>
            }
          </button>
        </td>
      </ng-container>

      <!-- Expanded Content Column - The detail row is made up of this one column that spans across all columns -->
      <ng-container matColumnDef="expandedDetail">
        <td mat-cell *matCellDef="let element" [attr.colspan]="displayedColumnsWithExpand().length">
          <div class="example-element-detail" [@detailExpand]="element === expandedElement ? 'expanded' : 'collapsed'">
            <ng-template [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{ $implicit: element }">
            </ng-template>
          </div>
        </td>
      </ng-container>

      <!-- Custom row definitions to be provided to the wrapper table. -->
      <tr mat-header-row *matHeaderRowDef="displayedColumnsWithExpand()"></tr>
      <tr
        mat-row
        *matRowDef="let element; columns: displayedColumnsWithExpand()"
        class="example-element-row"
        [class.example-expanded-row]="expandedElement === element"
        (click)="expandedElement = expandedElement === element ? null : element"
      ></tr>
      <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="example-detail-row"></tr>

      <!-- Row shown when there is no matching data that will be provided to the wrapper table. -->
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="4">No data</td>
      </tr>
    </table>
  `
})
export class NeExpansionTableComponent<T> implements AfterContentInit {
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  @ContentChild(TemplateRef) template: TemplateRef<any>;

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
