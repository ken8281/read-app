var app = getApp();
var util = require("../../../utils/util.js");

Page({

  data: {
  
  },

  onLoad:function (options) {
    var movieId = options.movieId;
    var movieUrl = app.doubanBase + "/v2/movie/subject/" + movieId;
    this.getMovieDetail(movieUrl);
  },

  //数据处理
  getMovieDetail:function (movieUrl) {
    wx.request({
      url: movieUrl,
      method: "GET",
      header: {
        "content-type": "json"
      },

      success:(function (res) {
        this.progressData(res.data);
      }).bind(this),
      fail: function (error) {
        console.log(error)
      }
    })
  },

  progressData:function (baseData) {
    if (baseData.directors != null) {
      var directorName = baseData.directors[0].name;
    }

    this.setData({
      directorName,
      castsName: this.progressCastsName(baseData),
      genres: this.progressGenres(baseData),
      stars: util.convertToStarsArray(baseData.rating.stars),
      average: baseData.rating.average,
      originalTitle: baseData.original_title,
      countries: baseData.countries[0],
      summary: baseData.summary,
      year: baseData.year,
      wishCount: baseData.wish_count,
      commentsCount: baseData.comments_count,
      casts: baseData.casts,
      coverImg: baseData.images.large,
    });
  },
  
  progressCastsName: (baseData) => {
    if (baseData.casts != null) {
      var CastsName = "";
      for (var idx in baseData.casts) {
        CastsName += baseData.casts[idx].name + "/";
      }
      CastsName = CastsName.substring(0, CastsName.length-2);
      return CastsName
    } else {
      return ""
    }
  },

  progressGenres: (baseData) => {
    var genres = baseData.genres.join("、");
    return genres
  },

  onPicShow:function () {
    var picUrl = this.data.coverImg;
    wx.previewImage({
      urls: [picUrl],
    })
  }

})
