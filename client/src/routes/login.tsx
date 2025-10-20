import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { login, register } from "@/lib/api/auth/auth";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	
	const { login: authLogin } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			if (isLogin) {
				const response = await login({ email, password });
				if (response.success && response.token) {
					authLogin(response.token);
					navigate({ to: "/dashboard" });
				}
			} else {
				const response = await register({ email, password, fullName });
				if (response.success && response.token) {
					authLogin(response.token);
					navigate({ to: "/dashboard" });
				}
			}
		} catch (err: any) {
			setError(err.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
					<CardDescription>
						{isLogin
							? "Enter your credentials to access your dashboard"
							: "Create an account to start tracking your career progress"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{!isLogin && (
							<div className="space-y-2">
								<label htmlFor="fullName" className="text-sm font-medium">
									Full Name
								</label>
								<input
									id="fullName"
									type="text"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
									required
								/>
							</div>
						)}
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								required
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								required
								minLength={6}
							/>
						</div>
						{error && (
							<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
								{error}
							</div>
						)}
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Please wait..." : isLogin ? "Login" : "Register"}
						</Button>
					</form>
					<div className="mt-4 text-center text-sm">
						{isLogin ? "Don't have an account? " : "Already have an account? "}
						<button
							type="button"
							onClick={() => {
								setIsLogin(!isLogin);
								setError("");
							}}
							className="text-primary underline-offset-4 hover:underline"
						>
							{isLogin ? "Register" : "Login"}
						</button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

