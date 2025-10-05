import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Storage, { Book } from '../lib/storage';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const GENRES = [
  'Classic Fiction',
  'Mystery Thriller',
  'Science Fiction',
  'Fantasy',
  'Romance',
  'Historical Fiction',
  'Horror',
  'Dystopian Fiction',
  'Literary Fiction',
  'Contemporary Fiction',
  'Biography',
  'Self-Help',
  'Non-Fiction',
  'Poetry',
  'Young Adult'
];

export default function AddBook() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    coverImage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add books');
      return;
    }

    setIsSubmitting(true);

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      description: formData.description,
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1652305489491-789257d2e95c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwbGlicmFyeSUyMHJlYWRpbmd8ZW58MXx8fHwxNzU5NTgzOTEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      addedBy: user.id,
      dateAdded: new Date().toISOString()
    };

    Storage.addBook(newBook);
    toast.success('Book added successfully!');
    navigate(`/book/${newBook.id}`);
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add a New Book</CardTitle>
          <CardDescription>
            Share a book with the community and help others discover great reads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter book title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                type="text"
                placeholder="Enter author name"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select 
                value={formData.genre} 
                onValueChange={(value) => handleChange('genre', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map(genre => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description of the book"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                required
              />
              <p className="text-sm text-gray-500">
                Minimum 50 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
              <Input
                id="coverImage"
                type="url"
                placeholder="https://example.com/book-cover.jpg"
                value={formData.coverImage}
                onChange={(e) => handleChange('coverImage', e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Leave empty to use a default cover image
              </p>
            </div>

            {formData.coverImage && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="aspect-[3/4] max-w-[200px] overflow-hidden rounded-lg border">
                  <img
                    src={formData.coverImage}
                    alt="Book cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1652305489491-789257d2e95c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwbGlicmFyeSUyMHJlYWRpbmd8ZW58MXx8fHwxNzU5NTgzOTEwfDA&ixlib=rb-4.1.0&q=80&w=1080';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || formData.description.length < 50}
                className="flex-1"
              >
                {isSubmitting ? 'Adding Book...' : 'Add Book'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
