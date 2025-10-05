// Mock database using localStorage

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  addedBy: string;
  dateAdded: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  reviewText: string;
  date: string;
}

// Initialize with sample data
const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Fiction',
    description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.',
    coverImage: 'https://images.unsplash.com/photo-1419640303358-44f0d27f48e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTk2NDA1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    addedBy: 'demo-user',
    dateAdded: '2024-03-15T10:00:00.000Z'
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian Fiction',
    description: 'A dystopian social science fiction novel that follows the life of Winston Smith, a low ranking member of the Party.',
    coverImage: 'https://images.unsplash.com/photo-1599185186578-0ba91c2a15c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWN0aW9uJTIwbm92ZWx8ZW58MXx8fHwxNzU5NjQwNTA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    addedBy: 'demo-user',
    dateAdded: '2024-03-14T10:00:00.000Z'
  },
  {
    id: '3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic Fiction',
    description: 'The story primarily concerns the young and mysterious millionaire Jay Gatsby and his quixotic passion for the beautiful Daisy Buchanan.',
    coverImage: 'https://images.unsplash.com/photo-1652305489491-789257d2e95c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwbGlicmFyeSUyMHJlYWRpbmd8ZW58MXx8fHwxNzU5NTgzOTEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    addedBy: 'demo-user',
    dateAdded: '2024-03-13T10:00:00.000Z'
  },
  {
    id: '4',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Mystery Thriller',
    description: 'A shocking psychological thriller of a woman\'s act of violence against her husband and the therapist obsessed with uncovering her motive.',
    coverImage: 'https://images.unsplash.com/photo-1698954634383-eba274a1b1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBib29rfGVufDF8fHx8MTc1OTU5NDMyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    addedBy: 'demo-user',
    dateAdded: '2024-03-12T10:00:00.000Z'
  }
];

const sampleReviews: Review[] = [
  {
    id: '1',
    bookId: '1',
    userId: 'demo-user',
    userName: 'Demo User',
    rating: 5,
    reviewText: 'An absolute masterpiece! This book beautifully captures the essence of morality and justice through the eyes of a child.',
    date: '2024-03-16T10:00:00.000Z'
  },
  {
    id: '2',
    bookId: '2',
    userId: 'demo-user',
    userName: 'Demo User',
    rating: 5,
    reviewText: 'Eerily prophetic and deeply disturbing. Orwell\'s vision of a totalitarian future remains relevant today.',
    date: '2024-03-15T10:00:00.000Z'
  },
  {
    id: '3',
    bookId: '3',
    userId: 'demo-user',
    userName: 'Demo User',
    rating: 4,
    reviewText: 'A brilliant portrayal of the American Dream and its corruption. Fitzgerald\'s prose is simply beautiful.',
    date: '2024-03-14T10:00:00.000Z'
  }
];

// Storage helper functions
class Storage {
  private static initializeIfNeeded() {
    if (!localStorage.getItem('books')) {
      localStorage.setItem('books', JSON.stringify(sampleBooks));
    }
    if (!localStorage.getItem('reviews')) {
      localStorage.setItem('reviews', JSON.stringify(sampleReviews));
    }
    if (!localStorage.getItem('users')) {
      const demoUser: User = {
        id: 'demo-user',
        email: 'demo@bookreviews.com',
        password: 'demo123',
        name: 'Demo User',
        createdAt: '2024-03-01T10:00:00.000Z'
      };
      localStorage.setItem('users', JSON.stringify([demoUser]));
    }
  }

  // Users
  static getUsers(): User[] {
    this.initializeIfNeeded();
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  static addUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  static findUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  static findUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  // Books
  static getBooks(): Book[] {
    this.initializeIfNeeded();
    return JSON.parse(localStorage.getItem('books') || '[]');
  }

  static addBook(book: Book) {
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static getBookById(id: string): Book | undefined {
    return this.getBooks().find(b => b.id === id);
  }

  static updateBook(id: string, updates: Partial<Book>) {
    const books = this.getBooks();
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...updates };
      localStorage.setItem('books', JSON.stringify(books));
    }
  }

  static deleteBook(id: string) {
    const books = this.getBooks().filter(b => b.id !== id);
    localStorage.setItem('books', JSON.stringify(books));
    // Also delete associated reviews
    const reviews = this.getReviews().filter(r => r.bookId !== id);
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }

  // Reviews
  static getReviews(): Review[] {
    this.initializeIfNeeded();
    return JSON.parse(localStorage.getItem('reviews') || '[]');
  }

  static addReview(review: Review) {
    const reviews = this.getReviews();
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }

  static getReviewsByBookId(bookId: string): Review[] {
    return this.getReviews().filter(r => r.bookId === bookId);
  }

  static getReviewsByUserId(userId: string): Review[] {
    return this.getReviews().filter(r => r.userId === userId);
  }

  static deleteReview(id: string) {
    const reviews = this.getReviews().filter(r => r.id !== id);
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }

  static updateReview(id: string, updates: Partial<Review>) {
    const reviews = this.getReviews();
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      reviews[index] = { ...reviews[index], ...updates };
      localStorage.setItem('reviews', JSON.stringify(reviews));
    }
  }

  // Auth
  static setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}

export default Storage;
