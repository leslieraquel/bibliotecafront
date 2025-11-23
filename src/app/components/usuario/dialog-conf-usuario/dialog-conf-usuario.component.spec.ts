import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfUsuarioComponent } from './dialog-conf-usuario.component';


describe('DialogConfUsuarioComponent', () => {
  let component: DialogConfUsuarioComponent;
  let fixture: ComponentFixture<DialogConfUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
