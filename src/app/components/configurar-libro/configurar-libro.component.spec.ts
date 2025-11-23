import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarLibroComponent } from './configurar-libro.component';

describe('Component', () => {
  let component: ConfigurarLibroComponent;
  let fixture: ComponentFixture<ConfigurarLibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurarLibroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurarLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
