/**
 * Dictionary of common field name patterns mapped to realistic example values.
 * Used for smart mock data generation in preview simulations.
 * Keys are lowercased field name substrings checked via .includes().
 */
export const FIELD_PATTERNS: Record<string, any> = {
  email: 'user@example.com',
  phone: '+1 (555) 012-3456',
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  avatar: 'https://i.pravatar.cc/150?u=john',
  bio: 'Full-stack developer passionate about clean code.',
  title: 'Senior Developer',
  description: 'A brief description of the item.',
  price: 29.99,
  amount: 100,
  quantity: 5,
  date: '2024-03-15',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-03-15T12:00:00Z',
  url: 'https://example.com',
  website: 'https://example.com',
  color: '#3b82f6',
  status: 'active',
  type: 'premium',
  category: 'Technology',
  tags: ['vue', 'laravel', 'tailwind'],
  address: '123 Main St, San Francisco, CA 94102',
  city: 'San Francisco',
  country: 'United States',
  zip: '94102',
  company: 'Acme Inc.',
  role: 'Administrator',
  permission: 'read-write',
  language: 'English',
  timezone: 'America/New_York',
  currency: 'USD',
  locale: 'en_US',
  theme: 'light',
  layout: 'grid',
  sort: 'created_at',
  order: 'desc',
  limit: 20,
  offset: 0,
  page: 1,
  total: 100,
  rating: 4.5,
  count: 42,
  id: 1,
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  slug: 'my-post-slug',
  password: '••••••••',
  token: 'sk_live_xxxxxxxxxxxxx',
  apiKey: 'api_xxxxxxxxxxxxx',
  secret: 'sec_xxxxxxxxxxxxx',
  hash: 'abcdef1234567890abcdef1234567890',
  image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
  thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150',
  cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
  logo: 'https://via.placeholder.com/200x200.png?text=Logo',
  icon: 'ri-star-line',
};

/**
 * Generate a realistic mock value for a given prop name.
 * Checks field name patterns first, falls back to type-based generation.
 */
export function generateMockData(propName: string, propType?: any): any {
  const normalizedName = propName.toLowerCase();

  for (const [pattern, value] of Object.entries(FIELD_PATTERNS)) {
    if (normalizedName.includes(pattern)) {
      if (typeof value === 'function') return value();
      return structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));
    }
  }

  if (propType === String || propType?.name === 'String') return `Mock ${propName}`;
  if (propType === Number || propType?.name === 'Number') return Math.floor(Math.random() * 100);
  if (propType === Boolean || propType?.name === 'Boolean') return true;
  if (propType === Array || propType?.name === 'Array') return [];
  if (propType === Object || propType?.name === 'Object') return {};
  if (propType === Date || propType?.name === 'Date') return new Date().toISOString().split('T')[0];

  return `Mock ${propName}`;
}

/**
 * Generate mock data for an entire schema based on field names and their types.
 * Accepts either a Vue props definition or a plain Record<string, any> schema.
 */
export function generateMockDataFromSchema(schema: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(schema)) {
    const def = schema[key];
    const type = (def && def.type) || String;
    result[key] = generateMockData(key, type);
  }
  return result;
}

/**
 * Serialize FIELD_PATTERNS to a JSON structure for embedding in generated
 * srcdoc JavaScript (where function references can not be serialized).
 */
export function serializeMockPatterns(): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(FIELD_PATTERNS)) {
    result[key] = typeof value === 'function' ? value() : value;
  }
  return result;
}
