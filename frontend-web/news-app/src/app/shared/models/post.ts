import { Review } from './review';
export class Post {
    id?: Number;
    title: string;
    content: string;
    author: string;
    date: Date;
    concept: boolean;
    approved: boolean;
    published: boolean;
    review: Review | null = null;
  
    constructor(title: string, content: string, author: string, date: Date, concept: boolean, approved: boolean, published: boolean, review: Review) {
      this.title = title;
      this.content = content;
      this.author = author;
      this.date = date;
      this.concept = concept;
      this.approved = approved;
      this.published = published;
      this.review = review;
    }
  }