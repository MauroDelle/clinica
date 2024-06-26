import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fader } from '../app/core/animations/animations'; // Adjust the path based on your project structure

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fader],
})
export class AppComponent {
  title = 'clinica';

  prepareRoute(outlet: RouterOutlet) {
    const animation =
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation'];
    // console.log('Animation:', animation);
    return animation;
  }
}
