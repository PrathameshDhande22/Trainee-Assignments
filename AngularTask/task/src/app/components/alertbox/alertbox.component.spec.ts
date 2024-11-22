import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AlertboxComponent } from './alertbox.component';
import { DebugElement } from '@angular/core';

describe('AlertBox Component', () => {
  let component: AlertboxComponent;
  let fixture: ComponentFixture<AlertboxComponent>;
  let debugEle: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertboxComponent);
    component = fixture.componentInstance;
    debugEle = fixture.debugElement;

    // setting the inputs
    fixture.componentRef.setInput('type', 'Success');
    fixture.componentRef.setInput('Open', true);
    fixture.detectChanges();
  });

  it('Should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should be called with Success', () => {
    expect(component.type).toBe('Success');
  });

  it('Should close the alertbox after 4 seconds', fakeAsync(() => {
    spyOn(component.close, 'emit');
    component.Open = true;
    fixture.detectChanges();
    expect(component._isVisible).toBeTrue();

    tick(4000);
    expect(component._isVisible).toBeFalse();
    expect(component.close.emit).toHaveBeenCalled();
  }));

  it('Should close the component when clicked on Close button', () => {
    let button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(component._isVisible)
      .withContext('should return false when the alert box is closed')
      .toBeFalse();
  });
});
