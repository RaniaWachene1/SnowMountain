import { TypeCourse } from './type-course.enum';
import { Support } from './support.enum';
import { Registration } from './registration.model';

export interface Course {
  numCourse: number;
  level: number;
  typeCourse: TypeCourse;
  support: Support;
  price: number;
  timeSlot: number;
  registrations: Registration[];
}
