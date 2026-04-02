import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBlogs } from '@/hooks/useBlogs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
} from '@/components/ui/alert-dialog';
import { 
  PenLine, 
  Calendar, 
  Edit2, 
  Trash2, 
  Plus,
  FileText,
  Eye,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

export function MyBlogs() {
  const { user } = useAuth();
  const { blogs, isLoading, getUserBlogs, deleteBlog } = useBlogs();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user?._id) {
      getUserBlogs(user._id);
    }
  }, [user, getUserBlogs]);

  const handleDeleteClick = (blogId: string) => {
    setBlogToDelete(blogId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (blogToDelete) {
      await deleteBlog(blogToDelete);
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-blue-50 py-12 px-4 relative overflow-hidden">
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">My Blogs</h1>
            </div>
            <p className="text-slate-500 ml-13">
              Manage and edit your colorful blog posts
            </p>
          </div>
          <Link to="/create-blog">
            <Button className="gap-2 gradient-button border-0 text-white rounded-full shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50">
              <Plus className="h-4 w-4" />
              Create New Blog
            </Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold gradient-text">{blogs.length}</p>
                  <p className="text-sm text-slate-500">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{blogs.length > 0 ? '1.2K' : '0'}</p>
                  <p className="text-sm text-slate-500">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {blogs.length > 0 
                      ? format(new Date(blogs[0].createdAt), 'MMM d')
                      : '-'
                    }
                  </p>
                  <p className="text-sm text-slate-500">Last Post</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blog List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg bg-white/90">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="text-center py-16 border-dashed border-2 border-violet-200 bg-white/50">
              <CardContent>
                <div className="w-20 h-20 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenLine className="h-10 w-10 text-violet-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 gradient-text">No blogs yet</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  Start your colorful writing journey by creating your first blog post!
                </p>
                <Link to="/create-blog">
                  <Button className="gap-2 gradient-button border-0 text-white rounded-full shadow-lg shadow-violet-500/30">
                    <Plus className="h-4 w-4" />
                    Create Your First Blog
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence>
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${
                      index % 4 === 0 ? 'from-violet-500 to-fuchsia-500' :
                      index % 4 === 1 ? 'from-blue-500 to-cyan-500' :
                      index % 4 === 2 ? 'from-emerald-500 to-teal-500' :
                      'from-orange-500 to-pink-500'
                    }`} />
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-violet-100">
                          <AvatarFallback className={`text-white font-semibold ${
                            index % 3 === 0 ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500' :
                            index % 3 === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                            'bg-gradient-to-br from-emerald-500 to-teal-500'
                          }`}>
                            {blog.author.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {blog.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className={`text-xs ${getTagStyle(tag)}`}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="text-lg font-semibold mb-1 group-hover:text-violet-600 transition-colors">
                            {blog.title}
                          </h3>
                          <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                            {blog.content.substring(0, 200)}...
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                            </span>
                            <span>{blog.content.split(' ').length} words</span>
                          </div>
                        </div>
                        <div className="flex sm:flex-col gap-2">
                          <Link to={`/blogs/${blog._id}`}>
                            <Button variant="outline" size="sm" className="gap-2 rounded-full border-violet-200 hover:bg-violet-50 hover:border-violet-300">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </Link>
                          <Link to={`/edit-blog/${blog._id}`}>
                            <Button variant="outline" size="sm" className="gap-2 rounded-full border-violet-200 hover:bg-violet-50 hover:border-violet-300">
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2 rounded-full"
                            onClick={() => handleDeleteClick(blog._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
              onClick={handleConfirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 rounded-full"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
