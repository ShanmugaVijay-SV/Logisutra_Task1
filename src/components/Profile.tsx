import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Storage, { Review, Book } from '../lib/storage';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Star, BookOpen, MessageSquare } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviewedBooks, setReviewedBooks] = useState<Map<string, Book>>(new Map());

  useEffect(() => {
    if (!user) return;

    const reviews = Storage.getReviewsByUserId(user.id);
    setUserReviews(reviews);

    // Get book details for each review
    const booksMap = new Map<string, Book>();
    reviews.forEach(review => {
      const book = Storage.getBookById(review.bookId);
      if (book) {
        booksMap.set(book.id, book);
      }
    });
    setReviewedBooks(booksMap);
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Please login to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const averageRating = userReviews.length > 0
    ? userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length
    : 0;

  const booksAdded = Storage.getBooks().filter(b => b.addedBy === user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">{userReviews.length}</p>
                <p className="text-sm text-gray-600">Reviews Written</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl">{averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl">{booksAdded.length}</p>
                <p className="text-sm text-gray-600">Books Added</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Reviews */}
      <div className="mb-8">
        <h2 className="mb-6">My Reviews ({userReviews.length})</h2>
        
        {userReviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              You haven't written any reviews yet. Browse books and share your thoughts!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userReviews.map((review) => {
              const book = reviewedBooks.get(review.bookId);
              if (!book) return null;

              return (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Book Cover */}
                      <Link to={`/book/${book.id}`} className="shrink-0">
                        <div className="w-24 h-32 overflow-hidden rounded-lg">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                          />
                        </div>
                      </Link>

                      {/* Review Content */}
                      <div className="flex-1">
                        <Link to={`/book/${book.id}`}>
                          <h3 className="hover:text-blue-600 transition-colors">
                            {book.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                        <Badge variant="secondary" className="mb-3">
                          {book.genre}
                        </Badge>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-gray-700">{review.reviewText}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Books Added by User */}
      {booksAdded.length > 0 && (
        <div>
          <h2 className="mb-6">Books I Added ({booksAdded.length})</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {booksAdded.map(book => {
              const bookReviews = Storage.getReviewsByBookId(book.id);
              const averageBookRating = bookReviews.length > 0
                ? bookReviews.reduce((acc, r) => acc + r.rating, 0) / bookReviews.length
                : 0;

              return (
                <Link key={book.id} to={`/book/${book.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
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
                      <CardTitle className="text-base mb-1 line-clamp-1">
                        {book.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      
                      <div className="flex items-center gap-2">
                        {averageBookRating > 0 ? (
                          <>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{averageBookRating.toFixed(1)}</span>
                            <span className="text-sm text-gray-500">
                              ({bookReviews.length})
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">No reviews</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
