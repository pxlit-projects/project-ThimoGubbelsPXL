import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPostDetailComponent } from './editor-post-detail.component';

describe('EditorPostDetailComponent', () => {
  let component: EditorPostDetailComponent;
  let fixture: ComponentFixture<EditorPostDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPostDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorPostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
