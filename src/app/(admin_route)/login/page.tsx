"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"

export default function Login() {
  const router = useRouter()

  const formSchema = z.object({
    email: z.string().min(1, {
      message: "Debes escribir el nombre de usuario.",
    }),
    password: z.string().min(1, {
      message: "Debes escribir la contraseña.",
    }),
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {

    const user = { 
      redirect: false,
      email: values.email,
      password: values.password
  }

    const response =await signIn("credentials", { ...user });
    console.log(response)
    if (response?.error) {
      console.error("Error en signIn:", response.error)
    } else {
      router.push('/admin')
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  

  return (
    <Form {...form}>
      <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input placeholder="email" type="email" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input placeholder="contraseña" {...field} type="password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
          )}
        />

      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 transition-colors duration-300">
              "Enviar"
              </Button>     
         </form>
    </Form>
  );
}