import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { DebugElement } from '@angular/core';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let debugEle: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComponent],
    });

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    debugEle = fixture.debugElement;

    // setting the inputs
    fixture.componentRef.setInput('title', 'Confirmation');
    fixture.componentRef.setInput('type', 'Delete');
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  it('Should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('Should be open with passed title', () => {
    expect(component.open).toBeTrue();
    expect(component.title).toEqual('Confirmation');
    expect(component.type).toEqual('Delete');
  });

  it('Should close the modal when clicked on cancel button ', () => {
    spyOn(component.cancel, 'emit');
    expect(component.open).toBeTrue();
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalledTimes(1);
    expect(component.open).toBeFalse();
  });

  it('Should close the modal and perform some action when clicked on confirm button', () => {
    spyOn(component.confirm, 'emit');
    expect(component.open).toBeTrue();
    component.onConfirm();
    expect(component.confirm.emit).toHaveBeenCalledTimes(1);
    expect(component.open).toBeFalse();
  });
});
