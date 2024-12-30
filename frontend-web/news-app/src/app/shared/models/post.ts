export class Post {
    id?: Number;
    title: string;
    content: string;
    author: string;
    date: Date;
    concept: boolean;
  
    constructor(title: string, content: string, author: string, date: Date, concept: boolean) {
      this.title = title;
      this.content = content;
      this.author = author;
      this.date = date;
      this.concept = concept;
    }
  }