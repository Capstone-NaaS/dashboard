function formatDate(isoString: string) {
  if (!isoString) return "";

  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return formattedDate;
}

export default formatDate;
