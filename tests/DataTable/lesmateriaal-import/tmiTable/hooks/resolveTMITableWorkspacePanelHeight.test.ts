import { describe, expect, it } from "vitest";
import {
  resolveTMITableWorkspacePanelHeight,
  TMI_TABLE_WORKSPACE_UNFILLED_PANEL_HEIGHT_PX,
} from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/hooks/useDatabaseTableDetailWorkspaceHeights.js";

describe("resolveTMITableWorkspacePanelHeight", () => {
  it("keeps percentage height when the workspace fills the viewport", () => {
    expect(resolveTMITableWorkspacePanelHeight("100%", true)).toBe("100%");
  });

  it("keeps numeric hook heights", () => {
    expect(resolveTMITableWorkspacePanelHeight(340, false)).toBe(340);
  });

  it("pins a pixel height when fill is off so the absolute hero pane does not collapse", () => {
    expect(resolveTMITableWorkspacePanelHeight("100%", false)).toBe(
      TMI_TABLE_WORKSPACE_UNFILLED_PANEL_HEIGHT_PX,
    );
  });
});
