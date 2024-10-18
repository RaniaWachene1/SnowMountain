import { Course } from './course.model';

export interface Instructor {
  numInstructor: number;
  firstName: string;
  lastName: string;
  dateOfHire: string; // Format appropriately
  courses: Course[];
}
