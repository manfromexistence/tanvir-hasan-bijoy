"use client"

import * as React from "react";
import { useEffect, useState, Suspense } from "react";
import dynamic from 'next/dynamic'; // Added import
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, limit, orderBy, startAfter } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleSlash2, Briefcase, Edit, Trash2, Plus } from "lucide-react";
import { cn, lt, loadLocaleData } from "@/lib/utils";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Locale } from "@/i18n-config";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAD3CP5FLboPrDaVig-R0ZyswKH_KT8wdM",
    authDomain: "portfolio-105c5.firebaseapp.com",
    projectId: "portfolio-105c5",
    storageBucket: "portfolio-105c5.firebasestorage.app",
    messagingSenderId: "1090961552205",
    appId: "1:1090961552205:web:48236ad49bf7326aebfd04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Image upload function
async function uploadImageToImgBB(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    const apiKey = "e9230df1a8b462e236782426e1430227";

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.data.url;
}

interface BlogPost {
    id: string;
    name: string;
    description: string;
    image: string;
    link: string;
    createdAt: any;
}

// Original component definition
const OriginalLocaleWrapper = ({ children, locale }: { children: React.ReactNode; locale: Locale }) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    loadLocaleData(locale).then(() => {
      setLoaded(true);
    });
  }, [locale]);
  
  return loaded ? <>{children}</> : null;
};

// Dynamically import LocaleWrapper with ssr: false
const LocaleWrapper = ({ children, locale }: { children: React.ReactNode; locale: Locale }) => {
  const Component = dynamic(() => Promise.resolve(({ children: c, locale: l }: { children: React.ReactNode; locale: Locale }) => 
    <OriginalLocaleWrapper locale={l}>{c}</OriginalLocaleWrapper>
  ), {
    ssr: false,
    // Suspense boundary around its usage will handle the loading state
  });
  
  return <Component locale={locale}>{children}</Component>;
};

export default function Contents() {
  // Get the locale from the URL on the client side
  const [locale, setLocale] = useState<Locale>('en');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const segments = pathname.split('/').filter(Boolean);
      const routeLocale = segments[0];
      
      if (routeLocale && ['en', 'af', 'ak', 'am', 'ar', 'as', 'ay', 'az', 'be', 'bg', 'bho', 'bm', 'bn', 'bs', 'ca', 'ceb', 'ckb', 'co', 'cs', 'cy', 'da', 'de', 'dv', 'ee', 'el', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'ha', 'haw', 'he', 'hi', 'hmn', 'hr', 'ht', 'hu', 'hy', 'id', 'ig', 'is', 'it', 'iw', 'ja', 'jw', 'ka', 'kk', 'km', 'kn', 'ko', 'ku', 'ky', 'la', 'lb', 'lg', 'ln', 'lo', 'lt', 'lv', 'mg', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'ny', 'om', 'or', 'pa', 'pl', 'ps', 'pt', 'qu', 'ro', 'ru', 'rw', 'sa', 'sd', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tk', 'tl', 'tr', 'tt', 'tw', 'ug', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'yo', 'zh', 'zu'].includes(routeLocale)) {
        setLocale(routeLocale as Locale);
      }
    }
  }, []);

  return <ContentsClient locale={locale} />;
}

