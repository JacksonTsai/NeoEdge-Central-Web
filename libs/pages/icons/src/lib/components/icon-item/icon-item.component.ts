import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IIconInputValueSettings, ISvgItem, SVG_ICON_LIST_TYPE } from '../../models';
import { IconService } from '../../services';

@Component({
  selector: 'ne-icon-item',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './icon-item.component.html',
  styleUrl: './icon-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconItemComponent implements OnInit {
  #clipboard = inject(Clipboard);
  #snackBar = inject(MatSnackBar);
  iconService = inject(IconService);
  data = input<ISvgItem>();
  showType = input<SVG_ICON_LIST_TYPE>();
  useAriaHidden = input<boolean>();
  settings = input<IIconInputValueSettings>();
  id: string;

  value = computed<string>(() => {
    return this.getValue();
  });

  getValue(): string {
    const result = this.iconService.selectOptions.filter((val) => val.name === this.showType())[0];

    let val = result?.code;
    val = val.replace(/\[name\]/gi, this.id);
    val = val.replace(/\[tag\]/gi, this.settings().tag);
    val = val.replace(/\[key\]=/gi, this.settings().key + '=');

    if (this.showType() === SVG_ICON_LIST_TYPE.HTML) {
      const isHTML = this.showType() === SVG_ICON_LIST_TYPE.HTML;
      const regex = isHTML ? /></gi : /\(\)/gi;
      const replaceStart = isHTML ? ' ' : '(';
      const replaceEnd = isHTML ? '><' : ')';

      if (!this.useAriaHidden()) {
        val = val.replace(regex, `${replaceStart}aria-hidden="false" aria-label="${this.id}"${replaceEnd}`);
      }
    }

    return val;
  }

  onCopy() {
    this.#clipboard.copy(this.value());
    this.#snackBar.open('Copy success!', 'X', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 5000
    });
  }

  ngOnInit(): void {
    this.id = this.data()?.id;
  }
}
