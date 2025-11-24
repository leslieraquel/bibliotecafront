import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarGestionComponent } from './configurar-gestion.component';

describe('ConfigurarGestionComponent', () => {
  let component: ConfigurarGestionComponent;
  let fixture: ComponentFixture<ConfigurarGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurarGestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurarGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
