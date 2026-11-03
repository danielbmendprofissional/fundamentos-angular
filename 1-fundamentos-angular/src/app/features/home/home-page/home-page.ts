import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { AuthService } from '@core/auth/auth-service';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly auth = inject(AuthService);
}
