import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let debugEle: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    debugEle = fixture.debugElement;
  });

  it('should have a routerLink to home', () => {
    const homeLink = fixture.debugElement.query(By.css('a[routerLink="/"]'));
    expect(homeLink).toBeTruthy();
  });

  it('should have a routerLink to users', () => {
    const userLink = fixture.debugElement.query(By.css('a[routerLink="user"]'));
    expect(userLink).toBeTruthy();
  });

});
