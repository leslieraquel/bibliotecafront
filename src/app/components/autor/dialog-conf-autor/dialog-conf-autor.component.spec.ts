import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfAutorComponent } from './dialog-conf-autor.component';

describe('DialogConfAutorComponent', () => {
  let component: DialogConfAutorComponent;
  let fixture: ComponentFixture<DialogConfAutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfAutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfAutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
