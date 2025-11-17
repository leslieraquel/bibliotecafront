import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfLibroComponent } from './dialog-conf-libro.component';

describe('DialogConfLibroComponent', () => {
  let component: DialogConfLibroComponent;
  let fixture: ComponentFixture<DialogConfLibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfLibroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
