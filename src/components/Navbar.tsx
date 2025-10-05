import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, LogOut, Home, PlusCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="text-xl">BookReviews</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Browse
                </Button>
              </Link>
              
              <Link to="/add-book">
                <Button 
                  variant={isActive('/add-book') ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Book
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
