import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <footer class="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500 mt-auto">
      <p>HERINOMENJANAHARY Fenosoa Fandresena Mickael - MAMINOMENJANAHARY Jocelyn Mickael</p>
    </footer>
  `,
  styles: []
})
export class AppComponent {
  title = 'MallConnect';
}
