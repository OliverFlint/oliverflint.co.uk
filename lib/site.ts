export const site = {
  name: "Oliver Flint",
  title: "Oliver Flint — Workbench",
  url: "https://oliverflint.co.uk",
  description: "Practical notes on Power Platform, Dynamics 365, Dataverse and Azure. Code, experiments and lessons from Oliver Flint.",
  github: "https://github.com/oliverflint",
  linkedin: "https://www.linkedin.com/in/oliverflint",
  twitter: "https://twitter.com/oliver_flint",
  support: "https://ko-fi.com/oliverflint",
};
export const topics = [
  { slug: "power-platform", name: "Power Platform", short: "PCF & Dataverse", description: "Components, APIs and the practical details of building on Power Platform.", number: "01" },
  { slug: "dynamics-typescript", name: "Dynamics 365", short: "TypeScript & web resources", description: "A structured approach to web resources, from your first TypeScript file to testing and telemetry.", number: "02" },
  { slug: "azure-devops", name: "Azure & DevOps", short: "Automation & delivery", description: "Tools and workflows for keeping development moving, including Azure Logic Apps and repository automation.", number: "03" },
] as const;
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}
