import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock FormData since it's not available in the test environment
global.FormData = class FormData {
  private data: Record<string, any> = {};

  append(key: string, value: any, filename?: string) {
    this.data[key] = { value, filename };
  }

  get(key: string) {
    return this.data[key]?.value;
  }

  getAll(key: string) {
    return [this.data[key]?.value].filter(Boolean);
  }

  has(key: string) {
    return key in this.data;
  }

  delete(key: string) {
    delete this.data[key];
  }

  *entries() {
    for (const [key, value] of Object.entries(this.data)) {
      yield [key, value.value];
    }
  }

  *keys() {
    yield* Object.keys(this.data);
  }

  *values() {
    for (const value of Object.values(this.data)) {
      yield value.value;
    }
  }
} as any;

// Mock File since it's not available in the test environment
global.File = class File {
  name: string;
  type: string;
  size: number;
  lastModified: number;

  constructor(bits: any[], filename: string, options: any = {}) {
    this.name = filename;
    this.type = options.type || '';
    this.size = bits.reduce((acc, bit) => acc + bit.length, 0);
    this.lastModified = Date.now();
  }
} as any;

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn(); 