"use client";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React,{useActionState, useState} from 'react';
import dynamic from "next/dynamic";
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formSchema } from '@/lib/validation';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createPitch } from '@/lib/actions';

const MDEditor = dynamic(() => import("@uiw/react-markdown-editor"), { ssr: false });
const StartupForm = () => {
  const [errors,setErrors]=useState<Record<string,string>>({});

  const [pitch,setPitch]=useState("");
  const {toast}=useToast();

  const router =useRouter();

  const handleFormSubmit=async (prevState:any ,formData:FormData)=>{
    try{
      const formValues={
        title:formData.get("title") as string,
        description:formData.get("description") as string,
        category:formData.get("category") as string,
        link:formData.get("link") as string,
        pitch,
        
      }

      await formSchema.parseAsync(formValues);
      const result = await createPitch(prevState,formData,pitch);

      if(result.status ==='SUCCESS'){
        toast({title:'Idea Created',description:'Your idea has been created successfully',
 
      })
    router.push(`startup/${result._id}`)
    }   
     console.log(result);
    return result

   
    }
    catch(error){


        if(error instanceof z.ZodError){
          const fieldError =error.flatten().fieldErrors;
          setErrors(fieldError as unknown as Record<string,string>);
          toast({
            title: "Error",
            description: "Please check your inputs and try again",
            variant:'destructive'
     
          })
            return {
            ...prevState,error:"Validation Failed",status:"ERROR"
          }
        }
        toast({
          title: "Error",
          description: "An unexpected error has occured",
          variant:'destructive'
        })
    
          return{
            ...prevState,
            error:'An unexpected error has occured',
            status:'ERROR'
          }
      
        }
    finally{

    }
}
const [state,formAction,isPending]=useActionState(handleFormSubmit,{
  error:"",
  status:"INITIAL",

});



  return (
    <form action={formAction} className="startup-form">
        <div>
            <label htmlFor="title" className='startup-form_label'>
                Title
            </label>
           <Input id="title" name="title" placeholder='Startup Title' className='startup-form_input' required/> 

           {errors.title && <p className='startup-form_error'>{errors.title}</p> }
        </div>
        <div>
            <label htmlFor="description" className='startup-form_label'>
               Description
            </label>
           <Textarea id="description" name="description" placeholder='Startup Description' className='startup-form_textarea' required/> 

           {errors.description && <p className='startup-form_error'>{errors.description}</p> }
        </div>
        <div>
            <label htmlFor="category" className='startup-form_label'>
              Category
            </label>
           <Input id="category" name="category" placeholder='Startup Category (Health,Tech,Education...)' className='startup-form_input' required/> 

           {errors.category && <p className='startup-form_error'>{errors.category}</p> }
        </div>
        <div>
            <label htmlFor="link" className='startup-form_label'>
                Image Url
            </label>
           <Input id="link" name="link" placeholder='Startup Image' className='startup-form_input' required/> 

           {errors.link && <p className='startup-form_error'>{errors.link}</p> }
        </div>

        <div data-color-mode="light">
            <label htmlFor="pitch" className='startup-form_label'>
            Pitch
            </label>
         <MDEditor value={pitch} 
           onChange={(value) => setPitch(value ?? "")}
         id="pitch" preview="edit" height={300} style={{borderRadius:20,overflow:"hidden"}} textareaprops={{
          placeholder:"Briefly describe your idea and what problem it solves"
         }} />
           {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p> }
        </div>

        <Button type="submit" className='startup-form_btn text-white' disabled={isPending}>{isPending? "Submitting..." :"Submit Your Pitch" }
       <Send className='size-8 ml-2'/>
        </Button>
       
        
    </form>
  )
}

export default StartupForm