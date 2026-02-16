import { renderHook, act } from "@testing-library/react";
import useTaskStore from "../store/taskStore";

describe("Task filters", () => {
  it("sets search query and priority filter", () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => result.current.setSearchQuery("Landing"));
    act(() => result.current.setPriorityFilter("High"));
    act(() => result.current.setSortBy("Due date"));

    expect(result.current.searchQuery).toBe("Landing");
    expect(result.current.priorityFilter).toBe("High");
    expect(result.current.sortBy).toBe("Due date");
  });
});
