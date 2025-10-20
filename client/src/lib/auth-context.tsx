import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { UserProfile } from "shared";
import { getCurrentUser } from "./api/auth/auth";

interface AuthContextType {
	user: UserProfile | null;
	loading: boolean;
	login: (token: string) => void;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	const refreshUser = async () => {
		const token = localStorage.getItem("auth_token");
		if (!token) {
			setUser(null);
			setLoading(false);
			return;
		}

		try {
			const userData = await getCurrentUser();
			setUser(userData);
		} catch (error) {
			console.error("Failed to fetch user:", error);
			localStorage.removeItem("auth_token");
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshUser();
	}, []);

	const login = (token: string) => {
		localStorage.setItem("auth_token", token);
		refreshUser();
	};

	const logout = () => {
		localStorage.removeItem("auth_token");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

