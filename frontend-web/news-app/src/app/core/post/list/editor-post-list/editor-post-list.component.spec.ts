import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPostListComponent } from './editor-post-list.component';

describe('EditorPostListComponent', () => {
  let component: EditorPostListComponent;
  let fixture: ComponentFixture<EditorPostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPostListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
