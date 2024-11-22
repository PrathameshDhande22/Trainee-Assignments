import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By, Title } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('HomeComponent', () => {
  let titleservice: Title;
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugEle: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [Title],
    }).compileComponents();

    titleservice = TestBed.inject(Title);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEle = fixture.debugElement;
  });

  it('Should Set the Title', () => {
    fixture.detectChanges();
    expect(document.title).toBe('User Listing');
  });

  it('Page Title Should be User Listing', () => {
    expect(titleservice.getTitle()).toBe('User Listing');
  });

  it("should have router link to user in button",()=>{
    expect(debugEle.query(By.css("button[routerlink='/user']"))).toBeTruthy()
  })
});
