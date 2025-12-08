export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "NASA Explorer",
  description: "A NASA API demo that explores the Astronomy Picture of the Day and the NASA Image and Video Library.",
  navItems: [
    {
      label: "APOD",
      href: "/apod",
    },
    {
      label: "Images",
      href: "/images",
    },
  ],

  // Navigation items for the mobile menu (hamburger)
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "APOD",
      href: "/apod",
    },
    {
      label: "Images",
      href: "/images",
    },
  ],

  links: {
    github: "https://github.com/CSU-WebEngineering-fall25/group-project-group1-nasa-api",
    docs: "https://api.nasa.gov/",
  },
};
