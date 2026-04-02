import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBlogs } from '@/hooks/useBlogs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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
} from '@/components/ui/alert-dialog';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit2, 
  Trash2, 
  Share2,
  Bookmark,
  Heart,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from '@/lib/utils';

// Colorful tag styles
const getTagStyle = (tag: string) => {
  const tagLower = tag.toLowerCase();
  if (tagLower.includes('react') || tagLower.includes('javascript')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (tagLower.includes('typescript')) return 'bg-sky-100 text-sky-700 border-sky-200';
  if (tagLower.includes('node')) return 'bg-green-100 text-green-700 border-green-200';
  if (tagLower.includes('css') || tagLower.includes('design')) return 'bg-pink-100 text-pink-700 border-pink-200';
  if (tagLower.includes('mongo')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (tagLower.includes('security') || tagLower.includes('auth')) return 'bg-red-100 text-red-700 border-red-200';
  if (tagLower.includes('api') || tagLower.includes('backend')) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (tagLower.includes('frontend') || tagLower.includes('web')) return 'bg-purple-100 text-purple-700 border-purple-200';
  return 'bg-violet-100 text-violet-700 border-violet-200';
};

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { blog, isLoading, getBlogById, deleteBlog } = useBlogs();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      getBlogById(id);
    }
  }, [id, getBlogById]);

  const handleDelete = async () => {
    if (id) {
      await deleteBlog(id);
      navigate('/');
    }
  };

  const canEdit = isAuthenticated && blog && (
    user?._id === blog.author._id || user?.role === 'admin'
  );

  const readingTime = blog?.content 
    ? Math.ceil(blog.content.split(' ').length / 200)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-blue-50 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-12 w-full" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-blue-50">
        <Card className="text-center p-8 border-0 shadow-xl bg-white/90 backdrop-blur-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Blog not found</h2>
          <p className="text-slate-500 mb-4">
            The blog post you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="gradient-button border-0 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-10 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-10 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header Actions */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-violet-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-violet-50 hover:text-violet-600 rounded-full">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-9 w-9 rounded-full transition-all ${liked ? 'bg-pink-100 text-pink-500' : 'hover:bg-violet-50'}`}
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-violet-50">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-violet-50">
              <Share2 className="h-4 w-4" />
            </Button>
            {canEdit && (
              <>
                <Link to={`/edit-blog/${blog._id}`}>
                  <Button variant="outline" size="sm" className="gap-2 rounded-full border-violet-200 hover:bg-violet-50 hover:border-violet-300">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2 rounded-full">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-0 shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl">Delete Blog Post</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-500">
                        Are you sure you want to delete this blog post? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-red-500 text-white hover:bg-red-600 rounded-full"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-4 py-12 relative z-10"
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className={`text-sm font-medium ${getTagStyle(tag)}`}>
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight gradient-text">
          {blog.title}
        </h1>

        {/* Author Info */}
        <Card className="mb-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="h-1 gradient-button" />
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-violet-200 ring-offset-2">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-lg font-bold">
                  {blog.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{blog.author.name}</span>
                  {blog.author.role === 'admin' && (
                    <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-violet-400" />
                    {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-violet-400" />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="mb-8 bg-violet-100" />

        {/* Content */}
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="prose prose-lg max-w-none">
              {blog.content.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-6 text-slate-700 leading-relaxed text-lg"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <Separator className="my-8 bg-violet-100" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className={`gap-2 rounded-full border-violet-200 ${liked ? 'bg-pink-50 border-pink-200 text-pink-600' : 'hover:bg-violet-50'}`}
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Liked' : 'Like'}
            </Button>
            <Button variant="outline" className="gap-2 rounded-full border-violet-200 hover:bg-violet-50">
              <MessageCircle className="h-4 w-4" />
              Comment
            </Button>
          </div>
          <span className="text-sm text-slate-400">
            Last updated: {format(new Date(blog.updatedAt), 'MMMM d, yyyy')}
          </span>
        </div>
      </motion.article>
    </div>
  );
}
