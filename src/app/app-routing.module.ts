import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './FrontOffice/home/home.component';
import { CourseComponent } from './components/course/course.component';
import { PisteComponent } from './components/piste/piste.component';
import { InstructorComponent } from './components/instructor/instructor.component';
import { SkierComponent } from './components/skier/skier.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'course', component: CourseComponent },
  { path: 'piste', component: PisteComponent },
  { path: 'instructor', component: InstructorComponent },
  { path: 'skier', component: SkierComponent },
  { path: 'subscription', component: SubscriptionComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
