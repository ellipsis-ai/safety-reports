function(hazardType, briefDescription, site, ellipsis) {
  ellipsis.success("", {
  next: {
    actionName: "Fiix safety report 2",
    args: [
      { name: "hazardType", value: hazardType.id },
      { name: "briefDescription", value: briefDescription },
      { name: "location", value: site.label.trim() }
    ]
  }
});
}
