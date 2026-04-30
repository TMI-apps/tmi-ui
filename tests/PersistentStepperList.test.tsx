import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { PersistentStepperList } from "../src/PersistentStepperList/PersistentStepperList.js";
import { renderWithTheme } from "./test-utils.js";

describe("PersistentStepperList", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("renders progress and toggles completion for main steps", async () => {
    const user = userEvent.setup();
    const text = "1. One\n  Sub line\n2. Two";
    renderWithTheme(
      <PersistentStepperList activityId="list-1" instructionText={text} />,
    );
    expect(screen.getByText("0 of 2 steps completed")).toBeInTheDocument();
    expect(screen.getByText("Sub line")).toBeInTheDocument();
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(2);
    await user.click(boxes[0]!);
    expect(screen.getByText("1 of 2 steps completed")).toBeInTheDocument();
  });
});
