import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfGestionComponent } from './dialog-conf-gestion.component';

describe('DialogConfGestionComponent', () => {
  let component: DialogConfGestionComponent;
  let fixture: ComponentFixture<DialogConfGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfGestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
