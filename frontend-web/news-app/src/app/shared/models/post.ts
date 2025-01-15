import { Review } from './review';
import { Comment } from './comment';
export class Post {
    id: Number;
    title: string;
    content: string;
    author: string;
    date: Date;
    concept: boolean;
    approved: boolean;
    published: boolean;
    review: Review | null = null;
    comments: Comment[] = [];
  
    constructor(id:Number,title: string, content: string, author: string, date: Date, concept: boolean, approved: boolean, published: boolean, review: Review, comments: Comment[] = []) {
      this.title = title;
      this.content = content;
      this.author = author;
      this.date = date;
      this.concept = concept;
      this.approved = approved;
      this.published = published;
      this.review = review;
      this.comments = comments || [];
   
        
    
      this.id = id;
    }
  }