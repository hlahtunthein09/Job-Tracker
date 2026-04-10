"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signUp } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignUp()
{
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    // Error handling state
    const [ error, setError ] = useState("");
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const router = useRouter();

    // submit function 
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Basic Manual Check
        if(!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        if(name.trim().length < 2) {
            setError("Name must be at least 2 characters long.");
            return;
        }

        if(!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }


        if(password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }


        setIsSubmitting(true);
        setError("");

        try{
            const result = await signUp.email({
                name,
                email,
                password
            });

            if (result.error) {
                setError(result.error.message ?? "Failed to sign up");
            }else{
                
                router.push("/dashboard"); // if success, we redirected to dashboard page.
                router.refresh(); 
            }

        }
        catch(err)
        {
            console.log("Error: ", err);
            setError("An unexpected error occurred.");
        }
        finally{
            setIsSubmitting(false);
        }
    }

    return(
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-gray-200 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-black">
                        Sign Up
                    </CardTitle>

                    <CardDescription className="text-gray-600">
                        Create an account to start tracking your job application
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label 
                                htmlFor="name"
                                className="text-gray-700"
                            >
                                Name
                            </Label>
                            <Input 
                                id="name" 
                                type="text" 
                                placeholder="Hla Htun" 
                                required 
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label 
                                htmlFor="email"
                                className="text-gray-700"
                            >
                                Email
                            </Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="hlahtun@example.com" 
                                required 
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label 
                                htmlFor="password" 
                                className="text-gray-700"
                            >
                                Password
                            </Label>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                                minLength={8}
                                className="border-gray-300 focus:border-primary focus:ring-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button 
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"   
                            disabled={isSubmitting}
                        >
                            { isSubmitting ? "Creating Account..." : "Sign Up" }
                        </Button>
                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link 
                                href="/sign-in"
                                className="font-medium text-primary hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}