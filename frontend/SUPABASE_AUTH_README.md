# Supabase Authentication Setup

This document provides instructions for setting up Supabase authentication with Google OAuth for the Dia Beat This application.

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace `your-supabase-project-url` and `your-supabase-anon-key` with your actual Supabase project URL and anonymous key.

## Google OAuth Setup

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Platform](https://console.cloud.google.com/) and create a new project.
2. Navigate to "APIs & Services" > "OAuth consent screen".
3. Configure the consent screen:
   - Add your Supabase project's domain (`<PROJECT_ID>.supabase.co`) under "Authorized domains".
   - Configure the following non-sensitive scopes:
     - `.../auth/userinfo.email`
     - `...auth/userinfo.profile`
     - `openid`

### 2. Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials".
2. Click "Create credentials" and choose "OAuth Client ID".
3. For application type, choose "Web application".
4. Under "Authorized JavaScript origins", add your site URL.
5. Under "Authorized redirect URLs", enter the callback URL from the Supabase dashboard (found in the Google Auth Provider section).
6. After creating the credentials, you'll receive a client ID and secret.

### 3. Configure Supabase

1. In the Supabase dashboard, navigate to "Authentication" > "Providers".
2. Enable Google authentication.
3. Add the client ID and secret from Google Cloud.

## Database Setup

Create a `profiles` table in your Supabase database with the following structure:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  suffix TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create a secure RLS policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

This will:
1. Create a profiles table linked to Supabase Auth users
2. Set up Row Level Security for data protection
3. Create a trigger to automatically create a profile when a user signs up

## Testing

After setup, you should be able to:

1. Sign up with email and password
2. Sign in with email and password
3. Sign up with Google
4. Sign in with Google

The authentication state will be managed by the AuthContext in the application. 