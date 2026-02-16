import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../store/authStore";

describe("Auth persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists login if rememberMe is true", async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login("intern@demo.com", "intern123", true);
    });

    const stored = JSON.parse(
      localStorage.getItem("ordo-auth-storage") || "{}",
    );
    expect(stored.state.isAuthenticated).toBe(true);
  });

  it("does not persist if rememberMe is false", async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login("intern@demo.com", "intern123", false);
    });

    const stored = JSON.parse(
      localStorage.getItem("ordo-auth-storage") || "{}",
    );
    expect(stored.state.rememberMe).toBe(false);
    expect(stored.state.isAuthenticated).toBeUndefined();
  });
});
