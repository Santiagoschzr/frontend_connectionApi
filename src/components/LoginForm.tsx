import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils"

// Define the schema for the login form using Zod
const loginSchema = z.object({
    username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).max(30),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

// Define the type for the form data based on the schema
type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginFormValues) => Promise<void>;
    isLoading: boolean;
    error?: string; // Make error prop optional
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error }) => {
    // Initialize React Hook Form
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema), // Use Zod schema for validation
        defaultValues: {
            username: '',
            password: '',
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)} // Handle form submission
                className="space-y-6"
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your username" {...field} />
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
                                <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
                <Button
                    type="submit"
                    className={cn(
                        "w-full",
                        isLoading && "cursor-not-allowed opacity-70"
                    )}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait...
                        </>
                    ) : (
                        'Login'
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default LoginForm;
