import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { App } from './app';

describe('App', () => {
  it('renderiza o outlet e o toast', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), MessageService],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('router-outlet')).not.toBeNull();
    expect(el.querySelector('p-toast')).not.toBeNull();
  });
});
