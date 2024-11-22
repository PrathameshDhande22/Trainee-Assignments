import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
  // injecting the service for the title
  title: Title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Not Found');
  }
}
