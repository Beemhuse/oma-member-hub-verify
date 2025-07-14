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
import { Cookies, useCookies } from "react-cookie";
import { useAuth } from "@/context/AuthContext";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};
const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const cookies = new Cookies();
  const { refreshAuth } = useAuth();

  // const [cookies, setCookie, removeCookie] = useCookies(['auth', 'oma-token']);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isMutating } = useApiMutation<
    LoginResponse,
    LoginRequest
  >({
    method: "POST",
    url: "/api/auth/login",
    onSuccess: (data) => {
      cookies.set("oma-token", data.token, { path: "/", maxAge: 86400 }); // Expires in 1 day
      cookies.set("auth", "true", { path: "/", maxAge: 86400 }); // Expires in 1 day
      refreshAuth();

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      const errMsg = error?.response?.data?.message;

      toast({
        title: "Signin failed",
        description: errMsg || "Failed",
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
      login(admin);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
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
              <Button loading={isMutating} type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex  flex-col justify-center">
          <p className="text-sm text-muted-foreground">
            OMA Member Hub Admin Portal
          </p>
          <Link to={"/signup"} className="text-blue-800 underline">
            Signup
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
