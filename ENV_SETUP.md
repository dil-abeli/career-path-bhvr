# Environment Setup

This project uses environment variables for configuration. Follow these steps to set up your environment.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```bash
   # Required for production
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ENCRYPTION_KEY=your-32-character-encryption-key!!

   # GitHub Integration (optional - used as fallback)
   GITHUB_PAT=ghp_your_github_personal_access_token_here

   # Jira Integration (optional - used as fallback)
   JIRA_TOKEN=your_jira_api_token_here
   JIRA_EMAIL=your@email.com
   JIRA_DOMAIN=yourcompany.atlassian.net
   ```

## Environment Variables Reference

### Authentication & Security

- **`JWT_SECRET`** (Required): Secret key for JWT token generation
  - Must be a strong, random string
  - Keep this secret and never commit it to version control

- **`ENCRYPTION_KEY`** (Required): Key for encrypting user credentials
  - Must be exactly 32 characters long
  - Keep this secret and never commit it to version control

### GitHub Integration

- **`GITHUB_PAT`** (Optional): GitHub Personal Access Token
  - Used as a fallback when users haven't connected their GitHub accounts
  - Useful for development and testing
  - Generate at: https://github.com/settings/tokens
  - Required scopes: `repo`, `read:user`

### Jira Integration

- **`JIRA_TOKEN`** (Optional): Jira API token
  - Used as a fallback when users haven't connected their Jira accounts
  - Generate at: https://id.atlassian.com/manage-profile/security/api-tokens

- **`JIRA_EMAIL`** (Optional): Email associated with Jira account
  - Required when using `JIRA_TOKEN`

- **`JIRA_DOMAIN`** (Optional): Your Jira instance domain
  - Example: `yourcompany.atlassian.net`
  - Required when using `JIRA_TOKEN`

### Server Configuration

- **`PORT`** (Optional): Server port
  - Default: `3000`

- **`CLIENT_URL`** (Optional): Client URL for CORS
  - Default: `http://localhost:5173`

## How Credentials Work

The application supports two ways to provide API credentials:

1. **User-specific credentials** (Recommended for production):
   - Users connect their own GitHub/Jira accounts via the UI
   - Credentials are encrypted and stored securely in the database
   - Each user's data is fetched using their own tokens

2. **Environment variable fallback** (Useful for development):
   - If a user hasn't connected their account, the app will use `GITHUB_PAT` or `JIRA_TOKEN` from `.env`
   - This allows testing without setting up individual accounts
   - The app will log when using fallback credentials

## Security Notes

- ⚠️ Never commit your `.env` file to version control
- ✅ The `.env` file is already listed in `.gitignore`
- ✅ Use strong, randomly generated values for secrets
- ✅ Rotate your secrets regularly in production
- ✅ Use different secrets for development and production environments

## Generating Strong Secrets

You can generate strong secrets using various methods:

### For JWT_SECRET:
```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using Bun
bun -e "console.log(Bun.randomBytes(32).toString('base64'))"
```

### For ENCRYPTION_KEY (must be exactly 32 characters):
```bash
# Using OpenSSL
openssl rand -base64 24

# Or create a memorable 32-character passphrase
```

