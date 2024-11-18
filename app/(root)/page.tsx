
import { client } from "@/sanity/lib/client";
import SearchForm from "../components/SearchForm"
import StartupCard from "../components/StartupCard";
import { startups_query } from "@/sanity/lib/querys";
import { StartupTypeCard } from "../components/StartupCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";
export default async function Home({searchParams}:{
  searchParams: Promise<{query?:string}>
}) {
 



  const query=(await searchParams).query;
  const params={search:query || null };
    const {data:posts}=await sanityFetch({query:startups_query,params});
  const session =await auth();


  return (
    <>
    <section className="pink_container">  <h1 className="heading">Pitch your Dream Idea<br/> <em>&</em> <br/> Connect with <span className="text-primary font-medium">Entrepreneurs</span></h1><p className="sub-heading !max-w-3xl">Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions</p>
    <SearchForm query ={query}/>
    </section>
    <section className="section_container">
    <p className="text-30-semibold">
      {query ?`Search results for "${query}"`:"All Startups" }
    </p>
    <ul className="mt-7 card_grid">
    {Array.isArray(posts) && posts.length > 0 ? (
    posts.map((post: any) => (
      <StartupCard key={post._id} post={post} />
    ))
  ) : (
    <p className="no-results">No startups found</p>
  )}
    </ul>
    </section>
  <SanityLive/>
  
    </>
  
  );
}
