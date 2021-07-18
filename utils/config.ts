export const NEXT_PUBLIC_GOOGLE_MAPS_API =
  "AIzaSyDt4Bnz3n7SErEtHwRso5prUZKIxIYPvos";

export const URLS = {
  // partner_url: "http://localhost:4000/",
  // base_url: "http://localhost:3000/",
  partner_url: "https://partner.incity-services.com/",
  base_url: "https://incity-services.com/",
  getImageLoader: function () {
    return undefined;
    const context = this;
    return ({ src, width, quality }: any) => {
      return `${this.base_url}${src}?w=${width}&q=${quality || 75}`;
    };
  },
};
