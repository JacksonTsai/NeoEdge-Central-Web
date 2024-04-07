import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MenuItem } from '@neo-edge-web/models';

@Component({
  selector: 'ne-menu-tree',
  standalone: true,
  imports: [MatListModule, MatIconModule, NgClass],
  templateUrl: './ne-menu-tree.component.html',
  styleUrl: './ne-menu-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('more-icon-rotate', [
      state('expanded', style({ transform: 'rotate(180deg)' })),
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      transition('expanded <=> collapsed', animate('198ms cubic-bezier(0.6,0.0,0.4,1)'))
    ])
  ]
})
export class NeMenuTreeComponent {
  @Output() handleMenuItemSelected = new EventEmitter<MenuItem>();
  menuItem = input.required<MenuItem>();
  isExpanded = false;

  onMenuItemSelected = (menuItem: MenuItem) => {
    this.handleMenuItemSelected.emit(menuItem);
    // if (!menuItem.children || !menuItem.children.length) {
    //   this.router.navigate([menuItem.path]);
    // }

    // if (menuItem.children && menuItem.children.length) {
    //   this.isExpanded = !this.isExpanded;
    // }
  };
}
