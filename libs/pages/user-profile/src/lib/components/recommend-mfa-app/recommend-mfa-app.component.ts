import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

interface IAppInfo {
  name: string;
  url: string;
}

interface IRecommendApp {
  title: string;
  list: IAppInfo[];
}

const RECOMMEND_APP: IRecommendApp[] = [
  {
    title: 'android',
    list: [
      { name: 'Twilio Authy Authenticator', url: 'https://play.google.com/store/apps/details?id=com.authy.authy' },
      { name: 'Duo Mobile', url: 'https://play.google.com/store/apps/details?id=com.duosecurity.duomobile' },
      {
        name: 'Microsoft Authenticator',
        url: 'https://play.google.com/store/apps/details?id=com.azure.authenticator'
      },
      {
        name: 'Google Authenticator',
        url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'
      },
      { name: 'Symantec VIP', url: 'https://m.vip.symantec.com/home.v#searchwebsite' }
    ]
  },
  {
    title: 'iOS',
    list: [
      { name: 'Twilio Authy Authenticator', url: 'https://apps.apple.com/us/app/authy/id494168017' },
      { name: 'Duo Mobile', url: 'https://apps.apple.com/us/app/duo-mobile/id422663827' },
      { name: 'Microsoft Authenticator', url: 'https://apps.apple.com/us/app/microsoft-authenticator/id983156458' },
      { name: 'Google Authenticator', url: 'https://apps.apple.com/us/app/google-authenticator/id388497605' },
      { name: 'Symantec VIP', url: 'https://m.vip.symantec.com/home.v#searchwebsite' }
    ]
  }
];

@Component({
  selector: 'ne-recommend-mfa-app',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './recommend-mfa-app.component.html',
  styleUrl: './recommend-mfa-app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendMfaAppComponent {
  displayedColumns: string[] = ['title', 'list'];
  dataSource = RECOMMEND_APP;
}
