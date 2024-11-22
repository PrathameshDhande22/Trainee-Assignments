import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component, DebugElement } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
})
class HeaderStubComponent {}

@Component({
  selector: 'app-showalert',
})
class ShowAlertStubComponent {}

@Component({
  selector: 'router-outlet',
})
class RouterOutletStubComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugEle: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [
        AppComponent,
        ShowAlertStubComponent,
        RouterOutletStubComponent,
        HeaderStubComponent,
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugEle = fixture.debugElement;
    fixture.detectChanges();
  });

  it('Should Create', () => {
    expect(component).toBeTruthy();
  });
});
