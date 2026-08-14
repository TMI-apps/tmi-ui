import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

interface DatabaseViewerTreeCellChevronsProps {
  isPartial: boolean;
  isExpanded: boolean;
}

export function DatabaseViewerTreeCellChevrons({
  isPartial,
  isExpanded,
}: DatabaseViewerTreeCellChevronsProps) {
  if (isPartial) {
    return (
      <KeyboardArrowRight
        fontSize="small"
        sx={{
          transform: "rotate(45deg)",
          transition: (theme) => theme.transitions.create("transform"),
        }}
      />
    );
  }
  if (isExpanded) {
    return <KeyboardArrowDown fontSize="small" />;
  }
  return <KeyboardArrowRight fontSize="small" />;
}
