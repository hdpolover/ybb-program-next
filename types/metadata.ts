export type CountryMetadata = {
  name: string;
  isoCode: string;
  phonecode: string;
  currency: string;
  flag: string;
  latitude: string;
  longitude: string;
};

export type StateMetadata = {
  name: string;
  isoCode: string;
  countryCode: string;
  latitude: string;
  longitude: string;
};

export type CityMetadata = {
  name: string;
  countryCode: string;
  stateCode: string;
  latitude: string;
  longitude: string;
};

export type ShirtSizeMetadata = {
  code: string;
  name: string;
};
