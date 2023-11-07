import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as firebase from 'firebase/app';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment'; 

firebase.initializeApp(environment.firebaseConfig);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
