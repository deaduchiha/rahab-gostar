/**
 * Password hashing utilities compatible with Cloudflare Workers
 * Uses Web Crypto API instead of native modules
 */

// Generate a random salt
function generateSalt(length: number = 16): Uint8Array {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return salt;
}

// Convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert Uint8Array to base64 string
function uint8ArrayToBase64(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array));
}

// Convert base64 string to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Hash a password using PBKDF2 (Password-Based Key Derivation Function 2)
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt(16);
  const passwordBuffer = stringToUint8Array(password);

  // Import the password as a key
  const key = await crypto.subtle.importKey(
    "raw",
    passwordBuffer as BufferSource,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  // Derive key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 100000, // High iteration count for security
      hash: "SHA-256",
    },
    key,
    256 // 32 bytes
  );

  // Combine salt and hash
  const hash = new Uint8Array(derivedBits);
  const combined = new Uint8Array(salt.length + hash.length);
  combined.set(salt);
  combined.set(hash, salt.length);

  // Return as base64 string
  return uint8ArrayToBase64(combined);
}

// Verify a password against a hash
export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    const combined = base64ToUint8Array(hash);
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);

    const passwordBuffer = stringToUint8Array(password);

    // Import the password as a key
    const key = await crypto.subtle.importKey(
      "raw",
      passwordBuffer as BufferSource,
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    // Derive key using the same parameters
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt as BufferSource,
        iterations: 100000,
        hash: "SHA-256",
      },
      key,
      256
    );

    const computedHash = new Uint8Array(derivedBits);

    // Compare hashes (constant-time comparison)
    if (storedHash.length !== computedHash.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < storedHash.length; i++) {
      result |= storedHash[i] ^ computedHash[i];
    }

    return result === 0;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}
