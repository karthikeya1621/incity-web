export const NEXT_PUBLIC_GOOGLE_MAPS_API =
  "AIzaSyBh9u9zMsqgUdDMDRrruqANMpRWvB5E-TE";

export const URLS = {
  // partner_url: "http://localhost:4000/",
  // base_url: "http://localhost:3000/",
  partner_url: "https://partner.incityservice.com/",
  base_url: "https://incityservice.com/",
  getImageLoader: function () {
    return undefined;
    const context = this;
    return ({ src, width, quality }: any) => {
      return `${this.base_url}${src}?w=${width}&q=${quality || 75}`;
    };
  },
};
