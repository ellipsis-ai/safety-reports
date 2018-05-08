function(ellipsis) {
  ellipsis.success("", {
  next: {
    actionName: "Fiix safety report",
    args: [
      { name: "hazardType", value: "1" },
      { name: "briefDescription", value: "This is a test issue." },
       { name: "location", value: "5559777" },
      { name: "stillUnsafe", value: "no" },
      { name: "concernLevel", value: "3" },
//      { name: "file", value: "none" },
      { name: "details", value: "none" }
    ]
  }
});
}
