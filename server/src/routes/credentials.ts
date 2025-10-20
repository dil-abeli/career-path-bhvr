import { Hono } from "hono";
import { authMiddleware, type AuthContext } from "../middleware/auth";
import { db } from "../db";
import { credentials } from "../db/schema";
import { encrypt, decrypt } from "../utils/encryption";
import { eq, and } from "drizzle-orm";
import type { ConnectCredentialRequest, CredentialInfo } from "shared";

export const credentialsRouter = new Hono<AuthContext>();

credentialsRouter.use("*", authMiddleware);

credentialsRouter.get("/", async (c) => {
	const { userId } = c.get("user");

	const userCredentials = await db.query.credentials.findMany({
		where: eq(credentials.userId, userId),
	});

	const credentialsList: CredentialInfo[] = userCredentials.map((cred) => ({
		id: cred.id,
		provider: cred.provider as any,
		isValid: cred.isValid,
		lastValidatedAt: cred.lastValidatedAt?.toISOString(),
		metadata: cred.metadata || undefined,
		createdAt: cred.createdAt.toISOString(),
	}));

	return c.json({ success: true, credentials: credentialsList }, 200);
});

credentialsRouter.post("/", async (c) => {
	const { userId } = c.get("user");
	const body = await c.req.json<ConnectCredentialRequest>();

	const { provider, token, metadata } = body;

	if (!provider || !token) {
		return c.json({ error: "Missing required fields", success: false }, 400);
	}

	const existingCred = await db.query.credentials.findFirst({
		where: and(
			eq(credentials.userId, userId),
			eq(credentials.provider, provider)
		),
	});

	if (existingCred) {
		return c.json(
			{ error: "Credential already exists for this provider", success: false },
			409
		);
	}

	const { encryptedText, iv } = encrypt(token);

	const newCredentials = await db
		.insert(credentials)
		.values({
			userId,
			provider,
			encryptedToken: encryptedText,
			encryptedIv: iv,
			metadata,
			isValid: true,
			lastValidatedAt: new Date(),
		})
		.returning();

	const newCredential = newCredentials[0];
	if (!newCredential) {
		return c.json({ error: "Failed to create credential", success: false }, 500);
	}

	const credentialInfo: CredentialInfo = {
		id: newCredential.id,
		provider: newCredential.provider as any,
		isValid: newCredential.isValid,
		lastValidatedAt: newCredential.lastValidatedAt?.toISOString(),
		metadata: newCredential.metadata || undefined,
		createdAt: newCredential.createdAt.toISOString(),
	};

	return c.json({ success: true, credential: credentialInfo }, 201);
});

credentialsRouter.put("/:id", async (c) => {
	const { userId } = c.get("user");
	const credentialId = c.req.param("id");
	const body = await c.req.json<{ token: string; metadata?: Record<string, any> }>();

	const credential = await db.query.credentials.findFirst({
		where: and(eq(credentials.id, credentialId), eq(credentials.userId, userId)),
	});

	if (!credential) {
		return c.json({ error: "Credential not found", success: false }, 404);
	}

	const { encryptedText, iv } = encrypt(body.token);

	const updatedCredentials = await db
		.update(credentials)
		.set({
			encryptedToken: encryptedText,
			encryptedIv: iv,
			metadata: body.metadata || credential.metadata,
			isValid: true,
			lastValidatedAt: new Date(),
			updatedAt: new Date(),
		})
		.where(eq(credentials.id, credentialId))
		.returning();

	const updatedCredential = updatedCredentials[0];
	if (!updatedCredential) {
		return c.json({ error: "Failed to update credential", success: false }, 500);
	}

	const credentialInfo: CredentialInfo = {
		id: updatedCredential.id,
		provider: updatedCredential.provider as any,
		isValid: updatedCredential.isValid,
		lastValidatedAt: updatedCredential.lastValidatedAt?.toISOString(),
		metadata: updatedCredential.metadata || undefined,
		createdAt: updatedCredential.createdAt.toISOString(),
	};

	return c.json({ success: true, credential: credentialInfo }, 200);
});

credentialsRouter.delete("/:id", async (c) => {
	const { userId } = c.get("user");
	const credentialId = c.req.param("id");

	const credential = await db.query.credentials.findFirst({
		where: and(eq(credentials.id, credentialId), eq(credentials.userId, userId)),
	});

	if (!credential) {
		return c.json({ error: "Credential not found", success: false }, 404);
	}

	await db.delete(credentials).where(eq(credentials.id, credentialId));

	return c.json({ success: true, message: "Credential deleted" }, 200);
});

export async function getDecryptedToken(
	userId: string,
	provider: string
): Promise<string | null> {
	const credential = await db.query.credentials.findFirst({
		where: and(
			eq(credentials.userId, userId),
			eq(credentials.provider, provider)
		),
	});

	if (!credential || !credential.isValid) {
		return null;
	}

	return decrypt(credential.encryptedToken, credential.encryptedIv);
}

