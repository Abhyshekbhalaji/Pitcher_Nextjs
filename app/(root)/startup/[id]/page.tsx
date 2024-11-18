import { PLAYLIST_BY_SLUG_QUERY, startup_by_id_query } from '@/sanity/lib/querys';
import React, { Suspense } from 'react'
import {client} from '@/sanity/lib/client'
import { notFound } from 'next/navigation';
import { formateDate } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import markdownit from "markdown-it"
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/app/components/View';
import StartupCard from '@/app/components/StartupCard';

export const experimental_ppr=true;

const page = async({params}:{params:Promise<{id:string}>}) => {
  const id=(await params).id;
const md=markdownit();
const [post,edit]=await Promise.all([
  await client.fetch(startup_by_id_query,{id}),
  await client.fetch(PLAYLIST_BY_SLUG_QUERY,{slug:"editor-picks"}) 
]);
  const editPost=await edit?.select || [];
  if(!post) return notFound();
    const parsedContent=md.render(post?.pitch || " ");

  return (
        <>
        <section className='pink_container !min-h-[230px]'>
        <p className='tag'>{formateDate(post?._createdAt)}</p>
         <h1 className='heading'>{post.title}</h1>
         <p className='sub-heading !max-w-5xl'> {post.description}</p>
         </section>
         <section className='section_container'>
            <img src={post?.image} alt="thumbnail" className=' w-full md:w-[1200px] md:h-[1000px] h-auto rounded-xl'/>
                <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
                    <div className='flex-between gap-5'>
                    <Link href={`/user/${post.author?._id}`} className='flex gap-2 items-center mb-3'>
                  {  <Image src={post?.author?.image} alt="avatar" width={64} height={64} className='rounded-full drop-shadow-lg '/>}
                   <div>
                     <p className='text-20-medium'>{post.author?.name}</p> 
                     <p className='text-20-medium !text-black-300'>{post.author?.username}</p> 
                   </div>
                    </Link>

                  <p className='category-tag'>
                    {post.category}
                    </p>  
                    </div>
                    <h3 className='text-30-bold'>Pitch Details</h3>
                    {parsedContent ? (
  <article className='prose max-w-4xl font-work-sans break-all ' dangerouslySetInnerHTML={{ __html: parsedContent }} />
) : (
  <p className="no-result">No details provided</p>
)}

                </div>
                <hr className='divider'/>
 {editPost.length>0 && (
  <div className='max-w-4xl mx-auto'>
    <p className='text-30-semibold'>Editor Picks</p>
  <ul className='mt-7 card_grid-sm'>{
    editPost.map((post:any,index:number)=>{
      return (
        <StartupCard key={index} post={post}/>
      )
    })}</ul>
  </div>
 ) }


<Suspense fallback={<Skeleton className="view_skeleton"/>} >
<View id={id}/>
</Suspense>
         </section>
       

        </>

  )
}

export default page