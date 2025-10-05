import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Storage, { Book, Review } from '../lib/storage';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Star, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const foundBook = Storage.getBookById(id);
    setBook(foundBook || null);
    
    const bookReviews = Storage.getReviewsByBookId(id);
    setReviews(bookReviews);
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (reviewText.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    const newReview: Review = {
      id: `review-${Date.now()}`,
      bookId: id!,
      userId: user.id,
      userName: user.name,
      rating,
      reviewText: reviewText.trim(),
      date: new Date().toISOString()
    };

    Storage.addReview(newReview);
    setReviews([newReview, ...reviews]);
    setRating(0);
    setReviewText('');
    setIsSubmitting(false);
    toast.success('Review submitted successfully!');
  };

  const handleDeleteReview = (reviewId: string) => {
    Storage.deleteReview(reviewId);
    setReviews(reviews.filter(r => r.id !== reviewId));
    toast.success('Review deleted');
  };

  const handleDeleteBook = () => {
    if (!id) return;
    Storage.deleteBook(id);
    toast.success('Book deleted');
    navigate('/');
  };

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Book not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const userHasReviewed = reviews.some(r => r.userId === user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            </div>
            {user?.id === book.addedBy && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Book</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this book? This will also delete all associated reviews. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteBook}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <Badge className="mb-4">{book.genre}</Badge>

          {/* Rating Overview */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl">
                {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
              </span>
            </div>
            <span className="text-gray-600">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="mb-2">About this book</h3>
            <p className="text-gray-700">{book.description}</p>
          </div>

          <div className="text-sm text-gray-500">
            <p>Added on {new Date(book.dateAdded).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Add Review Section */}
      {user && !userHasReviewed && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Your Review</label>
                <Textarea
                  placeholder="Share your thoughts about this book..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {user && userHasReviewed && (
        <Alert className="mb-8">
          <AlertDescription>
            You have already reviewed this book. You can delete your review below to write a new one.
          </AlertDescription>
        </Alert>
      )}

      {!user && (
        <Alert className="mb-8">
          <AlertDescription>
            Please login to write a review for this book.
          </AlertDescription>
        </Alert>
      )}

      {/* Reviews List */}
      <div>
        <h2 className="mb-6">Reviews ({reviews.length})</h2>
        
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No reviews yet. Be the first to review this book!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p>{review.userName}</p>
                      <div className="flex items-center gap-2 mt-1">
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
                    </div>
                    
                    {user?.id === review.userId && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this review? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  
                  <p className="text-gray-700">{review.reviewText}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
