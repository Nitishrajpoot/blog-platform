import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '@/hooks/useBlogs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { PenLine, Calendar, ArrowRight, BookOpen, Sparkles, TrendingUp } from 'lucide-react';
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

export function Home() {
  const { blogs, isLoading, getAllBlogs } = useBlogs();

  useEffect(() => {
    getAllBlogs();
  }, [getAllBlogs]);

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-blue-50">
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, 25, 0], 
            y: [0, 15, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex"
          >
            <span className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25">
              <Sparkles className="h-4 w-4" />
              Discover Amazing Stories
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
            </span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Welcome to{' '}
            <span className="gradient-text">
              BlogSpace
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A vibrant platform for sharing your thoughts, ideas, and stories with the world. 
            Join our colorful community of writers and readers today!
          </p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button size="lg" className="gap-2 gradient-button border-0 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105">
                <PenLine className="h-5 w-5" />
                Start Writing
              </Button>
            </Link>
            <Link to="#blogs">
              <Button size="lg" variant="outline" className="gap-2 border-2 border-violet-200 hover:border-violet-400 hover:bg-violet-50 transition-all">
                Explore Blogs
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-8 pt-4"
          >
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">5+</p>
              <p className="text-sm text-slate-500">Blog Posts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">3</p>
              <p className="text-sm text-slate-500">Writers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">1.2K</p>
              <p className="text-sm text-slate-500">Readers</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Blog List Section */}
      <section id="blogs" className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Latest Blogs</h2>
              </div>
              <p className="text-slate-500 ml-13">
                Discover the newest stories from our community
              </p>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="h-16 w-16 mx-auto text-violet-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-500">No blogs yet</h3>
              <p className="text-slate-400 mt-2">Be the first to share your story!</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {blogs.map((blog, index) => (
                <motion.div 
                  key={blog._id} 
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Link to={`/blogs/${blog._id}`}>
                    <Card className="h-full overflow-hidden group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                      {/* Card Header with Gradient */}
                      <div className={`h-2 bg-gradient-to-r ${
                        index % 4 === 0 ? 'from-violet-500 to-fuchsia-500' :
                        index % 4 === 1 ? 'from-blue-500 to-cyan-500' :
                        index % 4 === 2 ? 'from-emerald-500 to-teal-500' :
                        'from-orange-500 to-pink-500'
                      }`} />
                      <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blog.tags?.slice(0, 3).map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline"
                              className={`text-xs font-medium ${getTagStyle(tag)}`}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="line-clamp-2 group-hover:text-violet-600 transition-colors duration-200 text-lg">
                          {blog.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-slate-500">
                          {blog.content.substring(0, 150)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 ring-2 ring-violet-100">
                              <AvatarFallback className={`text-sm font-semibold ${
                                index % 3 === 0 ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white' :
                                index % 3 === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' :
                                'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                              }`}>
                                {blog.author.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">{blog.author.name}</span>
                              <span className="text-xs text-slate-400">
                                @{blog.author.username}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(blog.createdAt), 'MMM d')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-violet-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <PenLine className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">BlogSpace</span>
          </div>
          <p className="text-slate-500 text-sm">
            Share your story with the world. Built with ❤️ and lots of ☕
          </p>
        </div>
      </footer>
    </div>
  );
}
