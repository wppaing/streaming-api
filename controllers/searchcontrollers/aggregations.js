const autocompleteAgg = [
  {
    $search: {
      autocomplete: {
        query: keyword,
        path: "name",
        // score: { boost: { value: 2 } },
      },
    },
  },
  {
    $limit: Math.floor(limit - limit / 2),
  },
  {
    $project: {
      _id: 0,
      name: 1,
      type: 1,
      images: 1,
      // score: { $meta: "searchScore" },
    },
  },
];
