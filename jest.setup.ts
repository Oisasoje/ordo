import "@testing-library/jest-dom";

class LocalStorageMock {
  store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock() as any;
global.sessionStorage = new LocalStorageMock() as any;
