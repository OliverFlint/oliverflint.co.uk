import topicDefinitions from "./topics.json";

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
export const topics = topicDefinitions;
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}
