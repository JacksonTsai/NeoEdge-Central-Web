import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IIconSelectOption, ISvgItem, SVG_ICON_LIST_TYPE } from '../models';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  selectOptions: IIconSelectOption[] = [
    {
      name: SVG_ICON_LIST_TYPE.FILE_NAME,
      text: 'File Name',
      code: '[name]'
    },
    {
      name: SVG_ICON_LIST_TYPE.HTML,
      text: 'HTML',
      code: '<[tag] [key]="icon:[name]"></[tag]>'
    }
  ];

  constructor(private http: HttpClient) {}

  fetchSvgFile(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }

  svgString2Element(svgContent: string): SVGElement {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.documentElement as unknown as SVGElement;

    if (svgElement.nodeName !== 'svg') {
      throw new Error('解析的內容不是一個有效的 SVG');
    }

    return svgElement;
  }

  processSvg(svgContent: string): ISvgItem[] {
    const svgElement = this.svgString2Element(svgContent);
    const symbols = svgElement.querySelectorAll('symbol');

    const svgMap = Array.from(symbols).map((symbol) => ({
      id: symbol.id,
      el: symbol as SVGElement
    }));

    return svgMap;
  }
}
