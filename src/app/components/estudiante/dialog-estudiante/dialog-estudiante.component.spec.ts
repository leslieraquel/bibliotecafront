import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEstudianteComponent } from './dialog-estudiante.component';


describe('DialogEstudianteComponent', () => {
  let component: DialogEstudianteComponent;
  let fixture: ComponentFixture<DialogEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEstudianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
