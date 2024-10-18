import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkierComponent } from './skier.component';

describe('SkierComponent', () => {
  let component: SkierComponent;
  let fixture: ComponentFixture<SkierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
