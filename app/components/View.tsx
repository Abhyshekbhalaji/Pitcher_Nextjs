import React from 'react'
import Ping from './Ping';
import {client} from '@/sanity/lib/client'
import {startup_views_id} from '@/sanity/lib/querys';
import { writeClient } from '@/sanity/lib/write-client';
import { StartupViewsIdResult } from '@/sanity/types';
import { unstable_after as after } from 'next/server';
const View = async({id}:{id:string}) => {

  const result = await client
  .withConfig({ useCdn: false })
  .fetch<StartupViewsIdResult | null>(startup_views_id, { id });
  const totalViews = result?.views ?? 0;
    after( async() => await writeClient.patch(id).set({views:totalViews+1}).commit());
  
    return (
    <div className='view-container'>
        <div className='absolute -top-2 -right-2'>
            <Ping/>
        </div>
        <p className='view-text'>
            <span className='font-black'>Views:{totalViews} </span>
        </p>
    </div>
  )
}

export default View