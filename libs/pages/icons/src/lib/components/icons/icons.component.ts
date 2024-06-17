import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  computed,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { delay } from 'rxjs';
import { IIconInputValueSettings, ISvgItem, SVG_ICON_LIST_TYPE } from '../../models';
import { IconService } from '../../services';
import { IconItemComponent } from '../icon-item/icon-item.component';

@Component({
  selector: 'ne-icons',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatSlideToggleModule, IconItemComponent],
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconsComponent implements OnInit {
  iconService = inject(IconService);
  svgList = signal<ISvgItem[]>([]);
  year: number = new Date().getFullYear();

  total = computed(() => this.svgList().length);
  showType: SVG_ICON_LIST_TYPE = SVG_ICON_LIST_TYPE.HTML;
  useAriaHidden = true;

  settings: IIconInputValueSettings = {
    tag: 'mat-icon',
    key: 'svgIcon'
  };

  scrollFixRef = viewChild.required<ElementRef>('scrollFix');
  isFixed = false;

  isUseHTML(): boolean {
    return this.showType === SVG_ICON_LIST_TYPE.HTML;
  }

  isNotDefault(): boolean {
    return this.showType !== SVG_ICON_LIST_TYPE.HTML || !this.useAriaHidden;
  }

  reset(): void {
    this.showType = SVG_ICON_LIST_TYPE.HTML;
    this.useAriaHidden = true;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.scrollFixRef().nativeElement.getBoundingClientRect().top < 0) {
      this.isFixed = true;
    } else {
      this.isFixed = false;
    }
  }

  ngOnInit(): void {
    const svgUrl = '/assets/icons-sprite.svg?ts=' + new Date().getTime();

    const observer = {
      next: (data: string) => {
        this.svgList.set(this.iconService.processSvg(data));
      },
      error: (error: any) => {
        console.error('Error fetching SVG file:', error);
      },
      complete: () => {
        console.log('SVG file fetch complete');
      }
    };

    this.iconService.fetchSvgFile(svgUrl).pipe(delay(500)).subscribe(observer);
  }
}
