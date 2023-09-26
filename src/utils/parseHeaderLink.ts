const parseHeaderLink = (mbHeaderLink: string) => {
  const linkMatch = mbHeaderLink.match(/<([^>]+)>; rel="next"/);
  return linkMatch ? linkMatch[1] : null;
};

export default parseHeaderLink;
