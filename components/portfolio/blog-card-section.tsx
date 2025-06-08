"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BlogCard from './blog-card'
import { blogs as staticBlogs, products, projects } from '@/content/article'
import { Separator } from '@/components/ui//separator'
import { lt, preloadCurrentLocale } from '@/lib/utils'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

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

interface BlogPost {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
}

export function SocialMedias() {
  const [loaded, setLoaded] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch blogs from Firestore
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc"),
        limit(12)
      );
      
      const querySnapshot = await getDocs(q);
      const blogData: BlogPost[] = [];
      
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          blogData.push({ id: doc.id, ...doc.data() } as BlogPost);
        });
        setBlogs(blogData);
      } else {
        console.log("No blogs found in Firestore, using fallback data");
        // Fallback to static blogs if Firebase returns empty results
        setBlogs(staticBlogs.map((blog, index) => ({
          id: index.toString(),
          name: blog.name,
          description: blog.description,
          image: blog.image,
          link: blog.link
        })));
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // Fallback to static blogs if Firebase fails
      setBlogs(staticBlogs.map((blog, index) => ({
        id: index.toString(),
        name: blog.name,
        description: blog.description,
        image: blog.image,
        link: blog.link
      })));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    preloadCurrentLocale().then(() => {
      setLoaded(true);
    });
    fetchBlogs();
  }, []);

  // Skeleton component for loading state
  const BlogCardSkeleton = () => (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-48 w-full rounded-md overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
      ))}
    </>
  );
  
  return (
    <div className='w-full'>
      <div className='mb-4 flex w-full flex-col items-start justify-center gap-2'>
        <h1 className='text-xl font-medium tracking-tight'>
          {loaded ? lt("highlights") : "Highlights of My Work"}
        </h1>
        <Separator />
      </div>
      
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {isLoading ? (
          <BlogCardSkeleton />
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <Link href={blog.link} key={blog.id} passHref>
              <BlogCard image={blog.image} />
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            No content found.
          </div>
        )}
      </div>
      
      <Link className='my-4 flex w-full items-center justify-center rounded-md border py-2' href="/contents">
        {loaded ? lt("see-all-contents") : "See all contents"}
      </Link>
    </div>
  );
}

export function BigProjects() {
  return (
    <div className='w-full'>
      <div className='mb-4 flex w-full flex-col items-start justify-center gap-2'>
        <h1 className='text-xl font-medium tracking-tight'>Projects</h1>
        <Separator />
      </div>
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {projects?.map((project) => (
          <Link href={project?.link} key={project?.id} className="block h-48 overflow-hidden">
            <BlogCard image={project?.image} />
          </Link>
        ))}
      </div>
      <Link className='my-4 flex w-full items-center justify-center rounded-md border py-2' href="/contents">
        See all projects
      </Link>
    </div>
  )
}


export function ProductionGradeProjects() {
  return (
    <div className='w-full'>
      <div className='mb-4 flex w-full flex-col items-start justify-center gap-2'>
        <h1 className='text-xl font-medium tracking-tight'>Products</h1>
        <Separator />
      </div>
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {products?.map((product) => (
          <Link href={product?.link} key={product?.id} className="block h-48 overflow-hidden">
            <BlogCard image={product?.image} />
          </Link>
        ))}
      </div>
      <Link className='my-4 flex w-full items-center justify-center rounded-md border py-2' href="/contents">
        See all products
      </Link>
    </div>
  )
}


