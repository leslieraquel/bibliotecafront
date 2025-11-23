import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurarUsuarioComponent } from './usuario.component';

describe('ConfigurarAutorComponent', () => {
  let component: ConfigurarUsuarioComponent;
  let fixture: ComponentFixture<ConfigurarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurarUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
