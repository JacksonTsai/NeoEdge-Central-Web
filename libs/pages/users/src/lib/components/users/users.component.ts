import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'ne-users',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements AfterViewInit {
  searchCtrl = new FormControl('');
  displayedColumns: string[] = ['no', 'user', 'email', 'role', 'project', 'status', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: any[] = [
  {
    user: 'user name A',
    email: 'email',
    role: 'role',
    project: 'project name',
    status: 'Active',
    action: 'action'
  },
  {
    user: 'user name A',
    email: 'email',
    role: 'role',
    project: 'project name',
    status: 'Active',
    action: 'action'
  },
  {
    user: 'user name A',
    email: 'email',
    role: 'role',
    project: 'project name',
    status: 'Active',
    action: 'action'
  },
  {
    user: 'user name A',
    email: 'email',
    role: 'role',
    project: 'project name',
    status: 'Active',
    action: 'action'
  },
  {
    user: 'user name A',
    email: 'email',
    role: 'role',
    project: 'project name',
    status: 'Active',
    action: 'action'
  },
  {
    user: 'user name A',
    email: 'email',
    role: 'role',
    project: 'project name',
    status: 'Active',
    action: 'action'
  },
  {
    user: 'user name A',
    email: 'email',
    role: 'role',
    project: 'project name',
    status: 'Active',
    action: 'action'
  },
  {
    user: 'user name A',
    email: 'email',
    role: 'role',
    project: 'project name',
    status: 'Active',
    action: 'action'
  },

  {
    user: 'user name B',
    email: 'email',
    role: 'role',
    project: 'project name',
    status: 'Active',
    action: 'action'
  }
];
