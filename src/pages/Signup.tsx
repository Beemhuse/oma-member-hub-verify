import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApiMutation } from "@/hooks/useApi";

// We'll replace this with Supabase auth once connected

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;
type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate: signup, isMutating } = useApiMutation<
    LoginResponse,
    LoginRequest
  >({
    method: "POST",
    url: "/api/auth/register",
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast({
        title: "Signup successful",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Signup failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    },
  });
  const onSubmit = (values: FormValues) => {
    const admin = {
      email: values.email,
      password: values.password,
    };

    if (admin) {
      signup(admin);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Admin Signup</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Signup
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center">
          <p className="text-sm text-muted-foreground">
            OMA Member Hub Admin Portal
          </p>
          <Link to={"/login"} className="text-blue-800 underline">
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
