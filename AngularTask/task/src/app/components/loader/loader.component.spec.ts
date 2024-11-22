import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let debugEle: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    debugEle = fixture.debugElement;
    fixture.componentRef.setInput('width', 50);
    fixture.componentRef.setInput('height', 50);
    await fixture.whenStable();
  });

  it('Should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('Should get the input width and height as 50', () => {
    expect(component.height)
      .withContext('Height should be equal to 50')
      .toEqual(50);
    expect(component.width)
      .withContext('Width should be equal to 50')
      .toEqual(50);
  });

  it('Should render the loader with input height and width', () => {
    fixture.detectChanges();
    let divele: HTMLDivElement =
      fixture.nativeElement?.querySelector('.loader');
    expect(divele.style.width).toEqual('50px');
    expect(divele.style.height).toEqual('50px');
  });
});
