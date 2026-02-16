import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../store/authStore";

describe("AuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      rememberMe: false,
      hasHydrated: false,
    });
  });
  it("logs in with correct credentials", async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      const success = await result.current.login(
        "intern@demo.com",
        "intern123",
        true,
      );
      expect(success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("intern@demo.com");
    expect(result.current.rememberMe).toBe(true);
  });

  it("fails login with wrong credentials", async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      const success = await result.current.login(
        "wrong@demo.com",
        "wrongpass",
        false,
      );
      expect(success).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
