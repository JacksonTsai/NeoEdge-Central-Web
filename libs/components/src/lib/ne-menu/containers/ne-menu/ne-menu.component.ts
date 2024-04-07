import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MenuItem } from '@neo-edge-web/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NeMenuTreeComponent } from '../../components/ne-menu-tree/ne-menu-tree.component';

@UntilDestroy()
@Component({
  selector: 'ne-menu',
  standalone: true,
  imports: [NeMenuTreeComponent, MatListModule],
  template: `
    <mat-nav-list>
      @for ( menuItem of menuTree() ; track menuItem.path) {
      <ne-menu-tree [menuItem]="menuItem" (handleMenuItemSelected)="onMenuItemSelected($event)"></ne-menu-tree>
      }
    </mat-nav-list>
  `,
  styleUrl: './ne-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeMenuComponent {
  @Output() handleMenuItemSelected = new EventEmitter<MenuItem>();
  menuTree = input.required<MenuItem[]>();

  onMenuItemSelected = (menuItem: MenuItem) => {
    this.handleMenuItemSelected.emit(menuItem);
  };
}
