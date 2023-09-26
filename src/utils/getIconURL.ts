import config from "@/appConfig";

interface IconUrlParams {
  prefix: string;
  suffix: string;
}

const getIconURL = ({ prefix, suffix }: IconUrlParams):string => {
  return `${prefix}${config.iconSize}${suffix}`;
};

export default getIconURL;
