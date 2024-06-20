import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ne-ot-texol-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ot-texol-tag.component.html',
  styleUrl: './ot-texol-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtTexolTagComponent {
  texolTagsType = input<{ generateTagType: 'texol-general' | 'texol-dedicated'; tags: any }>();
  texolTagDoc = input<any>({});

  get texolTagByType() {
    if ('texol-general' === this.texolTagsType()?.generateTagType) {
      const texolGeneralTags = [...this.texolTagDoc()['General']['allDomain']];

      if (this.texolTagsType().tags.timeDomain) {
        texolGeneralTags.push(...this.texolTagDoc()['General']['timeDomain']);
      }

      if (this.texolTagsType().tags.frequencyDomain) {
        texolGeneralTags.push(...this.texolTagDoc()['General']['frequencyDomain']);
      }

      if (this.texolTagsType().tags.damageDomain) {
        texolGeneralTags.push(...this.texolTagDoc()['General']['damageDomain']);
      }

      return texolGeneralTags;
    } else if ('texol-dedicated' === this.texolTagsType()?.generateTagType) {
      const { component, level2, level3, axial } = this.texolTagsType().tags;

      if (component && level2 && level3 && axial) {
        return this.texolTagDoc()[component][level2][level3][axial];
      }
    }
  }
}
