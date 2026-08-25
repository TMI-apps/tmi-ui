import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, type ReactNode } from "react";

export const WORKSHOP_SCROLL_MAIN_ID = "workshop-scroll-main";

export function sectionIdFromHash(hash: string): string {
  return decodeURIComponent(hash.replace(/^#/, ""));
}

export function scrollWorkshopSection(sectionId: string): void {
  const container = document.getElementById(WORKSHOP_SCROLL_MAIN_ID);
  const target = document.getElementById(sectionId);
  if (!container || !target) return;
  const containerTop = container.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;
  container.scrollTop += targetTop - containerTop - 8;
}

export function navigateWorkshopSection(sectionId: string): void {
  const next = `#${sectionId}`;
  if (window.location.hash === next) {
    scrollWorkshopSection(sectionId);
    return;
  }
  window.location.hash = sectionId;
}

export type WorkshopTocItem = {
  id: string;
  label: string;
};

export function WorkshopSidebar({
  title,
  items,
}: {
  title: string;
  items: WorkshopTocItem[];
}) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <List dense disablePadding>
        {items.map((item) => (
          <ListItemButton
            key={item.id}
            component="a"
            href={`#${item.id}`}
            onClick={(event) => {
              event.preventDefault();
              navigateWorkshopSection(item.id);
            }}
            sx={{ py: 0.25, borderRadius: 1 }}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export function WorkshopLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    const syncFromHash = () => {
      const id = sectionIdFromHash(window.location.hash);
      if (!id) return;
      requestAnimationFrame(() => scrollWorkshopSection(id));
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: 260,
          flexShrink: 0,
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          height: "100%",
          overflow: "auto",
        }}
      >
        {sidebar}
      </Box>
      <Box
        id={WORKSHOP_SCROLL_MAIN_ID}
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          overflow: "auto",
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export function WorkshopSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Box id={id} sx={{ mb: 4, scrollMarginTop: 16 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
