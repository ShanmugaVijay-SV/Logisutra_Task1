import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Storage, { Book } from '../lib/storage';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Search } from 'lucide-react';

export default function Home() {
  const [books] = useState<Book[]>(Storage.getBooks());
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');

  const genres = useMemo(() => {
    const uniqueGenres = new Set(books.map(book => book.genre));
    return ['all', ...Array.from(uniqueGenres)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = genreFilter === 'all' || book.genre === genreFilter;
      
      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, genreFilter]);

  const getAverageRating = (bookId: string) => {
    const reviews = Storage.getReviewsByBookId(bookId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Discover Books</h1>
        <p className="text-gray-600">Browse and review your favorite books</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search books by title, author, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>
                {genre === 'all' ? 'All Genres' : genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No books found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => {
            const averageRating = getAverageRating(book.id);
            const reviewCount = Storage.getReviewsByBookId(book.id).length;

            return (
              <Link key={book.id} to={`/book/${book.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="p-0">
                    <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2 line-clamp-1">{book.title}</CardTitle>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <Badge variant="secondary" className="mb-3">
                      {book.genre}
                    </Badge>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {book.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center gap-2">
                    {averageRating > 0 ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{averageRating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">No reviews yet</span>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
