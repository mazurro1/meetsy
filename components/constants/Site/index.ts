export const Site = {
  // serverUrl: "https://api.meetsy.pl",
  serverUrl: "http://localhost:3000",
  siteUrl: "http://localhost:8000",
  // siteUrl: "https://www.meetsy.pl",
  awsUrl: "https://nootis.s3.eu-central-1.amazonaws.com",
  mobileSize: 576,
  barSize: 1200,
};

export interface SiteProps {
  serverUrl: string;
  siteUrl: string;
  awsUrl: string;
  mobileSize: number;
  barSize: number;
}
