export class Post {
    id?: Number;
    title: string;
    content: string;
    author: string;
    date: Date;
    isConcept: boolean;
  
    constructor(title: string, content: string, author: string, date: Date, isConcept: boolean) {
      this.title = title;
      this.content = content;
      this.author = author;
      this.date = date;
      this.isConcept = isConcept;
    }
  }