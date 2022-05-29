function paginatedResults(model) {
  return async (req, res, next) => {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 3;
    let skip = (page - 1) * limit;

    const total = await model.countDocuments();

    const results = await model
      .find()
      .skip(skip)
      .limit(limit)
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate("user");
    if (skip >= total) {
      return res.status(400).json({
        error: "No more documents",
      });
    }
    if (results.length === 0) {
      return res.status(400).json({
        error: "No documents found",
      });
    }

    res.paginatedResults = {
      total,
      limit,
      page,
      hasNextPage: skip + limit < total,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      results,
    };

    next();
  };
}

exports.paginatedResults = paginatedResults;