function ContentsClient({ locale }: { locale: Locale }) {
  // Remove the loaded state from the main component
  // const [loaded, setLoaded] = useState(false);

  // State for blogs data
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");

  // Form state for add/edit
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // Confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // Check admin status on component mount
  useEffect(() => {
    const savedAdminStatus = localStorage.getItem("isAdmin");
    if (savedAdminStatus === "true") {
      setIsAdmin(true);
    }

    // Remove locale loading from here - it's now in LocaleWrapper
    // preloadCurrentLocale().then(() => {
    //   setLoaded(true);
    // });

    // Initial fetch
    fetchInitialBlogs();
  }, []);

  // Fetch initial set of blogs
  const fetchInitialBlogs = async () => {
    setLoading(true);
    try {
        const q = query(
            collection(db, "blogs"),
            orderBy("createdAt", "desc"),
            limit(12)
        );

        const querySnapshot = await getDocs(q);
        const blogData: BlogPost[] = [];

        querySnapshot.forEach((doc) => {
            blogData.push({ id: doc.id, ...doc.data() } as BlogPost);
        });

        setBlogs(blogData);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 12);

    } catch (error) {
        console.error("Error fetching blogs:", error);
        toast({
            title: "Error",
            description: "Failed to load content. Please try again.",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };

  // Load more blogs
  const loadMoreBlogs = async () => {
    if (!lastVisible) return;

    setLoading(true);
    try {
        const q = query(
            collection(db, "blogs"),
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(12)
        );

        const querySnapshot = await getDocs(q);
        const blogData: BlogPost[] = [];

        querySnapshot.forEach((doc) => {
            blogData.push({ id: doc.id, ...doc.data() } as BlogPost);
        });

        setBlogs([...blogs, ...blogData]);

        if (querySnapshot.docs.length > 0) {
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } else {
            setHasMore(false);
        }

        setHasMore(querySnapshot.docs.length === 12);

    } catch (error) {
        console.error("Error loading more blogs:", error);
        toast({
            title: "Error",
            description: "Failed to load more content.",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };

  // Verify admin password
  const verifyPassword = () => {
    if (password === "Tanvir123@!") {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true");
        setShowPasswordDialog(false);
        toast({
            title: "Success",
            description: "Admin access granted",
        });
    } else {
        toast({
            title: "Error",
            description: "Incorrect password",
            variant: "destructive",
        });
    }
  };

  // Helper to get locale-prefixed paths for internal navigation
  const getLocalizedPath = (path: string) => {
    // Remove leading slash if it exists
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Return locale-prefixed path
    return `/${locale}${cleanPath ? `/${cleanPath}` : ''}`;
  };
  
  // When adding a blog, potentially update internal links to include locale
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!link || (!imageFile && !imagePreview)) {
        toast({
            title: "Missing fields",
            description: "Please provide a link and an image",
            variant: "destructive",
        });
        return;
    }
    
    setLoading(true);
    
    try {
      let imageUrl = imagePreview;
      
      // Upload new image if provided
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }
      
      // For internal links, ensure they have locale prefix
      let finalLink = link;
      if (finalLink && !finalLink.startsWith('http') && !finalLink.startsWith('mailto:')) {
        finalLink = getLocalizedPath(finalLink);
      }
      
      if (isEditMode) {
        // Update existing blog
        await updateDoc(doc(db, "blogs", currentBlogId), {
          image: imageUrl,
          link: finalLink, // Use potentially modified link
          updatedAt: new Date()
        });
        
        toast({
            title: "Success!",
            description: "Content updated successfully",
        });
      } else {
        // Add new blog
        await addDoc(collection(db, "blogs"), {
          name: "",
          description: "",
          image: imageUrl,
          link: finalLink, // Use potentially modified link
          createdAt: new Date()
        });
        
        toast({
            title: "Success!",
            description: "New content added successfully",
        });
      }
    
      // Reset form
      resetForm();
      // Refresh blogs
      fetchInitialBlogs();
    
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to save content. Please try again.",
            variant: "destructive",
        });
        console.error("Error saving blog:", error);
    } finally {
        setLoading(false);
        setIsDialogOpen(false);
    }
  };
  
  // Reset form fields
  const resetForm = () => {
    setName("");
    setDescription("");
    setLink("");
    setImageFile(null);
    setImagePreview("");
    setIsEditMode(false);
    setCurrentBlogId("");
  };

  // Open edit dialog with blog data
  const handleEdit = (blog: BlogPost) => {
    setCurrentBlogId(blog.id);
    setName(blog.name);
    setDescription(blog.description);
    setLink(blog.link);
    setImagePreview(blog.image);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Confirm and delete blog
  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
        await deleteDoc(doc(db, "blogs", blogToDelete));

        // Update the blogs state by filtering out the deleted item
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete));

        toast({
            title: "Success!",
            description: "Content deleted successfully",
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to delete content",
            variant: "destructive",
        });
    } finally {
        setIsDeleteDialogOpen(false);
        setBlogToDelete(null);
    }
  };

  // Prompt for delete confirmation
  const handleDelete = (id: string) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Open dialog for adding new content
  const handleAddNew = () => {
    if (isAdmin) {
        resetForm();
        setIsDialogOpen(true);
    } else {
        setShowPasswordDialog(true);
    }
  };

  // Skeleton component for loading state
  const ContentSkeleton = () => (
    <>
        {Array(12).fill(null).map((_, index) => (
                <AspectRatio key={index} ratio={16 / 9}>
                    <Skeleton className="h-full w-full" />
                </AspectRatio>
        ))}
    </>
  );

  // Main content wrapper
  const ContentWrapper = () => (
    <div className="container flex flex-col items-center space-y-8 pb-[75px] mx-auto max-w-7xl">
      <div className="mt-4 w-full space-y-8">
        <div className="flex items-center justify-between">
          <Suspense fallback={<h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">All Contents</h1>}>
            <LocaleWrapper locale={locale}>
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                {lt("all-contents", "All Contents", locale)}
              </h1>
            </LocaleWrapper>
          </Suspense>
          
          <Suspense fallback={
            <Button className="flex items-center gap-2" variant="outline" size="lg">
              <Plus size={16} />
              Add Content
            </Button>
          }>
            <LocaleWrapper locale={locale}>
              <Button
                onClick={handleAddNew}
                className="flex items-center gap-2"
                variant="outline"
                size="lg"
              >
                <Plus size={16} />
                {lt("add-content", "Add Content", locale)}
              </Button>
            </LocaleWrapper>
          </Suspense>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
        {loading ? (
          <ContentSkeleton />
        ) : (
          blogs.map((blog) => (
            <Link key={blog.id} href={blog.link} passHref className="block relative h-full rounded-md overflow-hidden group">
              <AspectRatio ratio={16 / 9} className="h-full">
                <Image
                  src={blog.image}
                  alt={blog.name}
                  fill
                  className="object-cover"
                />

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-secondary/80 hover:bg-secondary w-8 h-8"
                      onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit(blog);
                      }}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8"
                      onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(blog.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
              </AspectRatio>
            </Link>
          ))
        )}
      </div>

      {blogs.length === 0 && !loading && (
        <div className="text-center py-16 w-full">
          <h3 className="text-2xl font-medium mb-2">No content found</h3>
          <p className="text-muted-foreground">
            {isAdmin ? "Click 'Add Content' to get started" : "Content will be added soon!"}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && blogs.length > 0 && (
        <div className="flex justify-center mt-8 w-full">
          <Button
            variant="outline"
            onClick={loadMoreBlogs}
            disabled={loading}
            className="min-w-[200px]"
            size="lg"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      <SiteFooter />
    </div>
  );

  return (
    <>
      <Suspense fallback={
        <div className="container flex flex-col items-center space-y-8 pb-[75px] mx-auto max-w-7xl">
          <div className="mt-4 w-full">
            <Skeleton className="h-12 w-48 mb-8" />
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
            <ContentSkeleton />
          </div>
        </div>
      }>
        <ContentWrapper />
      </Suspense>

      {/* Add/Edit Content Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Content" : "Add New Content"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="link" className="text-sm font-medium">Link</label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter link URL"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Image</label>
              {imagePreview && (
                <ScrollArea className="h-[300px] w-full rounded-md border">
                  <div className="relative w-full" style={{ minHeight: "300px" }}>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                </ScrollArea>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditMode ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Admin Authentication Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Please enter the admin password to continue.
            </p>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  verifyPassword();
                }
              }}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={verifyPassword}>
              Verify
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}