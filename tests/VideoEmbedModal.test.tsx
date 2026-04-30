import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { VideoEmbedModal } from "../src/VideoEmbedModal/VideoEmbedModal.js";
import { renderWithTheme } from "./test-utils.js";

const YT = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const VIMEO = "https://vimeo.com/148751763";

describe("VideoEmbedModal", () => {
  it("returns null when url is not a supported provider", () => {
    const { container } = renderWithTheme(
      <VideoEmbedModal
        open
        onClose={() => {}}
        url="https://example.com/video"
        title="Bad"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders YouTube embed when open", () => {
    renderWithTheme(
      <VideoEmbedModal open onClose={() => {}} url={YT} title="Clip" />,
    );
    const iframe = screen.getByTitle("Clip");
    expect(iframe).toBeInstanceOf(HTMLIFrameElement);
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("youtube-nocookie.com/embed/dQw4w9WgXcQ"),
    );
  });

  it("renders Vimeo embed when open", () => {
    renderWithTheme(
      <VideoEmbedModal open onClose={() => {}} url={VIMEO} title="V" />,
    );
    const iframe = screen.getByTitle("V");
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("player.vimeo.com/video/"),
    );
  });

  it("calls onClose when close is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithTheme(
      <VideoEmbedModal open onClose={onClose} url={YT} title="T" />,
    );
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
