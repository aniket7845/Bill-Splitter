import { Routes } from '@angular/router';
import { SplitterComponent } from './splitter/splitter.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const routes: Routes = [
    { path:'',component: SplitterComponent },
    { path:'privacy-policy',component: PrivacyPolicyComponent }
];
