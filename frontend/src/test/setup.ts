import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_mock_key',
    VITE_AGENT_ENDPOINT: 'http://localhost:8001',
    VITE_SUPABASE_URL: 'https://test-supabase-url.com',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key'
  }
}));

// Mock Stripe
global.Stripe = vi.fn(() => ({
  elements: vi.fn(() => ({
    create: vi.fn(() => ({
      mount: vi.fn(),
      unmount: vi.fn(),
      on: vi.fn(),
      destroy: vi.fn()
    })),
    getElement: vi.fn()
  })),
  confirmCardPayment: vi.fn(),
  confirmPayment: vi.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn()
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scroll functions
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn()
});

// Suppress console errors in tests unless explicitly testing error scenarios
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});