import { Skier } from './skier.model';
import { Course } from './course.model';

export interface Registration {
  numRegistration: number;
  numWeek: number;
  skier: Skier;
  course: Course;
}
